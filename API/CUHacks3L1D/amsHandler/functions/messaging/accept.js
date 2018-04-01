const lib = require('lib')({token: process.env.STDLIB_TOKEN})
const send = require('../../helpers/send.js')
const axios = require('axios')
/**
* MORE handler, responds if user texts "more"
*  (or any uppercase variation like "MORE")
* @param {string} sender The phone number that sent the text to be handled
* @param {string} receiver The StdLib phone number that received the SMS
* @param {string} message The contents of the SMS
* @param {string} createdDatetime Datetime when the SMS was sent
* @returns {any}
*/
module.exports = async (sender = '14169488077', receiver = '', message = 'Default Msg', createdDatetime = '', context) => {
  // Callback to get active request info
  let res = await axios.post('http://localhost:3000/acceptedAlert', {"num": sender}).then(() => {
    console.log(res.data);
    return send(receiver, sender, "You (" + sender + ") have accepted the task.")
  })
});

}