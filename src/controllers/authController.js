const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();  // Загружаем переменные окружения

exports.registerUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({
      email,
      password,
    });

    await user.save();

    const payload = {
      user: {
        id: user.id,
      },
    };

    // Создаем JWT токен
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,  // Используем секретный ключ из переменной окружения
      { expiresIn: '24h' }
    );

    console.log('Generated Token:', token);  // Логируем токен (только для отладки)
    res.status(200).json({ token, message: "User registered successfully" });
  } catch (err) {
    console.error("Registration Error: ", err.message || err);
    res.status(500).json({ msg: 'Server error', error: err.message || err });
  }
};

// User login
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ msg: 'Invalid Credentials' });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid Credentials' });
      }
  
      const payload = {
        user: {
          id: user.id,
        },
      };
  
      // Создаем JWT токен
      const token = jwt.sign(
        payload,
        process.env.JWT_SECRET,  // Используем секретный ключ из переменной окружения
        { expiresIn: '24h' }
      );
  
      console.log('Generated Token:', token);  // Логируем токен (только для отладки)
      res.status(200).json({ token, message: "User logged in successfully" });
    } catch (err) {
      console.error("Login Error: ", err.message || err);
      res.status(500).json({ msg: 'Server error', error: err.message || err });
    }
  };