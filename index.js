const express = require('express')
const app = express()
const axios = require('axios')
app.use(express.json());
const lib = require('lib')({
  token: "FpBaXmJxDDHDcfHKlHPKQQVFr29ccs3JtIJh8yOKlp2wNWRsEN3s6MCN-9XqP8SY"
});
const tel = lib.messagebird.tel['@0.0.21'];

const originalPhonenum = "12048170807"

app.get('/triggermock/:id', (req, res) => {
  console.log("Mocking event " + req.params.id);
  sendAllAlert(pendingAlarms[req.params.id])
  res.send("Mock event triggered")
})

var sysAdmins = [] // Array of contacts
sysAdmins.push({
  number: "17058082706",
  name: "Joey",
  userId: "a07e4d8b-d64d-4551-80ec-1c7b592e08b0"
});
sysAdmins.push({
  number: "14169488077",
  name: "Wesley",
  userId: "968a1d3c-1b88-4812-b15b-9a554324c7cf"
});
sysAdmins.push({
  number: "16132553982",
  name: "Helen",
  userId: "68c4c1e5-8347-4327-8361-1e8fffd214d5",
});
sysAdmins.push({
  number: "16132631474",
  name: "Steven",
  userId: "968a1d3c-1b88-4812-b15b-9a554324c7cf",
});

var pendingAlarms = []; // Array of pendingAlarms
// pendingAlarms.push({
//   id: "12312",
//   accepted: false,
//   mock: true,
//   data: {
//       "id": 1,
//       "severity": "CRITICAL",
//       "text": "Error, Servers have crashed!",
//       "starttime": 1522430159279,
//       "device": {
//         "name":"MX 150 Server",
//       }
//   }
// });

var alerts = {};

app.post('/acceptedAlert', function(req, res) {
  var alarmID = req.body.alarmID
  console.log(alarmID);
  var admin;
  sysAdmins.forEach((a) => {
    if (a.number == req.body.num) {
      admin = a;
    }
  })
  var contains = false;
  pendingAlarms.forEach((alarm) => {
    console.log(alarm.id, alarmID);
    if (alarm.id.toString() == alarmID) {
      contains = true;
      axios.get("")
      axios.put("https://hackathon.sipseller.net/central/rest/devices/7aa4fb26-5a53-4677-a575-8623e87ba76b/alarms/" +
        alarmID + "/updateTicketAndLabels/?user=" + admin.userId, {
          headers: {
            'Authorization': "Basic dGVhbTFAbWFydGVsbG90ZWNoLmNvbTpwaW5lYXBwbGU="
          },
          body: {
            ticket: {
              assignee: {
                GUID: admin.userId,
                name: admin.name
              },
              status: "Assigned"
            }
          }
        }).catch((err) => console.log(err))
    }
  })
  if (contains) {
    // Assign a user to an alarm
    console.log('Server accepted the request(' + alarmID + ') from ' + req.body.num);
    res.send('Server accepted the request(' + alarmID + ') from ' + req.body.num);
  } else {
    console.log('No pendingAlarms with ID ' + alarmID);
    res.send('No pendingAlarms with ID ' + alarmID);
  }
});

app.post('/deniedAlert', function(req, res) {
  let alarmID = req.body.alarmID
  var contains = false;
  pendingAlarms.forEach((alarm) => {
    if (alarm.id.toString() == alarmID) {
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
  axios.get('https://hackathon.sipseller.net/central/rest/devices/7aa4fb26-5a53-4677-a575-8623e87ba76b/alarmList/', {
    headers: {
      'Authorization': "Basic dGVhbTFAbWFydGVsbG90ZWNoLmNvbTpwaW5lYXBwbGU="
    }
  }).then(function(response) {
    Object.keys(response.data).map(key => {
      alerts[key] = response.data[key]
      handleAlert(response.data[key])
    })
    setInterval(checkAlerts, 5000);
  }).catch(function(error) {
    console.log(error);
  });

}

var checkAlerts = () => {
  axios.get('https://hackathon.sipseller.net/central/rest/devices/7aa4fb26-5a53-4677-a575-8623e87ba76b/alarmList/', {
    headers: {
      'Authorization': "Basic dGVhbTFAbWFydGVsbG90ZWNoLmNvbTpwaW5lYXBwbGU="
    }
  }).then(function(response) {
    for (var key in response.data) {
      if (alerts[key] == undefined) {
        console.log("New alarm discovered!" + response.data[key])
        handleAlert(response.data[key]);
        sendAllAlert(pendingAlarm.slice(-1)[0])
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
    var message = "Alert: " + alarmData["text"] + "\n" +
      "AlertId: " + alarmData["id"] + "\n" +
      "Device: " + alarmData["device"]["name"] + "\n" +
      "Severity: " + alarmData["severity"] + "\n\n" +
      "Are you able to handle this task " + entry.name + " ?"
    console.log("Sending Alarm to " + entry.name);
    tel.sms({
      originator: originalPhonenum,
      recipient: entry.number,
      body: message,
    }).catch((err) => {
      console.log(err);
    });
  })
}

app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), servercode)
