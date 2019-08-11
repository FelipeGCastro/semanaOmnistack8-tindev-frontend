import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { Link } from "react-router-dom";

import api from "../../services/api";

import logo from "../../assets/logo.svg";
import like from "../../assets/like.svg";
import dislike from "../../assets/dislike.svg";
import itsamatch from "../../assets/itsamatch.png";

import {
  Container,
  MainLogo,
  DevContainer,
  DevBox,
  DevImage,
  DevInfo,
  DevName,
  DevDescription,
  DevButtons,
  DevButton,
  NothingToShow,
  MatchContainer,
  MatchLogo,
  MatchAvatar,
  MatchName,
  MatchBio,
  MatchCloseButton
} from "./styles";

const Main = ({ match }) => {
  const [users, setUsers] = useState([]);
  const [matchDev, setMatchDev] = useState(null);

  useEffect(() => {
    async function loadUsers() {
      const response = await api.get("/devs", {
        headers: { user: match.params.id }
      });
      setUsers(response.data);
    }
    loadUsers();
  }, [match.params.id]);

  useEffect(() => {
    const socket = io("http://localhost:3333", {
      query: { user: match.params.id }
    });
    socket.on("match", dev => {
      setMatchDev(dev);
    });
  }, [match.params.id]);

  async function handleLike(id) {
    await api.post(`/devs/${id}/likes`, null, {
      headers: { user: match.params.id }
    });

    setUsers(users.filter(user => user._id !== id));
  }
  async function handleDislike(id) {
    await api.post(`/devs/${id}/dislikes`, null, {
      headers: { user: match.params.id }
    });

    setUsers(users.filter(user => user._id !== id));
  }
  return (
    <Container>
      <Link to="/">
        <MainLogo src={logo} alt="Tindev" />
      </Link>

      {users.length > 0 ? (
        <DevContainer>
          {users.map(user => (
            <DevBox key={user._id}>
              <DevImage src={user.avatar} alt={user.name} />
              <DevInfo>
                <DevName>{user.name}</DevName>
                <DevDescription>{user.bio}</DevDescription>
              </DevInfo>
              <DevButtons>
                <DevButton
                  onClick={() => handleDislike(user._id)}
                  type="button"
                >
                  <img src={dislike} alt="dislike" />
                </DevButton>
                <DevButton onClick={() => handleLike(user._id)} type="button">
                  <img src={like} alt="like" />
                </DevButton>
              </DevButtons>
            </DevBox>
          ))}
        </DevContainer>
      ) : (
        <NothingToShow>Acabou :(</NothingToShow>
      )}
      {matchDev && (
        <MatchContainer>
          <MatchLogo src={itsamatch} alt="It's a Match" />
          <MatchAvatar src={matchDev.avatar} alt={matchDev.name} />
          <MatchName>{matchDev.name}</MatchName>
          <MatchBio>{matchDev.bio}</MatchBio>
          <MatchCloseButton onClick={() => setMatchDev(null)}>
            Fechar
          </MatchCloseButton>
        </MatchContainer>
      )}
    </Container>
  );
};

export default Main;
