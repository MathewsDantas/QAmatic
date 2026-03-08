import User from '../models/User.js';
import { signToken } from '../utils/jwt.js';

export const registerUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = new Error('Email already in use');
    error.status = 409;
    throw error;
  }

  const user = await User.create({ name, email, password });
  const token = signToken({ id: user._id, email: user.email });

  return {
    user: { id: user._id, name: user.name, email: user.email },
    token,
  };
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    const error = new Error('Invalid email or password');
    error.status = 401;
    throw error;
  }

  const token = signToken({ id: user._id, email: user.email });

  return {
    user: { id: user._id, name: user.name, email: user.email },
    token,
  };
};

export const getUserById = async (id) => {
  const user = await User.findById(id);
  if (!user) {
    const error = new Error('User not found');
    error.status = 404;
    throw error;
  }
  return { id: user._id, name: user.name, email: user.email };
};
