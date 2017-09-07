/* eslint no-console: off */

const tokenService = require('./token-service');

module.exports = function getEnsureAuth() {
  return function ensureAuth(req, res, next) {
    const token = req.get('Authorization') || req.get('authorization');
    
    if (!token) return next({ code: 401, error: 'No Authentication Found' });

    tokenService.verify(token)
      .then(payload => {
        req.user = payload;
        next();
      }, () => {
        next({ code: 401, error: 'Authentication Failed' });
      })
      .catch(error => {
        console.log('unexpected next() failure', error);
      });
  };
};
