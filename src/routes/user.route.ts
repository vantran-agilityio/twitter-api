import express from 'express';

import { UserService } from '@types';
import { authenticate } from 'auth';

export const userRouter = ({
  app,
  userService,
}: {
  app: express.Application;
  userService: UserService;
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
     *                 type: object
     *                 properties:
     *                   id:
     *                     type: string
     *                   name:
     *                     type: string
     *                   email:
     *                     type: string
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
     *         description: User created successfully
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
     *                   type: object
     *                   required:
     *                     - id
     *                     - name
     *                     - email
     *                   properties:
     *                     id:
     *                       type: string
     *                     name:
     *                       type: string
     *                     email:
     *                       type: string
     *                       format: email
     *     responses:
     *       200:
     *         description: Users updated successfully
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
     *     summary: Delete all users
     *     description: Removes all users from the system
     *     security:
     *       - BearerAuth: []
     *     responses:
     *       200:
     *         description: All users deleted successfully
     *       401:
     *         description: Unauthorized - Authentication required
     *       500:
     *         description: Server Error
     */
    .all(authenticate())
    .get(userService.fetchUsers)
    .post(userService.createUser)
    .put(userService.updateMultipleUsers)
    .delete(userService.deleteAllUsers);

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
     *               type: object
     *               properties:
     *                 id:
     *                   type: string
     *                 name:
     *                   type: string
     *                 email:
     *                   type: string
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
     *             type: object
     *             required:
     *               - name
     *               - email
     *             properties:
     *               name:
     *                 type: string
     *               email:
     *                 type: string
     *                 format: email
     *     responses:
     *       200:
     *         description: User updated successfully
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
     *       401:
     *         description: Unauthorized - Authentication required
     *       404:
     *         description: User not found
     *       500:
     *         description: Server Error
     */
    .all(authenticate())
    .get(userService.fetchUserById)
    .put(userService.updateUserById)
    .delete(userService.deleteUserById);
};
