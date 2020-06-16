const express = require('express');
const connectDB = require('./config/db');
const usersRoutes = require('./routes/api/users');
const postsRoutes = require('./routes/api/posts');
const authRoutes = require('./routes/api/auth');
const profileRoutes = require('./routes/api/profile');
const path = require('path');
const app = express();

// Connect Database
connectDB();

//Init Middleware
app.use(express.json({ extended: false }));

// app.get('/', (req, res) => res.send("API running"))

// Define Routes
app.use('/api/users', usersRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);

// SERVE static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`server started on port ${PORT}`));
