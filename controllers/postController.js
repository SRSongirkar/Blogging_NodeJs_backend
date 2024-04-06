const Post = require('../models/Post');
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate('author').populate('comments');
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch posts' });
  }
};

const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author').populate('comments');
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(200).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch post' });
  }
};

const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    // Populate the author field with req.user._id
    const newPost = await Post.create({
      title,
      content,
      author: req.user.id // Assuming user ID is stored in req.user.id
    });

    return res.status(201).json(newPost);
  } catch (error) {
    console.error('Error creating post:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const updatePost = async (req, res) => {
  try {
    const { title, content } = req.body;
    await Post.findByIdAndUpdate(req.params.id, { title, content });
    res.status(200).json({ message: 'Post updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update post' });
  }
};

const deletePost = async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete post' });
  }
};

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
};