import { response } from 'express';

export const validateFields = (err, res = response) => {
  const errors = err.map((error) => ({
    message: error.message
  }));

  return res.status(400).json({
    ok: false,
    message: errors[0].message
  });
};
