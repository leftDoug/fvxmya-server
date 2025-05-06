import { request, response } from 'express';

import { sequelize } from '../db/config.js';
import { Organization } from '../models/Organization.js';
import { TypeOfMeeting } from '../models/TypeOfMeeting.js';

export const getAll = async (req = request, res = response) => {
  try {
    const dbToms = await TypeOfMeeting.findAll({ include: Organization });
    const toms = dbToms.map((t) => ({
      id: t.id,
      name: t.name,
      organization: {
        id: t.organization.id,
        name: t.organization.name
      }
    }));

    return res.json({
      ok: true,
      data: toms
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      ok: false,
      message: 'Error al listar los Tipos De Reuniones'
    });
  }
};

export const getAllFromLeader = async (req = request, res = response) => {
  const idUser = req.user.id;

  try {
    const dbOrganizations = await Organization.findAll({
      where: { idLeader: idUser }
    });

    if (dbOrganizations.length === 0) {
      return res.json({
        ok: true,
        data: []
      });
    }

    let dbToms = await TypeOfMeeting.findAll({ include: Organization });

    if (dbOrganizations.length > 1) {
      dbToms = dbOrganizations.forEach((org) => {
        if (dbToms.length > 1) {
          return dbToms.filter((tom) => tom.idOrganization === org.id);
        } else {
          return dbToms[0].idOrganization === org.id ? dbToms : undefined;
        }
      });
    } else if (dbToms.length > 1) {
      dbToms = dbToms.filter(
        (tom) => tom.idOrganization === dbOrganizations[0].id
      );
    } else {
      dbToms =
        dbToms[0].idOrganization === dbOrganizations[0].id
          ? dbToms[0]
          : undefined;
    }

    if (!dbToms || dbToms.length === 0) {
      return res.json({
        ok: true,
        data: []
      });
    }

    if (dbToms.length > 1) {
      const toms = dbToms.map((t) => ({
        id: t.id,
        name: t.name,
        organization: {
          id: t.organization.id,
          name: t.organization.name
        }
      }));

      return res.json({
        ok: true,
        data: toms
      });
    }
    // console.log(picocolors.greenBright(JSON.stringify(dbToms[0])));
    // console.log(picocolors.greenBright(dbToms.length));

    const tom = {
      id: dbToms[0].id,
      name: dbToms[0].name,
      organization: {
        id: dbToms[0].organization.id,
        name: dbToms[0].organization.name
      }
    };

    return res.json({
      ok: true,
      data: [tom]
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      ok: false,
      message: 'Error al listar los Tipos de Reunión'
    });
  }
};

export const getAllFromOrganization = async (req = request, res = response) => {
  const { id } = req.params;
  const idUser = req.user.id;

  try {
    const dbToms = await TypeOfMeeting.findAll({
      where: { idOrganization: parseInt(id) },
      include: Organization
    });
    const toms = dbToms.map((t) => ({
      id: t.id,
      name: t.name,
      organization: {
        id: t.organization.id,
        name: t.organization.name
      }
    }));

    if (dbToms.length > 0) {
      const dbOrganization = await Organization.findByPk(
        dbToms[0].idOrganization
      );

      if (idUser !== dbOrganization.idLeader) {
        return res.status(403).json({
          ok: false,
          message: 'Se requiren permisos para acceder a esta información'
        });
      }
    }

    return res.json({
      ok: true,
      data: toms
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      ok: false,
      message: 'Error al obtener los Tipos de Reuniones'
    });
  }
};

export const getById = async (req = request, res = response) => {
  const { id } = req.params;
  const idUser = req.user.id;

  try {
    const dbTom = await TypeOfMeeting.findByPk(parseInt(id), {
      include: Organization
    });
    const tom = {
      id: dbTom.id,
      name: dbTom.name,
      organization: {
        id: dbTom.organization.id,
        name: dbTom.organization.name
      }
    };
    const dbOrganization = await Organization.findByPk(dbTom.idOrganization);

    if (idUser !== dbOrganization.idLeader) {
      return res.status(403).json({
        ok: false,
        message: 'Se requiren permisos para acceder a esta información'
      });
    }

    return res.json({
      ok: true,
      data: tom
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      ok: false,
      message: 'Error al buscar el Tipo de Reunión'
    });
  }
};

export const create = async (req = request, res = response) => {
  const { name, idOrganization } = req.body;
  const transaction = await sequelize.transaction();

  try {
    let dbTom = await TypeOfMeeting.findOne({
      where: { name, idOrganization: parseInt(idOrganization, 10) },
      transaction
    });
    const dbOrganization = await Organization.findByPk(
      parseInt(idOrganization),
      { transaction }
    );

    if (dbTom) {
      return res.status(400).json({
        message: 'Ya existe este Tipo de Reunión para esta Organización'
      });
    }

    dbTom = await TypeOfMeeting.create(
      {
        name,
        idOrganization: parseInt(idOrganization, 10)
      },
      { transaction }
    );
    const tom = {
      id: dbTom.id,
      name: dbTom.name,
      organization: {
        id: dbOrganization.id,
        name: dbOrganization.name
      }
    };

    await transaction.commit();

    return res.status(201).json({
      message: 'Tipo de Reunión creado',
      data: tom
    });
  } catch (err) {
    console.error(err);

    await transaction.rollback();

    return res.status(500).json({
      message: 'Error al crear el Tipo de Reunión'
    });
  }
};

export const update = async (req = request, res = response) => {
  const { id } = req.params;
  const { name, idOrganization } = req.body;

  try {
    let dbTom = await TypeOfMeeting.findOne({
      where: { name, idOrganization: parseInt(idOrganization, 10) }
    });

    if (dbTom) {
      return res.status(400).json({
        message: 'Ya existe este Tipo de Reunión para esta Organización'
      });
    }

    await TypeOfMeeting.update({ name }, { where: { id: parseInt(id, 10) } });
    dbTom = await TypeOfMeeting.findByPk(parseInt(id, 10));
    const tom = {
      id: dbTom.id,
      name: dbTom.name,
      idOrganization: dbTom.idOrganization
    };
    return res.json({
      message: 'Tipo de Reunión actualizado',
      data: tom
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: 'Error al actualizar el Tipo de Reunión'
    });
  }
};

export const remove = async (req = request, res = response) => {
  const { id } = req.params;

  try {
    const dbTom = await TypeOfMeeting.findByPk(parseInt(id, 10));
    const name = `(removed) ${dbTom.name}`;
    await dbTom.update(
      { name, state: false },
      { where: { id: parseInt(id, 10) } }
    );
    return res.json({
      message: 'Tipo de Reunión eliminado'
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: 'Error al eliminar el Tipo de Reunión'
    });
  }
};
