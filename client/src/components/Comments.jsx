import React, { memo, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import NewCommentForm from "./NewCommentForm";
import CommentCard from "./CommentCard";
import { EmptyCard, Container, Folder } from "../css/comment";

const Comments = memo(({ tweetId, commentService, onError }) => {
  const [comments, setComments] = useState([]);
  const [recipient, setRecipient] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    commentService
      .getComments(tweetId)
      .then((comments) => setComments([...comments]))
      .catch(onError);

    const stopSync = commentService.onSync((comment) => onCreated(comment));
    return () => stopSync();
  }, [commentService, user, tweetId, onError]);

  const onCreated = (comment) => {
    setComments((comments) => [comment, ...comments]);
  };

  const onDelete = (tweetId, id) =>
    commentService
      .deleteComment(tweetId, id)
      .then(() =>
        setComments((comments) =>
          comments.filter((comment) => comment.id !== id)
        )
      )
      .catch(onError);

  const onUpdate = (tweetId, id, text) =>
    commentService
      .updateComment(tweetId, id, text)
      .then((updated) =>
        setComments((comments) =>
          comments.map((item) => (item.id === updated.id ? updated : item))
        )
      )
      .catch(onError);

  const onChangeForGood = (comment, update) => {
    comment.good = update.good;
    comment.clicked = update.clicked;
    return comment;
  };

  const onClickGoodComment = (commentId, good, clicked) =>
    commentService
      .clickGood(tweetId, commentId, good, clicked)
      .then((updated) => {
        setComments((comments) =>
          comments.map((item) =>
            item.id === updated.id ? onChangeForGood(item, updated) : item
          )
        );
      })
      .catch(onError);

  const onClickReply = (recipient) => {
    setRecipient(recipient);
  };

  return (
    <>
      <Container>
        <NewCommentForm
          tweetId={tweetId}
          commentService={commentService}
          recipient={recipient}
          onClickReply={onClickReply}
          onError={onError}
        />
        {!comments.length && <EmptyCard>No Comments Yet</EmptyCard>}
        <Folder>
          {comments.map((comment) => (
            <CommentCard
              key={comment.id}
              tweetId={tweetId}
              comment={comment}
              owner={comment.username === user.username}
              onDelete={onDelete}
              onUpdate={onUpdate}
              onClickGoodComment={onClickGoodComment}
              onClickReply={onClickReply}
              onError={onError}
            />
          ))}
        </Folder>
      </Container>
    </>
  );
});
export default Comments;
