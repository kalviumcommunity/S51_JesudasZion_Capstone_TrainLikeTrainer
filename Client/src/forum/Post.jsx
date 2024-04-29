import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const Posts = ({posts}) => {
  console.log(posts, " zion")
//   useEffect(()=>{
//     const fetchUserById = async (userId) => {
//       try {
//           const response = await fetch(`/api/user/${userId}`); // Assuming your Express API is mounted at /api
//           if (!response.ok) {
//               throw new Error('Failed to fetch user');
//           }
//           const userData = await response.json();
//           return userData;
//       } catch (error) {
//           console.error('Error fetching user:', error.message);
//           throw error; // Rethrow the error to handle it elsewhere if needed
//       }
//   };
//   fetchUserById(id)
//   }
 
// ,[])

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
