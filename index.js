const express = require('express')
const app = express()
const axios = require('axios')

var alerts = {};

var servercode = () => {
  console.log('Server started on port 3000!')
  axios.get('https://hackathon.sipseller.net/central/rest/devices/7aa4fb26-5a53-4677-a575-8623e87ba76b/alarmList/', {
      headers: {
        'Authorization': "Basic dGVhbTFAbWFydGVsbG90ZWNoLmNvbTpwaW5lYXBwbGU="
      }
    })
    .then(function(response) {
      Object.keys(response.data).map(key => alerts[key]=response.data[key])
      setInterval(checkAlerts, 5000);
    })
    .catch(function(error) {
      console.log(error);
    });
}

var checkAlerts = () => {
  axios.get('https://hackathon.sipseller.net/central/rest/devices/7aa4fb26-5a53-4677-a575-8623e87ba76b/alarmList/', {
      headers: {
        'Authorization': "Basic dGVhbTFAbWFydGVsbG90ZWNoLmNvbTpwaW5lYXBwbGU="
      }
    })
    .then(function(response) {
      var NewEvent = false
      for (var key in response.data){
        if (alerts[key] == undefined){
          console.log("New alarm discovered!" + response.data[key])
          NewEvent = true
        }
      }
      if (NewEvent == false){
        console.log("No New Alerts. Everything is working well!");
      }
    })
    .catch(function(error) {
      console.log(error);
    });
}

app.listen(3000, servercode)
