// src/controllers/fileController.ts
import { Request, Response } from 'express';
import { bucket } from '../config/dbConnect';
import multer from 'multer';

const upload = multer();

// Controlador para subir archivos
export const uploadFile = async (req: Request, res: Response): Promise<void> => {
  if (!req.file) {
    res.status(400).json({ message: 'No file uploaded' });
    return;
  }

  const uploadStream = bucket.openUploadStream(req.file.originalname);
  uploadStream.end(req.file.buffer);

  uploadStream.on('finish', () => {
    res.status(200).json({ message: 'File uploaded successfully', fileId: uploadStream.id });
  });

  uploadStream.on('error', (error) => {
    res.status(500).json({ message: 'Error uploading file', error });
  });
};

// Controlador para descargar archivos
export const downloadFile = async (req: Request, res: Response): Promise<void> => {
  const { filename } = req.params;

  const downloadStream = bucket.openDownloadStreamByName(filename);

  downloadStream.on('data', (chunk) => {
    res.write(chunk);
  });

  downloadStream.on('end', () => {
    res.end();
  });

  downloadStream.on('error', (error) => {
    res.status(404).json({ message: 'File not found', error });
  });
};
