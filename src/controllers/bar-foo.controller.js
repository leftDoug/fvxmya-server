import { request, response } from 'express';
import { Bar } from '../models/Bar.js';
import { Foo } from '../models/Foo.js';

export const createBar = async (req = request, res = response) => {
  const { name } = req.body;

  try {
    const bar = await Bar.create({ id: Date.now(), name });
    res.json({ data: bar });
    return;
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Error' });
  }
};

export const createFoo = async (req = request, res = response) => {
  const { name, idBar } = req.body;

  try {
    const foo = await Foo.create({ name, idBar });
    res.json({ data: foo });
    return;
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Error' });
    return;
  }
};

export const createFooSolo = async (req = request, res = response) => {
  const { name } = req.body;

  try {
    const foo = await Foo.create({ name });
    res.json({ data: foo });
    return;
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Error' });
    return;
  }
};

export const getFoos = async (req = request, res = response) => {
  const { id } = req.params;

  try {
    const bar = await Bar.findByPk(id);
    const foos = await bar.getFoos();
    res.json({ data: foos });
    return;
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Error' });
    return;
  }
};

export const getFoosSolos = async (req = request, res = response) => {
  const { id } = req.params;

  try {
    const foosSolos = await Foo.findAll({
      where: { id },
      include: { model: Bar, as: 'bars' }
    });
    // const bar = await Bar.findByPk(id);
    // const foos = await bar.getFoos();
    res.json({ data: foosSolos });
    return;
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Error' });
    return;
  }
};

export const getBarsSolos = async (req = request, res = response) => {
  const { id } = req.params;

  try {
    const barsSolos = await Bar.findAll({
      where: { id },
      include: { model: Foo, as: 'foos' }
    });
    // const bar = await Bar.findByPk(id);
    // const foos = await bar.getFoos();
    res.json({ data: barsSolos });
    return;
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Error' });
    return;
  }
};
