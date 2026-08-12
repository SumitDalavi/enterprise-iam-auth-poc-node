import { Router } from 'express';
import { ssoLogin, ssoCallback } from '../controllers/sso.controller';

const router = Router();

router.get('/login/oauth2/:provider', ssoLogin);
router.get('/callback', ssoCallback);

export default router;
