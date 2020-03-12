const crypto = require("crypto");

exports.tokenGenerator = async function () {
  let token = await crypto.randomBytes(20).toString('hex');
  // Hashing of token
  let hashToken = crypto.createHash('sha256').update(token).digest('hex');
  return hashToken;
};