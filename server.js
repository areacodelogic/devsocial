const express = require('express');
const connectDB = require('./config/db')
const usersRoutes = require('./routes/api/users')
const postsRoutes = require('./routes/api/posts')
const authRoutes = require('./routes/api/auth')
const profileRoutes = require('./routes/api/profile')

const app = express();

// Connect Database
connectDB()

//Init Middleware
app.use(express.json({extended: false}))

app.get('/', (req, res) => res.send("API running"))

// Define Routes
app.use('/api/users', usersRoutes)
app.use('/api/posts', postsRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/profile', profileRoutes)

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`server started on port ${PORT}`));