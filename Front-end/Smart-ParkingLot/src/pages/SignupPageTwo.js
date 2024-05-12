import React from 'react';
import { SignupContainer, SignupForm, Input, SubmitButton, Title } from '../components/SignupStyles';

const SignupPageTwo = ({ onSignup, onBack }) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        onSignup();
    };

    return (
        <SignupContainer>
            <SignupForm onSubmit={handleSubmit}>
                <Title>Sign up</Title>
                <Input type="text" placeholder="Name" />
                <Input type="date" placeholder="Date of birth" />
                <Input type="text" placeholder="Country" />
                <Input type="text" placeholder="City" />
                <SubmitButton type="submit">Sign up</SubmitButton>
                <SubmitButton onClick={onBack} style={{ marginTop: '10px', textDecoration: 'none', background: 'none', border: 'none', color: '#7167EE', cursor: 'pointer', fontSize: '16px' }}>Back to previous step</SubmitButton>
            </SignupForm>
        </SignupContainer>
    );
};

export default SignupPageTwo;
