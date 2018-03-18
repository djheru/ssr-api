import passport from 'passport';

export const authCallback = () =>
  passport.authenticate('google', {
    failureRedirect: '/',
    session: false
  });

export const redirect = (route = '/') =>
  (req, res) => {
    res
      .cookie('tempUserId', req.user._id, { maxAge: 10000 })
      .cookie('tempToken', req.user.authToken)
      .status(200)
      .redirect(route);
  };

export const logout = (route = '/') => (req, res) => {
  req.logout();
  res.redirect(route);
};

export const currentUser = () => (req, res) => {
  res.json(req.user || {});
};
