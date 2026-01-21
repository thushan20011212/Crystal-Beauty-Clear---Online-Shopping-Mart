import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      default: 'customer',
    },
    isBlocked: {
      type: Boolean,
      required: true,
      default: false,
    },
    img: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;