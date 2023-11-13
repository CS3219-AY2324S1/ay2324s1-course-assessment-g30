import { app } from './app';
import { initialize as initialize_db } from './db/init';

const port = process.env.PORT || 3000;

initialize_db().then(() => {
  app.listen(port, () => {
    console.log(`User-service on port ${port}`);
  });
});
