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
