require("dotenv").config({ path: ".env" });
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');
const authMiddleware = require('./middleware/authMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

app.use('/api/auth', authRoutes);
app.use('/api/posts', authMiddleware ,postRoutes);
app.use('/api/comments',authMiddleware, commentRoutes);


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.get("/",(req,res)=>{
  res.send("Connected")
})
