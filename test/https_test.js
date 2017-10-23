'use strict';

require('../');

const expect = require('chai').expect;
const https = require('../lib');

context('https', function () {
  let middleware, req, res, status, redirectUrl;

  beforeEach(function() {
    req = {
      method: 'GET',
      url: '/path',
      secure: false,
      headers: {
        host: 'example.com',
        'x-forwarded-proto': 'http'
      }
    };
    res = { };
    res.redirect = function () { };
    res.send = function () { };
    res.status = function (_status) { status = _status; return res; }

    middleware = https();
  });

  it('redirects when the req is not insecure', function (done) {
    res.redirect = function (url) {
      expect(status).to.eql(301);
      expect(url).to.eql('https://example.com/path');
      done();
    }
    middleware(req, res, function (){});
  });

  it('passes back an error when the req is not secure & the original protocol is https & the req is not a GET', function (done) {
    req.method = 'POST';
    res.send = function (message) {
      expect(status).to.eql(403);
      expect(message).to.eql('https is required');
      done();
    }
    middleware(req, res, function (){});
  });

  it('passes the request through when the orignial protocol is https', function (done) {
    req.headers['x-forwarded-proto'] = 'https';
    middleware(req, res, function (){
      done();
    });
  });

  it('passes the request through when req is secure', function (done) {
    req.secure = true;
    middleware(req, res, function (){
      done();
    });
  });
});
