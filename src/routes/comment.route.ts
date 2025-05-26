import express from 'express';

import { authenticate } from 'auth';
import { CommentController } from '@controllers';

/**
 * @openapi
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         content:
 *           type: string
 *           example: "This is a great post!"
 *         userId:
 *           type: string
 *           example: "abc123-user-id"
 *         postId:
 *           type: string
 *           example: "def456-post-id"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       required:
 *         - id
 *         - content
 *         - userId
 *         - postId
 *
 *     CreateCommentInput:
 *       type: object
 *       required:
 *         - content
 *         - userId
 *       properties:
 *         content:
 *           type: string
 *           example: "This is a great post!"
 *         userId:
 *           type: string
 *           example: "abc123-user-id"
 *
 *     CommentResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Comment operation successful"
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           example: "Error message"
 */

export const commentRouter = ({
  app,
  commentController,
}: {
  app: express.Application;
  commentController: CommentController;
}) => {
  app
    .route('/posts/:id/comments')
    /**
     * @openapi
     * /posts/{id}/comments:
     *   get:
     *     tags:
     *       - Comments
     *     summary: Get all comments for a post
     *     description: Retrieves all comments associated with a specific post
     *     security:
     *       - BearerAuth: []
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         description: ID of the post
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: List of comments
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Comment'
     *       401:
     *         description: Unauthorized - Authentication required
     *       404:
     *         description: Not Found - Post not found or no comments found
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     *       500:
     *         description: Server Error
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     *   post:
     *     tags:
     *       - Comments
     *     summary: Create a new comment
     *     description: Adds a new comment to a specific post
     *     security:
     *       - BearerAuth: []
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         description: ID of the post
     *         schema:
     *           type: string
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CreateCommentInput'
     *     responses:
     *       201:
     *         description: Comment created successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: "Comment created successfully"
     *                 newComment:
     *                   $ref: '#/components/schemas/Comment'
     *       400:
     *         description: Bad Request - Invalid input
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     *       401:
     *         description: Unauthorized - Authentication required
     *       404:
     *         description: Not Found - Post not found
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     *       500:
     *         description: Server Error
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     *   delete:
     *     tags:
     *       - Comments
     *     summary: Delete all comments for a post
     *     description: Removes all comments associated with a specific post
     *     security:
     *       - BearerAuth: []
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         description: ID of the post
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: All comments deleted successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: "All comments for this post deleted successfully"
     *       401:
     *         description: Unauthorized - Authentication required
     *       404:
     *         description: Not Found - Post not found
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     *       500:
     *         description: Server Error
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    .all(authenticate())
    .get(commentController.fetchComments)
    .post(commentController.createComment)
    .delete(commentController.deleteAllComments);

  app
    .route('/posts/:postId/comment/:commentId')
    /**
     * @openapi
     * /posts/{postId}/comment/{commentId}:
     *   get:
     *     tags:
     *       - Comments
     *     summary: Get a specific comment
     *     description: Retrieves a specific comment by ID from a specific post
     *     security:
     *       - BearerAuth: []
     *     parameters:
     *       - name: postId
     *         in: path
     *         required: true
     *         description: ID of the post
     *         schema:
     *           type: string
     *       - name: commentId
     *         in: path
     *         required: true
     *         description: ID of the comment
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Comment details
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Comment'
     *       401:
     *         description: Unauthorized - Authentication required
     *       404:
     *         description: Not Found - Comment or post not found
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     *       500:
     *         description: Server Error
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     *   delete:
     *     tags:
     *       - Comments
     *     summary: Delete a specific comment
     *     description: Removes a specific comment by ID from a specific post
     *     security:
     *       - BearerAuth: []
     *     parameters:
     *       - name: postId
     *         in: path
     *         required: true
     *         description: ID of the post
     *         schema:
     *           type: string
     *       - name: commentId
     *         in: path
     *         required: true
     *         description: ID of the comment
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Comment deleted successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: "Comment deleted successfully"
     *       401:
     *         description: Unauthorized - Authentication required
     *       404:
     *         description: Not Found - Comment or post not found
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     *       500:
     *         description: Server Error
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    .all(authenticate())
    .get(commentController.fetchCommentById)
    .delete(commentController.deleteCommentById);
};
