const userService = require("../services/user-service");

// Register new user
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const result = await userService.registerUser({ name, email, password, role });
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await userService.loginUser(email, password);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: "Invalid email or password" });
  }
};

// Logout user
const logout = async (req, res) => {
  try {
    await userService.logoutUser(req.user, req.token);
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Logout all sessions
const logoutAll = async (req, res) => {
  try {
    await userService.logoutAllSessions(req.user);
    res.json({ message: "Logged out from all devices" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get user profile
const getProfile = (req, res) => {
  res.json(userService.getUserProfile(req.user));
};

module.exports = { register, login, logout, logoutAll, getProfile };
