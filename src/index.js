import dotenv from 'dotenv';
import pc from 'picocolors';

import app from './app.js';

import { sequelize } from './db/config.js';

import { getAgendaModel } from './models/Agenda.js';
import { getAgreementModel } from './models/Agreement.js';
import { getAreaModel } from './models/Area.js';
import { getMeetingModel } from './models/Meeting.js';
import { getMeetingWorkerModel } from './models/MeetingWorker.js';
import { getOrganizationModel } from './models/Organization.js';
import { getOrganizationMemberModel } from './models/OrganizationMember.js';
import { getResponseModel } from './models/Response.js';
import { getRoleModel } from './models/Role.js';
import { getTopicModel } from './models/Topic.js';
import { getTypeOfMeetingModel } from './models/TypeOfMeeting.js';
import { getUserModel } from './models/User.js';

import setupAssociations from './models/associations.js';
import { getBarModel } from './models/Bar.js';
import { getFooModel } from './models/Foo.js';
import { getMeetingTopicModel } from './models/MeetingTopic.js';

dotenv.config();

const models = {
  Bar: getBarModel(),
  Foo: getFooModel(),
  Agenda: getAgendaModel(),
  Agreement: getAgreementModel(),
  Area: getAreaModel(),
  Meeting: getMeetingModel(),
  Organization: getOrganizationModel(),
  Response: getResponseModel(),
  Role: getRoleModel(),
  Topic: getTopicModel(),
  TypeOfMeeting: getTypeOfMeetingModel(),
  User: getUserModel(),
  MeetingWorker: getMeetingWorkerModel(),
  OrganizationMember: getOrganizationMemberModel(),
  MeetingTopic: getMeetingTopicModel()
};
setupAssociations(models);

async function dbConnection() {
  try {
    await sequelize.authenticate();
    // await MeetingWorker.sync({ alter: true });
    // await sequelize.sync();
    // await Bar.sync({ force: true });
    // await Foo.sync({ force: true });
    // await Agreement.sync({ force: true });
    // await Area.sync({ force: true });
    // await Organization.sync({ force: true });
    // await Role.sync({ force: true });
    // await User.sync({ force: true });
    // await TypeOfMeeting.sync({ alter: true });
    // await Agenda.sync({ force: true });
    // await Topic.sync({ force: true });
    // await createViews();
    // await createFunctions();

    console.log(
      pc.green(pc.bold('Connection has been established successfully'))
    );
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

await dbConnection();

export const server = app.listen(process.env.PORT, '0.0.0.0', () => {
  console.log(
    pc.green(pc.bold(`Server is listening on port ${process.env.PORT}`))
  );
});
