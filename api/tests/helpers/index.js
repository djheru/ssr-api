export const expectRouteIsRegistered = (appStub, route) => {
  expect(appStub).to.be.calledWith(route);
};
