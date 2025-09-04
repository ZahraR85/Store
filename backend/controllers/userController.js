import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';



const generateToken = (userId, role) => {
  return jwt.sign({ userId, role }, process.env.JWT_SECRET, { expiresIn: '60d' });
};

// Register User
export const register = async (req, res) => {
  const { name, family, email, phone, password } = req.body;
console.log(req.body);
  try {
    const newUser = new User({ name, family, email, phone, password });
    await newUser.save();
    res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyValue)[0];
      return res.status(400).json({ error: `${duplicateField} already exists.` });
    }
    res.status(400).json({ error: 'Error registering user. Ensure all fields are valid.' });
  }
};

// Sign In User
export const signin = async (req, res) => {
  const { identifier, password } = req.body; // identifier = email or name

  try {
    // Find user by email or name
    const user = await User.findOne({
      $or: [{ email: identifier }, { name: identifier }],
    }).select('+password'); // Explicitly include the password field

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Compare provided password with stored hashed password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    //const token = generateToken(user._id, user.role);
     // Generate a JWT token with an expiration time
    const token = jwt.sign(
      { userId: user._id, role: user.role }, // Payload
      process.env.JWT_SECRET,              // Secret key
      { expiresIn: '1h' }                  // Expiration time
    );

    // Set token as HTTP-only cookie
    res
      .cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 3600000, // 1 hour
      })
      .status(200)
      .json({
        message: 'Login successful',
        userId: user._id,
        role: user.role,
        token,
      });
  } catch (error) {
    console.error('Error during sign in:', error);
    res.status(500).send({ error: 'Error during sign in' });
  }
};

// Update Password
export const updatePassword = async (req, res) => {
  const { userId } = req.user;
  const { oldPassword, newPassword } = req.body;

  try {
    const user = await User.findById(userId).select('+password');
    if (!user) return res.status(404).send('User not found');

    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) return res.status(401).send('Old password is incorrect');

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).send('Password updated successfully');
  } catch (error) {
    res.status(500).send('Error updating password');
  }
};

// Admin-Only Delete User
export const deleteUser = async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).send('Admins only');

  try {
    const { userId } = req.params;
    const user = await User.findByIdAndDelete(userId);

    if (!user) return res.status(404).send('User not found');
    res.status(200).send('User deleted');
  } catch (error) {
    res.status(500).send('Error deleting user');
  }
};

// Get all 
export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

// Get user role by userId (or _id)
export const getUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    // console.log('Incoming userId:', userId);

    // Validate userId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }

    const user = await User.findById(userId, 'role');
    if (!user) {
      // console.log('No user found for ID:', userId);
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ role: user.role });
  } catch (error) {
    console.error('Error fetching user role:', error);
    res.status(500).json({ error: 'Error fetching user role' });
  }
};

export const getUserProfile = async (req, res) => { 
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user profile', error });
  }
}