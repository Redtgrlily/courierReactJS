const assert = require('assert');
const request = require('supertest');
const app = require('../server');

describe('The express app', () => {
  it('handles a GET request to /api/orders', (done) => {
    request(app)
      .get('/api/orders')
      .end((err, response) => {
        console.log(response);
      });

  });
});