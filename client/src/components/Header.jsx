import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { useHistory } from "react-router";
import { roof } from "../css/components";
import logo from "../assets/logo.png";

const Header = ({ username, toAllTweets, toProfile, toLogout }) => {
  const history = useHistory();
  const toMyTweets = () => {
    history.push(`/${username}`);
  };

  return (
    <roof.Header>
      <roof.Logo>
        <roof.Image src={logo} alt="Dwitter Logo" />
        <roof.Title onClick={toAllTweets}>Dwitter</roof.Title>
        {username && (
          <roof.Username onClick={toMyTweets}>@{username}</roof.Username>
        )}
      </roof.Logo>
      {username && (
        <roof.Menu>
          <roof.Button onClick={toProfile}>
            <FontAwesomeIcon icon={faUser} />
          </roof.Button>
          <roof.Button onClick={toLogout}>
            <FontAwesomeIcon icon={faSignOutAlt} />
          </roof.Button>
        </roof.Menu>
      )}
    </roof.Header>
  );
};

export default Header;
