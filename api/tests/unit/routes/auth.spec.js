import { initializeAuthRoutes } from '../../../src/routes/auth';
import { expectRouteIsRegistered } from '../../helpers/index';
import proxyquire from 'proxyquire';

describe('(Auth Routes)', () => {
  let initializeAuthRoutesProxy;
  let expressStub;
  let appStub;
  let routerStub;
  let passportStub;
  let passportMiddlewareStub;
  let authenticateStub;
  let authCallbackStub;
  let redirectStub;
  let logoutStub;

  beforeEach(() => {
    expressStub = { Router: sinon.stub() };
    appStub = { use: sinon.stub() };
    routerStub = { get: sinon.stub() };
    expressStub.Router.returns(routerStub);
    passportStub = {
      authenticate: sinon.stub()
    };
    passportMiddlewareStub = sinon.stub();
    passportStub.authenticate.returns(passportMiddlewareStub);
    authenticateStub = sinon.stub();
    authCallbackStub = sinon.stub();
    redirectStub = sinon.stub();
    logoutStub = sinon.stub();

    const authProxyModule = proxyquire(
      '../../../src/routes/auth',
      {
        'express': expressStub,
        '../handlers/auth': {
          authenticate: authenticateStub,
          authCallback: authCallbackStub,
          redirect: redirectStub,
          logout: logoutStub
        }
      }
    );
    initializeAuthRoutesProxy = authProxyModule.initializeAuthRoutes;
  });

  it('should be a function', () => {
    expect(initializeAuthRoutes).to.be.a('function');
  });

  it('should register the route "/google"', () => {
    initializeAuthRoutesProxy(appStub);
    expectRouteIsRegistered(routerStub.get, '/google');
  });

  it('should register the passport authentication middleware', () => {
    initializeAuthRoutesProxy(appStub);
    expect(authenticateStub).to.be.called;
    expect(routerStub.get).to.be.calledWith('/google', authenticateStub());
  });

  it('should register the route "/google/callback"', () => {
    initializeAuthRoutesProxy(appStub);
    expectRouteIsRegistered(routerStub.get, '/google/callback');
  });

  it('should register the passport authentication middleware and redirect handler', () => {
    initializeAuthRoutesProxy(appStub);
    expect(authCallbackStub).to.be.called;
    expect(redirectStub).to.be.called;
    expect(routerStub.get).to.be.calledWith('/google/callback', authCallbackStub(), redirectStub());
  });

  it('should register the route "/logout"', () => {
    initializeAuthRoutesProxy(appStub);
    expectRouteIsRegistered(routerStub.get, '/logout');
    expect(logoutStub).to.be.called;
    expect(routerStub.get).to.be.calledWith('/logout', logoutStub());
  });

  it('should mount the routes on the "/auth" endpoint', () => {
    initializeAuthRoutesProxy(appStub);
    expect(appStub.use).to.be.calledWith('/auth', routerStub);
  });
});
