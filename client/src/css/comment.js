import styled from "styled-components";

export const Container = styled.section`
  grid-row: 3/4;
  background: var(--color-grey);
`;

export const EmptyCard = styled.p`
  font-size: 2rem;
  font-weight: bold;
  color: white;
  text-align: center;
  margin: 10px 0 0 0;
`;

export const Folder = styled.ul`
  overflow-y: auto;
  color: var(--color-black);
  padding: 10px;
  list-style: none;
  //Firefox
  scrollbar-width: 6px;
  scrollbar-color: var(--color-darkGrey);
  scrollbar-face-color: var(--color-blue);
`;

export const Card = styled.li`
  background: white;
  box-shadow: 0 4px 8px 0 var(--color-shadow);
  transition: 0.3s;
  margin-bottom: 10px;
  padding: 8px;
`;

export const CommentForm = styled.form`
  display: flex;
  padding: 4px 16px;
  height: 40px;
`;

export const Username = styled.span`
  font-size: 0.7rem;
  margin-left: 4px;
  color: var(--color-blue);
  font-weight: bold;
`;
