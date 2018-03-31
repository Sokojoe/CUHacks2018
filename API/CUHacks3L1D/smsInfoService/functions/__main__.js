const lib = require('lib');
const sms = lib.utils.sms['@1.0.4'];

/**
* A basic Hello World function
* @param {integer} number Who you're notifying
* @param {string} msg Message to send
* @returns {object} Message sent
*/
module.exports = (number, msg = "EMPTY MESSAGE", callback) => {

  let ret = sms({
    to: 4169488077, // (required)
    body: "tett", // (required)
  }, (err)=>{});
  return callback(null, ret);
};
