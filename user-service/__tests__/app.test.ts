import request from 'supertest';
import { app } from '../app';
import { UserDb } from '../src/db/Users';

beforeEach(async () => {
  await UserDb.initializeUserDatabase();
  await UserDb.createAdminAccount();
});

afterEach(async () => {
  await UserDb.dropUserTable();
});

const fail = () => {
  throw new Error('Failed test');
};

describe('"test" endpoint', () => {
  test('should return status 200', async () => {
    const response = await request(app).get('/v1/test').send();
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('Hear you loud and clear');
  });
});

describe('register endpoint', () => {
  const password = 'Testpassword1@';
  const username = 'testUser1';
  const email = 'testUser1@test.com';
  const firstName = 'tester';
  const lastName = 'testerLastName';

  const unusedUsername = 'testUser2';
  const unusedEmail = 'testUser2@test.com';

  const createTestUser = async () => {
    await UserDb.createUser(username, firstName, lastName, password, email);
  };

  test('correct response message for new user', async () => {
    const response = await request(app)
      .post('/v1/auth/register')
      .send({ username, email, firstName, lastName, password });
    expect(response.statusCode).toBe(200);
    expect(response.body.res).toBe('Account created successfully');
  });

  test('throw error for missing fields', async () => {
    const response = await request(app)
      .post('/v1/auth/register')
      .send({ email, firstName, lastName });

    expect(response.statusCode).toBe(400);
    expect(response.body.err).toBe('Missing Fields');
  });

  test('throw error for existing username', async () => {
    await createTestUser();
    const response = await request(app)
      .post('/v1/auth/register')
      .send({ username, email: unusedEmail, firstName, lastName, password });
    expect(response.statusCode).toBe(400);
    expect(response.body.err).toBe('Username is in use');
  });

  test('throw error for existing email', async () => {
    await createTestUser();
    const response = await request(app)
      .post('/v1/auth/register')
      .send({ username: unusedUsername, email, firstName, lastName, password });
    expect(response.statusCode).toBe(400);
    expect(response.body.err).toBe('Email is in use');
  });
});
