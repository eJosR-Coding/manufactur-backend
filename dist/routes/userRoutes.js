"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/userRoutes.ts
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const router = express_1.default.Router();
// Ruta para registrar un nuevo usuario (pública)
router.post('/register', userController_1.registerUser);
// Ruta para iniciar sesión (pública)
router.post('/login', userController_1.loginUser);
// Ruta para obtener el perfil de usuario (pública en este caso, usando userId en la query)
router.get('/profile', userController_1.getUserProfile);
// Nuevo endpoint para obtener todos los usuarios
router.get('/all', userController_1.getAllUsers);
exports.default = router;
