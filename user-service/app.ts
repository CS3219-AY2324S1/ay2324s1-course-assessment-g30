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
const version = 'v1';
app.use(express.json());

const router = express.Router();
app.use(`/${version}`, router);

router.get('/test', (req, res) => {
  res.send('Hear you loud and clear');
});

// Create new user endpoint
router.post('/auth/register', createUser);
router.post('/auth/login', loginUser);

// Protected routes
router.use(authJwtMiddleware);
router.post('/user', getUserProfile);
router.put('/user', updateUserProfile);
router.delete('/user', deleteUserProfile);

initalize_db().then(() => {
  app.listen(port, () => {
    console.log(`User-service on port ${port}`);
  });
});
