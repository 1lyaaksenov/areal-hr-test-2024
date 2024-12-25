const express = require('express'); 
const userRoutes = require('./routes/routes.js'); 
const cors = require('cors');

const app = express();

const startServer = () => {
    try {
        app.use(cors());
        app.use(express.json());    
        app.use('/api', userRoutes);

        const PORT = 3000;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();