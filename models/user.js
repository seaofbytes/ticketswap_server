const Sequelize = require('sequelize')
const db = require('../db')
const Event = require('./event')

const User = db.define(
  'user',
  {
    email: {
      type: Sequelize.STRING,
      allowNull: false
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    firstName: {
      type: Sequelize.STRING,
      allowNull: false
    },
    lastName: {
      type: Sequelize.STRING,
      allowNull: false
    }
  },
  {
    timestamps: false
  }
)

User.hasMany(Event)
Event.belongsTo(User)

module.exports = User
