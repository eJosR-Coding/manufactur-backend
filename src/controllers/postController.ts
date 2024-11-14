import { Request, Response } from 'express';
import Post from '../models/post';
import cloudinary from '../config/cloudinary';

export const getPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 5 } = req.query;
    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);

    const posts = await Post.find({})
    .populate('user', 'username')
    .sort({ createdAt: -1 })
    .skip((pageNumber - 1) * limitNumber)
    .limit(limitNumber);


    const totalPosts = await Post.countDocuments();
    const totalPages = Math.ceil(totalPosts / limitNumber);

    res.status(200).json({ success: true, data: posts, totalPages, currentPage: pageNumber });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
};

export const createPost = async (req: Request, res: Response): Promise<void> => {
  const { title, body, userId, imageUrl } = req.body;

  if (!title || !body || !userId) {
    res.status(400).json({ success: false, message: 'Title, body, and userId are required.' });
    return;
  }

  let uploadedImageUrl = imageUrl;

  // Si hay una imagen en el request, sube la imagen a Cloudinary
  if (imageUrl) {
    try {
      const uploadResponse = await cloudinary.uploader.upload(imageUrl, {
        folder: 'posts', // Puedes especificar una carpeta en Cloudinary
      });
      uploadedImageUrl = uploadResponse.secure_url;
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error uploading image' });
      return;
    }
  }

  try {
    const post = await Post.create({ title, body, user: userId, imageUrl: uploadedImageUrl });
    res.status(201).json({ success: true, data: post });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
};

export const deletePost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedPost = await Post.findByIdAndDelete(id);

    if (!deletedPost) {
      res.status(404).json({ success: false, message: 'Post not found' });
      return;
    }

    res.status(200).json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
};
