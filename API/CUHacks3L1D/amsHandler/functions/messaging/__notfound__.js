const lib = require('lib')({ token: process.env.STDLIB_TOKEN })
const send = require('../../helpers/send.js')

const DEMO_REGEX = /^\s*what\s*do\s*you\s*think\s*of\s*([^\s\?]*)\s*.*$/gi

/**
* Not found handler - handles all SMS that don't match a command
*   (i.e. "more" = functions/messaging/more.js)
* @param {string} sender The phone number that sent the text to be handled
* @param {string} receiver The StdLib phone number that received the SMS
* @param {string} message The contents of the SMS
* @param {string} createdDatetime Datetime when the SMS was sent
* @returns {any}
*/
module.exports = async (sender = '', receiver = '', message = '', createdDatetime = '', context) => {
  if (message.match(DEMO_REGEX)) {
    // We matched some regex
    let matches = new RegExp(DEMO_REGEX).exec(message)
    let item = matches[1].toLowerCase()
    return send(
      receiver,
      sender,
      `I don't like ${item}. It's coarse and rough and irritating and it gets everywhere`
    )
  } else {
    // We didn't find a command or match anything
    return send(
      receiver,
      sender,
      `This is the default "not found" handler for SMS. Basically, if the ` +
        `message does not match a function name in /functions/messaging/, it ` +
        `will go here instead - where you can do regex matching or NLP, if you want.` +
        `\n\n` +
        `Try asking, "What do you think of <X>?" to see a regex-handled response`
    )
  }
}
