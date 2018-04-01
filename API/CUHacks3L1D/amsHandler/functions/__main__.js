const lib = require('lib')({ token: process.env.STDLIB_TOKEN })

/**
* Generic MessageBird SMS handler
* @param {string} sender The phone number that sent the text to be handled
* @param {string} receiver The StdLib phone number that received the SMS
* @param {string} message The contents of the SMS
* @param {string} createdDatetime Datetime when the SMS was sent
* @returns {any}
*/
module.exports = async (sender = '', receiver = '', message = '_', createdDatetime = '', context) => {
  // Try to find a handler for the message, default to __notfound__
  let handler = message.toLowerCase().trim().replace(/[^a-z0-9_-]/gi, '_') || '_'
  let result
  try {
    result = await lib[`${context.service.identifier}.messaging.${handler}`]({
      sender: sender,
      message: message,
      receiver: receiver,
      createdDatetime: createdDatetime
    })
  } catch (e) {
    // Catch thrown errors specifically so we can log them. See logs using
    // $ lib logs <username>.<service name> from the command line
    console.error(e)
    return
  }
  return result
}
