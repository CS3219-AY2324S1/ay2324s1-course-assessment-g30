import { app } from './app';
import { initalize as initalize_db } from './db/init';

const port = process.env.PORT || 3000;

initalize_db().then(() => {
  app.listen(port, () => {
    console.log(`User-service on port ${port}`);
  });
});
