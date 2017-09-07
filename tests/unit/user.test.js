const assert = require('chai').assert;
const User = require('../../lib/models/user');

describe('User model', () => {

  it('new user generates hash', () => {
    const user = new User({
      firstName: 'Chirsty',
      lastName: 'La Guardia',
      email: 'chrisy@newuser.com'
    });
    const password = 'love2code';

    user.generateHash(password);

    assert.notEqual(user.hash, password);
    assert.isOk(user.comparePassword(password));
    assert.isNotOk(user.comparePassword('bad password'));
  });

});