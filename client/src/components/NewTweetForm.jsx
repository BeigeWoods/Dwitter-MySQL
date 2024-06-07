import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperclip } from "@fortawesome/free-solid-svg-icons";
import { tweetForm } from "../css/forms";

const NewTweetForm = ({ tweetService, onError }) => {
  const [text, setText] = useState("");
  const [video, setVideo] = useState("");
  const [image, setImage] = useState("");
  const [show, setShow] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    tweetService
      .postTweet(text, video, image)
      .then(() => {
        setText("");
        setVideo("");
        setImage("");
        setShow(false);
      })
      .catch(onError);
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

  return (
    <>
      <tweetForm.Form current={show} onSubmit={onSubmit}>
        <input
          type="text"
          name="text"
          placeholder="Edit your tweet"
          value={text}
          autoFocus
          onChange={onChange}
          className="tweet-input"
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
            <tweetForm.Image.Input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={onChange}
            />
          </>
        )}
        <tweetForm.Submit type="button" current={show} onClick={showMediaInput}>
          <FontAwesomeIcon icon={faPaperclip} />
        </tweetForm.Submit>
        <button type="submit" className="form-btn">
          Post
        </button>
      </tweetForm.Form>
    </>
  );
};

export default NewTweetForm;
