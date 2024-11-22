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
exports.downloadMessageFile = exports.getMessagesByConversation = exports.sendMessage = void 0;
const Message_1 = __importDefault(require("../models/Message"));
const Conversation_1 = __importDefault(require("../models/Conversation"));
const dbConnect_1 = require("../config/dbConnect");
const mongoose_1 = __importDefault(require("mongoose"));
const sendMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { conversationId, sender, content } = req.body;
    const file = req.file;
    if (!conversationId || !sender) {
        res.status(400).json({ success: false, message: 'conversationId y sender son requeridos' });
        return;
    }
    try {
        let fileId;
        let fileUrl;
        let fileMetadata;
        if (file) {
            const uploadStream = dbConnect_1.bucket.openUploadStream(file.originalname, {
                metadata: {
                    contentType: file.mimetype,
                    sender,
                    conversationId,
                },
            });
            uploadStream.end(file.buffer);
            fileId = uploadStream.id;
            fileUrl = `/api/messages/file/${fileId.toString()}`;
            fileMetadata = {
                filename: file.originalname,
                contentType: file.mimetype,
            };
        }
        const newMessage = new Message_1.default({
            conversation: conversationId,
            sender,
            content,
            file: fileId ? fileId.toString() : undefined,
            fileMetadata,
        });
        yield newMessage.save();
        yield Conversation_1.default.findByIdAndUpdate(conversationId, {
            $push: { messages: newMessage._id },
        });
        res.status(201).json({ success: true, data: Object.assign(Object.assign({}, newMessage.toObject()), { fileUrl }) });
    }
    catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ success: false, message: 'Error sending message' });
    }
});
exports.sendMessage = sendMessage;
const getMessagesByConversation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { conversationId } = req.params;
    try {
        const messages = yield Message_1.default.find({ conversation: conversationId })
            .populate('sender', 'username')
            .sort({ createdAt: 1 });
        // Genera fileUrl dinámicamente para cada mensaje
        const messagesWithFileUrl = messages.map((message) => {
            const messageObj = message.toObject();
            if (message.file) {
                messageObj.fileUrl = `/api/messages/file/${message.file}`;
            }
            return messageObj;
        });
        res.status(200).json({ success: true, data: messagesWithFileUrl });
    }
    catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ success: false, message: 'Error fetching messages' });
    }
});
exports.getMessagesByConversation = getMessagesByConversation;
const downloadMessageFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { fileId } = req.params;
    try {
        const file = yield dbConnect_1.bucket.find({ _id: new mongoose_1.default.Types.ObjectId(fileId) }).toArray();
        if (!file || file.length === 0 || !file[0]) { // Verificación adicional para evitar `undefined`
            res.status(404).json({ success: false, message: 'File not found' });
            return;
        }
        const contentType = ((_a = file[0].metadata) === null || _a === void 0 ? void 0 : _a.contentType) || 'application/octet-stream'; // Uso seguro de `?` para verificar existencia
        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Disposition', `inline; filename="${file[0].filename}"`);
        const downloadStream = dbConnect_1.bucket.openDownloadStream(new mongoose_1.default.Types.ObjectId(fileId));
        downloadStream.pipe(res);
        downloadStream.on('error', (error) => {
            console.error('Error downloading file:', error);
            res.status(500).json({ success: false, message: 'Error downloading file' });
        });
    }
    catch (error) {
        console.error('Error fetching file:', error);
        res.status(500).json({ success: false, message: 'Error fetching file' });
    }
});
exports.downloadMessageFile = downloadMessageFile;
