import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { GridFSBucket } from 'mongodb';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI as string;

if (!MONGO_URI) {
  throw new Error('Por favor define la variable MONGO_URI en el archivo .env');
}

let bucket: GridFSBucket;

async function dbConnect() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Conectado a la base de datos');

    const db = mongoose.connection.db;
    if (db) {
      bucket = new GridFSBucket(db, { bucketName: 'fs' });
      console.log('GridFSBucket inicializado');
    } else {
      throw new Error('No se pudo obtener la base de datos');
    }
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
    process.exit(1);
  }
}

export { dbConnect, bucket };
