import React, { useState, useEffect } from "react";
import Joi from "joi-browser";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Input from "./common/input";
import Form from "./common/form";
import http from "../services/httpService";
import { api } from "../config.js";
import { createpost } from "../services/postCreateService";
import "../CSS_files/forum.css";
import NavBar from "../components/NavBar.jsx";

const NewPost = () => {
  const [data, setData] = useState({ title: "", description: "", tags: [] });
  const [errors, setErrors] = useState({
    title: "",
    description: "",
    tags: [],
  });
  const [tags, setTags] = useState([]);

  const schema = {
    title: Joi.string().required().min(10).label("Title"),
    description: Joi.string().required().min(5).label("Description"),
    tags: Joi.array(),
    user: Joi.object(),
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: fetchedTags } = await http.get(api.tagsEndPoint);
        setTags(fetchedTags);
      } catch (ex) {
        if (ex.response && ex.response.status === 400) {
          toast.error("Post Validation Failed!");
        }
      }
    };
    fetchData();
  }, []);

  const handleTagChange = (tagID) => {
    let newData = { ...data };
    const newTags = [...newData.tags];
    const index = newTags.indexOf(tagID);
    if (index === -1) newTags.push(tagID);
    else newTags.splice(index, 1);
    newData = { ...newData, tags: newTags };
    setData(newData);
  };

  const validate = () => {
    const options = { abortEarly: false };
    const { error } = Joi.validate(data, schema, options);
    if (!error) return null;

    const newErrors = {};
    for (let item of error.details) {
      newErrors[item.path[0]] = item.message;
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors || {});
    if (validationErrors) return;

    try {
      const { response } = await createpost(data);
      console.log(response);
      window.location = "/dashboard";
    } catch (ex) {}
  };

  const handleChange = ({ currentTarget: input }) => {
    const newData = { ...data };
    newData[input.name] = input.value;
    setData(newData);
  };

  return (
    <>
      <NavBar></NavBar>
      <React.Fragment>
        <ToastContainer />
        <div className="container-reply">
          
          <div className="new-post-form">
          <h1 className="new-post-title">Create a New Discussion</h1>
            <form onSubmit={handleSubmit}>
              <Input
                value={data.title}
                onChange={handleChange}
                label="Title"
                name="title"
                type="text"
                className="new-post-input"
                error={errors.title}
              />
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  value={data.description}
                  onChange={handleChange}
                  name="description"
                  id="description"
                  className="new-post-textarea"
                />
                {errors.description && (
                  <div className="new-post-alert">{errors.description}</div>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="tags">Related Tags</label>
                <br />
                {tags.map((tag) => (
                  <React.Fragment key={tag._id}>
                    <label className="mr-3 ml-3">
                      <input
                        className="new-post-checkbox"
                        type="checkbox"
                        onChange={() => handleTagChange(tag._id)}
                      />
                      {tag.name}
                    </label>
                  </React.Fragment>
                ))}
                {errors.tags && (
                  <div className="new-post-alert">{errors.tags}</div>
                )}
              </div>
              <div className="text-center">
                <button className="new-post-submit" disabled={validate()}>
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </React.Fragment>
    </>
  );
};

export default NewPost;
