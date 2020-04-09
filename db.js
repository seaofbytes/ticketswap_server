const Sequelize = require('sequelize')
const User = require('./models/user')

const databaseURL =
  process.env.DATABASE_URL ||
  'postgres://postgres:secret@localhost:5432/postgres'

const db = new Sequelize(databaseURL)

db.sync({ force: false })
  .then(() => {
    console.log(`Database synced.`)
  })
  .catch(err => console.log(err))

module.exports = db
