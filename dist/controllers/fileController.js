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
exports.downloadFile = exports.uploadFile = void 0;
const dbConnect_1 = require("../config/dbConnect");
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)();
// Controlador para subir archivos
const uploadFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file) {
        res.status(400).json({ message: 'No file uploaded' });
        return;
    }
    const uploadStream = dbConnect_1.bucket.openUploadStream(req.file.originalname);
    uploadStream.end(req.file.buffer);
    uploadStream.on('finish', () => {
        res.status(200).json({ message: 'File uploaded successfully', fileId: uploadStream.id });
    });
    uploadStream.on('error', (error) => {
        res.status(500).json({ message: 'Error uploading file', error });
    });
});
exports.uploadFile = uploadFile;
// Controlador para descargar archivos
const downloadFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { filename } = req.params;
    const downloadStream = dbConnect_1.bucket.openDownloadStreamByName(filename);
    downloadStream.on('data', (chunk) => {
        res.write(chunk);
    });
    downloadStream.on('end', () => {
        res.end();
    });
    downloadStream.on('error', (error) => {
        res.status(404).json({ message: 'File not found', error });
    });
});
exports.downloadFile = downloadFile;
