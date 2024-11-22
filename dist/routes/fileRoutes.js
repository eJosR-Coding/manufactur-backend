"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/fileRoutes.ts
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const fileController_1 = require("../controllers/fileController");
const router = express_1.default.Router();
const upload = (0, multer_1.default)();
// Ruta para subir archivos
router.post('/upload', upload.single('file'), fileController_1.uploadFile);
// Ruta para descargar archivos
router.get('/download/:filename', fileController_1.downloadFile);
exports.default = router;
