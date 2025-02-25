const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const { genUserSig } = require("../tencent_sig");

exports.register = async (req, res) => {
  try {
    const { userID, password } = req.body;
    if (!userID || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExists = await User.findOne({ userID });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ userID, password: hashedPassword });
    await newUser.save();

    const userSig = genUserSig(userID);
    res.status(201).json({ userID, userSig });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { userID, password } = req.body;
    const user = await User.findOne({ userID });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const userSig = genUserSig(userID);
    res.json({ userID, userSig });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
