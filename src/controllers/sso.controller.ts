import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid'; // Actually we don't have uuid installed, we'll just use math.random for mock
import { generateToken } from '../utils/jwt';

export const ssoLogin = (req: Request, res: Response) => {
  const { provider } = req.params;
  
  if (!['google', 'okta', 'azure'].includes(provider)) {
    return res.status(400).json({ error: 'Unsupported SSO provider' });
  }

  // Simulate a callback URL logic
  const mockCode = Math.random().toString(36).substring(2, 15);
  const callbackUrl = `/api/v1/sso/callback?provider=${provider}&code=${mockCode}`;
  
  res.redirect(callbackUrl);
};

export const ssoCallback = (req: Request, res: Response) => {
  const { provider, code } = req.query;

  if (!provider || !code) {
    return res.status(400).json({ error: 'Missing provider or code in callback' });
  }

  // Mocking user data retrieved from provider
  const mockEmail = `sso_user_${provider}@enterprise.local`;
  const mockRoles = ['user', 'sso_federated'];
  
  // Generate our internal JWT for this federated user
  const token = generateToken({
    sub: 'mock-uuid-sso',
    email: mockEmail,
    roles: mockRoles
  });

  res.status(200).json({
    message: `Successfully authenticated via ${provider}`,
    accessToken: token,
    tokenType: 'Bearer',
    roles: mockRoles
  });
};
