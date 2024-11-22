# Imagen base de Node.js
FROM node:18-alpine

# Crear un directorio de trabajo
WORKDIR /app

# Copiar los archivos de configuración
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Instalar definiciones de tipo específicas (opcional para reducir tamaño en prod)
RUN npm install --only=development

# Copiar el resto del código fuente
COPY . .

# Exponer el puerto de la aplicación
EXPOSE 5000

# Comando para desarrollo
CMD ["npm", "run", "dev"]
