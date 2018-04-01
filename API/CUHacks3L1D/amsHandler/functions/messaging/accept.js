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
module.exports = async (sender = '', receiver = '', message = '', createdDatetime = '', context) => {
  // Callback to get active request info
  let res = await axios.post('https://fathomless-retreat-64446.herokuapp.com/acceptedAlert', {"num": sender});
  console.log(res.data);
  return send(receiver, sender, "You (" + sender + ") have accepted the task.")
}
