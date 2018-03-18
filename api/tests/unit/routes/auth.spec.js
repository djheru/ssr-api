import { initializeAuthRoutes } from '../../../src/routes/auth';
import { expectRouteIsRegistered } from '../../helpers/index';
import proxyquire from 'proxyquire';

describe('(Auth Routes)', () => {
  let initializeAuthRoutesProxy;
  let appStub;
  let passportStub;
  let passportMiddlewareStub;
  let authenticateStub;
  let authCallbackStub;
  let redirectStub;
  let logoutStub;
  let currentUserStub;

  beforeEach(() => {
    appStub = { get: sinon.stub() };
    passportStub = {
      authenticate: sinon.stub()
    };
    passportMiddlewareStub = sinon.stub();
    passportStub.authenticate.returns(passportMiddlewareStub);
    authenticateStub = sinon.stub();
    authCallbackStub = sinon.stub();
    redirectStub = sinon.stub();
    logoutStub = sinon.stub();
    currentUserStub = sinon.stub();

    const authProxyModule = proxyquire(
      '../../../src/routes/auth',
      {
        'passport': passportStub,
        './handlers/auth': {
          authCallback: authCallbackStub,
          redirect: redirectStub,
          logout: logoutStub,
          currentUser: currentUserStub
        },
        '../services/auth': { authenticateGoogle: authenticateStub }
      }
    );
    initializeAuthRoutesProxy = authProxyModule.initializeAuthRoutes;
  });

  it('should be a function', () => {
    expect(initializeAuthRoutes).to.be.a('function');
  });

  it('should register the route "/auth/google"', () => {
    initializeAuthRoutesProxy(appStub);
    expectRouteIsRegistered(appStub.get, '/auth/google');
  });

  it('should register the passport authentication middleware', () => {
    initializeAuthRoutesProxy(appStub);
    expect(authenticateStub).to.be.called;
    expect(appStub.get).to.be.calledWith('/auth/google', authenticateStub());
  });

  it('should register the route "/auth/google/callback"', () => {
    initializeAuthRoutesProxy(appStub);
    expectRouteIsRegistered(appStub.get, '/auth/google/callback');
  });

  it('should register the passport authentication middleware and redirect handler', () => {
    initializeAuthRoutesProxy(appStub);
    expect(authCallbackStub).to.be.called;
    expect(redirectStub).to.be.called;
    expect(appStub.get).to.be.calledWith('/auth/google/callback', authCallbackStub(), redirectStub());
  });

  it('should register the route "/logout"', () => {
    initializeAuthRoutesProxy(appStub);
    expectRouteIsRegistered(appStub.get, '/logout');
    expect(logoutStub).to.be.called;
    expect(appStub.get).to.be.calledWith('/logout', logoutStub());
  });
});
