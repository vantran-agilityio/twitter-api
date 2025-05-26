import express from 'express';

import { authenticate } from 'auth';
import { UserController } from '@controllers';

export const userRouter = ({
  app,
  userController,
}: {
  app: express.Application;
  userController: UserController;
}) => {
  app
    .route('/users')
    /**
     * @openapi
     * /users:
     *   get:
     *     tags:
     *       - Users
     *     summary: Get all users
     *     description: Retrieves a list of all users
     *     security:
     *       - BearerAuth: []
     *     responses:
     *       200:
     *         description: A list of users
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/User'
     *       401:
     *         description: Unauthorized - Authentication required
     *       404:
     *         description: No users found
     *       500:
     *         description: Server Error
     *   post:
     *     tags:
     *       - Users
     *     summary: Create a new user
     *     description: Creates a new user with the provided information
     *     security:
     *       - BearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CreateUserInput'
     *     responses:
     *       201:
     *         description: User created successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/User'
     *       400:
     *         description: Bad Request - Invalid input
     *       401:
     *         description: Unauthorized - Authentication required
     *       500:
     *         description: Server Error
     *   put:
     *     tags:
     *       - Users
     *     summary: Update multiple users
     *     description: Updates multiple users with the provided information
     *     security:
     *       - BearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - users
     *             properties:
     *               users:
     *                 type: array
     *                 items:
     *                   $ref: '#/components/schemas/UserUpdate'
     *     responses:
     *       200:
     *         description: Users updated successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: Users updated successfully
     *       400:
     *         description: Bad Request - Invalid input
     *       401:
     *         description: Unauthorized - Authentication required
     *       500:
     *         description: Server Error
     *   delete:
     *     tags:
     *       - Users
     *     summary: Delete all users
     *     description: Removes all users from the system
     *     security:
     *       - BearerAuth: []
     *     responses:
     *       200:
     *         description: All users deleted successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: All users deleted successfully
     *       401:
     *         description: Unauthorized - Authentication required
     *       500:
     *         description: Server Error
     */
    .all(authenticate())
    .get(userController.fetchUsers)
    .post(userController.createUser)
    .put(userController.updateMultipleUsers)
    .delete(userController.deleteAllUsers);

  app
    .route('/users/:id')
    /**
     * @openapi
     * /users/{id}:
     *   get:
     *     tags:
     *       - Users
     *     summary: Get user by ID
     *     description: Retrieves a single user by their ID
     *     security:
     *       - BearerAuth: []
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         description: ID of the user to retrieve
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: User details
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/User'
     *       401:
     *         description: Unauthorized - Authentication required
     *       404:
     *         description: User not found
     *       500:
     *         description: Server Error
     *   put:
     *     tags:
     *       - Users
     *     summary: Update user by ID
     *     description: Updates a user's information by their ID
     *     security:
     *       - BearerAuth: []
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         description: ID of the user to update
     *         schema:
     *           type: string
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/UpdateUserInput'
     *     responses:
     *       200:
     *         description: User updated successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: User updated successfully
     *       400:
     *         description: Bad Request - Invalid input
     *       401:
     *         description: Unauthorized - Authentication required
     *       404:
     *         description: User not found
     *       500:
     *         description: Server Error
     *   delete:
     *     tags:
     *       - Users
     *     summary: Delete user by ID
     *     description: Removes a user from the system by their ID
     *     security:
     *       - BearerAuth: []
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         description: ID of the user to delete
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: User deleted successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: User deleted successfully
     *       401:
     *         description: Unauthorized - Authentication required
     *       404:
     *         description: User not found
     *       500:
     *         description: Server Error
     */
    .all(authenticate())
    .get(userController.fetchUserById)
    .put(userController.updateUserById)
    .delete(userController.deleteUserById);
};

/**
 * @openapi
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         name:
 *           type: string
 *           example: "John Doe"
 *         email:
 *           type: string
 *           format: email
 *           example: "john@example.com"
 *       required:
 *         - id
 *         - name
 *         - email
 *
 *     CreateUserInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: "John Doe"
 *         email:
 *           type: string
 *           format: email
 *           example: "john@example.com"
 *         password:
 *           type: string
 *           format: password
 *           example: "securePassword123"
 *       required:
 *         - name
 *         - email
 *         - password
 *
 *     UpdateUserInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: "John Doe"
 *         email:
 *           type: string
 *           format: email
 *           example: "john@example.com"
 *       required:
 *         - name
 *         - email
 *
 *     UserUpdate:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         name:
 *           type: string
 *           example: "John Doe"
 *         email:
 *           type: string
 *           format: email
 *           example: "john@example.com"
 *       required:
 *         - id
 *         - name
 *         - email
 *
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
