import app from '../../src';

describe('(Health Check)', () => {
  let server;
  before(async () => {
    server = await app();
  });

  it('should be running', () => {
    expect(server).to.exist;
  });

  it('should return a response status of 200', async () => {
    const res = await chai
      .request(server)
      .get('/health-check')
      .send();
    console.log(res);
    expect(res.status).to.equal(200);
  });
});
