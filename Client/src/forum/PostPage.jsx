import React, { useState, useEffect } from "react";
// import Moment from "react-moment";
// import "moment-timezone";  
import { PersonCircle, HandThumbsUpFill } from "react-bootstrap-icons";
import { ToastContainer, toast } from "react-toastify";
import http from "../services/httpService";
import { api } from "../config.js";
import PostReply from "./createReply";
import { useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from  "axios" 


const PostPage =  () => {
  const [user, setUSer] = useState(null);
  const [post, setPost] = useState({
    description: "",
    title: "",
    tags: [],
    author: [],
    upvotes: [],
    views: 0,
  });
  const [replies, setReplies] = useState([]);
  const {id} = useParams();
  useEffect( () => {
    const fetchData = async () => {
      
      try {
        const { data: postData } = await http.get(api.postsEndPoint + id);
        const { data: repliesData } = await http.get(api.repliesEndPoint + id);
        setPost(postData);
        setReplies(repliesData);
        console.log(repliesData , " reply")
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
 
    const userHandel = async () =>{
      
    const tokenCookie = document.cookie
    .split(';')
    .find(cookie => cookie.trim().startsWith('token='));

  // Extract token value
  const token = tokenCookie ? tokenCookie.split('=')[1] : null;

  if (token) {
    try {
      // Step 2: Decode the token
      const decoded = jwtDecode(token);
      // Fetch user data after successful login
      const userDataResponse = await axios.get(
        `https://s51-jesudaszion-capstone-trainliketrainer.onrender.com/user/${decoded.email}`
      );

      // Update state with decoded token
      setUSer(userDataResponse.data);
      console.log(decoded)
      console.log(userDataResponse.data)
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  } else {
    console.error('Token cookie not found or invalid.')
  }

    }


    userHandel()
  }, [id]);



  const checkLike = () => {
    if (user && post.upvotes && post.upvotes.includes(user._id)) return true;
    return false;
  };

  const checkReplyLike = (id) => {
    if (user) {
      const reply = replies.find((reply) => reply._id === id);
      if (reply && reply.upvotes.includes(user._id)) return true;
    }
    return false;
  };

  const handleUpvote = async () => {
    try {
      const { data: updatedPost } = await http.put(
        api.postsEndPoint + "like/" + id,
        {}
      );
      setPost(updatedPost[0]);
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        toast.error("You can't upvote your own post!");
      }
    }
  };

  const handleReplyUpvote = async (id) => {
    try {
      await http.put(api.repliesEndPoint + "like/" + id, {});
      const { data: updatedReplies } = await http.get(
        api.repliesEndPoint + "/" + id
      );
      setReplies(updatedReplies);
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        toast.error("You can't upvote your own reply!");
      }
    }
  };

  return (
    <div>
      <ToastContainer />
      <div className="container-rounded">
        <h2>{post.title}</h2>
        <p className="mt-4" style={{ color: "#505050" }}>
          {post.description}
        </p>
        <div className="mt-1">
          Related Topics:
          {post.tags &&
            post.tags.map((tag) => (
              <span className="badge-success" key={tag._id}>
                {tag.name}
              </span>
            ))}
          <div className="">
            <button
              disabled={!user}
              className={
                checkLike() ? "" : ""
              }
              onClick={handleUpvote}
            >
              <HandThumbsUpFill className="mr-2" />
              {(post.upvotes && post.upvotes.length) || 0}
            </button>
            <p>{post.views} Views</p>
          </div>
          <div className="" style={{ color: "#505050" }}>
            <div>
              <PersonCircle size={30} className="mr-2" />
              Posted by {(post.author.name) || 0}
            </div>
            <p className="mb-1">
              {/* <Moment fromNow>{post.time}</Moment> */}
            </p>
          </div>
        </div>
      </div>
      {user && <PostReply id={id} />}
      <div className="">
        Showing {replies.length} replies
      </div>
      <div>
        {replies &&
          replies.map((reply) => (
            <div className="container col-lg-6 shadow-lg p-3 mt-3 bg-body rounded" key={reply._id}>
              <div className="ml-4">
                <PersonCircle size={30} className="mr-3" />
                Posted by {reply.author.name}
              </div>
              <div className="m-4">{reply.comment}</div>
              <div className="d-flex w-100 justify-content-between mt-3 mb-3">
                <button
                  className={
                    checkReplyLike(reply._id)
                      ? "btn btn-primary"
                      : "btn btn-outline-primary"
                  }
                  disabled={!user}
                  onClick={() => {
                    handleReplyUpvote(reply._id);
                  }}
                >
                  <HandThumbsUpFill className="mr-2" />
                  {reply.upvotes.length}
                </button>
                <p className="mb-1">
                  {/* <Moment fromNow style={{ color: "#505050" }}>
                    {reply.time}
                  </Moment> */}
                </p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default PostPage;
