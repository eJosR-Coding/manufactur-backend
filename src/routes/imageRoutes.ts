// src/routes/imageRoutes.ts
import express, { Request, Response } from 'express';
import { uploadImage } from '../controllers/imageController';

const router = express.Router();

// Llamada directa sin envolturas adicionales.
router.post('/uploadImage', async (req: Request, res: Response) => {
    await uploadImage(req, res);
});

export default router;
