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
exports.deleteComment = exports.getCommentsByPostId = exports.createComment = void 0;
const comment_1 = __importDefault(require("../models/comment"));
const createComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId, userId, body, parentCommentId } = req.body;
    if (!postId || !userId || !body) {
        res.status(400).json({ success: false, message: 'Post ID, User ID, and comment body are required' });
        return;
    }
    try {
        // Crear el nuevo comentario
        const newComment = new comment_1.default({
            body,
            user: userId,
            post: postId,
            parentCommentId: parentCommentId || null, // Cambiado a parentCommentId
        });
        // Guardar el comentario en la base de datos
        yield newComment.save();
        // Si es una respuesta, agregar el comentario al array de respuestas del comentario padre
        if (parentCommentId) {
            const parentComment = yield comment_1.default.findById(parentCommentId);
            if (parentComment && !parentComment.replies.includes(newComment._id)) {
                yield parentComment.updateOne({ $push: { replies: newComment._id } });
            }
        }
        // Populate user field with username before sending the response
        yield newComment.populate('user', 'username');
        res.status(201).json({ success: true, data: newComment });
    }
    catch (error) {
        console.error('Error creating comment:', error);
        res.status(500).json({ success: false, message: 'Error creating comment' });
    }
});
exports.createComment = createComment;
// Obtener todos los comentarios de un post específico
const getCommentsByPostId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId } = req.query;
    if (!postId) {
        res.status(400).json({ success: false, message: 'Post ID is required' });
        return;
    }
    try {
        // Buscar todos los comentarios del post, incluyendo los detalles del usuario y las respuestas
        const comments = yield comment_1.default.find({ post: postId, parentCommentId: null }) // Cambiado a parentCommentId
            .populate('user', 'username') // Trae solo el username del usuario
            .populate({
            path: 'replies',
            populate: { path: 'user', select: 'username' } // Poblado en cascada para obtener el username en las respuestas
        });
        res.status(200).json({ success: true, data: comments });
    }
    catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ success: false, message: 'Error fetching comments' });
    }
});
exports.getCommentsByPostId = getCommentsByPostId;
// Eliminar un comentario
const deleteComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { commentId } = req.params;
    if (!commentId) {
        res.status(400).json({ success: false, message: 'Comment ID is required' });
        return;
    }
    try {
        const deletedComment = yield comment_1.default.findByIdAndDelete(commentId);
        if (!deletedComment) {
            res.status(404).json({ success: false, message: 'Comment not found' });
            return;
        }
        res.status(200).json({ success: true, message: 'Comment deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ success: false, message: 'Error deleting comment' });
    }
});
exports.deleteComment = deleteComment;
