import express from 'express';

import { CommentService } from '@types';
import { authenticate } from 'auth';

export const commentRouter = ({
  app,
  commentService,
}: {
  app: express.Application;
  commentService: CommentService;
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
     *                 type: object
     *                 properties:
     *                   id:
     *                     type: string
     *                   content:
     *                     type: string
     *                   userId:
     *                     type: string
     *                   postId:
     *                     type: string
     *                   createdAt:
     *                     type: string
     *                     format: date-time
     *       401:
     *         description: Unauthorized - Authentication required
     *       404:
     *         description: Not Found - Post not found
     *       500:
     *         description: Server Error
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
     *             type: object
     *             required:
     *               - content
     *             properties:
     *               content:
     *                 type: string
     *                 example: "This is a great post!"
     *     responses:
     *       201:
     *         description: Comment created successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 id:
     *                   type: string
     *                 content:
     *                   type: string
     *                 userId:
     *                   type: string
     *                 postId:
     *                   type: string
     *                 createdAt:
     *                   type: string
     *                   format: date-time
     *       400:
     *         description: Bad Request - Invalid input
     *       401:
     *         description: Unauthorized - Authentication required
     *       404:
     *         description: Not Found - Post not found
     *       500:
     *         description: Server Error
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
     *       401:
     *         description: Unauthorized - Authentication required
     *       404:
     *         description: Not Found - Post not found
     *       500:
     *         description: Server Error
     */
    .all(authenticate())
    .get(commentService.fetchComments)
    .post(commentService.createComment)
    .delete(commentService.deleteAllComments);

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
     *               type: object
     *               properties:
     *                 id:
     *                   type: string
     *                 content:
     *                   type: string
     *                 userId:
     *                   type: string
     *                 postId:
     *                   type: string
     *                 createdAt:
     *                   type: string
     *                   format: date-time
     *       401:
     *         description: Unauthorized - Authentication required
     *       404:
     *         description: Not Found - Comment or post not found
     *       500:
     *         description: Server Error
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
     *       401:
     *         description: Unauthorized - Authentication required
     *       403:
     *         description: Forbidden - User doesn't have permission
     *       404:
     *         description: Not Found - Comment or post not found
     *       500:
     *         description: Server Error
     */
    .all(authenticate())
    .get(commentService.fetchCommentById)
    .delete(commentService.deleteCommentById);
};
