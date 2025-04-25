import express from 'express';
import { send2faCode, verify2faCode, disable2fa } from '../controllers/user.controller.js';
// import auth middleware if needed
const router = express.Router();

// These should be protected with authentication middleware in production!
router.post('/send', send2faCode);
router.post('/verify', verify2faCode);
router.post('/disable', disable2fa);

export default router;
