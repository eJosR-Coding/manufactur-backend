"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserProfile = exports.getUserProfile = exports.getAllUsers = exports.loginUser = exports.registerUser = void 0;
const user_1 = __importDefault(require("../models/user"));
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        res.status(400).json({ success: false, message: 'All fields are required.' });
        return;
    }
    try {
        const userExists = yield user_1.default.findOne({ email });
        if (userExists) {
            res.status(400).json({ success: false, message: 'User already exists.' });
            return;
        }
        const user = yield user_1.default.create({ username, email, password });
        res.status(201).json({ success: true, data: { userId: user._id, username: user.username, email: user.email } });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Error creating user.' });
    }
});
exports.registerUser = registerUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ success: false, message: 'Email and password are required.' });
        return;
    }
    try {
        const user = yield user_1.default.findOne({ email });
        if (!user || user.password !== password) {
            res.status(400).json({ success: false, message: 'Invalid credentials.' });
            return;
        }
        res.status(200).json({ success: true, data: { userId: user._id, username: user.username, email: user.email } });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Error logging in.' });
    }
});
exports.loginUser = loginUser;
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_1.default.find().select('username');
        res.status(200).json({ success: true, data: users });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Error retrieving users.' });
    }
});
exports.getAllUsers = getAllUsers;
const getUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.query.userId; // Lee el userId desde la query
    if (!userId) {
        res.status(400).json({ success: false, message: 'User ID is missing' });
        return;
    }
    try {
        const userProfile = yield user_1.default.findById(userId).select('username email profile');
        if (!userProfile) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }
        res.status(200).json({ success: true, data: userProfile });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching profile' });
    }
});
exports.getUserProfile = getUserProfile;
const updateUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, username, profile } = req.body;
    if (!userId) {
        res.status(400).json({ success: false, message: "User ID is required." });
        return;
    }
    try {
        const updatedUser = yield user_1.default.findByIdAndUpdate(userId, { username, profile }, { new: true, runValidators: true });
        if (!updatedUser) {
            res.status(404).json({ success: false, message: "User not found." });
            return;
        }
        res.status(200).json({ success: true, data: updatedUser });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error updating user profile." });
    }
});
exports.updateUserProfile = updateUserProfile;
