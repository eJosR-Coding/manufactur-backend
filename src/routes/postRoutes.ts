import express from 'express';
import { getPosts, createPost, deletePost } from '../controllers/postController';

const router = express.Router();

router.get('/', getPosts);  // Cambia a '/'
router.post('/', createPost);  // Cambia a '/'
router.delete('/:id', deletePost);  // Cambia a '/:id'

export default router;
