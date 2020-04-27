const { Router } = require('express')
const router = new Router()
const Comment = require('../models/comment')
const auth = require('../middleware/auth')
const User = require('../models/user')
const Event = require('../models/event')

// post a comment
router.post('/comment', auth, async (req, res, next) => {
  try {
    const { text, ticketId, userId } = req.body
    const findAuthor = await User.findByPk(userId)
    const createdComment = await Comment.create({
      author: `${findAuthor.firstName} ${findAuthor.lastName}`,
      text,
      ticketId,
      userId
    })

    res.send(createdComment)
  } catch (error) {
    next(error)
  }
})

// Get all comments from event
router.get('/ticket/:id/comment', async (req, res, next) => {
  try {
    const eventComments = await Comment.findAll({
      where: {
        ticketId: req.params.id
      }
    })
    if (eventComments) {
      res.send(eventComments)
    } else {
      res.status(400).end()
    }
  } catch (error) {
    next(error)
  }
})

module.exports = router
