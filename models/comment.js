const Sequelize = require('sequelize')
const db = require('../db')
const Ticket = require('./ticket')
const User = require('./user')

const Comment = db.define('comment', {
  author: {
    type: Sequelize.STRING,
    allowNull: true
  },
  text: {
    type: Sequelize.TEXT,
    allowNull: false
  }
})

User.hasMany(Comment)
Comment.belongsTo(User)

Ticket.hasMany(Comment)
Comment.belongsTo(Ticket)

module.exports = Comment
