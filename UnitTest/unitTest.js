const expect = require('chai').expect;
const request = require('request');

describe('Status & Content', () => {
  describe('unitTest GET', () => {
    it('status', done => {
      request('http://localhost:5000/unitTest', (_, response) => {
        expect(response.statusCode).to.equal(200)
        done()
      })
    })

    it('content', done => {
      request('http://localhost:5000/unitTest', (_, response) => {
        expect(JSON.parse(response.body).message).to.equal('Test is passed')
        done()
      })
    })
  })
})