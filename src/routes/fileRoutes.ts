// src/routes/fileRoutes.ts
import express from 'express';
import multer from 'multer';
import { uploadFile, downloadFile } from '../controllers/fileController';

const router = express.Router();
const upload = multer();

// Ruta para subir archivos
router.post('/upload', upload.single('file'), uploadFile);

// Ruta para descargar archivos
router.get('/download/:filename', downloadFile);

export default router;
