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
  console.log(pendingAlarms[req.params.id]);
  sendAllAlert(pendingAlarms[req.params.id])
  res.send("Mock event triggered")
})

var sysAdmins = [] // Array of contacts
sysAdmins.push({
  number: "17058082706",
  name: "Joey"
});
sysAdmins.push({
  number: "14169488077",
  name: "Wesley"
});
sysAdmins.push({
  number: "16132553982",
  name: "Helen"
});
sysAdmins.push({
  number: "16132631474",
  name: "Steven"
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
  if (pendingAlarms.length > 0) {
    // Assign a user to an alarm
    console.log('Server accepted the request(' + req.body.alarmID + ') from ' + req.body.num);
    res.send('Server accepted the request(' + req.body.alarmID + ') from ' + req.body.num);
  } else {
    console.log('No pendingAlarms');
    res.send('No pendingAlarms');
  }
});

app.post('/deniedAlert', function(req, res) {
  if (pendingAlarms.length > 0) {
    console.log('Server denied the request from ' + req.body.num);
    res.send('Server denied the request from ' + req.body.num);
  } else {
    console.log('No pendingAlarms');
    res.send('No pendingAlarms');
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
    setInterval(checkAlerts, 10000);
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
