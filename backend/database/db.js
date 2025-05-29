import mongoose from 'mongoose';
export const db =  async () => {
    try {
        console.log('mangos are good',process.env.MONGO_URI);
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);  
    }
    catch (err) {
        console.error(`Error db: ${err.message}`);
        process.exit(1);
    }
}