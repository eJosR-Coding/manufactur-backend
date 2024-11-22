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
exports.getUserConversations = exports.createConversation = void 0;
const Conversation_1 = __importDefault(require("../models/Conversation"));
const createConversation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { participants } = req.body;
    // Validate participants
    if (!participants || !Array.isArray(participants) || participants.length !== 2) {
        res.status(400).json({ success: false, message: 'The conversation must be between two users.' });
        return;
    }
    try {
        // Check if a conversation already exists between these two participants
        let conversation = yield Conversation_1.default.findOne({ participants: { $all: participants } });
        if (!conversation) {
            // Create a new conversation if it doesn't exist
            conversation = new Conversation_1.default({ participants, messages: [] });
            yield conversation.save();
        }
        res.status(201).json({ success: true, data: conversation });
    }
    catch (error) {
        console.error('Error creating conversation:', error);
        res.status(500).json({ success: false, message: 'Error creating conversation' });
    }
});
exports.createConversation = createConversation;
// Get all conversations of a user
const getUserConversations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const conversations = yield Conversation_1.default.find({ participants: userId })
            .populate('participants', 'username') // Only fetch `username`
            .populate({
            path: 'messages',
            options: { sort: { createdAt: -1 }, limit: 1 }, // Last message
        });
        res.status(200).json({ success: true, data: conversations });
    }
    catch (error) {
        console.error('Error fetching user conversations:', error);
        res.status(500).json({ success: false, message: 'Error fetching conversations' });
    }
});
exports.getUserConversations = getUserConversations;
