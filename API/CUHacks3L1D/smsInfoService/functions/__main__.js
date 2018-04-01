const lib = require('lib');
const sms = lib.utils.sms['@1.0.4'];
// MESSAGEBIRD NUMBER: +12048170807
/**
* A basic Hello World function
* @param {string} number Who you're notifying
* @param {string} msg Message to send
* @returns {object} Message sent
*/
module.exports = (number, msg = "EMPTY MESSAGE", callback) => {

  let ret = sms({
    to: number, // (required)
    body: msg, // (required)
  }).then((value) => {
    return callback(null, ret);
  });

};
