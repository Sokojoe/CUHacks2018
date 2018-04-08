const express = require('express')
const app = express()
const axios = require('axios')
const request = require('request-promise')
app.use(express.json());
const lib = require('lib')({
  token: "FpBaXmJxDDHDcfHKlHPKQQVFr29ccs3JtIJh8yOKlp2wNWRsEN3s6MCN-9XqP8SY"
});
const tel = lib.messagebird.tel['@0.0.21'];
const originalPhonenum = "12048170807"

app.get('/triggermock/:id', (req, res) => {
  console.log(pendingAlarms[req.params.id]);
  sendAllAlert(pendingAlarms[req.params.id])
  res.send("Mock event triggered")
})

var sysAdmins = {} // Array of contacts
sysAdmins["17058082706"] = {
  number: "17058082706",
  name: "Joey",
  guid: "a07e4d8b-d64d-4551-80ec-1c7b592e08b0"
}
sysAdmins["14169488077"] = {
  number: "14169488077",
  name: "Wesley",
  guid: "f0698f82-2b30-4d97-bc9c-b22cc368a4dc"
}
// sysAdmins.push({
//   "16132553982": {
//     number: "16132553982",
//     name: "Helen",
//     guid: "68c4c1e5-8347-4327-8361-1e8fffd214d5"
//   }
// });
// sysAdmins.push({
//   "16132631474": {
//     number: "16132631474",
//     name: "Steven",
//     guid: "968a1d3c-1b88-4812-b15b-9a554324c7cf"
//   }
// });

var pendingAlarms = []; // Array of pendingAlarms

var alerts = {};

// Send Martello POST req
app.post('/acceptedAlert', function(req, res) {
  var alarmID = req.body.alarmID
  var contains = false;
  // Verify that the alarm is pending
  pendingAlarms.forEach((alarm) => {
    console.log("Comparing:" + alarm.id.toString() + ":" + alarmID);
    if (alarm.id.toString() == alarmID) {
      contains = true;
    }
  })

  if (contains) {
    //Get sysAdmin info
    console.log("Phone number: " + req.body.num);
    console.log("sysAdmins: " + sysAdmins[req.body.num]);
    var currRecipient = sysAdmins[req.body.num]
    console.log(currRecipient);
    // Post to Assign an user to an alarm
    request({
      url: "https://hackathon.sipseller.net/central/rest/devices/7aa4fb26-5a53-4677-a575-8623e87ba76b/alarms/" + alarmID + "/updateTicketAndLabels/?user=3c91a75a-ce56-4f89-82b8-bdff12bfcbd1",
      method: "PUT",
      json: true,
      body: {
        "ticket": {
          "status": "Assigned",
          "assignee": {
            "name": currRecipient.name,
            "GUID": currRecipient.guid
          },
          "ticketinfo": {
            "URL": "",
            "number": ""
          }
        },
        "labelDiff": {
          "unassignedLabels": [],
          "assignedLabels": []
        }
      },
      headers: {
        "Authorization": "Basic dGVhbTFAbWFydGVsbG90ZWNoLmNvbTpwaW5lYXBwbGU=",
        "Content-Type": "application/json"
      }
    }).then(function(parsedBody) {
      console.log(parsedBody);
      res.send('Server accepted the request(' + alarmID + ') from ' + req.body.num);
    }).catch(function(err) {
      res.send('An error occured');
    });
  } else {
    console.log('No pendingAlarms with ID ' + alarmID);
    res.send('No pendingAlarms with ID ' + alarmID);
  }
});

app.post('/deniedAlert', function(req, res) {
  let alarmID = req.body.alarmID
  var contains = false;
  pendingAlarms.forEach((alarm) => {
    if (alarm.id == alarmID) {
      contains = true;
    }
  })
  if (contains) {
    console.log('Server denied the request(' + alarmID + ') from ' + req.body.num);
    res.send('Server denied the request(' + alarmID + ') from ' + req.body.num);
  } else {
    console.log('No pendingAlarms with ID ' + alarmID);
    res.send('No pendingAlarms with ID ' + alarmID);
  }
});

var servercode = () => {
  console.log('Server started on port ' + app.get('port'))
  request({
    url: 'https://hackathon.sipseller.net/central/rest/devices/7aa4fb26-5a53-4677-a575-8623e87ba76b/alarmList/',
    method: "GET",
    json: true,
    headers: {
      "Authorization": "Basic dGVhbTFAbWFydGVsbG90ZWNoLmNvbTpwaW5lYXBwbGU=",
    },
  }).then(function(response) {
    Object.keys(response).map(key => {
      alerts[key] = response[key]
      handleAlert(response[key])
    })
    setInterval(checkAlerts, 10000);
  }).catch(function(error) {
    console.log(error);
  });
}

var checkAlerts = () => {
  request({
    url: 'https://hackathon.sipseller.net/central/rest/devices/7aa4fb26-5a53-4677-a575-8623e87ba76b/alarmList/',
    method: "GET",
    json: true,
    headers: {
      "Authorization": "Basic dGVhbTFAbWFydGVsbG90ZWNoLmNvbTpwaW5lYXBwbGU=",
    },
  }).then(function(response) {
    for (var key in response) {
      if (alerts[key] == undefined) {
        console.log("New alarm discovered!" + response[key])
        handleAlert(response[key]);
      }
    }
  }).catch(function(error) {
    console.log(error);
  });
}

function handleAlert(alertData) {
  //console.log(alertData)
  pendingAlarms.push({
    id: alertData.id,
    accepted: false,
    mock: true,
    data: alertData
  })
  //sendAllAlert(pendingAlarms[0])
}

function sendAllAlert(pendingAlarm) {
  var alarmData = pendingAlarm.data
  sysAdmins.forEach((entry) => {
    var message = "Alert: " + alarmData["text"] + "\n" + "AlertId: " + alarmData["id"] + "\n" + "Device: " + alarmData["device"]["name"] + "\n" + "Severity: " + alarmData["severity"] + "\n\n" + "Are you able to handle this task " + entry.name + " ?"
    tel.sms({
      originator: originalPhonenum,
      recipient: entry.number,
      body: message
    }).catch((err) => {
      console.log(err);
    })
  })
}

app.set('port', (process.env.PORT || 3000));
app.listen(app.get('port'), servercode)
