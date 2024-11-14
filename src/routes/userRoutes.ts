// src/routes/userRoutes.ts
import express from 'express';
import { registerUser, loginUser, getUserProfile, getAllUsers } from '../controllers/userController';

const router = express.Router();

// Ruta para registrar un nuevo usuario (pública)
router.post('/register', registerUser);

// Ruta para iniciar sesión (pública)
router.post('/login', loginUser);

// Ruta para obtener el perfil de usuario (pública en este caso, usando userId en la query)
router.get('/profile', getUserProfile);

// Nuevo endpoint para obtener todos los usuarios
router.get('/all', getAllUsers);

export default router;
