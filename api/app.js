const express = require('express');
const mongoose = require('mongoose');
const config = require('./config');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const cors = require('cors');

const app = express();


const axios = require('axios');

const options = {
  method: 'GET',
  url: 'https://odds.p.rapidapi.com/v4/sports',
  params: { all: 'true' },
  headers: {
    'content-type': 'application/octet-stream',
    'X-RapidAPI-Key': '80488c775fmsh4aec38ed431dd37p1d408djsn9993b3e1e317',
    'X-RapidAPI-Host': 'odds.p.rapidapi.com'
  }
};

try {
  const response = await axios.request(options);
  console.log(response.data);
} catch (error) {
  console.error(error);

}
app.use(cors());

// Connect to MongoDB
mongoose.connect(config.dbUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Could not connect to MongoDB', err));

// Parse JSON requests
app.use(express.json());

// Register routes
app.use('/users', userRoutes);
app.use('/posts', postRoutes);

// Handle errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong.');
});

// Start server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
