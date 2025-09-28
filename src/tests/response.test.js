import request from 'supertest';

import app from '../app.js';
import { sequelize } from '../db/config.js';

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

describe('POST /api/responses', () => {
  test('debe crear la respuesta', async () => {
    const response = await api.get(`/api/users`);

    expect(response.body.data).toHaveLength(initialUsers.length);
  });
});

// describe('PATCH /api/meetings/attendance/:id', () => {
//   test('debe registrar la asistencia', async () => {
//     const user = await User.findOne({
//       where: { username: initialUsers[0].username }
//     });
//     const response = await api.get(`/api/users/${user.id}`);

//     expect(response.body.data).toHaveProperty('name', initialUsers[0].name);
//   });

//   test('debe dar error 404', async () => {
//     const response = await api.get(`/api/users/1`);
//     // XXX mirar si arreglar el mensaje de error
//     expect(response.body.message).toBe('Usuario no encontrado');
//   });
// });

afterAll(async () => {
  await sequelize.close();
});
