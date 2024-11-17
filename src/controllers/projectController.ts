import { Request, Response } from "express";
import Project from "../models/project";

// Crear un nuevo proyecto
export const createProject = async (req: Request, res: Response): Promise<void> => {
    const { name, description, createdBy, teamMembers } = req.body;

    if (!name || !description || !createdBy) {
        res.status(400).json({ success: false, message: "Name, description, and createdBy are required." });
        return;
    }

    try {
        const project = new Project({
            name,
            description,
            createdBy,
            teamMembers,
            stages: [], // Etapas vacías inicialmente
        });

        await project.save();
        res.status(201).json({ success: true, data: project });
    } catch (error) {
        console.error("Error creating project:", error);
        res.status(500).json({ success: false, message: "Error creating project." });
    }
};

// Obtener proyectos por usuario
export const getProjectsByUser = async (
    req: Request<{}, {}, {}, { userId: string }>, // userId en req.query
    res: Response
): Promise<void> => {
    const { userId } = req.query;

    try {
        const projects = await Project.find({ $or: [{ createdBy: userId }, { teamMembers: userId }] })
            .populate("teamMembers", "username email")
            .populate("createdBy", "username email");

        res.status(200).json({ success: true, data: projects });
    } catch (error) {
        console.error("Error fetching projects:", error);
        res.status(500).json({ success: false, message: "Error fetching projects." });
    }
};

// Obtener un proyecto por ID
export const getProjectById = async (
    req: Request<{ projectId: string }>, // projectId en req.params
    res: Response
): Promise<void> => {
    const { projectId } = req.params;

    try {
        const project = await Project.findById(projectId).populate("teamMembers").populate("createdBy");

        if (!project) {
            res.status(404).json({ success: false, message: "Project not found." });
            return;
        }

        res.status(200).json({ success: true, data: project });
    } catch (error) {
        console.error("Error fetching project:", error);
        res.status(500).json({ success: false, message: "Error fetching project." });
    }
};

// Actualizar proyecto
export const updateProject = async (
    req: Request<{ projectId: string }>, // projectId en req.params
    res: Response
): Promise<void> => {
    const { projectId } = req.params;
    const updates = req.body;

    try {
        const project = await Project.findByIdAndUpdate(projectId, updates, { new: true });

        if (!project) {
            res.status(404).json({ success: false, message: "Project not found." });
            return;
        }

        res.status(200).json({ success: true, data: project });
    } catch (error) {
        console.error("Error updating project:", error);
        res.status(500).json({ success: false, message: "Error updating project." });
    }
};

// Eliminar proyecto
export const deleteProject = async (
    req: Request<{ projectId: string }>, // projectId en req.params
    res: Response
): Promise<void> => {
    const { projectId } = req.params;

    try {
        const project = await Project.findByIdAndDelete(projectId);

        if (!project) {
            res.status(404).json({ success: false, message: "Project not found." });
            return;
        }

        res.status(200).json({ success: true, message: "Project deleted successfully." });
    } catch (error) {
        console.error("Error deleting project:", error);
        res.status(500).json({ success: false, message: "Error deleting project." });
    }
};

// Obtener todos los proyectos (sin filtro de usuario)
export const getAllProjects = async (req: Request, res: Response): Promise<void> => {
    try {
      const projects = await Project.find().populate("teamMembers", "username email").populate("createdBy", "username email");
      res.status(200).json({ success: true, data: projects });
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ success: false, message: "Error fetching projects." });
    }
  };
  