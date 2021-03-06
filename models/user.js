'use strict';

const {generatePassword} = require('../helpers/bcrypt.js');

module.exports = (sequelize, DataTypes) => {

  const Model = sequelize.Sequelize.Model;

  class User extends Model{}
  
  User.init({
    email: {
      type: DataTypes.STRING,
      unique: {
        args: true,
        msg: "Email already exist"
      },
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "Email is required"
        },
        notEmpty: {
          args: true,
          msg: "Email is required"
        },
        isEmail: {
          args: true,
          msg: "Invalid email format"
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "Password is required"
        },
        notEmpty: {
          args: true,
          msg: "Password is required"
        },
        len: {
          args: [7, 15],
          msg: "Password length should between 7 and 15"
        }
      }
    }
  },
  {
    sequelize,
    hooks: {
      beforeCreate: (user) => {
        user.password = generatePassword(user.password);
      }
    },
    validate: {
      valueNotEmpty(){
        if(!this.email || !this.password){
          throw new Error(`All data must filled`);
        }
      },
      isUnique(){
        return User.findOne({
          where: {
            email: this.email
          }
        })
        .then(data => {
          if(data){
            throw new Error('email is being used')
          } 
        })
      }
    },
    modelName: "User"
  });
  
  User.associate = function(models) {
    // associations can be defined here
    User.hasMany(models.Product);
  };
  return User;
};