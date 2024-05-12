import React from 'react';
import {
  ForgotPasswordContainer,
  ForgotPasswordForm,
  Title,
  Input,
  SubmitButton,
  BackLink
} from '../components/ForgotPasswordStyles'; 

const ForgotPasswordPage = () => {
  return (
    <ForgotPasswordContainer>
      <ForgotPasswordForm>
        <Title>Forgot password</Title>
        <Input type="text" placeholder="email/username" />
        <SubmitButton>Submit</SubmitButton>
        <BackLink to="/login">Back to login</BackLink>
      </ForgotPasswordForm>
    </ForgotPasswordContainer>
  );
};

export default ForgotPasswordPage;
