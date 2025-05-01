import { response } from 'express';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.SECRET_JWT || 'p455w0rd';
const AUTH_TOKEN_EXPIRITY = '1min';
const REFRESH_TOKEN_EXPIRITY = '12h';
const revokedTokens = new Set();

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

export const generateTokens = (id, username, role) => {
  const authTokenPayload = { id, username, role };
  const refreshTokenPayload = { id };

  const authToken = jwt.sign(authTokenPayload, SECRET_KEY, {
    expiresIn: AUTH_TOKEN_EXPIRITY
  });

  const refreshToken = jwt.sign(refreshTokenPayload, SECRET_KEY, {
    expiresIn: REFRESH_TOKEN_EXPIRITY
  });

  // console.log(
  //   picocolors.magenta(new Date(jwt.verify(accessToken, SECRET_KEY).exp * 1000))
  // );

  // console.log(
  //   picocolors.yellow(new Date(jwt.verify(refreshToken, SECRET_KEY).exp * 1000))
  // );

  return { authToken, refreshToken };
};

export const revokeToken = (token) => {
  revokedTokens.add(token);
};

export const verifyToken = (token, res = response) => {
  if (revokedTokens.has(token)) {
    return res.status(401).json({
      ok: false,
      message: 'Token revocado'
    });
  }

  try {
    const decodedToken = jwt.verify(token, SECRET_KEY);

    if (new Date() > new Date(decodedToken.exp * 1000)) {
      return false;
    }

    return true;
  } catch (err) {
    console.log(err);

    return res.status(401).json({
      ok: false,
      message: 'Token inválido (verify)'
    });
  }
};

// export const decodeToken = (token) => {
//   return jwt.decode(token);
// };

// export const getIdUser = (token) => {
//   const decodedToken = jwt.decode(token);

//   return decodedToken.idUser;
// };
