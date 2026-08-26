import { Router, Request, Response } from 'express';
import { randomUUID } from 'crypto';

export const scimRouter = Router();

interface ScimUser { userName: string; displayName?: string; emails?: object[]; active?: boolean; }
const users = new Map<string, ScimUser & { id: string }>();

function formatUser(id: string, u: ScimUser) {
  return {
    schemas: ['urn:ietf:params:scim:schemas:core:2.0:User'],
    id, userName: u.userName, displayName: u.displayName || u.userName,
    emails: u.emails || [], active: u.active !== false,
    meta: { resourceType: 'User', location: `/scim/v2/Users/${id}` },
  };
}

scimRouter.get('/Users', (_req, res) => {
  const resources = [...users.values()].map(u => formatUser(u.id, u));
  res.json({ schemas: ['urn:ietf:params:scim:api:messages:2.0:ListResponse'],
             totalResults: resources.length, Resources: resources });
});

scimRouter.post('/Users', (req, res) => {
  const id = randomUUID();
  const user = { id, ...req.body };
  users.set(id, user);
  res.status(201).json(formatUser(id, user));
});

scimRouter.get('/Users/:id', (req, res) => {
  const user = users.get(req.params.id);
  if (!user) return res.status(404).json({ detail: 'Not found' });
  res.json(formatUser(user.id, user));
});

scimRouter.put('/Users/:id', (req, res) => {
  if (!users.has(req.params.id)) return res.status(404).json({ detail: 'Not found' });
  const user = { id: req.params.id, ...req.body };
  users.set(req.params.id, user);
  res.json(formatUser(user.id, user));
});

scimRouter.delete('/Users/:id', (req, res) => {
  if (!users.has(req.params.id)) return res.status(404).json({ detail: 'Not found' });
  users.delete(req.params.id);
  res.status(204).send();
});
