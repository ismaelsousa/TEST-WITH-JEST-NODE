import request from 'supertest';
import bcrypt from 'bcryptjs';
import app from '../../src/app';
import trucate from '../util/truncate';
import factory from '../factories';

describe('User', () => {
  beforeEach(async () => {
    await trucate();
  });
  it('should encrypt user password when new user created', async () => {
    const user = await factory.create('User', {
      password: '1234567',
    });

    const compareHash = await bcrypt.compare('1234567', user.password);
    expect(compareHash).toBe(true);
  });

  it('should be able to register', async () => {
    const user = await factory.attrs('User');
    const response = await request(app)
      .post('/users')
      .send(user);
    expect(response.body).toHaveProperty('id');
  });
  it('should not be able to register with duplicated email', async () => {
    const user = await factory.attrs('User');
    await request(app)
      .post('/users')
      .send(user);
    const response = await request(app)
      .post('/users')
      .send(user);
    expect(response.status).toBe(400);
  });
});
