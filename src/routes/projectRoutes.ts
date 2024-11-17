import express from "express";
import {
    createProject,
    getProjectsByUser,
    getProjectById,
    updateProject,
    deleteProject,
    getAllProjects,
} from "../controllers/projectController";

const router = express.Router();

// Ruta para crear un proyecto
router.post("/", createProject);

// Ruta para obtener proyectos por usuario
router.get("/user", getProjectsByUser);

// Ruta para obtener todos los proyectos
router.get("/", getAllProjects); // <- Esta ruta llama a `getAllProjects`

// Ruta para obtener un proyecto por ID
router.get("/:projectId", getProjectById);

// Ruta para actualizar un proyecto
router.put("/:projectId", updateProject);

// Ruta para eliminar un proyecto
router.delete("/:projectId", deleteProject);

export default router;
