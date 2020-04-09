const { Router } = require('express')
const router = new Router()
const Ticket = require('../models/ticket')
const Event = require('../models/event')
const User = require('../models/user')
const Comment = require('../models/comment')
const auth = require('../middleware/auth')
const risk = require('../risk')

// Create ticket
router.post('/ticket', auth, async (req, res, next) => {
  try {
    const { picture, price, description, eventId, userId } = req.body
    const seller = await User.findByPk(userId)

    const createdTicket = await Ticket.create({
      picture,
      price,
      description,
      eventId,
      userId,
      seller: `${seller.firstName} ${seller.lastName}`
    })

    res.send(createdTicket)
  } catch (error) {
    next(error)
  }
})

//Get all events tickets
router.get(`/event/:id/tickets`, async (req, res, next) => {
  try {
    const eventTickets = await Ticket.findAll({
      where: { eventId: req.params.id }
    })
    const allComments = await Comment.findAll()

    eventTickets.map(
      ticket => (ticket.riskPercent = risk(eventTickets, allComments, ticket))
    )

    console.log(eventTickets, 'XXXXX')
    if (eventTickets) {
      res.send(eventTickets)
    } else {
      res.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})

//Risk update
router.get('/risk/:id', async (req, res, next) => {
  try {
    const ticket = await Ticket.findByPk(req.params.id)
    const allComments = await Comment.findAll()
    const tickets = await Ticket.findAll()
    ticket.riskPercent = risk(tickets, allComments, ticket)
    if (ticket) {
      res.send(ticket)
    } else {
      res.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})

// Get single ticket
router.get('/ticket/:id/ticket/:ticketId', async (req, res, next) => {
  try {
    const singleTicket = await Ticket.findOne({
      where: { id: req.params.id },
      include: [Event, User]
    })

    const eventTickets = await Ticket.findAll({
      where: { eventId: req.params.id }
    })

    const allComments = await Comment.findAll()

    singleTicket.riskPercent = risk(eventTickets, allComments, singleTicket)

    if (singleTicket) {
      res.send(singleTicket)
    } else {
      res.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})

router.put('/ticket/:id', auth, async (req, res, next) => {
  const { id } = req.params
  try {
    const ticket = await Ticket.findByPk(id, { include: [User, Event] })

    // filter req.body to remove empty values
    const { body } = req
    const filteredBody = Object.keys(body).reduce((resultObj, key) => {
      if (body[key] != '') {
        resultObj[key] = body[key]
      }
      return resultObj
    }, {})

    const updatedTicket = await ticket.update(filteredBody)
    res.send(updatedTicket)
  } catch (error) {
    next(error)
  }
})

module.exports = router
