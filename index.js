const express = require('express')
const app = express()
const axios = require('axios')
app.use(express.json());
const lib = require('lib')({token: "FpBaXmJxDDHDcfHKlHPKQQVFr29ccs3JtIJh8yOKlp2wNWRsEN3s6MCN-9XqP8SY"});
const tel = lib.messagebird.tel['@0.0.21'];

const originalPhonenum = "12048170807"

var sysAdmins = [] // Array of contacts
sysAdmins.push({number: "17058082706", name: "JOEY"});
sysAdmins.push({number: "14169488077", name: "WESLEY"});

var pendingAlarms = []; // Array of pendingAlarms
pendingAlarms.push({id: "12312", accepted: false}});

var alerts = {};

app.post('/acceptedAlert', function(req, res) {
if (pendingAlarms.length > 0) {
  // Assign a user to an alarm
  console.log('Server accepted the request from ' + req.body.num);
  res.send('Server accepted the request from ' + req.body.num);
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
console.log('Server started on port 3000!')
axios.get('https://hackathon.sipseller.net/central/rest/devices/7aa4fb26-5a53-4677-a575-8623e87ba76b/alarmList/', {
  headers: {
    'Authorization': "Basic dGVhbTFAbWFydGVsbG90ZWNoLmNvbTpwaW5lYXBwbGU="
  }
}).then(function(response) {
  Object.keys(response.data).map(key => alerts[key] = response.data[key])
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
      handleNewAlert(key);
    }
  }
}).catch(function(error) {
  console.log(error);
});
}

// Add to arr
function handleNewAlert(pendingAlarm, userPhone) {
tel.sms({
  originator: originalPhonenum,
  recipient: userPhone,
  body: "ALERT: " + pendingAlarm
}).catch((err) => {
  console.log(err);
});
}

handleNewAlert("", "17058082706")

app.listen(3000, servercode)
