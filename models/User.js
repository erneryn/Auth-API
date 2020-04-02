'use strict';
module.exports = (sequelize, DataTypes) => {
  
  const bcrypt = require('bcryptjs')
  const salt = bcrypt.genSaltSync(10)

  const Model = sequelize.Sequelize.Model

  class User extends Model{}

  User.init({
    firstName:{
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg : 'first name cannot be empty'},
        notEmpty: { msg: 'first name cannot be empty' }
      }
    },
    lastName:{
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg : 'first name cannot be empty'},
        notEmpty: { msg: 'first name cannot be empty' }
      }
    },
    email:{
      type: DataTypes.STRING,
      allowNull: false,
      validate:{
        isEmail: {msg : "please insert correct email"},
        notNull: { msg: "email cannot be empty" },
        notEmpty: { msg: "email cannot be empty" }
      }
    },
    password: {
      type : DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "password cannot be empty" },
        notEmpty: { msg: "password cannot be empty" }
      }
    },
    secretKey: {
      type: DataTypes.STRING
    }
  },{sequelize,
  hooks:{
    beforeCreate: (instance,options)=>{
      const hash = bcrypt.hashSync(instance.password,salt);
      instance.password = hash
    },
  }
})


  User.associate = function(models) {
    // associations can be defined here
  };

  return User;
};