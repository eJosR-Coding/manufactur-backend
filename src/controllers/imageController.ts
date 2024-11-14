import { Request, Response } from 'express';
import cloudinary from '../config/cloudinary';

export const uploadImage = async (req: Request, res: Response) => {
    const { image } = req.body;

    if (!image) {
        return res.status(400).json({ success: false, message: 'No image provided' });
    }

    try {
        const uploadResponse = await cloudinary.uploader.upload(image, {
            folder: 'posts',
            fetch_format: 'auto',
            quality: 'auto',
            transformation: [
                { width: 600, height: 400, crop: "fill", gravity: "auto" } // Ajusta el tamaño a 600x400 con recorte automático
            ],
        });        
        res.status(200).json({ success: true, url: uploadResponse.secure_url });
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ success: false, message: 'Error uploading image' });
    }
};
