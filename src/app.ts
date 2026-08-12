import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import ssoRoutes from './routes/sso.routes';
import { requireAuth } from './middleware/auth.middleware';
import { requireRoles } from './middleware/role.middleware';
import { AuthRequest } from './middleware/auth.middleware';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes Registration
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/sso', ssoRoutes);

// Protected Routes Example (RBAC)
app.get('/api/v1/admin/dashboard', requireAuth, requireRoles(['admin']), (req, res) => {
  res.status(200).json({ message: 'Welcome to the highly secure admin dashboard.' });
});

app.get('/api/v1/users/me', requireAuth, (req: AuthRequest, res) => {
  res.status(200).json({ user: req.user?.sub, roles: req.user?.roles });
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'enterprise-iam-auth-node' });
});

export default app;
