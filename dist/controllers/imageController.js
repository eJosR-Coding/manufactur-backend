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
exports.uploadImage = void 0;
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const uploadImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { image } = req.body;
    if (!image) {
        return res.status(400).json({ success: false, message: 'No image provided' });
    }
    try {
        const uploadResponse = yield cloudinary_1.default.uploader.upload(image, {
            folder: 'posts',
            fetch_format: 'auto',
            quality: 'auto',
            transformation: [
                { width: 600, height: 400, crop: "fill", gravity: "auto" } // Ajusta el tamaño a 600x400 con recorte automático
            ],
        });
        res.status(200).json({ success: true, url: uploadResponse.secure_url });
    }
    catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ success: false, message: 'Error uploading image' });
    }
});
exports.uploadImage = uploadImage;
