const lib = require('lib')({ token: process.env.STDLIB_TOKEN })

/**
* Send an SMS message via MessageBird
* @param {string} originator The StdLib phone number to send the SMS from
* @param {string} recipient The phone number that will receive the SMS
* @param {string} body The contents of the SMS
* @returns {any}
*/
module.exports = async (originator, recipient, body) => {
  if (!originator || !recipient) {
    return body
  }
  return lib.messagebird.sms.create({
    originator: originator,
    recipient: recipient,
    body: body
  })
}
