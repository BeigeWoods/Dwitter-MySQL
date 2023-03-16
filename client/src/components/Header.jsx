import React, { memo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { useHistory } from "react-router";
import styled from "styled-components";

// Style
const PageHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--color-black);
  padding: 8px;
`;

const Logo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
`;

const Image = styled.img`
  width: 32px;
  height: 32px;
  margin-left: 5px;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin: 8px;
`;

const Username = styled.span`
  font-size: 0.8rem;
  color: var(--color-blue);
  padding-top: 8px;
`;

const Menu = styled.nav`
  color: var(--color-white);
  display: flex;
  justify-content: space-between;
  width: 60px;
`;

const Button = styled.button`
  font-size: 17px;
`;

// Component
const Header = memo(({ username, onLogout, onMyTweets, onAllTweets }) => {
  const history = useHistory();
  const onProfile = () => {
    history.push("/auth/profile");
  };
  return (
    <PageHeader>
      <Logo>
        <Image src="./img/logo.png" alt="Dwitter Logo" />
        <Title onClick={onAllTweets}>Dwitter</Title>
        {username && <Username onClick={onMyTweets}>@{username}</Username>}
      </Logo>
      {username && (
        <Menu>
          <Button onClick={onProfile}>
            <FontAwesomeIcon icon={faUser} />
          </Button>
          <Button onClick={onLogout}>
            <FontAwesomeIcon icon={faSignOutAlt} />
          </Button>
        </Menu>
      )}
    </PageHeader>
  );
});

export default Header;
