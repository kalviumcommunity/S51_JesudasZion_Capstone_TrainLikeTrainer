import { useState } from "react";
import Joi from "joi-browser";

const Form = (initialData, schema, onSubmit) => {
  const [data, setData] = useState(initialData);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const options = { abortEarly: false };
    const result = Joi.validate(data, schema, options);
    const newErrors = {};
    if (!result.error) return null;
    for (let item of result.error.details) {
      newErrors[item.path[0]] = item.message;
    }
    return newErrors;
  };

  const validateProperty = ({ name, value }) => {
    const obj = { [name]: value };
    const validationSchema = { [name]: schema[name] };
    const { error } = Joi.validate(obj, validationSchema);
    return error ? error.details[0].message : null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors || {});
    if (validationErrors) return;
    onSubmit(data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const errorMessage = validateProperty({ name, value });
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessage,
    }));
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return { data, errors, handleSubmit, handleChange };
};

export default Form;
