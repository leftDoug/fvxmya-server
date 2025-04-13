import jwt from 'jsonwebtoken';

export const generateJWT = (idUser, status) => {
  const payload = { idUser, status };

  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      process.env.SECRET_JWT_SEED,
      {
        expiresIn: '30m'
      },
      (err, token) => {
        if (err) {
          console.error(err);

          reject(err);
        } else {
          resolve(token);
        }
      }
    );
  });
};

export const getIdUser = (token) => {
  const decodedToken = jwt.decode(token);

  return decodedToken.idUser;
};
