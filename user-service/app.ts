import 'dotenv/config';
import express from 'express';
import { createUser } from './controllers/user-controller';
import { initalize as initalize_db } from './db/init';

const app = express();
const port = 3000;

app.use(express.json());

app.get('/test', (req, res) => {
  res.send('Hear you loud and clear');
});

// Create new user endpoint
app.post('/user', createUser);

initalize_db().then(() => {
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
});
