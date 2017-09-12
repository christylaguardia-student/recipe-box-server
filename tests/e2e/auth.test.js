const assert = require('chai').assert;
const db = require('./_db');
const request = require('./_request');

describe.only('user auth', () => {

  before(db.drop);

  const user = {
    username: 'Christy La Guardia',
    email: 'me@laguardia.com',
    password: 'love2code'
  };

  describe('user management', () => {

    const badRequest = (url, data, code, error) => {
      request
        .post(url)
        .send(data)
        .then(() => {
          throw new Error('status should not be ok');
        }, res => {
          assert.equal(res.status, code);
          assert.equal(res.response.body.error, error);
        });
    };

    let token = '';

    it('signup fails when email is not provided', () => {
      badRequest('/api/auth/signup', { password: 'bad'}, 400, 'Email and password must be provided to sign up.');
    });

    it('signup fails when password is not provided', () => {
      badRequest('/api/auth/signup', { email: 'bad@email.com'}, 400, 'Email and password must be provided to sign up.');
    });

    it('signup successful', () => {
      request
        .post('/api/auth/signup')
        .send(user)
        .then(res => {
          assert.ok(token = res.body.token);
        });
    });

    it('signup fails when email has already been used', () => {
      badRequest('/api/auth/signup', user, 400, 'Email Already in Use');
    });
    
    it('signin fails with wrong email', () => {
      badRequest('/api/auth/signin', { email: 'bad', password: user.password }, 401, 'Invalid Login');
    });

    it('signin fails with wrong password', () => {
      badRequest('/api/auth/signin', { email: user.email, password: 'bad' }, 401, 'Invalid Login');
    });

    it('signin successful', () => {
      request
        .post('/api/auth/signin')
        .send(user)
        .then(res => {
          assert.ok(token = res.body.token);
        });
    });

    it('token is invalid', () => {
      request
        .get('/api/auth/verify')
        .set('Authorization', 'bad token')
        .then(() => {
          throw new Error('success response not expected');
        }, (res) => {
          assert.equal(res.status, 401);
        });
    });

    it('token is valid', () => {
      request
        .get('/api/auth/verify')
        .set('Authorization', token)
        .then(res => assert.ok(res.body));
    });

  });

});