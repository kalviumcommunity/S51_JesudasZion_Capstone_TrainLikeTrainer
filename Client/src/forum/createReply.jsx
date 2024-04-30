import React, { useState } from "react";
import Joi from "joi-browser";
import { ToastContainer } from "react-toastify";
import Form from "./common/form";
import { createreply } from "../services/replyCreateService";
// import { Redirect } from "react-router-dom";

const PostReply = (props) => {
  const [data, setData] = useState({
    comment: "",
  });
  const [errors, setErrors] = useState({ comment: "" });

  const schema = {
    comment: Joi.string().required().min(5).label("Comment"),
  };

  const handleChange = ({ target: input }) => {
    const updatedData = { ...data };
    updatedData[input.name] = input.value;
    setData(updatedData);

    const errorMessage = validateProperty(input);
    setErrors({ ...errors, [input.name]: errorMessage });
  };

  const validateProperty = ({ name, value }) => {
    const obj = { [name]: value };
    const subschema = { [name]: schema[name] };
    const { error } = Joi.validate(obj, subschema);
    return error ? error.details[0].message : null;
  };

  const validate = () => {
    const options = { abortEarly: false };
    const { error } = Joi.validate(data, schema, options);

    if (!error) return null;

    const validationErrors = {};
    for (let item of error.details) {
      validationErrors[item.path[0]] = item.message;
    }
    return validationErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors || {});
    if (validationErrors) return;

    try {
      const { data: reply } = await createreply(data, props.id);
      window.location = `/post/${props.id}`;
    } catch (ex) {}
  };

  return (
    <>
      <ToastContainer />
      <div className="container col-lg-6 shadow-lg p-3 mt-5 bg-body rounded">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="description">Post Reply</label>
            <textarea
              className="border border-primary form-control"
              style={{ height: 150 }}
              value={data.comment}
              onChange={handleChange}
              name="comment"
              type="comment"
              id="comment"
            />
            {errors.comment && <div className="alert-info">{errors.comment}</div>}
            <div className="text-center">
              <button className="btn btn-primary mt-4" disabled={validate()}>
                Post Reply
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default PostReply;
