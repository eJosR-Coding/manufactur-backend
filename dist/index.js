"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const dbConnect_1 = require("./config/dbConnect");
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const postRoutes_1 = __importDefault(require("./routes/postRoutes"));
const commentRoutes_1 = __importDefault(require("./routes/commentRoutes"));
const imageRoutes_1 = __importDefault(require("./routes/imageRoutes"));
const chatRoutes_1 = __importDefault(require("./routes/chatRoutes"));
const fileRoutes_1 = __importDefault(require("./routes/fileRoutes")); // Importa las rutas de archivos
const messageRoutes_1 = __importDefault(require("./routes/messageRoutes")); // Importa las rutas de mensajes
const projectRoutes_1 = __importDefault(require("./routes/projectRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use(express_1.default.json({ limit: '1mb' }));
app.use(express_1.default.urlencoded({ limit: '1mb', extended: true }));
(0, dbConnect_1.dbConnect)();
app.use((0, cors_1.default)({
    origin: 'http://localhost:3000', // URL de tu frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
// Rutas para los diferentes recursos de la API
app.use('/api/users', userRoutes_1.default);
app.use('/api/posts', postRoutes_1.default);
app.use('/api/comments', commentRoutes_1.default);
app.use('/api', imageRoutes_1.default);
app.use('/api/chat', chatRoutes_1.default);
app.use('/api/files', fileRoutes_1.default); // Añade las rutas de archivos aquí
app.use('/api/messages', messageRoutes_1.default); // Añade las rutas de mensajes aquí
app.use("/api/projects", projectRoutes_1.default);
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
