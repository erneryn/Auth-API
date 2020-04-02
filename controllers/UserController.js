const { User } = require("../models");
const bcrypt = require("bcryptjs");
const Speakeasy = require("speakeasy");
const sgMail = require('@sendgrid/mail');


class UserController {
  static register(req, res, next) {
    const { firstName, lastName, email, password } = req.body;
    User.findOne({
      where: {
        email
      }
    })
      .then(Email => {
        if (Email) {
          res.status(406).json({
            message: "email already exists"
          });
        } else {
          var { base32 } = Speakeasy.generateSecret({ length: 20 });

          const NewUser = {
            firstName,
            lastName,
            email,
            password,
            secretKey: base32
          };
          User.create(NewUser)
            .then(result => {
              res.status(201).json(result);
            })
            .catch(err => {
              next(err);
            });
        }
      })
      .catch(err => {
        res.send(err);
      });
  }

  static login(req, res, next) {
    const { email, password } = req.body;
    User.findOne({
      where: { email }
    })
      .then(result => {
        if (!result) {
          res.status(404).json({
            message: "email not found"
          });
        } else {
          if (bcrypt.compareSync(password, result.dataValues.password)) {
            res.send({
              email: result.dataValues.email,
              secretKet: result.dataValues.secretKey
            });
          } else {
            res.status(404).json({
              message: "Password Wrong"
            });
          }
        }
      })
      .catch(err => {
        res.send(err);
      });
  }


  static GenereteOTP(req,res,next){
      const email = req.body.email
      const OTP = Speakeasy.totp({
          secret: req.body.secret,
          encoding: "base32"
      })
      console.log(OTP)
      // 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
      // sgMail.setApiKey('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');
      // const msg = {
      //   to: email,
      //   from: 'test@example.com',
      //   subject: 'OTP',
      //   text: 'this is your otp code',
      //   html: `<strong>${OTP}</strong>`,
      // };
      // sgMail.send(msg);
      res.send({message : 'otp succesfully send to your email'})
  }

  static validateOTP(req,res,next){
    res.send({
      "valid": Speakeasy.totp.verify({
          secret: req.body.secret,
          encoding: "base32",
          token: req.body.otp,
          window: 0,
      })
  });
  }

  static resetPassword(req,res,next){
    const { email } = req.body
    User
    .findOne({where: { email }})
    .then(result =>{
      if(result){
        try {
          const OTP = Speakeasy.totp({
            secret: result.dataValues.secretKey,
            encoding: "base32"
          })
          sgMail.setApiKey('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');
          const msg = {
            to: email,
            from: 'test@example.com',
            subject: 'Reset Password',
            text: 'this is your new password',
            html: `<strong>${OTP}</strong>`,
          };
          sgMail.send(msg);
          
          const salt = bcrypt.genSaltSync(10)
          const data = { password : bcrypt.hashSync(OTP,salt) }
          
          User.update( data, { where: {id: result.dataValues.id}})
          res.send({message: "your password has been reset successfuly, we send to your email"})
        } catch (error) {
          next(error)
        }
      }else {
        res.status(404).json({message : "email not found"})
      }
    })
    .catch(err=>{
      res.send(err)
    })
  }

  
}

module.exports = UserController;
