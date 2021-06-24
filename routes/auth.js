const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authRouter = express.Router();

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

authRouter.post('/', async (req, res, next) => {
  try {
    const { password } = req.body;
    console.log(req);
    if (!password) {
      return res.status(401).json({
        status: 'fail',
      });
    }

    if (!(await bcrypt.compare(password, process.env.PWD_HASHED))) {
      return res.status(401).json({
        status: 'fail',
      });
    }

    const tokenJWT = signToken(process.env.USERNAME);

    res.status(200).json({
      status: 'success',
      token: tokenJWT,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = authRouter;
