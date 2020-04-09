const { Router } = require('express')
const { toJWT, toData } = require('../middleware/jwt')
const router = new Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')
const auth = require('../middleware/auth')
const Event = require('../models/event')
const Ticket = require('../models/ticket')

router.post('/login', (req, res, next) => {
  if (req.body) {
    if (req.body.email && req.body.password) {
      User.findOne({
        where: {
          email: req.body.email
        }
      })
        .then(entity => {
          if (!entity) {
            res.status(400).send({
              message: 'User with that email does not exist'
            })
          }
          // 2. use bcrypt.compareSync to check the password against the stored
          else if (bcrypt.compareSync(req.body.password, entity.password)) {
            // 3. if the password is correct, return a JWT with the userId of the user (user.id)
            res.send({
              jwt: toJWT({ userId: entity.id })
            })
          } else {
            res.status(400).send({
              message: 'Password was incorrect'
            })
          }
        })
        .catch(err => {
          console.error(err)
          res.status(500).send({
            message: 'Something went wrong'
          })
        })
    } else {
      res.status(400).send({
        message: 'Please supply a valid email and password'
      })
    }
  } else {
    res.status(400).send({
      message: 'Please supply a valid email and password'
    })
  }
})

// Create user account
router.post('/user', (req, res, next) => {
  if (req.body) {
    if (req.body.email && req.body.password) {
      const user = {
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
        firstName: req.body.firstName,
        lastName: req.body.lastName
      }
      User.findOne({
        where: {
          email: req.body.email
        }
      }).then(foundUser => {
        if (!foundUser) {
          User.create(user)
            .then(newUser => res.json(newUser))
            .catch(next)
        } else {
          res.status(400).send({
            message: 'User already exists'
          })
        }
      })
    } else {
      res.status(400).send({
        message: 'Please supply a valid email and password'
      })
    }
  } else {
    res.status(400).send({
      message: 'Please supply a valid email and password'
    })
  }
})

// Get single user
router.get('/users/:id', async (req, res, next) => {
  try {
    const singleUser = await User.findOne({
      where: { id: req.params.id },
      include: [Event, Ticket]
    })

    if (singleUser) {
      res.send(singleUser)
    } else {
      res.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})

// Get all user's tickets
router.get('/users/:userId/tickets', async (req, res, next) => {
  try {
    const userTickets = await Ticket.findAll({
      where: { userId: req.params.userId }
    })
    if (userTickets.length > 0) {
      res.json(userTickets)
    } else {
      res.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})

// Update ticket (edit)
router.put('/users/:userId/tickets/:ticketId', auth, async (req, res, next) => {
  try {
    const ticket = await Ticket.findOne({
      where: {
        id: req.params.ticketId,
        userId: req.params.userId
      }
    })

    if (ticket) {
      const updatedTicket = await ticket.update(req.body)
      res.json(updatedTicket)
    } else {
      res.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})

module.exports = router

//http :4000/user email=sandi@gmail.com password=123 ;http :4000/user email=ira@gmail.com password=123 ;http :4000/user email=magdaleno@gmail.com password=123 ; http :4000/event name="Event for magdaleno" description="Event for magdaleno" picture="magdaleno.jpg" startDate= 10-10-2020 endDate=10-10-2020 userId=3; http :4000/ticket picture="picture.jpg" price=99e description="Ticket for magdaleno event", userId=3 eventId=1
