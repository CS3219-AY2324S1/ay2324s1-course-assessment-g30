import request from 'supertest';
import { app } from '../app';

describe('"test" endpoint', () => {
  test('should return status 200', async () => {
    const response = await request(app).get('/v1/test').send();
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('Hear you loud and clear');
  });
});
