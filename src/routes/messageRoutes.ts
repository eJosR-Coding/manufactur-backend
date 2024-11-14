import express from 'express';
import multer from 'multer';
import {
    sendMessage,
    getMessagesByConversation,
    downloadMessageFile
} from '../controllers/messageControler';

const router = express.Router();
const upload = multer(); // Use multer to handle file uploads

router.post('/send', upload.single('file'), sendMessage); // Send message with optional file
router.get('/conversation/:conversationId', getMessagesByConversation); // Fetch messages by conversation
router.get('/file/:fileId', downloadMessageFile); // Download file by ID

export default router;
