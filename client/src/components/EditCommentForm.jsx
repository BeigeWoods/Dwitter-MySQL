import React, { useState } from "react";
import { commentForm } from "../css/forms";

const EditCommentForm = ({ tweetId, comment, onUpdate, onClose, onError }) => {
  const [text, setText] = useState(comment.text);

  const onSubmit = async (event) => {
    event.preventDefault();
    if (text !== comment.text)
      onUpdate(tweetId, comment.id, text).catch(onError);
    onClose();
  };

  const onChange = (event) => {
    const {
      target: { name, value },
    } = event;
    switch (name) {
      case "text":
        return setText(value);
      default:
    }
  };

  return (
    <commentForm.Form cancle={true} isEdit={true} onSubmit={onSubmit}>
      <input
        type="text"
        name="text"
        placeholder="Edit your comment"
        value={text}
        autoFocus
        onChange={onChange}
      />
      <commentForm.Submit type="submit">►</commentForm.Submit>
      <commentForm.Cancle type="button" onClick={onClose}>
        X
      </commentForm.Cancle>
    </commentForm.Form>
  );
};

export default EditCommentForm;
