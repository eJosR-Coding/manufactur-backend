// controllers/messageController.ts
import { Request, Response } from 'express';
import Message from '../models/Message';
import Conversation from '../models/Conversation';
import { bucket } from '../config/dbConnect';
import mongoose from 'mongoose';

export const sendMessage = async (req: Request, res: Response): Promise<void> => {
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
            const uploadStream = bucket.openUploadStream(file.originalname, {
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

        const newMessage = new Message({
            conversation: conversationId,
            sender,
            content,
            file: fileId ? fileId.toString() : undefined,
            fileMetadata,
        });

        await newMessage.save();

        await Conversation.findByIdAndUpdate(conversationId, {
            $push: { messages: newMessage._id },
        });

        res.status(201).json({ success: true, data: { ...newMessage.toObject(), fileUrl } });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ success: false, message: 'Error sending message' });
    }
};


export const getMessagesByConversation = async (req: Request, res: Response) => {
    const { conversationId } = req.params;

    try {
        const messages = await Message.find({ conversation: conversationId })
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
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ success: false, message: 'Error fetching messages' });
    }
};


export const downloadMessageFile = async (req: Request, res: Response): Promise<void> => {
    const { fileId } = req.params;

    try {
        const file = await bucket.find({ _id: new mongoose.Types.ObjectId(fileId) }).toArray();
        
        if (!file || file.length === 0 || !file[0]) {  // Verificación adicional para evitar `undefined`
            res.status(404).json({ success: false, message: 'File not found' });
            return;
        }

        const contentType = file[0].metadata?.contentType || 'application/octet-stream'; // Uso seguro de `?` para verificar existencia
        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Disposition', `inline; filename="${file[0].filename}"`);

        const downloadStream = bucket.openDownloadStream(new mongoose.Types.ObjectId(fileId));
        downloadStream.pipe(res);

        downloadStream.on('error', (error) => {
            console.error('Error downloading file:', error);
            res.status(500).json({ success: false, message: 'Error downloading file' });
        });
    } catch (error) {
        console.error('Error fetching file:', error);
        res.status(500).json({ success: false, message: 'Error fetching file' });
    }
};
