import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Pagination from "./common/pagination";
import ListGroup from "./listgroup.jsx";
import Posts from "./Post.jsx";
import { paginate } from "../utils/paginate";
import { api } from "../config.js";
import http from "../services/httpService.js";
import Jumbotron from "./common/jumbotron";
import _ from "lodash"
import "../CSS_files/forum.css"

const DashboardView = () => {
  function getCookie(cookieName) {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === cookieName) {
            return decodeURIComponent(value);
        }
    }
  }
  const [token,setToken] = useState(getCookie("token"))
  const [allPosts, setAllPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(4);
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState({ _id: "1", name: "All Posts" });

  useEffect(() => {
    const fetchData = async () => {
      const { data: allposts } = await http.get(api.postsEndPoint);
      const { data: tags } = await http.get(api.tagsEndPoint);

      setAllPosts([...allposts]);
      console.log([...allPosts])
      setTags([
        {
          _id: "1",
          name: "All Posts",
        },
        ...tags,
      ]);
    };

    fetchData();
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePostDelete = (post) => {
    // Implement post deletion logic
  };

  const handleTagSelect = (tag) => {
    setSelectedTag(tag);
    setCurrentPage(1);
  };

  const getPosts = () => {
    const filtered = [];
    for (let i in allPosts) {
      const post = allPosts[i];
      const { tags } = post;
      for (let j in tags) {
        if (tags[j].name === selectedTag.name) {
          filtered.push(post);
          break;
        }
      }
    }
    return filtered;
  };

  function paginate(items, pageNumber, pageSize) {
    const startIndex = (pageNumber - 1) * pageSize;
    return _(items).slice(startIndex).take(pageSize).value();
  }

  const filtered = selectedTag._id === "1" ? allPosts : getPosts();
  console.log(filtered)
  const posts = paginate(filtered, currentPage, pageSize);
  console.log(posts , "posts")

//   if (allPosts.length === 0)
//     return <p>There are no posts in the database!</p>;

  return (
    <>
      <Jumbotron />
      <div className="dashboard-container">
        <div className="dashboard-row">
          <div className="dashboard-col">
            <div className="dashboard-header">
             <p> Showing {filtered.length} posts.</p>
                <Link to="/new-post">
                  <button 
                    type="button"
                    className="dashboard-button"
                  >
                    New Post
                  </button>
                </Link>
            </div>
          </div>
        </div>
        <div className="dashboard-row">
          <div className="dashboard-posts">
            <Posts posts={posts} onDelete={handlePostDelete} />
          </div>
          <div className="dashboard-col-3">
            <ListGroup
              items={tags}
              selectedTag={selectedTag}
              onTagSelect={handleTagSelect}
            />
          </div>
          <Pagination
            itemCount={filtered.length}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </>
  );
};

export default DashboardView;
