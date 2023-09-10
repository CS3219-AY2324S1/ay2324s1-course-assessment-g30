import 'dotenv/config';
import express from 'express';
import {
  createUser,
  deleteUserProfile,
  getUserProfile,
  loginUser,
  updateUserProfile
} from './controllers/user-controller';
import { initalize as initalize_db } from './db/init';
import authJwtMiddleware from './middleware/auth';

const app = express();
const port = 3000;

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
    console.log(`Example app listening on port ${port}`);
  });
});
