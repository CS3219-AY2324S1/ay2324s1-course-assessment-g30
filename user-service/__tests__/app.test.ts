import request from 'supertest';
import { app } from '../src/app';
import { UserDb } from '../src/db/Users';

beforeEach(async () => {
  await UserDb.initializeUserDatabase();
});

afterEach(async () => {
  await UserDb.dropUserTable();
});

const password = 'Testpassword1@';
const username = 'testUser1';
const email = 'testUser1@test.com';
const firstName = 'tester';
const lastName = 'testerLastName';

const adminEmail = 'testAdmin1@test.com';
const adminUsername = 'testAdmin1';
const adminFirstName = 'adminTester';

const unusedUsername = 'testUser2';
const unusedEmail = 'testUser2@test.com';

const invalidPassword = '1235';
const validPassword = 'Test@12345678'

const createTestUser = async () => {
  await UserDb.createUser(username, firstName, lastName, password, email);
};

const createTestAdmin = async () => {
  await UserDb.createAdmin(
    adminUsername,
    adminFirstName,
    lastName,
    password,
    adminEmail
  );
};

const loginTestUser = async () => {
  return await request(app).post('/v1/auth/login/').send({ email, password });
};

const loginTestAdmin = async () => {
  return await request(app)
    .post('/v1/auth/login/')
    .send({ email: adminEmail, password });
};

const getUserJwtToken = async () => {
  const request = await loginTestUser();
  return request.body.res.accessToken;
};

const getUserUUID = async () => {
  const request = await loginTestUser();
  return request.body.res.uuid;
};

const getAdminJwtToken = async () => {
  const request = await loginTestAdmin();
  return request.body.res.accessToken;
};

const getAdminUUID = async () => {
  const request = await loginTestAdmin();
  return request.body.res.uuid;
};

describe('"test" endpoint', () => {
  test('should return status 200', async () => {
    const response = await request(app).get('/v1/test').send();
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('Hear you loud and clear');
  });
});

describe('register endpoint', () => {
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

describe('login endpoint', () => {
  test('correct response message for existing user', async () => {
    await createTestUser();
    const response = await request(app)
      .post('/v1/auth/login/')
      .send({ email, password });

    expect(response.statusCode).toBe(200);
    expect(response.body.res).toHaveProperty('accessToken');
    expect(response.body.res).toHaveProperty('uuid');
    expect(response.body.res).toHaveProperty('exp');
  });

  test('correct response message for non-existent user', async () => {
    const response = await request(app)
      .post('/v1/auth/login/')
      .send({ email, password });

    expect(response.statusCode).toBe(403);
    expect(response.body.err).toBe('User does not exist');
  });

  test('correct response message for incorrect password', async () => {
    await createTestUser();
    const response = await request(app)
      .post('/v1/auth/login/')
      .send({ email, password: 'badPassword' });

    expect(response.statusCode).toBe(403);
    expect(response.body.err).toBe('Incorrect password for user account');
  });
});

describe('update profile endpoint', () => {
  const newUsername = 'newusername';

  test('Allows user to update their own profile', async () => {
    await createTestUser();
    const token = await getUserJwtToken();
    const uuid = await getUserUUID();
    const response = await request(app)
      .put('/v1/user')
      .auth(token, { type: 'bearer' })
      .send({ uuid, username: newUsername, password: validPassword });

    expect(response.statusCode).toBe(200);
    expect(response.body.res).toHaveProperty('username', newUsername);
  });

  test('Receive error for invalid update password', async () => {
    await createTestUser();
    const token = await getUserJwtToken();
    const uuid = await getUserUUID();
    const response = await request(app)
      .put('/v1/user')
      .auth(token, { type: 'bearer' })
      .send({ uuid, password: invalidPassword});

    expect(response.statusCode).toBe(400);
    expect(response.body.err).toBe('Invalid password provided');
  });

  test('Disallows unauthorised user to update profile', async () => {
    await createTestUser();
    const invalidToken = 'invalidToken';
    const uuid = await getUserUUID();
    const response = await request(app)
      .put('/v1/user')
      .auth(invalidToken, { type: 'bearer' })
      .send({ uuid, username: newUsername });

    expect(response.statusCode).toBe(403);
    expect(response.body.err).toBe('Invalid Token');
  });
});

describe('delete profile endpoint', () => {
  test('Allows user to delete their own profile', async () => {
    await createTestUser();
    const token = await getUserJwtToken();
    const uuid = await getUserUUID();
    const response = await request(app)
      .delete('/v1/user')
      .auth(token, { type: 'bearer' })
      .send({ uuid });

    expect(response.statusCode).toBe(200);
    expect(response.body.res).toBe('User account has been deleted');
  });

  test('Disallows unauthorised user to delete profile', async () => {
    await createTestUser();
    const invalidToken = 'invalidToken';
    const uuid = await getUserUUID();
    const response = await request(app)
      .delete('/v1/user')
      .auth(invalidToken, { type: 'bearer' })
      .send({ uuid });

    expect(response.statusCode).toBe(403);
    expect(response.body.err).toBe('Invalid Token');
  });
});

describe('Get role endpoint', () => {
  test('return role for admin user', async () => {
    await createTestAdmin();
    const token = await getAdminJwtToken();
    const response = await request(app).post('/v1/user/role').send({ token });

    expect(response.statusCode).toBe(200);
    expect(response.body.res).toHaveProperty('role', 'MAINTAINER');
  });

  test('return role for registered user', async () => {
    await createTestUser();
    const token = await getUserJwtToken();
    const response = await request(app).post('/v1/user/role').send({ token });

    expect(response.statusCode).toBe(200);
    expect(response.body.res).toHaveProperty('role', 'USER');
  });

  test('throws error if user has deleted profile', async () => {
    await createTestUser();
    const token = await getUserJwtToken();
    const uuid = await getUserUUID();
    UserDb.deleteUser(uuid);
    const response = await request(app).post('/v1/user/role').send({ token });

    expect(response.statusCode).toBe(400);
    expect(response.body.err).toBe('User does not exist');
  });
});
