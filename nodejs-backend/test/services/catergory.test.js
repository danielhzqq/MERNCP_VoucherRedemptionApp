const assert = require('assert');
const app = require('../../src/app');

describe('\'catergory\' service', () => {
  it('registered the service', () => {
    const service = app.service('catergory');

    assert.ok(service, 'Registered the service (catergory)');
  });
});
