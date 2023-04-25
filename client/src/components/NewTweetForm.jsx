import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperclip } from "@fortawesome/free-solid-svg-icons";
import {
  AttachmentButton,
  ImageInput,
  TweetForm,
  VideoInput,
} from "../css/tweetForm";

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

  const showMediaInput = () => (show ? setShow(false) : setShow(true));

  return (
    <>
      <TweetForm current={show} onSubmit={onSubmit}>
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
            <VideoInput
              type="text"
              placeholder="Write Youtube Video Url"
              name="video"
              value={video}
              autoFocus
              onChange={onChange}
              className="tweet-input"
            />
            <ImageInput
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={onChange}
            />
          </>
        )}
        <AttachmentButton type="button" current={show} onClick={showMediaInput}>
          <FontAwesomeIcon icon={faPaperclip} />
        </AttachmentButton>
        <button type="submit" className="form-btn">
          Post
        </button>
      </TweetForm>
    </>
  );
};

export default NewTweetForm;
