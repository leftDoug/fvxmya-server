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

describe('PATCH /api/meetings/8', () => {
  test('debe actualizar la reunión', async () => {
    const response = await api.get(`/api/users`);

    expect(response.body.data).toHaveLength(initialUsers.length);
  });
});

describe('PATCH /api/meetings/attendance/:id', () => {
  test('debe registrar la asistencia', async () => {
    const user = await User.findOne({
      where: { username: initialUsers[0].username }
    });
    const response = await api.get(`/api/users/${user.id}`);

    expect(response.body.data).toHaveProperty('name', initialUsers[0].name);
  });

  test('debe dar error 404', async () => {
    const response = await api.get(`/api/users/1`);
    // XXX mirar si arreglar el mensaje de error
    expect(response.body.message).toBe('Usuario no encontrado');
  });
});

// describe('GET /users/:id', () => {
//   test('debe devolver el usuario', async () => {
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

// xdescribe('GET /workers', () => {
//   test('debe devolver los trabajadores', async () => {
//     const response = await api.get('/api/users/workers');

//     expect(response.body.data.length).toBe(initialUsers.length);
//   });
// });

// describe('POST /', () => {
//   xtest('debe crear un usuario', async () => {
//     const response = await api.post('/api/users/').send({
//       name: 'John Doe',
//       occupation: 'Director RRHH',
//       area: 'RRHH',
//       username: 'dirrrhh',
//       password: '12345678',
//       role: 'LÍDER'
//     });

//     expect(response.statusCode).toBe(201);
//   });

//   xtest('debe dar error de nombre de usuario en uso', async () => {
//     const response = await api.post('/api/users/').send({
//       name: 'Karla Mendez',
//       occupation: 'Especialista Principal',
//       area: 'RRHH',
//       username: 'esprrhh',
//       password: '12345678',
//       role: 'TRABAJADOR'
//     });

//     expect(response.body).toEqual({
//       ok: false,
//       message: 'Este nombre de usuario ya está en uso'
//     });
//   });

//   // test('debe dar error de correo en uso', async () => {
//   //   const response = await api.post('/api/users/').send({
//   //     name: 'Karla Mendez',
//   //     occupation: 'Especialista Principal',
//   //     email: 'esprrhh@fevex.cu',
//   //     idArea: 1,
//   //     username: 'especialista',
//   //     password: '12345678',
//   //     idRole: 1
//   //   });

//   //   expect(response.body).toEqual({
//   //     ok: false,
//   //     msg: 'Este correo ya está en uso'
//   //   });
//   // });

//   xtest('debe dar error de trabajador existente', async () => {
//     const response = await api.post('/api/users/').send({
//       name: 'Osmani Lopez',
//       occupation: 'Especialista Principal',
//       area: 'RRHH',
//       username: 'especialista',
//       password: 'especialista',
//       role: 'TRABAJADOR'
//     });

//     expect(response.body).toEqual({
//       ok: false,
//       message: 'Este trabajador ya tiene un Usuario creado'
//     });
//   });
// });

// describe('PATCH /users/:id', () => {
//   test('debe actualizar un usuario', async () => {
//     const user = await User.findOne({
//       where: { username: initialUsers[0].username }
//     });
//     const response = await api.patch(`/api/users/${user.id}`).send({
//       name: 'Carlitos Brown',
//       occupation: 'Custodio',
//       email: 'boberia@fevex.cu',
//       area: 'Seguridad',
//       username: 'custodio',
//       role: 'LÍDER'
//     });

//     expect(response.body.message).toBe('Usuario actualizado');
//   });

//   // test('debe dar error de nombre de usuario en uso', async () => {
//   //   const user = await User.findOne({
//   //     where: { username: initialUsers[1].username }
//   //   });
//   //   const response = await api.patch(`/api/users/${user.id}`).send({
//   //     name: initialUsers[1].name,
//   //     occupation: initialUsers[1].occupation,
//   //     email: initialUsers[1].email,
//   //     area: initialUsers[1].area,
//   //     username: 'esprrhh',
//   //     role: initialUsers[1].role
//   //   });

//   //   expect(response.body).toEqual({
//   //     ok: false,
//   //     message: 'Este nombre de usuario ya está en uso'
//   //   });
//   // });

//   // test('debe dar error de correo en uso', async () => {
//   //   const user = await User.findOne({
//   //     where: { username: initialUsers[1].username }
//   //   });
//   //   const response = await api.patch(`/api/auth/users/${user.id}/update`).send({
//   //     name: initialUsers[1].name,
//   //     occupation: initialUsers[1].occupation,
//   //     email: initialUsers[0].email,
//   //     idArea: initialUsers[1].idArea,
//   //     username: initialUsers[1].username,
//   //     oldPassword: initialUsers[1].password,
//   //     newPassword: initialUsers[1].password,
//   //     idRole: initialUsers[1].idRole
//   //   });

//   //   expect(response.body).toEqual({
//   //     ok: false,
//   //     msg: 'Este correo ya está en uso.'
//   //   });
//   // });

//   xtest('debe dar error de trabajador existente', async () => {
//     const user = await User.findOne({
//       where: { username: initialUsers[1].username }
//     });
//     const response = await api.patch(`/api/users/${user.id}`).send({
//       name: initialUsers[0].name,
//       occupation: initialUsers[0].occupation,
//       email: initialUsers[1].email,
//       area: initialUsers[0].area,
//       username: initialUsers[1].username,
//       oldPassword: initialUsers[1].password,
//       newPassword: initialUsers[1].password,
//       role: initialUsers[1].role
//     });

//     expect(response.body).toEqual({
//       ok: false,
//       message: 'Este trabajador ya tiene un Usuario creado'
//     });
//   });
// });

// describe('POST /login', () => {
//   test('debe hacer login correctamente', async () => {
//     const response = await api.post('/api/auth/login').send({
//       username: initialUsers[0].username,
//       password: initialUsers[0].password
//     });

//     expect(response.body.ok).toBe(true);
//     expect(response.statusCode).toBe(200);
//   });

//   test('debe devolver un token de acceso', async () => {
//     const response = await api.post('/api/auth/login').send({
//       username: initialUsers[0].username,
//       password: initialUsers[0].password
//     });

//     expect(response.body.token).not.toBeUndefined();
//   });

//   test('debe dar error de usuario', async () => {
//     const response = await api
//       .post('/api/auth/login')
//       .send({ username: 'esprrhh2', password: '12345678' });

//     expect(response.body).toEqual({
//       ok: false,
//       message: 'Credenciales incorrectas'
//     });
//   });

//   // test('debe dar error de contraseña', async () => {
//   //   const response = await api
//   //     .post('/api/auth/login')
//   //     .send({ username: 'esprrhh', password: '123456789' });

//   //   expect(response.body).toEqual({ ok: false, message: 'Contraseña incorrecta' });
//   // });
// });

// describe('PATCH /api/meetings/8', () => {
//   test('debe actualizar la reunión', async () => {
//     const response = await api
//       .patch('/api/meetings/8')
//       .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImU3YjE5ZWYwLTI4NDQtMTFmMC05N2RhLWMxNzc1MjVmNjhmNyIsInVzZXJuYW1lIjoibGhkZXoiLCJyb2xlIjoiTMONREVSIiwiaWF0IjoxNzQ2ODk5NDU1LCJleHAiOjE3NDY4OTk1MTV9.Ze77-knq_1tFz5z_rK91hQARX0x6EUGB4bQo-4vUvo8')
//       .send({
//         startTime: '15:00',
//         endTime: '16:00',
//         members: [
//           {
//             id: '41679540-2844-11f0-97da-c177525f68f7',
//             name: 'Carlos Durán Restrepo',
//             occupation: 'Driector de RRHH',
//             area: 'RRHH'
//           },
//           {
//             id: '67112340-284b-11f0-af94-4b34a60564f5',
//             name: 'Ernesto Remigio López Cabrera',
//             occupation: 'Director de Informatica',
//             area: 'Informatica'
//           },
//           {
//             id: '6ef4b290-288f-11f0-9433-638ca0f388c8',
//             name: 'Julio Iglesias Fernández',
//             occupation: 'Jefe de Servicios',
//             area: 'Sevicios'
//           }
//         ]
//       });

//     expect(response.statusCode).toBe(200);
//     expect(response.body.data.startTime).toEqual('15:00');
//     expect(response.body.data.endTime).toEqual('16:00');
//   });
// });

afterAll(async () => {
  await sequelize.close();
});
