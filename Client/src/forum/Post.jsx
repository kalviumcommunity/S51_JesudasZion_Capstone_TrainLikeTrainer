import React from "react";
import { Link } from "react-router-dom";

const Posts = (props) => {
  const { posts } = props;

  return (
    <div className="posts-list">
      {posts.map((post, index) => (
        <Link
          key={index}
          className="post-item"
          to={`/post/${post._id}`}
        >
          <div className="post-header">
            <h5 className="post-title">{post.title}</h5>
          </div>
          <small>Created by {post.author.name}</small>
          <br />
          <small className="post-description">{post.description}</small>
          <div className="post-details">
            Related Topics:
            {post.tags.map((tag, tagIndex) => (
              <span key={tagIndex} className="post-tag">{tag.name}</span>
            ))}
            <h6 className="post-stats">
              {post.upvotes.length} Likes | {post.views} Views
            </h6>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Posts;
