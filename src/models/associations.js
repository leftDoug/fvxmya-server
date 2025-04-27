export default function setupAssociations(models) {
  const {
    Bar,
    Foo,
    Agenda,
    Agreement,
    Meeting,
    Organization,
    Response,
    Topic,
    TypeOfMeeting,
    User,
    MeetingAttendance,
    OrganizationMembership,
    MeetingAgenda
  } = models;

  // ===> agenda
  TypeOfMeeting.hasMany(Agenda, {
    foreignKey: {
      name: 'idTypeOfMeeting',
      allowNull: false
    }
  });

  Agenda.belongsTo(TypeOfMeeting, {
    as: 'typeOfMeeting',
    foreignKey: {
      name: 'idTypeOfMeeting',
      allowNull: false
    }
  });

  // ===> agreement <===
  User.hasMany(Agreement, {
    foreignKey: {
      name: 'idResponsible',
      allowNull: false
    }
  });

  Agreement.belongsTo(User, {
    as: 'responsible',
    foreignKey: {
      name: 'idResponsible',
      allowNull: false
    }
  });

  Meeting.hasMany(Agreement, {
    foreignKey: {
      name: 'idMeeting',
      allowNull: false
    }
  });

  Agreement.belongsTo(Meeting, {
    foreignKey: {
      name: 'idMeeting',
      allowNull: false
    }
  });

  // ===> meeting <===
  TypeOfMeeting.hasMany(Meeting, {
    as: 'meets',
    foreignKey: {
      name: 'idTypeOfMeeting',
      allowNull: false
    }
  });

  Meeting.belongsTo(TypeOfMeeting, {
    as: 'typeOfMeeting',
    foreignKey: {
      name: 'idTypeOfMeeting',
      allowNull: false
    }
  });

  User.hasMany(Meeting, {
    foreignKey: 'idSecretary'
  });

  Meeting.belongsTo(User, {
    as: 'secretary',
    foreignKey: 'idSecretary'
  });

  // ===> meeting-guest <===
  Meeting.belongsToMany(User, {
    as: 'participants',
    through: MeetingAttendance,
    foreignKey: { name: 'idMeeting' }
  });

  User.belongsToMany(Meeting, {
    as: 'meets',
    through: MeetingAttendance,
    foreignKey: { name: 'idWorker' }
  });

  // ===> meeting-topic <===
  Meeting.belongsToMany(Topic, {
    through: MeetingAgenda,
    foreignKey: { name: 'idMeeting' }
  });

  Topic.belongsToMany(Meeting, {
    through: MeetingAgenda,
    foreignKey: { name: 'idTopic' }
  });

  // ===> organization <===
  Organization.belongsTo(User, {
    as: 'leader',
    foreignKey: {
      name: 'idLeader',
      allowNull: false
    }
  });

  User.hasMany(Organization, {
    foreignKey: {
      name: 'idLeader',
      allowNull: false
    }
  });

  // ===> organization-member <===
  Organization.belongsToMany(User, {
    as: 'members',
    through: OrganizationMembership,
    foreignKey: {
      name: 'idOrganization'
    }
  });

  User.belongsToMany(Organization, {
    as: 'orgs',
    through: OrganizationMembership,
    foreignKey: {
      name: 'idMember'
    }
  });

  // ===> response <===
  Agreement.hasMany(Response, {
    foreignKey: {
      name: 'idAgreement',
      allowNull: false
    }
  });

  Response.belongsTo(Agreement, {
    foreignKey: {
      name: 'idAgreement',
      allowNull: false
    }
  });

  // ===> topic <===
  Agenda.hasMany(Topic, {
    foreignKey: {
      name: 'idAgenda',
      allowNull: false
    }
  });

  Topic.belongsTo(Agenda, {
    foreignKey: {
      name: 'idAgenda',
      allowNull: false
    }
  });

  // ===> type-of-meeting <===
  Organization.hasMany(TypeOfMeeting, {
    as: 'typesOfMeetings',
    foreignKey: {
      name: 'idOrganization',
      allowNull: false
    }
  });

  TypeOfMeeting.belongsTo(Organization, {
    foreignKey: {
      name: 'idOrganization',
      allowNull: false
    }
  });

  // ===> user <===
  // Area.hasMany(User, { foreignKey: { name: 'idArea', allowNull: false } });

  // User.belongsTo(Area, { foreignKey: { name: 'idArea', allowNull: false } });

  // Role.hasMany(User, { foreignKey: { name: 'idRole', allowNull: false } });

  // User.belongsTo(Role, { foreignKey: { name: 'idRole', allowNull: false } });

  // ===> bar-foo <===
  // Bar.hasMany(Foo, { foreignKey: 'idBar' });
  // Foo.belongsTo(Bar, { foreignKey: 'idBar' });
  Bar.belongsToMany(Foo, { as: 'foos', through: 'bars_foos' });
  Foo.belongsToMany(Bar, { as: 'bars', through: 'bars_foos' });
}
