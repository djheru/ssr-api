import { initializeApi } from '../../../src/resources';
import proxyquire from 'proxyquire';

// Resources
import Todo from '../../../src/resources/todo';

describe('(Resources)', () => {
  let initializeApiProxy;
  let expressStub;
  let restifyStub;


  let appStub;

  beforeEach(() => {
    appStub = { use: sinon.stub() };
    expressStub = {
      Router: sinon.stub()
    };
    expressStub.Router.returns({ look: 'I am a router!' });
    restifyStub = {
      serve: sinon.stub()
    };
    const resourcesModule = proxyquire(
      '../../../src/resources',
      {
        'express': expressStub,
        'express-restify-mongoose': restifyStub

      }
    );
    initializeApiProxy = resourcesModule.initializeApi;
  });

  it('should be a function', () => {
    expect(initializeApi).to.be.a('function');
  });

  it('should use restify, express Router and the mongoose model to serve up the resources', () => {
    initializeApiProxy(appStub);
    expect(restifyStub.serve).to.be.calledWith(expressStub.Router(), Todo.model, Todo.options);
  });

  it('should mount the resources at the "/api" route', () => {
    initializeApiProxy(appStub);
    expect(appStub.use).to.be.calledWith('/api', expressStub.Router());
  });
});
