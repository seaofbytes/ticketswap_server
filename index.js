const express = require('express')
const cors = require('cors')
const userRoutes = require('./routes/user')
const eventRoutes = require('./routes/event')
const ticketRoutes = require('./routes/ticket')
const commentRoutes = require('./routes/comment')
const app = express()
const port = process.env.PORT || 4000
const corsMiddleware = cors()
const parser = express.json()

// Middleware
app.use(corsMiddleware)
app.use(parser)

// Routes
app.use(userRoutes)
app.use(eventRoutes)
app.use(ticketRoutes)
app.use(commentRoutes)

app.get('/', (req, res) => {
  res.send('Hello world !')
})

app.listen(port, () => console.log(`Game app listening on port ${port}!`))
