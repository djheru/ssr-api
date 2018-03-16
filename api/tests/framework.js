import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

chai.use(chaiHttp);
chai.use(sinonChai);
chai.config.includeStack = true;

global.assert = chai.assert;
global.expect = chai.expect;
global.sinon = sinon;
global.chai = chai;
