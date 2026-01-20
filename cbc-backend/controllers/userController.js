import User from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import axios from 'axios'; // For Google token verification

dotenv.config();

export function createUser(req, res) {

    const hashedPassword = bcrypt.hashSync(req.body.password, 10);

    const user = new User({
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: hashedPassword,
        role: req.body.role,
    });

    user.save().then(() => {
        res.status(201).json({
            message: "User created successfully",
        });
    }).catch(() => {
        res.status(500).json({
            message: "Failed to create user",
        });
 });

}

export function loginUser(req, res) {
    const email = req.body.email;
    const password = req.body.password

    User.findOne({ email: email }).then
        ((user) => {
            if(user == null){
                res.status(404).json(
                    {
                        message: "User not found",
                    }
                )
            } else {
                const isPasswordCorrect = bcrypt.compareSync(password, user.password);  
                if(isPasswordCorrect){

                   const token = jwt.sign(
                        {
                            email: user.email,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            role: user.role
                        },
                        process.env.JWT_KEY
                    )

                    res.status(200).json(
                        {
                            message: "Login successful",
                            token: token,
                            role: user.role,
                        }
                    )
                } else {
                    res.status(404).json(
                        {
                            message: "Incorrect password",
                        }
                    )
                }
                                }
        }
    ).catch((error) => {
        res.status(500).json({
            message: "Database error occurred",
        });
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

