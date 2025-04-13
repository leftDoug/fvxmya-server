import picocolors from 'picocolors';

export const validateFields = (err, req, res, next) => {
  if (err) {
    console.error(picocolors.red(picocolors.bold(err)));
    const errors = err.errors.map((error) => ({
      field: error.path,
      msg: error.message
    }));

    return res.status(400).json({
      ok: false,
      msg: errors[0].msg
    });
  }
};
