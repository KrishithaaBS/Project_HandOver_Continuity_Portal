import User from "../models/User.js";
import bcrypt from "bcrypt"; //hash password
import jwt from "jsonwebtoken"; //prove user is logged in


export const signup = async (req, res) => {
    try{
        const { username, email, password } = req.body;
        const existingUser = await User.findOne({email});
        if (existingUser) {
            return res.status(400).json({success: false, message: "User already exists, login"});
        }
        const passwordhash = await bcrypt.hash(password, 10);
        const user = await User.create({username, email, password: passwordhash});
        res.status(201).json({success: true, message: "User created successfully"});
    }catch(error){
        res.status(500).json({success: false, message: "Signup failed", error: error.message});
    }
}

export const login = async (req, res) => {
    try{
        const { username, email, password } = req.body;
        const existingUser = await User.findOne({email});
        if (!existingUser) {
            return res.status(400).json({success: false, message: "User doesn't exists, signup"});
        }
        if (existingUser.banned) {
            return res.status(403).json({success: false, message: "This account has been banned"});
        }
        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if(!isPasswordCorrect){
            return res.status(400).json({success: false, message: "Invalid Password, try again"});
        }
        const token = jwt.sign(
            { userId: existingUser._id, role: existingUser.role},
            process.env.JWT_SECRET,
            { expiresIn: "1h"}
        );
        const { password: _password, resetToken: _resetToken, ...safeUser } = existingUser.toObject();
        res.status(200).json({success: true, message: "Login successful",token, data: safeUser});
    }catch(error){
        res.status(500).json({success: false, message: "Login failed", error: error.message});
    }
}

export const getCurrentUser = async (req, res) => {
    try{
        const user = await User.findById(req.user.userId).select('-password');
        if(!user){
            return res.status(404).json({success: false, message: "User not found"});
        }
        res.status(200).json({success: true, data: user});
    }catch(error){
        res.status(500).json({success: false, message: "Failed to fetch user", error: error.message});
    }
}

export const signout = async (req, res) => {
    try{
        res.clearCookie("token"); //remove JWT cookie from browser
        res.status(200).json({success: true, message: "Signout successful"});
    }catch(error){
        res.status(500).json({success: false, message: "Signout failed", error: error.message});
    }
}