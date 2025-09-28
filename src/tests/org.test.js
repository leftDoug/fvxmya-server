import bcrypt from 'bcryptjs';
import supertest from 'supertest';
import app from '../app.js';
import { sequelize } from '../db/config.js';
import { User } from '../models/User.js';

const api = supertest(app);

const initialUsers = [
  {
    name: 'Juan Pablo Remigio',
    occupation: 'Director RRHH',
    area: 'RRHH',
    username: 'jremigio',
    password: 'jremigio',
    role: 'LÍDER'
  },
  {
    name: 'Ana Terrazas',
    occupation: 'Especialista Principal',
    area: 'RRHH',
    username: 'jterrazas',
    password: 'jterrazas',
    role: 'TRABAJADOR'
  },
  {
    name: 'Tommy Ramos',
    occupation: 'Secretario',
    area: 'RRHH',
    username: 'tramos',
    password: 'tramos',
    role: 'TRABAJADOR'
  }
];

const salt = await bcrypt.genSalt();
const hashedPassword = await bcrypt.hash('admin', salt);

const initialAdmin = {
  name: 'Ernesto Astro',
  occupation: 'Informatico',
  area: 'Informatica',
  username: 'admin',
  password: hashedPassword,
  role: 'ADMINISTRADOR'
};

beforeAll(async () => {
  await sequelize.sync({ force: true });
  // await Token.sync({ force: true });
});

beforeEach(async () => {
  // await User.destroy({ where: {} });

  await sequelize.query(
    `
    TRUNCATE TABLE users RESTART IDENTITY CASCADE;
    `
  );
  await User.bulkCreate(initialUsers);
  const admin = await User.create(initialAdmin);
  admin.state = true;
  await admin.save();

  // await api.post('/api/users').send(initialUsers[0]);
  // await api.post('/api/users').send(initialUsers[1]);
  // await api.post('/api/users').send(initialUsers[2]);
});

afterAll(async () => {
  await sequelize.close();
});

test('debe retornar los usuarios', async () => {
  const response = await api.get('/api/users');

  expect(response.statusCode).toBe(200);
  expect(response.body.data).toHaveLength(initialUsers.length);
});

test('debe devolver el usuario', async () => {
  const user = await User.findOne({
    where: { username: initialUsers[0].username }
  });
  console.log(user);
  const response = await api.get(`/api/users/${user.id}`);

  expect(response.statusCode).toBe(200);
  expect(response.body.data.name).toEqual('Juan Pablo Remigio');
});

test('debe crear el usuario', async () => {
  const user = {
    name: 'Luis Mendoza',
    occupation: 'Informatico',
    area: 'Informatica',
    username: 'admin',
    password: 'admin',
    role: 'ADMINISTRADOR'
  };

  const response = await api.post('/api/users').send(user);

  expect(response.statusCode).toBe(201);
  expect(response.body.data.name).toEqual(user.name);
});

test('debe dar error nombre de usuario en uso', async () => {
  const user = {
    name: 'Luis Mendoza',
    occupation: 'Informatico',
    area: 'Informatica',
    username: initialUsers[0].username,
    password: 'admin',
    role: 'ADMINISTRADOR'
  };

  const response = await api.post('/api/users').send(user);

  expect(response.statusCode).toBe(400);
  expect(response.body).toHaveProperty(
    'message',
    'Este nombre de usuario ya está en uso'
  );
});

test('debe logear al usuario', async () => {
  const credentials = {
    username: 'admin',
    password: 'admin'
  };
  const response = await api.post('/api/auth/login').send(credentials);

  // expect(response.statusCode).toBe(200);
  expect(response.body).toEqual(true);
});
