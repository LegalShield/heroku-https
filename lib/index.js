module.exports = function () {
  let self = {};
  self.ensure = function (req, res, next) {
    if (!req.secure && req.headers['x-forwarded-proto'] && req.headers['x-forwarded-proto'] != 'https') {
      if (!!~['GET', 'OPTIONS', 'HEAD'].indexOf(req.method)) {
        res.send(301).redirect('https://' + req.headers.host + req.url);
      } else {
        res.status(403).send('https is required');
      }
    } else {
      next()
    }
  }
  return self;
}
