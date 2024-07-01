import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperclip } from "@fortawesome/free-solid-svg-icons";
import { tweetForm } from "../css/forms";

const EditTweetForm = ({ tweet, onUpdate, onClose, onError }) => {
  const [text, setText] = useState(tweet.text);
  const [video, setVideo] = useState(tweet.video);
  const [image, setImage] = useState(tweet.image);
  const [show, setShow] = useState(false);

  const onSubmit = (event) => {
    event.preventDefault();
    if (text !== tweet.text || video !== tweet.video || image !== tweet.image)
      onUpdate(
        tweet.id,
        text === tweet.text ? "" : text,
        video === tweet.video ? "" : video,
        image === tweet.image ? "" : image,
        tweet.image
      ).catch(onError);
    onClose();
  };

  const onChange = (event) => {
    const {
      target: { name, value, files },
    } = event;
    switch (name) {
      case "text":
        return setText(value);
      case "video":
        return setVideo(value);
      case "image":
        return setImage(files[0]);
      default:
    }
  };

  const showMediaInput = () => setShow(show ? false : true);

  const removeImage = () => setImage("No Image");

  return (
    <tweetForm.Edit.Form
      className="edit-tweet-form"
      current={show}
      onSubmit={onSubmit}
    >
      <input
        type="text"
        name="text"
        placeholder="Edit your tweet"
        value={text}
        autoFocus
        onChange={onChange}
        className="form-input tweet-input"
      />
      {show && (
        <>
          <tweetForm.Video
            type="text"
            placeholder="Write Youtube Video Url"
            name="video"
            value={video}
            autoFocus
            onChange={onChange}
            className="tweet-input"
          />
          <tweetForm.Image.Url>
            {tweet.image ? tweet.image.substring(0, 32) : "No Image"}...
          </tweetForm.Image.Url>
          <tweetForm.Image.Remove type="button" onClick={removeImage}>
            X
          </tweetForm.Image.Remove>
          <tweetForm.Image.Input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={onChange}
          />
        </>
      )}
      <tweetForm.Edit.Submit type="button" onClick={showMediaInput}>
        <FontAwesomeIcon icon={faPaperclip} />
      </tweetForm.Edit.Submit>
      <button type="submit" className="form-btn-update">
        Update
      </button>
      <button type="button" className="form-btn-cancel" onClick={onClose}>
        Cancel
      </button>
    </tweetForm.Edit.Form>
  );
};

export default EditTweetForm;
