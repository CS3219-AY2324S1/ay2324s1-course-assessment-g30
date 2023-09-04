import express from 'express';

const app = express();
const port = 3000;

app.use(express.json());

app.get('/test', (req, res) => {
  res.send('Hear you loud and clear');
});

// Create new user endpoint
app.post('/user', (req, res) => {
  if ('username' in req.body && 'password' in req.body && 'email' in req.body) {
    res.send(
      `Username: ${req.body.username} Password: ${req.body.password} Username: ${req.body.email}`
    );
  } else {
    res.send("I don't know who the hell you are");
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
