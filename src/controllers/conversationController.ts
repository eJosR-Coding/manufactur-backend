import { Request, Response } from 'express';
import Conversation from '../models/Conversation';

export const createConversation = async (req: Request, res: Response): Promise<void> => {
    const { participants } = req.body;

    // Validate participants
    if (!participants || !Array.isArray(participants) || participants.length !== 2) {
        res.status(400).json({ success: false, message: 'The conversation must be between two users.' });
        return;
    }

    try {
        // Check if a conversation already exists between these two participants
        let conversation = await Conversation.findOne({ participants: { $all: participants } });

        if (!conversation) {
            // Create a new conversation if it doesn't exist
            conversation = new Conversation({ participants, messages: [] });
            await conversation.save();
        }

        res.status(201).json({ success: true, data: conversation });
    } catch (error) {
        console.error('Error creating conversation:', error);
        res.status(500).json({ success: false, message: 'Error creating conversation' });
    }
};

// Get all conversations of a user
export const getUserConversations = async (req: Request, res: Response) => {
    const { userId } = req.params;

    try {
        const conversations = await Conversation.find({ participants: userId })
            .populate('participants', 'username') // Only fetch `username`
            .populate({
                path: 'messages',
                options: { sort: { createdAt: -1 }, limit: 1 }, // Last message
            });

        res.status(200).json({ success: true, data: conversations });
    } catch (error) {
        console.error('Error fetching user conversations:', error);
        res.status(500).json({ success: false, message: 'Error fetching conversations' });
    }
};
