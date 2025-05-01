import cors from 'cors';
import express from 'express';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import authRoutes from './routes/auth.routes.js';
import barFooRoutes from './routes/bar-foo.routes.js';
import organizationsRoutes from './routes/organizations.routes.js';
// import workersRoutes from './routes/workers.routes.js';
import { validateFields } from './middlewares/validate-fields.js';
import agendasRoutes from './routes/agendas.routes.js';
import agreementsRoutes from './routes/agreements.routes.js';
import meetingsRoutes from './routes/meetings.routes.js';
import responsesRoutes from './routes/responses.routes.js';
import topicsRoutes from './routes/topics.routes.js';
import typesOfMeetingsRoutes from './routes/types-of-meetings.routes.js';
import usersRoutes from './routes/users.routes.js';

// create express application/server
const app = express();

// CORS
app.use(
  cors({
    origin: ['http://localhost:4200'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true
  })
);

// boby lecture and parsing
app.use(express.json());

// OpenAPI definition fof swagger
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'FevexMeet API',
      version: '1.0.0'
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT}`,
        description: 'FevexMeet API Server'
      }
    ]
  },
  apis: ['./routes/*.js']
};

// swagger setup
const swaggerSpec = swaggerJSDoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// routes
app.use('', barFooRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/organizations', organizationsRoutes);
app.use('/api/types-meetings', typesOfMeetingsRoutes);
app.use('/api/agendas', agendasRoutes);
app.use('/api/meetings', meetingsRoutes);
app.use('/api/responses', responsesRoutes);
app.use('/api/agreements', agreementsRoutes);
app.use('/api/topics', topicsRoutes);
app.use('/api/users', usersRoutes);
app.use((req, res) => {
  return res.status(404).json({
    ok: false,
    message: 'Ruta no encontrada'
  });
});
app.use(validateFields);

export default app;
