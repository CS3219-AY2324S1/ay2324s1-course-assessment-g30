import 'dotenv/config';
import {
  createUser,
  deleteUserProfile,
  getUserProfile,
  loginUser,
  updateUserProfile
} from './controllers/user-controller';
import express from 'express';
import authJwtMiddleware from './middleware/auth';
import cors from 'cors';
import { getUserRole } from './controllers/auth-controller';

const app = express();
const version = 'v1';

app.use(cors());

app.use(express.json());

const router = express.Router();
app.use(`/${version}`, router);

router.get('/test', (req, res) => {
  res.send('Hear you loud and clear');
});

// Create new user endpoint
router.post('/auth/register', createUser);
router.post('/auth/login', loginUser);

router.post('/user/role', getUserRole);

// Protected routes
router.use(authJwtMiddleware);
router.post('/user', getUserProfile);
router.put('/user', updateUserProfile);
router.delete('/user', deleteUserProfile);

export { app };
