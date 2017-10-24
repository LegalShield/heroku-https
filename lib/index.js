module.exports = function () {
  const REDIRECTABLE_HTTP_METHODS = [ 'GET', 'OPTIONS', 'HEAD' ];

  return function (req, res, next) {
    if (req.headers['x-forwarded-proto'] !== 'https') {
      if (REDIRECTABLE_HTTP_METHODS.includes(req.method)) {
        res.status(301).redirect('https://' + req.headers.host + req.url);
      } else {
        res.status(403).send('https is required');
      }
    } else {
      next();
    }
  };
};
