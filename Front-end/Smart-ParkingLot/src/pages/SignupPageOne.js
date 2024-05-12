// SignupPageOne.js
import React from 'react';
import { SignupContainer, SignupForm, Input, SubmitButton, Title, BackLink } from '../components/SignupStyles';

const SignupPageOne = ({ onNext }) => {
    const handleSubmit = (e) => {
        e.preventDefault(); 
        
        onNext();  
    };

    return (
        <SignupContainer>
            <SignupForm onSubmit={handleSubmit}>
                <Title>Sign up</Title>
                <Input type="email" placeholder="Email" required />
                <Input type="text" placeholder="Username" required />
                <Input type="password" placeholder="Password" required />
                <Input type="password" placeholder="Confirm Password" required />
                <SubmitButton type="submit " onClick={onNext}>Next</SubmitButton>
                <BackLink to="/login">Back to login</BackLink>
            </SignupForm>
        </SignupContainer>
    );
};

export default SignupPageOne;
