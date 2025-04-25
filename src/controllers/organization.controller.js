import { request, response } from 'express';

import { Organization } from '../models/Organization.js';
import { sequelize } from '../db/config.js';
import { QueryTypes, where } from 'sequelize';
import { OrganizationMember } from '../models/OrganizationMember.js';
import picocolors from 'picocolors';
import { User } from '../models/User.js';
import { TypeOfMeeting } from '../models/TypeOfMeeting.js';

export const getAll = async (req = request, res = response) => {
  try {
    const dbOrganizations = await Organization.findAll({
      include: { model: User, as: 'leader' }
    });

    const organizations = dbOrganizations.map((organization) => ({
      id: organization.id,
      name: organization.name,
      leader: {
        id: organization.idLeader,
        name: organization.leader.name
      }
    }));
    return res.json({
      data: organizations
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: 'Error al listar las Organizaciones'
    });
  }
};

export const getById = async (req = request, res = response) => {
  const { id } = req.params;

  try {
    const dbOrganization = await Organization.findByPk(id);
    return res.json({
      data: dbOrganization
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: 'Error al buscar la Organización'
    });
  }
};

export const getAllFrom = async (req = request, res = response) => {
  const { id } = req.params;

  try {
    let dbOrgsAsLeader = await Organization.findAll({
      where: { idLeader: id },
      include: User
    });
    dbOrgsAsLeader = dbOrgsAsLeader.map((organization) => ({
      id: organization.id,
      name: organization.name,
      leader: {
        id: organization.idLeader,
        name: organization.user.name
      }
    }));
    const dbOrgsAsMember = await User.findByPk(id, {
      include: { model: Organization, as: 'orgs' }
    });
    const organizations = [
      ...dbOrgsAsLeader,
      ...dbOrgsAsMember.orgs
        .filter(
          (orgMem) => !dbOrgsAsLeader.some((orgLea) => orgLea.id === orgMem.id)
        )
        .map((org) => ({
          id: org.id,
          name: org.name,
          idLeader: org.idLeader
        }))
    ];
    return res.json({
      data: organizations
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: 'Error al buscar las Organizaciones'
    });
  }
};

export const getInfo = async (req = request, res = response) => {
  const { id } = req.params;

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
        id: dbOrganization.idLeader,
        name: dbOrganization.leader.name
      },
      members: dbOrganization.members.map((m) => ({
        id: m.id,
        name: m.name
      }))
    };
    return res.json({
      data: organization
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: 'Error al obtener la información de la Organización'
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
      include: [{ model: User }, { model: User, as: 'members' }],
      transaction
    });
    const organization = {
      id: dbOrgInfo.id,
      name: dbOrgInfo.name,
      leader: {
        id: dbOrgInfo.user.id,
        name: dbOrgInfo.user.name
      }
    };
    await transaction.commit();
    return res.status(201).json({
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
      include: [{ model: User }, { model: User, as: 'members' }],
      transaction
    });
    const organization = {
      id: dbOrgInfo.id,
      name: dbOrgInfo.name,
      leader: {
        id: dbOrgInfo.user.id,
        name: dbOrgInfo.user.name
      },
      members: dbOrgInfo.members.map((m) => ({
        id: m.id,
        name: m.name
      }))
    };
    await transaction.commit();
    return res.json({
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
      message: 'Organización eliminada'
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: 'Error al eliminar la Organización'
    });
  }
};

export const getWorkers = async (req = request, res = response) => {
  const { id } = req.params;

  try {
    const dbOrganization = await Organization.findByPk(parseInt(id, 10), {
      include: { model: User, as: 'members' }
    });
    const members = dbOrganization.members.map((m) => ({
      id: m.id,
      name: m.name
    }));
    return res.json({
      data: members
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: 'Error al obtener los Trabajadores'
    });
  }
};

export const addWorkers = async (req = request, res = response) => {
  const { id } = req.params;
  const { workersId } = req.body;
  try {
    workersId.forEach(async (worker) => {
      await OrganizationMember.create({ idOrganization: id, idMember: worker });
    });

    return res.json({
      ok: true,
      message: 'Trabajadores agregados.'
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      ok: false,
      message: 'Error al agregar los Trabajadores.'
    });
  }
};

export const updateWorkers = async (req = request, res = response) => {
  const { id } = req.params;
  const { workersId } = req.body;
  try {
    const dbWorkers = await OrganizationMember.findAll({
      where: { idOrganization: id }
    });

    workersId.forEach(async (worker) => {
      !dbWorkers.some((w) => {
        w.id === worker.id;
      }) &&
        (await OrganizationMember.create({
          idOrganization: id,
          idMember: worker
        }));
    });

    dbWorkers.forEach((worker) => {
      !workersId.some((w) => {
        w.id === worker.id;
      }) && worker.destroy();
    });

    return res.json({
      ok: true,
      message: 'Lista de Trabajadores actualizada.'
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      ok: false,
      message: 'Error al actualizar la lista de Trabajadores.'
    });
  }
};
