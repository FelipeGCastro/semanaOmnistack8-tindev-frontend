import React, { useState } from "react";
import logo from "../../assets/logo.svg";

import api from "../../services/api";

import {
  Container,
  LoginContainer,
  LoginLogo,
  LoginInput,
  LoginButton
} from "./styles";

export default function Login({ history }) {
  const [username, setUsername] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await api.post("/devs", { username });
      const { _id } = response.data;
      history.push(`/dev/${_id}`);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Container>
      <LoginContainer onSubmit={handleSubmit}>
        <LoginLogo src={logo} alt="Tindev" />
        <LoginInput
          placeholder="Digite seu usuário no Github"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <LoginButton type="submit">Enviar</LoginButton>
      </LoginContainer>
    </Container>
  );
}
