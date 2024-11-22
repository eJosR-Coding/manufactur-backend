"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const conversationController_1 = require("../controllers/conversationController");
const router = express_1.default.Router();
const upload = (0, multer_1.default)(); // Initialize multer to handle file uploads
// Routes for conversations
router.post('/conversations', conversationController_1.createConversation); // Create a new conversation
router.get('/conversations/:userId', conversationController_1.getUserConversations); // Get all conversations of a user
exports.default = router;
