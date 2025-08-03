const assert = require('assert');
const app = require('../../src/app');

describe('\'cartitems\' service', () => {
  it('registered the service', () => {
    const service = app.service('cartitems');

    assert.ok(service, 'Registered the service (cartitems)');
  });
});
