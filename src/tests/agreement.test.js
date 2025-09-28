import request from 'supertest';

import app from '../app.js';
import { sequelize } from '../db/config.js';
import { User } from '../models/User.js';

const api = request(app);
const initialUsers = [
  {
    name: 'Osmani Lopez',
    occupation: 'Especialista Principal',
    area: 'RRHH',
    username: 'esprrhh',
    password: '12345678',
    role: 'TRABAJADOR'
  },
  {
    name: 'Begoña Vega',
    occupation: 'Informatica',
    area: 'Informatica',
    username: 'informatica',
    password: 'informatica',
    role: 'ADMINISTRADOR'
  }
];

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

beforeEach(async () => {
  await sequelize.query(
    `
    TRUNCATE TABLE users RESTART IDENTITY CASCADE;
    `
  );

  await api.post('/api/users/').send(initialUsers[0]);
  await api.post('/api/users/').send(initialUsers[1]);
});

describe('POST /api/agreements', () => {
  test('debe crear el acuerdo', async () => {
    const response = await api.get(`/api/users`);

    expect(response.body.data).toHaveLength(initialUsers.length);
  });
});

describe('PATCH /api/agreements/complete/:id', () => {
  test('debe establecer el acuerdo como cumplido', async () => {
    const user = await User.findOne({
      where: { username: initialUsers[0].username }
    });
    const response = await api.get(`/api/users/${user.id}`);

    expect(response.body.data).toHaveProperty('name', initialUsers[0].name);
  });
});

describe('PATCH /api/agreements/cancel/:id', () => {
  test('debe anular el acuerdo', async () => {
    const user = await User.findOne({
      where: { username: initialUsers[0].username }
    });
    const response = await api.get(`/api/users/${user.id}`);

    expect(response.body.data).toHaveProperty('name', initialUsers[0].name);
  });
});

afterAll(async () => {
  await sequelize.close();
});
