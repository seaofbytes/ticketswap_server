const { Router } = require('express')
const router = new Router()
const Event = require('../models/event')
const User = require('../models/user')
const Ticket = require('../models/ticket')
const auth = require('../middleware/auth')
const Comment = require('../models/comment')
// Create event
router.post('/event', auth, async (req, res, next) => {
  try {
    const { name, description, picture, startDate, endDate, userId } = req.body

    const event = await Event.create({
      name,
      description,
      picture,
      startDate,
      endDate,
      userId
    })

    res.status(200).send(event)
  } catch (error) {
    next(error)
  }
})

// Get all events
router.get('/event', async (req, res, next) => {
  try {
    const allEvents = await Event.findAll({ include: [Ticket] })
    const comments = await Comment.findAll()
    allEvents.comments = comments
    res.send(allEvents)
  } catch (error) {
    next(error)
  }
})

// Get a single event
router.get('/event/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    const singleEvent = await Event.findByPk(id, { include: [User, Ticket] })

    res.send(singleEvent)
  } catch (error) {
    next(error)
  }
})

// Update event
// router.put('/event/:id', async (req, res, next) => {
//   const { id } = req.params
//   try {
//     const event = await Event.findByPk(id)
//     const updatedEvent = await event.update(req.body)
//     res.send(updatedEvent)
//   } catch (error) {
//     next(error)
//   }
// })

// Update event and get rid of empty fields sent from react
router.put('/event/:id', auth, async (req, res, next) => {
  const { id } = req.params
  try {
    const event = await Event.findByPk(id)

    // filter req.body to remove empty values
    const { body } = req
    const filteredBody = Object.keys(body).reduce((resultObj, key) => {
      if (body[key] != '') {
        resultObj[key] = body[key]
      }
      return resultObj
    }, {})

    const updatedEvent = await event.update(filteredBody)
    res.send(updatedEvent)
  } catch (error) {
    next(error)
  }
})

// Delete a single event
router.delete('/event/:id', auth, (req, res, next) => {
  try {
    const { id } = req.params
    Event.destroy({
      where: {
        id: id
      }
    })
    res.status(200).end()
  } catch (error) {
    next(error)
  }
})

module.exports = router
