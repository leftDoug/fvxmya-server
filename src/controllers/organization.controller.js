import { request, response } from 'express';

import { sequelize } from '../db/config.js';
import { Organization } from '../models/Organization.js';
import { OrganizationMember } from '../models/OrganizationMember.js';
import { User } from '../models/User.js';

export const getAll = async (req = request, res = response) => {
  try {
    const dbOrganizations = await Organization.findAll({
      include: [
        { model: User, as: 'leader' },
        { model: User, as: 'members' }
      ]
    });
    const organizations = dbOrganizations.map((organization) => ({
      id: organization.id,
      name: organization.name,
      leader: {
        id: organization.leader.id,
        name: organization.leader.name,
        occupation: organization.leader.occupation
      },
      members: organization.members.map((m) => ({
        id: m.id,
        name: m.name,
        occupation: m.occupation
      }))
    }));

    return res.json({
      ok: true,
      data: organizations
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      ok: false,
      message: 'Error al listar las Organizaciones'
    });
  }
};

export const getAllFromLeader = async (req = request, res = response) => {
  const idUser = req.user.id;

  try {
    const dbOrganizations = await Organization.findAll({
      where: { idLeader: idUser },
      include: [
        { model: User, as: 'leader' },
        { model: User, as: 'members' }
      ]
    });

    if (dbOrganizations.length === 0) {
      return res.json({
        ok: true,
        data: []
      });
    }

    const organizations = dbOrganizations.map((organization) => ({
      id: organization.id,
      name: organization.name,
      leader: {
        id: organization.leader.id,
        name: organization.leader.name,
        occupation: organization.leader.occupation
      },
      members: organization.members.map((m) => ({
        id: m.id,
        name: m.name,
        occupation: m.occupation
      }))
    }));

    // TODO borrar
    // if (dbOrganizations.length > 0) {
    //   if (idUser !== dbOrganizations[0].idLeader) {
    //     return res.status(403).json({
    //       ok: false,
    //       message: 'Se requiren permisos para acceder a esta información'
    //     });
    //   }
    // }

    return res.json({
      ok: true,
      data: organizations
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      ok: false,
      message: 'Error al buscar las Organizaciones'
    });
  }
};

export const getById = async (req = request, res = response) => {
  const { id } = req.params;
  const idUser = req.user.id;

  try {
    const dbOrganization = await Organization.findByPk(id, {
      include: [
        { model: User, as: 'leader' },
        { model: User, as: 'members' }
      ]
    });
    const organization = {
      id: dbOrganization.id,
      name: dbOrganization.name,
      leader: {
        id: dbOrganization.leader.id,
        name: dbOrganization.leader.name,
        occupation: dbOrganization.leader.occupation
      },
      members: dbOrganization.members.map((m) => ({
        id: m.id,
        name: m.name,
        occupation: m.occupation
      }))
    };

    if (idUser !== organization.leader.id) {
      return res.status(403).json({
        ok: false,
        message: 'Se requiren permisos para acceder a esta información'
      });
    }

    return res.json({
      ok: true,
      data: organization
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      ok: false,
      message: 'Error al obtener la Organización'
    });
  }
};

export const create = async (req = request, res = response, next) => {
  const { name, idLeader, members } = req.body;
  const transaction = await sequelize.transaction();

  try {
    let dbOrganization = await Organization.findOne({
      where: { name },
      transaction
    });

    if (dbOrganization) {
      return res.status(400).json({
        message: 'Ya existe una Organización con este nombre'
      });
    }

    dbOrganization = await Organization.create(
      { name, idLeader },
      { transaction }
    );
    await OrganizationMember.bulkCreate(
      members.map((m) => {
        return {
          idOrganization: dbOrganization.id,
          idMember: m.id
        };
      }),
      { transaction }
    );
    const dbOrgInfo = await Organization.findByPk(parseInt(dbOrganization.id), {
      include: [
        { model: User, as: 'leader' },
        { model: User, as: 'members' }
      ],
      transaction
    });
    const organization = {
      id: dbOrgInfo.id,
      name: dbOrgInfo.name,
      leader: {
        id: dbOrgInfo.leader.id,
        name: dbOrgInfo.leader.name,
        occupation: dbOrgInfo.leader.occupation
      }
    };
    await transaction.commit();
    return res.status(201).json({
      ok: true,
      message: 'Organización creada',
      data: organization
    });
  } catch (err) {
    await transaction.rollback();
    if (err.name === 'SequelizeValidationError') {
      next(err);
    } else {
      console.error(err);
      return res.status(500).json({
        ok: false,
        message: 'Error al crear la Organización'
      });
    }
  }
};

export const update = async (req = request, res = response, next) => {
  const { id } = req.params;
  const { name, idLeader, members } = req.body;
  const transaction = await sequelize.transaction();

  try {
    const dbOrganization = await Organization.findOne({
      where: { name },
      transaction
    });

    if (dbOrganization && dbOrganization.id !== parseInt(id)) {
      return res.status(400).json({
        message: 'Ya existe una Organización con ese nombre'
      });
    }

    const dbOMs = await OrganizationMember.findAll({
      where: { idOrganization: parseInt(id) },
      transaction
    });

    await Organization.update(
      { name, idLeader },
      { where: { id }, transaction }
    );
    await OrganizationMember.destroy({
      where: {
        idOrganization: parseInt(id),
        idMember: dbOMs
          .filter((dbOM) => !members.some((m) => m.id === dbOM.idMember))
          .map((dbOM) => dbOM.idMember)
      },
      transaction
    });
    await OrganizationMember.bulkCreate(
      members
        .filter((m) => !dbOMs.some((dbOM) => dbOM.idMember === m.id))
        .map((m) => {
          return {
            idOrganization: parseInt(id),
            idMember: m.id
          };
        }),
      { transaction }
    );
    const dbOrgInfo = await Organization.findByPk(parseInt(id), {
      include: [
        { model: User, as: 'leader' },
        { model: User, as: 'members' }
      ],
      transaction
    });
    const organization = {
      id: dbOrgInfo.id,
      name: dbOrgInfo.name,
      leader: {
        id: dbOrgInfo.leader.id,
        name: dbOrgInfo.leader.name,
        occupation: dbOrgInfo.leader.occupation
      },
      members: dbOrgInfo.members.map((m) => ({
        id: m.id,
        name: m.name,
        occupation: m.occupation
      }))
    };
    await transaction.commit();
    return res.json({
      ok: true,
      message: 'Organización actualizada',
      data: organization
    });
  } catch (err) {
    await transaction.rollback();
    if (err.name === 'SequelizeValidationError') {
      next(err);
    } else {
      console.error(err);
      return res.status(500).json({
        ok: false,
        message: 'Error al actualizar la Organización'
      });
    }
  }
};

export const remove = async (req = request, res = response) => {
  const { id } = req.params;
  const transaction = await sequelize.transaction();

  try {
    await Organization.destroy({ where: { id }, transaction });
    await transaction.commit();

    return res.json({
      ok: true,
      message: 'Organización eliminada'
    });
  } catch (err) {
    console.error(err);

    await transaction.rollback();

    return res.status(500).json({
      ok: false,
      message: 'Error al eliminar la Organización'
    });
  }
};
