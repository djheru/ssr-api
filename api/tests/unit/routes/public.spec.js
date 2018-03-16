import { initializePublicRoutes } from '../../../src/routes/public';
import { expectRouteIsRegistered } from '../../helpers/index';

describe('(Public Routes)', () => {
  let appStub;

  beforeEach(() => {
    appStub = { get: sinon.stub() };
  });

  it('should be a function', () => {
    expect(initializePublicRoutes).to.be.a('function');
  });

  it('should register the root route "/"', () => {
    initializePublicRoutes(appStub);
    expectRouteIsRegistered(appStub.get, '/');
  });

  it('should register the route "/health-check"', () => {
    initializePublicRoutes(appStub);
    expectRouteIsRegistered(appStub.get, '/health-check');
  });
});
