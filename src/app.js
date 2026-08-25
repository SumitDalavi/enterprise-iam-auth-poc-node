const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');

const app = express();
app.use(express.json());

const SECRET_KEY = 'super-secret-node-key';

// Mock DB
const users = {
  'admin': { password: 'password123', role: 'admin' },
  'user': { password: 'password123', role: 'user' }
};

// Passport setup
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: SECRET_KEY
};

passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
  return done(null, { username: jwt_payload.sub, role: jwt_payload.role });
}));

app.use(passport.initialize());

const requireAuth = passport.authenticate('jwt', { session: false });

const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ error: 'Admin privileges required' });
};

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = users[username];
  
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const payload = { sub: username, role: user.role };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '15m' });
  
  res.json({ access_token: token });
});

app.get('/api/users/me', requireAuth, (req, res) => {
  res.json({ username: req.user.username, role: req.user.role });
});

app.get('/api/admin/dashboard', requireAuth, requireAdmin, (req, res) => {
  res.json({ message: 'Welcome to the admin dashboard' });
});

module.exports = app;

if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`Node IAM Auth running on port ${port}`));
}
