const Sequelize = require('sequelize')
const db = require('../db')
const Event = require('./event')
const User = require('./user')
const risk = require('../risk')

const Ticket = db.define('ticket', {
  picture: {
    type: Sequelize.STRING,
    allowNull: true
  },
  price: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false
  },
  seller: {
    type: Sequelize.STRING,
    allowNull: false
  },
  riskPercent: {
    type: Sequelize.VIRTUAL,
    allowNull: true
  }
})
User.hasMany(Ticket)
Ticket.belongsTo(User)

Event.hasMany(Ticket)
Ticket.belongsTo(Event)

module.exports = Ticket
