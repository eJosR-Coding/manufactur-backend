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
exports.getAllProjects = exports.deleteProject = exports.updateProject = exports.getProjectById = exports.getProjectsByUser = exports.createProject = void 0;
const project_1 = __importDefault(require("../models/project"));
// Crear un nuevo proyecto
const createProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, createdBy, teamMembers } = req.body;
    if (!name || !description || !createdBy) {
        res.status(400).json({ success: false, message: "Name, description, and createdBy are required." });
        return;
    }
    try {
        const project = new project_1.default({
            name,
            description,
            createdBy,
            teamMembers,
            stages: [], // Etapas vacías inicialmente
        });
        yield project.save();
        res.status(201).json({ success: true, data: project });
    }
    catch (error) {
        console.error("Error creating project:", error);
        res.status(500).json({ success: false, message: "Error creating project." });
    }
});
exports.createProject = createProject;
// Obtener proyectos por usuario
const getProjectsByUser = (req, // userId en req.query
res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.query;
    try {
        const projects = yield project_1.default.find({ $or: [{ createdBy: userId }, { teamMembers: userId }] })
            .populate("teamMembers", "username email")
            .populate("createdBy", "username email");
        res.status(200).json({ success: true, data: projects });
    }
    catch (error) {
        console.error("Error fetching projects:", error);
        res.status(500).json({ success: false, message: "Error fetching projects." });
    }
});
exports.getProjectsByUser = getProjectsByUser;
// Obtener un proyecto por ID
const getProjectById = (req, // projectId en req.params
res) => __awaiter(void 0, void 0, void 0, function* () {
    const { projectId } = req.params;
    try {
        const project = yield project_1.default.findById(projectId).populate("teamMembers").populate("createdBy");
        if (!project) {
            res.status(404).json({ success: false, message: "Project not found." });
            return;
        }
        res.status(200).json({ success: true, data: project });
    }
    catch (error) {
        console.error("Error fetching project:", error);
        res.status(500).json({ success: false, message: "Error fetching project." });
    }
});
exports.getProjectById = getProjectById;
// Actualizar proyecto
const updateProject = (req, // projectId en req.params
res) => __awaiter(void 0, void 0, void 0, function* () {
    const { projectId } = req.params;
    const updates = req.body;
    try {
        const project = yield project_1.default.findByIdAndUpdate(projectId, updates, { new: true });
        if (!project) {
            res.status(404).json({ success: false, message: "Project not found." });
            return;
        }
        res.status(200).json({ success: true, data: project });
    }
    catch (error) {
        console.error("Error updating project:", error);
        res.status(500).json({ success: false, message: "Error updating project." });
    }
});
exports.updateProject = updateProject;
// Eliminar proyecto
const deleteProject = (req, // projectId en req.params
res) => __awaiter(void 0, void 0, void 0, function* () {
    const { projectId } = req.params;
    try {
        const project = yield project_1.default.findByIdAndDelete(projectId);
        if (!project) {
            res.status(404).json({ success: false, message: "Project not found." });
            return;
        }
        res.status(200).json({ success: true, message: "Project deleted successfully." });
    }
    catch (error) {
        console.error("Error deleting project:", error);
        res.status(500).json({ success: false, message: "Error deleting project." });
    }
});
exports.deleteProject = deleteProject;
// Obtener todos los proyectos (sin filtro de usuario)
const getAllProjects = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const projects = yield project_1.default.find().populate("teamMembers", "username email").populate("createdBy", "username email");
        res.status(200).json({ success: true, data: projects });
    }
    catch (error) {
        console.error("Error fetching projects:", error);
        res.status(500).json({ success: false, message: "Error fetching projects." });
    }
});
exports.getAllProjects = getAllProjects;
