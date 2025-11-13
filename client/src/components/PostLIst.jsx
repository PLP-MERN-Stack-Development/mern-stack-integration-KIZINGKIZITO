import React from 'react';
import { Link } from 'react-router-dom';

const PostList = ({ posts, onDelete }) => {
  if (!posts.length) {
    return <div className="no-posts">No posts found</div>;
  }

  return (
    <div className="post-list">
      {posts.map(post => (
        <div key={post._id} className="post-card">
          <h3>
            <Link to={`/posts/${post._id}`}>{post.title}</Link>
          </h3>
          <p className="post-excerpt">{post.excerpt || post.content.substring(0, 150)}...</p>
          <div className="post-meta">
            <span className="category">{post.category?.name}</span>
            <span className="author">By {post.author}</span>
            <span className="date">
              {new Date(post.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className="post-actions">
            <Link to={`/edit/${post._id}`} className="btn btn-edit">Edit</Link>
            <button 
              onClick={() => onDelete(post._id)}
              className="btn btn-delete"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostList;