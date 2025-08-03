const assert = require('assert');
const app = require('../../src/app');

describe('\'cartitemhistory\' service', () => {
  it('registered the service', () => {
    const service = app.service('cartitemhistory');

    assert.ok(service, 'Registered the service (cartitemhistory)');
  });
});
