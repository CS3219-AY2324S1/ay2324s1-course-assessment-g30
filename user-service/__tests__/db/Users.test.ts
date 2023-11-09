import 'dotenv/config';
import { UserDb, UserDbTest } from '../../src/db/Users';

const adminEmail = 'testAdmin1@test.com';
const adminUsername = 'testAdmin1';
const adminFirstName = 'adminTester';
const lastName = 'testerLastName';
const password = 'Testpassword1@';

beforeEach(async () => {
  await UserDb.initializeUserDatabase();
});

afterEach(async () => {
  await UserDb.dropUserTable();
});

describe('User DB Unit test', () => {
  test('admin peristed in DB', async () => {
    await UserDb.createAdmin(
      adminUsername,
      adminFirstName,
      lastName,
      password,
      adminEmail
    );

    const searchResult = UserDbTest.getUser({
      email: adminEmail,
      username: adminUsername,
      firstName: adminFirstName,
      lastName
    });

    expect(searchResult).not.toBeNull();
  });
});
