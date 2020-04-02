const Speakeasy = require("speakeasy");

module.exports = function authenticated(req, res, next) {
  const valid = Speakeasy.totp.verify({
    secret: req.body.secretKey,
    encoding: "base32",
    token: req.body.token,
    window: 0
  });

  if(valid){
     next()
  } else {
     res.json({ message : 'otp invalid'})
  }

};
