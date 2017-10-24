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

  context('when request is secure', function () {
    it('passes the request through', function (done) {
      req.headers['x-forwarded-proto'] = 'https';
      middleware(req, res, function (){
        done();
      });
    });
  });

  context('when request is not secure', function () {
    context('when http method is redirectable', function () {
      it('redirects to https when the http method is GET', function (done) {
        req.method = 'GET';
        res.redirect = function (url) {
          expect(status).to.eql(301);
          expect(url).to.eql('https://example.com/path');
          done();
        }
        middleware(req, res, function (){});
      });

      it('redirects to https when the http method is OPTIONS', function (done) {
        req.method = 'OPTIONS';
        res.redirect = function (url) {
          expect(status).to.eql(301);
          expect(url).to.eql('https://example.com/path');
          done();
        }
        middleware(req, res, function (){});
      });

      it('redirects to https when the http method is HEAD', function (done) {
        req.method = 'HEAD';
        res.redirect = function (url) {
          expect(status).to.eql(301);
          expect(url).to.eql('https://example.com/path');
          done();
        }
        middleware(req, res, function (){});
      });
    });

    context('when http method is not redirectable', function () {
      it('errors with message', function (done) {
        req.method = 'POST';
        res.send = function (message) {
          expect(status).to.eql(403);
          expect(message).to.eql('https is required');
          done();
        }
        middleware(req, res, function (){});
      });
    });
  });
});
