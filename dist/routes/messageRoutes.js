"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const messageControler_1 = require("../controllers/messageControler");
const router = express_1.default.Router();
const upload = (0, multer_1.default)(); // Use multer to handle file uploads
router.post('/send', upload.single('file'), messageControler_1.sendMessage); // Send message with optional file
router.get('/conversation/:conversationId', messageControler_1.getMessagesByConversation); // Fetch messages by conversation
router.get('/file/:fileId', messageControler_1.downloadMessageFile); // Download file by ID
exports.default = router;
