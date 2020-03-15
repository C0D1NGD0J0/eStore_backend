const crypto = require("crypto");
const jwt = require('jsonwebtoken');

exports.tokenGenerator = async function () {
  let token = await crypto.randomBytes(10).toString('hex');
  // Hashing of token
  let hashToken = crypto.createHash('sha256').update(token).digest('hex');
  return hashToken;
};

exports.jwtGenerator = (user) =>{
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIREIN });
};

exports.paginateResult = (count, skip, limit) => {
  return {
    "total": count,
    "per_page": parseInt(limit),
    "current_page": (Math.floor(skip / limit) + 1),
    "total_pages": Math.ceil(count / limit),
    "hasMoreResource": (count - (page * limit) > 0)
  };
};