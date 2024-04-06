const Comment = require('../models/Comment');
const Post = require('../models/Post');

// Create a new comment on a post
exports.createComment = async (req, res) => {
  try {
    const { content } = req.body;
    const postId = req.params.postId;
    const userId = req.user.id; // Assuming user ID is stored in req.user.id

    // Check if the post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Create a new comment
    const newComment = new Comment({ content, author: userId, post: postId });
    await newComment.save();

    // Update the post's comments array
    post.comments.push(newComment);
    await post.save();

    res.status(201).json({ message: 'Comment added successfully', comment: newComment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to add comment' });
  }
};

// Delete a comment from a post
exports.deleteComment = async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const userId = req.user.id; // Assuming user ID is stored in req.user.id

    // Check if the comment exists
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if the user is the author of the comment
    if (comment.author.toString() !== userId) {
      return res.status(403).json({ message: 'You are not authorized to delete this comment' });
    }

    // Remove the comment from the post's comments array
    const postId = comment.post;
    const post = await Post.findById(postId);
    post.comments.pull(commentId);
    await post.save();

    // Delete the comment from the database
    await Comment.findByIdAndDelete(commentId);

    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete comment' });
  }
};
