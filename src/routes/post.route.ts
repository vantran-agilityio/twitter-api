import express from 'express';

import { authenticate } from 'auth';
import { PostController } from '@controllers';

/**
 * @openapi
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         title:
 *           type: string
 *           example: "Sample Post Title"
 *         description:
 *           type: string
 *           example: "This is a sample post description"
 *         userId:
 *           type: string
 *           example: "abc123-user-id"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       required:
 *         - id
 *         - title
 *         - description
 *         - userId
 *
 *     CreatePostInput:
 *       type: object
 *       required:
 *         - title
 *         - description
 *       properties:
 *         title:
 *           type: string
 *           example: "New Post Title"
 *         description:
 *           type: string
 *           example: "This is a new post description"
 *
 *     UpdatePostInput:
 *       type: object
 *       required:
 *         - title
 *         - description
 *       properties:
 *         title:
 *           type: string
 *           example: "Updated Post Title"
 *         description:
 *           type: string
 *           example: "This is an updated post description"
 */

export const postRouter = ({
  app,
  postController,
}: {
  app: express.Application;
  postController: PostController;
}) => {
  app
    .route('/posts')
    /**
     * @openapi
     * /posts:
     *   get:
     *     tags:
     *       - Posts
     *     summary: Get all posts
     *     description: Retrieves a list of all posts
     *     security:
     *       - BearerAuth: []
     *     responses:
     *       200:
     *         description: A list of posts
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Post'
     *       401:
     *         description: Unauthorized - Authentication required
     *       404:
     *         description: No posts found
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   example: "No posts found"
     *       500:
     *         description: Server Error
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   example: "Internal Server Error"
     *   delete:
     *     tags:
     *       - Posts
     *     summary: Delete all posts
     *     description: Removes all posts from the system
     *     security:
     *       - BearerAuth: []
     *     responses:
     *       200:
     *         description: All posts deleted successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: "All posts deleted successfully"
     *       401:
     *         description: Unauthorized - Authentication required
     *       500:
     *         description: Server Error
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   example: "Internal Server Error"
     */
    .all(authenticate())
    .get(postController.getPosts)
    .delete(postController.deleteAllPosts);

  app
    .route('/posts/:id')
    /**
     * @openapi
     * /posts/{id}:
     *   get:
     *     tags:
     *       - Posts
     *     summary: Get post by ID
     *     description: Retrieves a single post by its ID
     *     security:
     *       - BearerAuth: []
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         description: ID of the post to retrieve
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Post details
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Post'
     *       401:
     *         description: Unauthorized - Authentication required
     *       404:
     *         description: Post not found
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   example: "Post not found"
     *       500:
     *         description: Server Error
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   example: "Internal Server Error"
     *   put:
     *     tags:
     *       - Posts
     *     summary: Update post by ID
     *     description: Updates a post's information by its ID
     *     security:
     *       - BearerAuth: []
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         description: ID of the post to update
     *         schema:
     *           type: string
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/UpdatePostInput'
     *     responses:
     *       200:
     *         description: Post updated successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: "Post updated successfully"
     *       400:
     *         description: Bad Request - Invalid input
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   example: "Title or description is required"
     *       401:
     *         description: Unauthorized - Authentication required
     *       404:
     *         description: Post not found
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   example: "Post not found"
     *       500:
     *         description: Server Error
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   example: "Internal Server Error"
     */
    .all(authenticate())
    .get(postController.getPostById)
    .put(postController.updatePostById);

  app
    .route('/users/:id/post')
    /**
     * @openapi
     * /users/{id}/post:
     *   post:
     *     tags:
     *       - Posts
     *     summary: Create a new post
     *     description: Creates a new post for a specific user
     *     security:
     *       - BearerAuth: []
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         description: ID of the user creating the post
     *         schema:
     *           type: string
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CreatePostInput'
     *     responses:
     *       201:
     *         description: Post created successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 id:
     *                   type: string
     *                 title:
     *                   type: string
     *                 description:
     *                   type: string
     *                 userId:
     *                   type: string
     *                 createdAt:
     *                   type: string
     *                   format: date-time
     *                 updatedAt:
     *                   type: string
     *                   format: date-time
     *       400:
     *         description: Bad Request - Invalid input
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   example: "Title and description are required"
     *       401:
     *         description: Unauthorized - Authentication required
     *       404:
     *         description: User not found
     *       500:
     *         description: Server Error
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   example: "Internal Server Error"
     */
    .all(authenticate())
    .post(postController.createPost);

  app
    .route('/users/:userId/post/:postId')
    /**
     * @openapi
     * /users/{userId}/post/{postId}:
     *   delete:
     *     tags:
     *       - Posts
     *     summary: Delete a post
     *     description: Deletes a specific post for a specific user
     *     security:
     *       - BearerAuth: []
     *     parameters:
     *       - name: userId
     *         in: path
     *         required: true
     *         description: ID of the user who owns the post
     *         schema:
     *           type: string
     *       - name: postId
     *         in: path
     *         required: true
     *         description: ID of the post to delete
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Post deleted successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: "Post deleted successfully"
     *       401:
     *         description: Unauthorized - Authentication required
     *       404:
     *         description: Post not found
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   example: "Post not found"
     *       500:
     *         description: Server Error
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   example: "Internal Server Error"
     */
    .all(authenticate())
    .delete(postController.deletePostById);
};
