import 'dotenv/config';
import {
  createUser,
  deleteUserProfile,
  getUserProfile,
  loginUser,
  updateUserProfile
} from './src/controllers/user-controller';
import { initalize as initalize_db } from './src/db/init';
import express from 'express';
import authJwtMiddleware from './src/middleware/auth';

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

app.get('/test', (req, res) => {
  res.send('Hear you loud and clear');
});

// Create new user endpoint
app.post('/user', createUser);
app.post('/login', loginUser);

// Protected routes
app.use(authJwtMiddleware);
app.get('/user', getUserProfile);
app.put('/user', updateUserProfile);
app.delete('/user', deleteUserProfile);

initalize_db().then(() => {
  app.listen(port, () => {
    console.log(`User-service on port ${port}`);
  });
});
