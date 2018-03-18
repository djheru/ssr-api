import { initializeAuth } from '../../../src/services/auth';
import proxyquire from 'proxyquire';

describe('(Auth Service)', () => {
  let initializeAuthProxy;
  let updateUserProfileProxy;
  let deserializeUserProxy;
  let mongooseStub;
  let userStub;
  let execStub;
  let appStub;
  let passportStub;

  beforeEach(() => {
    execStub = { exec: sinon.stub() };
    userStub = {
      findById: sinon.stub(),
      findOrCreateSocial: sinon.stub(),
      validateToken: sinon.stub()
    };
    userStub.findById.returns(execStub);
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
    updateUserProfileProxy = authProxyModule.updateUserProfile;
    deserializeUserProxy = authProxyModule.deserializeUser;
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

  describe('(Update User Profile)', () => {
    const accessToken = 'some cool access token';
    const refreshToken = 'some cool refresh token';
    const profile = {
      name: 'it me'
    };
    const done = sinon.stub();

    it('should set values for the accessToken and refreshToken on the profile', async () => {
      await updateUserProfileProxy(accessToken, refreshToken, profile, done);
      expect(profile.accessToken).to.equal(accessToken);
      expect(profile.refreshToken).to.equal(refreshToken);
    });

    it('should update or create the user', async () => {
      await updateUserProfileProxy(accessToken, refreshToken, profile, done);
      expect(userStub.findOrCreateSocial).to.be.calledWith(profile);
    });

    it('should call done() with the new/updated user', async () => {
      const user = { id: 'me' };
      userStub.findOrCreateSocial.returns(Promise.resolve(user));
      await updateUserProfileProxy(accessToken, refreshToken, profile, done);
      expect(done).to.be.calledWith(null, user);
    });

    it('should call done with an error in the case of failure', async () => {
      const error = new Error('it died');
      userStub.findOrCreateSocial.returns(Promise.reject(error));
      await updateUserProfileProxy(accessToken, refreshToken, profile, done);
      expect(done).to.be.calledWith(error);
    });
  });

  describe('(Deserialize User)', () => {
    const id = 'me';
    const user = { id };
    const done = sinon.stub();

    it('should find the user based on the supplied id', async () => {
      execStub.exec.returns(Promise.resolve(user));
      await deserializeUserProxy(id, done);
      expect(userStub.findById).to.be.calledWith(id);
      expect(execStub.exec).to.be.called;
    });

    it('should call done() with the user', async () => {
      execStub.exec.returns(Promise.resolve(user));
      await deserializeUserProxy(id, done);
      expect(done).to.be.calledWith(null, user);
    });

    it('should call done() with an error in the case of failure', async () => {
      const error = new Error('it died');
      execStub.exec.returns(Promise.reject(error));
      await deserializeUserProxy(id, done);
      expect(done).to.be.calledWith(error);
    });
  });
});
