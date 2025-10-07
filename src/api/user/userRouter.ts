import { Router, type IRouter } from 'express';
import { userService } from './userService.js';
import { ok, fail } from '../../utils/http.js';

export const userRouter: IRouter = Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required: [id, name, email, createdAt]
 *       properties:
 *         id:
 *           type: string
 *           example: "u_3k4j2l"
 *         name:
 *           type: string
 *           example: "Alice"
 *         email:
 *           type: string
 *           format: email
 *           example: "alice@example.com"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-09-21T12:34:56.000Z"
 *     ApiSuccessUsers:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/User'
 */

/**
 * @openapi
 * /users:
 *   get:
 *     tags: [Users]
 *     summary: Get all users
 *     description: Returns the list of users.
 *     responses:
 *       200:
 *         description: List of users wrapped in ApiSuccess
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccessUsers'
 *             examples:
 *               ok:
 *                 value:
 *                   success: true
 *                   data:
 *                     - id: "u_1"
 *                       name: "Alice"
 *                       email: "alice@example.com"
 *                       createdAt: "2025-09-21T12:00:00.000Z"
 *                     - id: "u_2"
 *                       name: "Bob"
 *                       email: "bob@example.com"
 *                       createdAt: "2025-09-21T13:00:00.000Z"
 */
userRouter.get('/', async (_req, res) => {
  try {
    const users = await userService.list();
    res.json(ok(users));
  } catch (e: any) {
    res.status(500).json(fail(e.message ?? 'Internal error'));
  }
});

/**
 * @openapi
 * /users:
 *   post:
 *     tags: [Users]
 *     summary: Create a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email]
 *             properties:
 *               name:  { type: string, example: "Alice" }
 *               email: { type: string, format: email, example: "alice@example.com" }
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error
 */
userRouter.post('/', async (req, res) => {
  try {
    const user = await userService.create(req.body);
    res.status(201).json(ok(user));
  } catch (e: any) {
  
    const status = e?.name === 'ZodError' ? 400 : 500;
    res.status(status).json(fail(e.message ?? 'Error'));
  }
});

userRouter.post('/login', async (req, res) => {
  try {
    const user = await userService.login(req.body);
    res.json(ok(user));
  } catch (e: any) {
    res.status(401).json(fail(e.message ?? 'Unauthorized'));
  }
});

userRouter.post('/refresh', async (req, res) => {
  try {
    const { refresh } = req.body;
    const out = await userService.refresh(refresh);
    res.json(ok(out));
  } catch (e: any) {
    res.status(401).json(fail(e.message ?? 'Unauthorized'));
  }
});

userRouter.post('/logout', async (req, res) => {
  try {
  
    const userId = req.body.userId;
    if (!userId) return res.status(400).json(fail('userId required'));
    await userService.logout(userId);
    res.json(ok({}));
  } catch (e: any) {
    res.status(500).json(fail(e.message ?? 'Error'));
  }
});
