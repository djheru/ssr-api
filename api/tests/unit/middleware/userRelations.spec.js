import { requireUser, addResultToUser, addUserToBody, restrictToUser } from '../../../src/middleware/userRelations';
import proxyquire from 'proxyquire';

describe('(User Relations Middleware)', () => {
  let userRelationsProxy;
  let loggerStub;
  let logStub;
  let UserStub;
  let sendStub;
  let mongooseStub;
  let reqStub;
  let resStub;
  let nextStub;
  let user;

  beforeEach(() => {
    loggerStub = { log: sinon.stub() };
    logStub = sinon.stub();
    loggerStub.log.returns(logStub);

    sendStub = { send: sinon.stub() };
    resStub = { status: sinon.stub() };
    resStub.status.returns(sendStub);

    reqStub = {
      body: {

      },
      user: {
        _id: 'some user id'
      },
      erm: {
        result: {
          _id: 'some result id'
        }
      },
      query: {
        query: '{ "fooParam": "barValue" }'
      }
    };

    nextStub = sinon.stub();

    mongooseStub = {
      model: sinon.stub()
    };
    UserStub = { findById: sinon.stub() };
    mongooseStub.model.returns(UserStub);

    user = {
      save: sinon.stub()
    };
    UserStub.findById.returns(Promise.resolve(user));

    userRelationsProxy = proxyquire(
      '../../../src/middleware/userRelations',
      {
        '../utils/logger': loggerStub,
        'mongoose': mongooseStub
      }
    );
  });

  it('should be functions', () => {
    expect(requireUser).to.be.a('function');
    expect(addResultToUser).to.be.a('function');
    expect(addUserToBody).to.be.a('function');
    expect(restrictToUser).to.be.a('function');
  });

  describe('(addUserToBody)', () => {
    it('should add the user to the request body', () => {
      addUserToBody(reqStub, resStub, nextStub);
      expect(reqStub.body.user).to.equal(reqStub.user._id);
    });

    it('should call next()', () => {
      addUserToBody(reqStub, resStub, nextStub);
      expect(nextStub).to.be.called;
    });
  });

  describe('(restrictToUser)', () => {
    it('should return middleware', () => {
      const middleware = restrictToUser();
      expect(middleware).to.be.a('function');
    });

    it('should alter the query to ensure that the userKey property of the resource matches the user._id', () => {
      const expectedQuery = '{"fooParam":"barValue","user":"some user id"}';
      const middleware = restrictToUser();
      middleware(reqStub, resStub, nextStub);
      expect(reqStub.query.query).to.equal(expectedQuery);
      expect(reqStub._ermQueryOptions).to.eql({ query: JSON.parse(expectedQuery) });
    });

    it('should call next()', () => {
      const middleware = restrictToUser();
      middleware(reqStub, resStub, nextStub);
      expect(nextStub).to.be.called;
    });
  });

  describe('(addResultToUser)', () => {
    it('should return a middleware function', () => {
      const middleware = userRelationsProxy.addResultToUser('user');
      expect(middleware).to.be.a('function');
    });

    it('should return middleware that adds the id of the new record to the provided field on the user', async () => {
      const fieldName = 'somecoolfield';
      const middleware = userRelationsProxy.addResultToUser(fieldName);
      await middleware(reqStub, resStub, nextStub);
      expect(mongooseStub.model).to.be.calledWith('User');
      expect(UserStub.findById).to.be.calledWith(reqStub.user._id);
      expect(user[fieldName]).to.be.an('array');
      expect(user[fieldName]).to.contain(reqStub.erm.result._id);
    });

    it('should save the user and call next()', async () => {
      const fieldName = 'somecoolfield';
      const middleware = userRelationsProxy.addResultToUser(fieldName);
      await middleware(reqStub, resStub, nextStub);
      expect(user.save).to.be.called;
      expect(nextStub).to.be.called;
    });

    it('should call next() with any errors', async () => {
      const error = new Error('it died');
      UserStub.findById.returns(Promise.reject(error));

      const fieldName = 'somecoolfield';
      const middleware = userRelationsProxy.addResultToUser(fieldName);
      await middleware(reqStub, resStub, nextStub);
      expect(nextStub).to.be.calledWith(error);
    });
  });

  describe('(requireUser)', () => {
    it('should call next() if the user is present on the request', () => {
      reqStub.user = { it: 'me' };
      requireUser(reqStub, resStub, nextStub);
      expect(resStub.status).to.not.be.called;
      expect(nextStub).to.be.called;
    });

    it('should send a 401 status and an error message if the user is not present on the request', () => {
      const expectedError = { error: 'You must log in!' };
      delete reqStub.user;
      requireUser(reqStub, resStub, nextStub);
      expect(resStub.status).to.be.calledWith(401);
      expect(sendStub.send).to.be.calledWith(expectedError);
    });
  });
});
