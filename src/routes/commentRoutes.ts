import { Router, Request, Response } from 'express';
import { createComment, getCommentsByPostId, deleteComment } from '../controllers/commentController';

const router = Router();

// Envolver cada controlador en una función anónima
router.post('/', (req: Request, res: Response) => {
    createComment(req, res);
});

router.get('/', (req: Request, res: Response) => {
    getCommentsByPostId(req, res);
});

router.delete('/:commentId', (req: Request, res: Response) => {
    deleteComment(req, res);
});

export default router;
