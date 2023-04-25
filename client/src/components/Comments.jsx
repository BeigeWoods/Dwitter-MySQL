import React, { memo, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import NewCommentForm from "./NewCommentForm";
import CommentCard from "./CommentCard";
import { EmptyCard, Container, Folder } from "../css/comment";

const Comments = memo(({ tweetId, commentService, onError }) => {
  const [comments, setComments] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    commentService
      .getComments(tweetId)
      .then((comments) => setComments([...comments]))
      .catch((error) => onError(error));

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
      .catch((error) => onError(error));

  const onUpdate = (tweetId, id, text) =>
    commentService
      .updateComment(tweetId, id, text)
      .then((updated) =>
        setComments((comments) =>
          comments.map((item) => (item.id === updated.id ? updated : item))
        )
      )
      .catch((error) => onError(error));

  return (
    <>
      <Container>
        <NewCommentForm
          tweetId={tweetId}
          commentService={commentService}
          onError={onError}
        />
        {comments.length === 0 && <EmptyCard>No Comments Yet</EmptyCard>}
        <Folder>
          {comments.map((comment) => (
            <CommentCard
              key={comment.id}
              tweetId={tweetId}
              comment={comment}
              owner={comment.username === user.username}
              onDelete={onDelete}
              onUpdate={onUpdate}
            />
          ))}
        </Folder>
      </Container>
    </>
  );
});
export default Comments;
