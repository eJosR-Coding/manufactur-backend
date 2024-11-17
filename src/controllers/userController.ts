// src/controllers/userController.ts
import { Request, Response } from 'express';
import User from '../models/user';

export const registerUser = async (req: Request, res: Response): Promise<void> => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        res.status(400).json({ success: false, message: 'All fields are required.' });
        return;
    }

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            res.status(400).json({ success: false, message: 'User already exists.' });
            return;
        }

        const user = await User.create({ username, email, password });
        res.status(201).json({ success: true, data: { userId: user._id, username: user.username, email: user.email } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error creating user.' });
    }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ success: false, message: 'Email and password are required.' });
        return;
    }

    try {
        const user = await User.findOne({ email });
        if (!user || user.password !== password) {
            res.status(400).json({ success: false, message: 'Invalid credentials.' });
            return;
        }

        res.status(200).json({ success: true, data: { userId: user._id, username: user.username, email: user.email } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error logging in.' });
    }
};

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await User.find().select('username');
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error retrieving users.' });
    }
};



export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
    const userId = req.query.userId; // Lee el userId desde la query

    if (!userId) {
        res.status(400).json({ success: false, message: 'User ID is missing' });
        return;
    }

    try {
        const userProfile = await User.findById(userId).select('username email profile');

        if (!userProfile) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }

        res.status(200).json({ success: true, data: userProfile });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching profile' });
    }
};

export const updateUserProfile = async (req: Request, res: Response): Promise<void> => {
    const { userId, username, profile } = req.body;

    if (!userId) {
        res.status(400).json({ success: false, message: "User ID is required." });
        return;
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { username, profile },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            res.status(404).json({ success: false, message: "User not found." });
            return;
        }

        res.status(200).json({ success: true, data: updatedUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error updating user profile." });
    }
};
