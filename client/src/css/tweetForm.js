import styled from "styled-components";

export const AttachmentButton = styled.button`
  font-size: 17px;
  color: var(--color-blue);
  grid-column: 2;
  margin-right: ${(props) => (props.current ? "0" : "4px")};
`;

export const TweetForm = styled.form`
  display: ${(props) => (props.current ? "grid" : "flex")};
  width: 100%;
  padding: 4px 16px;
  background-color: var(--color-grey);
  grid-template-columns: 8fr 35px 1fr;
  grid-template-rows: 30px 30px 30px;
  row-gap: 5px;
  align-items: center;
`;

export const VideoInput = styled.input`
  grid-row: 2;
`;

export const ImageInput = styled.input`
  grid-row: 4;
`;

export const TweetEditForm = styled.form`
  grid-row: 2/3;
  display: grid;
  width: 100%;
  padding: 4px 16px;
  background-color: var(--color-grey);
  grid-template-columns: 5fr 25px 1fr;
  grid-template-rows: ${(props) =>
    props.current ? "24px 24px 24px 24px" : "24px 24px"};
  row-gap: 5px;
  align-items: center;
`;

export const EditAttachmentButton = styled.button`
  font-size: 14px;
  color: var(--color-blue);
  grid-column: 2;
`;

export const ImageDesc = styled.p`
  margin-left: 3px;
  grid-row: 3;
  font-size: 14px;
`;

export const RemoveImage = styled.button`
  grid-column: 2;
  grid-row: 3;
  color: var(--color-blue);
`;
