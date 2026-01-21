import User from '../models/user.js'
import Order from '../models/order.js'
import Review from '../models/review.js'
import OTP from '../models/otp.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'
import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

// Create a new user
export function createUser(req, res) {
  const hashedPassword = bcrypt.hashSync(req.body.password, 10);

  const user = new User({
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    password: hashedPassword,
    role: req.body.role,
  });

  user
    .save()
    .then(() => {
      res.status(201).json({ message: 'User created successfully' });
    })
    .catch(() => {
      res.status(500).json({ message: 'Failed to create user' });
    });
}

// Login user with email and password
export function loginUser(req, res) {
  const { email, password } = req.body;

  User.findOne({ email: email })
    .then((user) => {
      if (user == null) {
        res.status(404).json({ message: 'User not found' });
      } else {
        const isPasswordCorrect = bcrypt.compareSync(password, user.password);
        if (isPasswordCorrect) {
          const token = jwt.sign(
            {
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
              role: user.role,
            },
            process.env.JWT_KEY
          );

          res.status(200).json({
            message: 'Login successful',
            token: token,
            role: user.role,
          });
        } else {
          res.status(404).json({ message: 'Incorrect password' });
        }
      }
    })
    .catch((error) => {
      res.status(500).json({ message: 'Database error occurred' });
    })
}

export async function loginWithGoogle(req,res){
    const token = req.body.accessToken;
    if(token == null){
        res.status(400).json({
            message: "Token is required",
        })
        return
    }
    const response = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    console.log(response.data)

    const user= await User.findOne({ 
        email: response.data.email 
    })

    
    if (user == null) {
        const newUser = new User(
            {
                email: response.data.email,
                firstName: response.data.given_name,
                lastName: response.data.family_name,
                password: "googleUserPassword",
                img: response.data.picture 
            }
        )
        await newUser.save()
        const token = jwt.sign(
            {
                email: newUser.email,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                role: newUser.role,
                img: newUser.img
            },
            process.env.JWT_KEY
        )
        res.json({
            message: "User login successfully",
            token: token,
            role: newUser.role
        })
    }
    else {
        const token = jwt.sign(
            {
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                img: user.img
            },
            process.env.JWT_KEY
        )
        res.json({
            message: "User login successfully",
            token: token,
            role: user.role
        })
    }
}

const transport = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
    }
});

export async function sendOTP(req,res) {
    const email = req.body.email;
    const randomOTP = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP

    if(email == null){
        res.status(400).json({
            message: "Email is required",
        })
        return
    }
    const user = await User.findOne({ 
        email: email 
    });
    if (user == null) {
        res.status(404).json({
            message: "User not found",
        })
    }

    //delete all otp
    await OTP.deleteMany({
        email: email
    });

    const message ={
        from : process.env.GMAIL_USER,
        to: email,
        subject: 'Resetting Password For Avanaa Glowy Square',
        text: "Your OTP for password reset is: " + randomOTP
    }

    const otp = new OTP({
        email: email,
        otp: randomOTP
    })

    await otp.save();
    transport.sendMail(message,(error,info)=>{
        if(error){
            res.status(500).json({
                message: "Failed to send OTP",
            })
        }else{
            res.json({
                message: "OTP sent successfully",
                otp: randomOTP
            })
        }
    });
}

export async function resetPassword(req,res){
    const otp = req.body.otp;
    const email = req.body.email;
    const newPassword = req.body.newPassword;

    const response = await OTP.findOne({
        email : email,
    })
    if (response == null) {
        res.status(500).json({
            message : "No otp request found please try again"
        })
        return
    }
    if(otp == response.otp){
        await OTP.deleteMany(
            {
                email : email
            }
        ) 
        const hashedPassword = bcrypt.hashSync(newPassword, 10);
        const response2 = await User.updateOne(
            {
                email: email
            },
            {
                password: hashedPassword
            }
        )
        res.json({
            message: "Password reset successfully"
        })
    }else{
        res.status(403).json({
            message: "OTPs are not matching! Please try again."
        })
    }
}

export function getUser(req, res) {
    if(req.userData == null) {
        res.status(403).json({
            message: "Your account is not authorized to view user details"
        });
        return;
    }
    res.status(200).json(req.userData);
}

// Get all users (Admin only)
export async function getAllUsers(req, res) {
    try {
        // Check if user is authenticated and is admin
        if (!req.userData || req.userData.role !== "admin") {
            return res.status(403).json({
                message: "Access denied. Admin privileges required."
            });
        }

        const users = await User.find()
            .select("-password") // Exclude password from response
            .sort({ createdAt: -1 }); // Latest users first

        res.status(200).json({
            message: "Users fetched successfully",
            count: users.length,
            users: users
        });

    } catch (error) {
        console.error("Get all users error:", error.message);
        res.status(500).json({
            message: "Failed to fetch users",
            error: error.message
        });
    }
}

// Update user role (Admin only)
export async function updateUserRole(req, res) {
    try {
        // Check if user is authenticated and is admin
        if (!req.userData || req.userData.role !== "admin") {
            return res.status(403).json({
                message: "Access denied. Admin privileges required."
            });
        }

        const { userId } = req.params;
        const { role } = req.body;

        if (!role || !["customer", "admin"].includes(role)) {
            return res.status(400).json({
                message: "Valid role is required (customer or admin)"
            });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { role: role },
            { new: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            message: "User role updated successfully",
            user: user
        });

    } catch (error) {
        console.error("Update user role error:", error.message);
        res.status(500).json({
            message: "Failed to update user role",
            error: error.message
        });
    }
}

// Delete user (Admin only)
// Also deletes all related orders and reviews
export async function deleteUser(req, res) {
    try {
        // Check if user is authenticated and is admin
        if (!req.userData || req.userData.role !== "admin") {
            return res.status(403).json({
                message: "Access denied. Admin privileges required."
            })
        }

        const { userId } = req.params

        // Find user first to get their email
        const user = await User.findById(userId)

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        const userEmail = user.email

        // Delete all orders associated with this user's email
        const deletedOrders = await Order.deleteMany({ email: userEmail })
        
        // Delete all reviews associated with this user's email
        const deletedReviews = await Review.deleteMany({ email: userEmail })

        // Finally, delete the user
        await User.findByIdAndDelete(userId)

        res.status(200).json({
            message: "User and all related data deleted successfully",
            deletedData: {
                user: user.email,
                ordersDeleted: deletedOrders.deletedCount,
                reviewsDeleted: deletedReviews.deletedCount
            }
        })

    } catch (error) {
        console.error("Delete user error:", error.message)
        res.status(500).json({
            message: "Failed to delete user",
            error: error.message
        })
    }
}