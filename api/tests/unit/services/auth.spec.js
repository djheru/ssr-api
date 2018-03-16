import { initializeAuth } from '../../../src/services/auth';
import proxyquire from 'proxyquire';

describe('(Auth Service)', () => {
  let initializeAuthProxy;
  let mongooseStub;
  let userStub;
  let appStub;
  let passportStub;

  beforeEach(() => {
    userStub = {
      findById: sinon.stub(),
      findOrCreateSocial: sinon.stub()
    };
    mongooseStub = {
      model: sinon.stub()
    };
    mongooseStub.model.returns(userStub);
    appStub = {
      use: sinon.stub()
    };
    passportStub = {
      serializeUser: sinon.stub(),
      deserializeUser: sinon.stub(),
      use: sinon.stub(),
      initialize: sinon.stub(),
      session: sinon.stub()
    };
    const authProxyModule = proxyquire(
      '../../../src/services/auth',
      {
        'mongoose': mongooseStub,
        'passport': passportStub
      }
    );

    initializeAuthProxy = authProxyModule.initializeAuth;
  });

  it('should be a function', () => {
    expect(initializeAuth).to.be.a('function');
  });

  it('should register the passport.serializeUser function', () => {
    initializeAuthProxy(appStub);
    expect(passportStub.serializeUser).to.be.called;
  });

  it('should register the passport.deserializeUser function', () => {
    initializeAuthProxy(appStub);
    expect(passportStub.deserializeUser).to.be.called;
  });

  it('should register the passport authentication strategy function', () => {
    initializeAuthProxy(appStub);
    expect(passportStub.use).to.be.called;
  });

  it('should set up the passport auth strategy as express middleware', () => {
    initializeAuthProxy(appStub);
    expect(appStub.use).to.be.calledWith(passportStub.initialize());
  });

  it('should set up the passport session express middleware', () => {
    initializeAuthProxy(appStub);
    expect(appStub.use).to.be.calledWith(passportStub.session());
  });
});
