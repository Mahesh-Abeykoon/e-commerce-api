// const express = require('express')
// const User = require('../models/User')

// const router = new express.Router()

// //signup

// const register = async (req, res) => {
//     try {
//         await user.save()
//         const token = await user.generateAuthToken()
//         res.status(201).send({user, token})
//     } catch (error) {
//         res.status(400).send(error)
//     }

// }
// //login

// const login = async (req, res) => {
//     try {
//         const user = await User.findByCredentials(req.body.email, req.body.password)
//         const token = await user.generateAuthToken()
//         res.send({ user, token})
//     } catch (error) {
//         res.status(400).send(error)
//     }
// }

// //logout
// const logout = async (req, res) => {
//     try {
//        req.user.tokens =  req.user.tokens.filter((token) => {
//             return token.token !== req.token 
//         })

//         await req.user.save()
//         res.send()
//     } catch (error) {
//         res.status(500).send()
//     }
// }

// //Logout All 
// const logoutAll = async (req, res) => {
//     try {
//         req.user.tokens = []
//         await req.user.save()
//         res.send()
//     } catch (error) {
//         res.status(500).send()        
//     }
// }

// module.exports = { register, login, logout, logoutAll };

// const User = require('../models/User');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');

// const register = async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     if (await User.findOne({ email })) {
//       return res.status(400).json({ error: 'Email already exists' });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = new User({ name, email, password: hashedPassword });

//     await user.save();
//     const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

//     res.status(201).json({ user, token });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });

//     if (!user || !(await bcrypt.compare(password, user.password))) {
//       return res.status(400).json({ error: 'Invalid email or password' });
//     }

//     const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
//     res.json({ user, token });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// const logout = async (req, res) => {
//   try {
//     req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token);
//     await req.user.save();
//     res.json({ message: 'Logged out' });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// const logoutAll = async (req, res) => {
//   try {
//     req.user.tokens = [];
//     await req.user.save();
//     res.json({ message: 'Logged out from all devices' });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// const getProfile = async (req, res) => {
//     if (!req.user) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }
//     res.status(200).json(req.user);
//   };
  

// module.exports = { register, login, logout, logoutAll, getProfile };

const User = require("../models/User");

// Register new user
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!["customer", "seller", "admin"].includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    if (await User.findOne({ email })) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const user = new User({ name, email, password, role });
    await user.save();

    const token = await user.generateAuthToken();
    res.status(201).json({ user, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByCredentials(email, password);
    const token = await user.generateAuthToken();
    res.json({ user, token });
  } catch (error) {
    res.status(400).json({ error: "Invalid email or password" });
  }
};

// Logout (single session)
const logout = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((t) => t.token !== req.token);
    await req.user.save();
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Logout all sessions
const logoutAll = async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.json({ message: "Logged out from all devices" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get user profile
const getProfile = async (req, res) => {
  res.json(req.user);
};

module.exports = { register, login, logout, logoutAll, getProfile };
