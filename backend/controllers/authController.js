import bcrypt from "bcryptjs";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

// REGISTER
export const registerUser = async (req, res) => {
  const startTime = Date.now();
  console.log(`[${new Date().toISOString()}] REGISTER - Request received`);
  
  try {
    const { name, email, password } = req.body;
    console.log(`[${new Date().toISOString()}] REGISTER - Processing registration for email: ${email}`);

    // validation
    if (!name || !email || !password) {
      console.log(`[${new Date().toISOString()}] REGISTER - Validation failed: Missing fields - Name: ${!!name}, Email: ${!!email}, Password: ${!!password}`);
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // existing user
    console.log(`[${new Date().toISOString()}] REGISTER - Checking if user exists: ${email}`);
    const userExists = await User.findOne({ email });

    if (userExists) {
      console.log(`[${new Date().toISOString()}] REGISTER - User already exists: ${email}`);
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // hash password
    console.log(`[${new Date().toISOString()}] REGISTER - Hashing password for: ${email}`);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log(`[${new Date().toISOString()}] REGISTER - Password hashed successfully for: ${email}`);

    // create user
    console.log(`[${new Date().toISOString()}] REGISTER - Creating user in database: ${email}`);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    console.log(`[${new Date().toISOString()}] REGISTER - User created successfully with ID: ${user._id}`);

    // generate token
    console.log(`[${new Date().toISOString()}] REGISTER - Generating JWT token for user: ${user._id}`);
    const token = generateToken(user._id);
    
    const duration = Date.now() - startTime;
    console.log(`[${new Date().toISOString()}] REGISTER - Registration completed successfully for: ${email} (Duration: ${duration}ms)`);

    // response
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: token,
    });

  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[${new Date().toISOString()}] REGISTER - Error occurred: ${error.message} (Duration: ${duration}ms)`);
    console.error(`[${new Date().toISOString()}] REGISTER - Stack trace:`, error.stack);
    
    res.status(500).json({
      message: error.message,
    });
  }
};

// LOGIN
export const loginUser = async (req, res) => {
  const startTime = Date.now();
  console.log(`[${new Date().toISOString()}] LOGIN - Request received`);
  
  try {
    const { email, password } = req.body;
    console.log(`[${new Date().toISOString()}] LOGIN - Processing login for email: ${email}`);

    // validation
    if (!email || !password) {
      console.log(`[${new Date().toISOString()}] LOGIN - Validation failed: Missing fields - Email: ${!!email}, Password: ${!!password}`);
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // find user
    console.log(`[${new Date().toISOString()}] LOGIN - Searching for user: ${email}`);
    const user = await User.findOne({ email });

    if (!user) {
      console.log(`[${new Date().toISOString()}] LOGIN - User not found: ${email}`);
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }
    console.log(`[${new Date().toISOString()}] LOGIN - User found: ${user._id}`);

    // compare password
    console.log(`[${new Date().toISOString()}] LOGIN - Comparing passwords for user: ${user._id}`);
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log(`[${new Date().toISOString()}] LOGIN - Invalid password attempt for user: ${user._id} (Email: ${email})`);
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }
    console.log(`[${new Date().toISOString()}] LOGIN - Password verification successful for user: ${user._id}`);

    // generate token
    console.log(`[${new Date().toISOString()}] LOGIN - Generating JWT token for user: ${user._id}`);
    const token = generateToken(user._id);
    
    const duration = Date.now() - startTime;
    console.log(`[${new Date().toISOString()}] LOGIN - User logged in successfully: ${user._id} (Email: ${email}, Duration: ${duration}ms)`);

    // response
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: token,
    });

  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[${new Date().toISOString()}] LOGIN - Error occurred: ${error.message} (Duration: ${duration}ms)`);
    console.error(`[${new Date().toISOString()}] LOGIN - Stack trace:`, error.stack);
    
    res.status(500).json({
      message: error.message,
    });
  }
};