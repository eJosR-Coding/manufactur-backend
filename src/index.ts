import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { dbConnect } from './config/dbConnect';
import userRoutes from './routes/userRoutes';
import postRoutes from './routes/postRoutes';
import commentRoutes from './routes/commentRoutes';
import imageRoutes from './routes/imageRoutes';
import chatRoutes from './routes/chatRoutes';
import fileRoutes from './routes/fileRoutes'; // Importa las rutas de archivos
import messageRoutes from './routes/messageRoutes'; // Importa las rutas de mensajes
import projectRoutes from "./routes/projectRoutes";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ limit: '1mb', extended: true }));

dbConnect();

app.use(cors({
    origin: 'http://localhost:3000', // URL de tu frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rutas para los diferentes recursos de la API
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api', imageRoutes); 
app.use('/api/chat', chatRoutes);
app.use('/api/files', fileRoutes); // Añade las rutas de archivos aquí
app.use('/api/messages', messageRoutes); // Añade las rutas de mensajes aquí
app.use("/api/projects", projectRoutes);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
