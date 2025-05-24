import express from 'express';

import { AuthController } from '@controllers';

export const authRouter = ({
  app,
  authController,
}: {
  app: express.Application;
  authController: AuthController;
}) =>
  app
    /**
     * @openapi
     * /signup:
     *   post:
     *     tags:
     *       - Authentication
     *     summary: Create user
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - name
     *               - email
     *               - password
     *             properties:
     *               name:
     *                 type: string
     *                 example: "John Doe"
     *               email:
     *                 type: string
     *                 format: email
     *                 example: "john@example.com"
     *               password:
     *                 type: string
     *                 format: password
     *                 example: "securePassword123"
     *     responses:
     *       201:
     *         description: Created
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 id:
     *                   type: string
     *                 name:
     *                   type: string
     *                 email:
     *                   type: string
     *       409:
     *         description: Conflict - Email already exists
     *       404:
     *         description: Not Found
     *       500:
     *         description: Server Error
     */
    .post('/signup', authController.signUp)
    /**
     * @openapi
     * /signin:
     *   post:
     *     tags:
     *       - Authentication
     *     summary: User sign in
     *     description: Authenticates a user and returns a JWT token
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - email
     *               - password
     *             properties:
     *               email:
     *                 type: string
     *                 format: email
     *                 example: "john@example.com"
     *               password:
     *                 type: string
     *                 format: password
     *                 example: "securePassword123"
     *     responses:
     *       200:
     *         description: Successfully authenticated
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 token:
     *                   type: string
     *                   description: JWT token for authentication
     *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
     *       400:
     *         description: Bad Request - Missing required fields
     *       401:
     *         description: Unauthorized - Invalid credentials
     *       404:
     *         description: Not Found - User not found
     *       500:
     *         description: Server Error
     */
    .post('/signin', authController.signIn);
