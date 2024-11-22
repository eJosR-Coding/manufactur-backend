"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const projectController_1 = require("../controllers/projectController");
const router = express_1.default.Router();
// Ruta para crear un proyecto
router.post("/", projectController_1.createProject);
// Ruta para obtener proyectos por usuario
router.get("/user", projectController_1.getProjectsByUser);
// Ruta para obtener todos los proyectos
router.get("/", projectController_1.getAllProjects); // <- Esta ruta llama a `getAllProjects`
// Ruta para obtener un proyecto por ID
router.get("/:projectId", projectController_1.getProjectById);
// Ruta para actualizar un proyecto
router.put("/:projectId", projectController_1.updateProject);
// Ruta para eliminar un proyecto
router.delete("/:projectId", projectController_1.deleteProject);
exports.default = router;
