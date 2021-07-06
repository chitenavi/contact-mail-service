const jwt = require('jsonwebtoken');

module.exports = function () {
  return (req, res, next) => {
    const tokenJWT = (req.get('Authorization') || '').split(' ')[1];

    // if no token then return error 401
    if (!tokenJWT) {
      return res.status(403).json({
        status: 'fail',
        error: 'No token provided',
      });
    }

    // verify the received tonodeken
    jwt.verify(tokenJWT, process.env.JWT_SECRET, (err, payload) => {
      // if TokenExpiredError or JsonWebTokenError or NotBeforeError
      // return 401 error with message
      if (err)
        return res.status(401).json({
          status: 'fail',
          error: err,
        });
      next();
    });
  };
};
