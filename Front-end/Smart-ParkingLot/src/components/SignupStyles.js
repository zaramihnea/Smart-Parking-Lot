// SignupStyles.js
import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const SignupContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(to right, #e6e9f0, #eef1f5); // Gradient subtil de griuri calde pentru light mode

  @media (prefers-color-scheme: dark) {
    background: linear-gradient(to right, #333333, #262626); // Background pentru dark mode
  }
`;

export const SignupForm = styled.div`
  width: 80%;
  max-width: 360px;
  padding: 48px 24px;
  background: #FFFFFF; // Fundal alb pentru formular
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1); // Umbră subtilă
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (prefers-color-scheme: dark) {
    background: #3A3A3A; // Schimbă fundalul pentru dark mode
    color: #FFFFFF; // Schimbă textul în alb pentru dark mode
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3); // Umbra mai accentuată pentru dark mode
  }
`;

export const Input = styled.input`
  width: 100%;
  max-width: 280px;
  padding: 12px 20px;
  margin-bottom: 20px;
  background: #FAFAFA;
  border: 1px solid #DDD;
  border-radius: 12px;
  font-size: 16px;

  @media (prefers-color-scheme: dark) {
    background: #333333; // Schimbă fundalul inputurilor pentru dark mode
    border-color: #555; // Schimbă culoarea bordurii pentru dark mode
    color: #DDD; // Schimbă culoarea textului pentru dark mode
  }
`;

export const SubmitButton = styled.button`
  width: 100%;
  max-width: 280px;
  padding: 16px 0;
  background-color: #685FDA;
  color: white;
  font-size: 16px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #5741d9;
  }

  @media (prefers-color-scheme: dark) {
    background-color: #7a6ff0; // Butonul mai luminos în dark mode
    &:hover {
      background-color: #6f61d8; // Schimbă culoarea la hover pentru dark mode
    }
  }
`;

export const Title = styled.h1`
  font-size: 2.5rem;
  color: #7167EE;
  margin-bottom: 36px;

  @media (prefers-color-scheme: dark) {
    color: #8888ff; // Schimbă culoarea titlului pentru dark mode
  }
`;

export const BackLink = styled(Link)`
  color: #7167EE;
  font-size: 14px;
  text-decoration: none;
  margin-top: 10px;

  &:hover {
    text-decoration: underline;
  }

  @media (prefers-color-scheme: dark) {
    color: #9a9cff; // Link-uri mai luminoase pentru dark mode
    &:hover {
      color: #bcbcff; // Schimbă culoarea la hover pentru dark mode
    }
  }
`;
