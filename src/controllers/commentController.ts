import { Request, Response } from 'express';
import Comment from '../models/comment';

export const createComment = async (req: Request, res: Response) => {
    const { postId, userId, body, parentCommentId } = req.body;

    if (!postId || !userId || !body) {
        res.status(400).json({ success: false, message: 'Post ID, User ID, and comment body are required' });
        return;
    }

    try {
        // Crear el nuevo comentario
        const newComment = new Comment({
            body,
            user: userId,
            post: postId,
            parentCommentId: parentCommentId || null, // Cambiado a parentCommentId
        });

        // Guardar el comentario en la base de datos
        await newComment.save();

        // Si es una respuesta, agregar el comentario al array de respuestas del comentario padre
        if (parentCommentId) {
            const parentComment = await Comment.findById(parentCommentId);
            if (parentComment && !parentComment.replies.includes(newComment._id)) {
                await parentComment.updateOne({ $push: { replies: newComment._id } });
            }
        }

        // Populate user field with username before sending the response
        await newComment.populate('user', 'username');

        res.status(201).json({ success: true, data: newComment });
    } catch (error) {
        console.error('Error creating comment:', error);
        res.status(500).json({ success: false, message: 'Error creating comment' });
    }
};

// Obtener todos los comentarios de un post específico
export const getCommentsByPostId = async (req: Request, res: Response) => {
    const { postId } = req.query;

    if (!postId) {
        res.status(400).json({ success: false, message: 'Post ID is required' });
        return;
    }

    try {
        // Buscar todos los comentarios del post, incluyendo los detalles del usuario y las respuestas
        const comments = await Comment.find({ post: postId, parentCommentId: null }) // Cambiado a parentCommentId
            .populate('user', 'username') // Trae solo el username del usuario
            .populate({
                path: 'replies',
                populate: { path: 'user', select: 'username' } // Poblado en cascada para obtener el username en las respuestas
            });

        res.status(200).json({ success: true, data: comments });
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ success: false, message: 'Error fetching comments' });
    }
};

// Eliminar un comentario
export const deleteComment = async (req: Request, res: Response) => {
    const { commentId } = req.params;

    if (!commentId) {
        res.status(400).json({ success: false, message: 'Comment ID is required' });
        return;
    }

    try {
        const deletedComment = await Comment.findByIdAndDelete(commentId);

        if (!deletedComment) {
            res.status(404).json({ success: false, message: 'Comment not found' });
            return;
        }

        res.status(200).json({ success: true, message: 'Comment deleted successfully' });
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ success: false, message: 'Error deleting comment' });
    }
};
