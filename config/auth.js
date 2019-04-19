module.exports = {
  authenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next()
    }
    res.redirect('/users/login');
  }
};


// router.get('/logout', (req, res) => {
//   req.logout();
//   res.redirect('/users/login');
// });

// module.exports = router;