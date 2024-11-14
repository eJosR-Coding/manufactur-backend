import express from 'express';
import multer from 'multer';
import { createConversation, getUserConversations } from '../controllers/conversationController';

const router = express.Router();
const upload = multer(); // Initialize multer to handle file uploads

// Routes for conversations
router.post('/conversations', createConversation); // Create a new conversation
router.get('/conversations/:userId', getUserConversations); // Get all conversations of a user

export default router;
