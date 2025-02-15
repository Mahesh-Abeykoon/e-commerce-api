const User = require("../models/User");

// Register new user
const registerUser = async ({ name, email, password, role }) => {
  if (!["customer", "seller", "admin"].includes(role)) {
    throw new Error("Invalid role");
  }

  if (await User.findOne({ email })) {
    throw new Error("Email already exists");
  }

  const user = new User({ name, email, password, role });
  await user.save();
  const token = await user.generateAuthToken();

  return { user, token };
};

// Login user
const loginUser = async (email, password) => {
  const user = await User.findByCredentials(email, password);
  const token = await user.generateAuthToken();
  return { user, token };
};

// Logout (single session)
const logoutUser = async (user, token) => {
  user.tokens = user.tokens.filter((t) => t.token !== token);
  await user.save();
};

// Logout from all sessions
const logoutAllSessions = async (user) => {
  user.tokens = [];
  await user.save();
};

// Get user profile
const getUserProfile = (user) => {
  return user;
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  logoutAllSessions,
  getUserProfile,
};
