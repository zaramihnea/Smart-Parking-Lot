// SignupPage.js
import React, { useState } from 'react';
import SignupPageOne from './SignupPageOne';
import SignupPageTwo from './SignupPageTwo';

const SignupPage = () => {
    const [step, setStep] = useState(1);

    const handleNext = () => {
        console.log("Moving to step 2"); 
        setStep(2);  
    };

    const handleSignup = () => {
        console.log("User registered.");
    };

    const handleBackToFirstStep = () => {
        setStep(1); 
    };

    return (
        <>
            {step === 1 ? (
                <SignupPageOne onNext={handleNext} />
            ) : (
                <SignupPageTwo onSignup={handleSignup} onBack={handleBackToFirstStep} />
            )}
        </>
    );
};

export default SignupPage;
