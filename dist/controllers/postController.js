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
exports.deletePost = exports.createPost = exports.getPosts = void 0;
const post_1 = __importDefault(require("../models/post"));
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const getPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page = 1, limit = 5 } = req.query;
        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);
        const posts = yield post_1.default.find({})
            .populate('user', 'username')
            .sort({ createdAt: -1 })
            .skip((pageNumber - 1) * limitNumber)
            .limit(limitNumber);
        const totalPosts = yield post_1.default.countDocuments();
        const totalPages = Math.ceil(totalPosts / limitNumber);
        res.status(200).json({ success: true, data: posts, totalPages, currentPage: pageNumber });
    }
    catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});
exports.getPosts = getPosts;
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, body, userId, imageUrl } = req.body;
    if (!title || !body || !userId) {
        res.status(400).json({ success: false, message: 'Title, body, and userId are required.' });
        return;
    }
    let uploadedImageUrl = imageUrl;
    // Si hay una imagen en el request, sube la imagen a Cloudinary
    if (imageUrl) {
        try {
            const uploadResponse = yield cloudinary_1.default.uploader.upload(imageUrl, {
                folder: 'posts', // Puedes especificar una carpeta en Cloudinary
            });
            uploadedImageUrl = uploadResponse.secure_url;
        }
        catch (error) {
            res.status(500).json({ success: false, message: 'Error uploading image' });
            return;
        }
    }
    try {
        const post = yield post_1.default.create({ title, body, user: userId, imageUrl: uploadedImageUrl });
        res.status(201).json({ success: true, data: post });
    }
    catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});
exports.createPost = createPost;
const deletePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deletedPost = yield post_1.default.findByIdAndDelete(id);
        if (!deletedPost) {
            res.status(404).json({ success: false, message: 'Post not found' });
            return;
        }
        res.status(200).json({ success: true, message: 'Post deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
exports.deletePost = deletePost;
