const fetch = require('node-fetch');

module.exports = function () {
  return (req, res, next) => {
    const secret_key = process.env.RECAPTCHA_SECRET_KEY;
    const token = req.body.token;
    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${token}`;

    fetch(url, { method: 'post' })
      .then(response => response.json())
      .then(google_response => {
        if (google_response.success) {
          next();
        } else {
          console.log('No captcha resolve');
          return res.status(401).json({
            status: 'fail',
          });
        }
      })
      .catch(error => {
        console.log(error);
        return res.status(401).json({
          status: 'fail',
          error,
        });
      });
  };
};
