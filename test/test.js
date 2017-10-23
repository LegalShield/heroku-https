'use strict';

require('../');

const expect = require('chai').expect;
const Promise = require('bluebird');
const https = require('../lib');

context('https', function () {
  describe('#ensure', function () {
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
      res.status = function (_status) { status = _status; return res; }

      middleware = https();
    });

    it('redirects when the req is insecure', function (done) {
      res.redirect = function (url) {
        expect(status).to.eql(301);
        expect(url).to.eql('https://example.com/path');
        done();
      }
      console.log(res);
      middleware.ensure(req, res, function (){});
    });

    it('passes the request through when the orignial protocol is https', function (done) {
      req.headers['x-forwarded-proto'] = 'https';
      middleware.ensure(req, res, function (){
        done();
      });
    });

    it('passes the request through when req is secure', function (done) {
      req.secure = true;
      middleware.ensure(req, res, function (){
        done();
      });
    });

    it('passes back an error when the req is not secure & the original protocol is https & the req is not a GET', function (done) {
      req.method = 'POST';
      res.send = function (message) {
        expect(status).to.eql(403);
        expect(message).to.eql('https is required');
        done();
      }
      middleware.ensure(req, res, function (){});
    });
  });
});

