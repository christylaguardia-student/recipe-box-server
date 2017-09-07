const assert = require('chai').assert;
const ensureAuth = require('../../lib/auth/ensure-auth')();
const tokenService = require('../../lib/auth/token-service');

describe('ensure auth middleware', () => {

  it('routes to error handler when no token is found in Authorization header', done => {
    const req = { get() { return ''; }};
    
    const next = (error) => {
      assert.deepEqual(error, { code: 401, error: 'No Authentication Found' });
      done();
    };

    ensureAuth(req, null, next);
  });

  it('routes to error handler when bad token', done => {
    const req = {
      get() { return 'not-a-good-token'; }
    };

    const next = (error) => {
      assert.deepEqual(error, { code: 401, error: 'Authentication Failed' });
      done();
    };

    ensureAuth(req, null, next);
  });

  it('calls next on valid Authorization and sets user prop on req', done => {
    const payload = { _id: '123', roles: [] };

    tokenService.sign(payload)
      .then(token => {
        const req = {
          get(header) { return header === 'Authorization' ? token : null }
        };

        const next = (error) => {
          assert.isNotOk(error);
          assert.equal(req.user.id, payload._id);
          done();
        };

        ensureAuth(req, null, next);
      })
      .catch(done);
  });

});