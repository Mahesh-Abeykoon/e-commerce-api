const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator"); 

const userSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true, 
      trim: true 
    },
    email: { 
      type: String, 
      required: true, 
      unique: true, 
      lowercase: true, 
      trim: true,
      validate: {
        validator: (value) => validator.isEmail(value),
        message: 'Invalid email format',
      }, 
    },
    password: { 
      type: String, 
      required: true, 
      minlength: 6,
      trim: true,
      validate: {
        validator: (value) => !value.toLowerCase().includes('password'),
        message: 'Password must not contain the word "password"',
      }, 
    },
    role: { 
      type: String, 
      enum: ["customer", "seller", "admin"], 
      default: "customer" 
    },
    tokens: [
      { token: { 
        type: String, 
        required: true 
      }
     }
    ],
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

// Generate authentication token
userSchema.methods.generateAuthToken = async function () {
  const token = jwt.sign({ _id: this._id, role: this.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  this.tokens = this.tokens.concat({ token });

  // Keep only the last 5 tokens
  // this.tokens = this.tokens.slice(-4).concat({ token });

  //only store the latest token
  // this.tokens = [{ token }];

  await this.save();

  return token;
};

// Find user by credentials (for login)
userSchema.statics.findByCredentials = async function (email, password) {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid email or password");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid email or password");

  return user;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
