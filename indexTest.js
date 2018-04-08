const request = require('request-promise')

var data = {
  "ticket": {
    "status": "Assigned",
    "assignee": {
      "name": "It worked",
      "GUID": "f0698f82-2b30-4d97-bc9c-b22cc368a4dc"
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
}

request({
  url: "https://hackathon.sipseller.net/central/rest/devices/7aa4fb26-5a53-4677-a575-8623e87ba76b/alarms/119/updateTicketAndLabels/?user=3c91a75a-ce56-4f89-82b8-bdff12bfcbd1",
  method: "PUT",
  json: true, // <--Very important!!!
  body: data,
  headers: {
    "Authorization": "Basic dGVhbTFAbWFydGVsbG90ZWNoLmNvbTpwaW5lYXBwbGU=",
    "Content-Type": "application/json"
  }
}).then((res) => {
  console.log(res)
}).catch((err) => {
  console.log(err);
});
