const express = require('express');
const cors = require('cors');  // Добавляем require для CORS
const connectDB = require('./config/db'); // Adjust the path according to your file structure

const app = express();

connectDB();

// Enable CORS with specific origin
app.use(cors({
  origin: '*' // Можно заменить на нужный домен, например: 'http://example.com'
}));

// Middleware and routes
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/auth', require('./routes/authRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
