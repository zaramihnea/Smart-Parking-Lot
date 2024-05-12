import React from 'react';
import {
  LoginContainer,
  LoginForm,
  Title,
  Input,
  LoginButton,
  StyledLink
} from '../components/LoginFormStyles'; 

const LoginPage = () => {
  return (
    <LoginContainer>
      <LoginForm>
        <Title>Login</Title>
        <Input type="text" placeholder="email/username" />
        <Input type="password" placeholder="password" />
        <LoginButton>Login</LoginButton>
        <StyledLink to="/forgot-password">Forgot password?</StyledLink>
        <StyledLink to="/signup">Don't have an account? Sign up</StyledLink>
      </LoginForm>
    </LoginContainer>
  );
};

export default LoginPage;
