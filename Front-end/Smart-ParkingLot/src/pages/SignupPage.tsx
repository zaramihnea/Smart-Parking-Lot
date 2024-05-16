import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const SignupPage: React.FC = () => {
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');

    const [fname, setFname] = useState('');
    const [lname, setLname] = useState('');
    const [dob, setDob] = useState('');
    const [country, setCountry] = useState('');
    const [city, setCity] = useState('');

    //temp vars to send to backend for database query
    const [tempEmail, setTempEmail] = useState('');
    const [tempPassword, setTempPassword] = useState('');
    const [tempUsername, setTempUsername] = useState('');

    //refs html
    const emailInputRef = useRef<HTMLInputElement>(null);
    const passwordInputRef = useRef<HTMLInputElement>(null);
    const passwordConfirmInputRef = useRef<HTMLInputElement>(null);
    const usernameInputRef = useRef<HTMLInputElement>(null);

    //popup errors
    const [showInvalidEmailPopup, setShowInvalidEmailPopup] = useState(false);
    const [showInvalidPasswordPopup, setShowInvalidPasswordPopup] = useState(false);
    const [showInvalidPasswordConfirmPopup, setShowInvalidPasswordConfirmPopup] = useState(false);
    const [showNamePopup, setShowNamePopup] = useState(false);
    const [showUsernamePopup, setShowUsernamePopup] = useState(false);
    const [errorMessage, setUIErrorMessage] = useState('');

    const handleNext = () => {
        if (isValidEmail(email)) {
            if (isValidUsername(username)) {
                if (isValidPassword(password)) {
                    if (password === passwordConfirm) {
                        console.log("Moving to step 2");
                        setStep(2);
                        setTempEmail(email);
                        setTempPassword(password);
                        setTempUsername(username);
                        if (emailInputRef.current) emailInputRef.current.value = '';
                        if (passwordInputRef.current) passwordInputRef.current.value = '';
                        if (passwordConfirmInputRef.current) passwordConfirmInputRef.current.value = '';
                        if (usernameInputRef.current) usernameInputRef.current.value = '';
                        setShowInvalidPasswordConfirmPopup(false);
                    } else {
                        setShowInvalidPasswordConfirmPopup(true);
                    }
                } else {
                    setShowInvalidPasswordPopup(true);
                }
            } else {
                setShowUsernamePopup(true);
            }
            setShowInvalidEmailPopup(false);
        } else {
            setShowInvalidEmailPopup(true);
        }
    };

    const formatDate = (dateString: string): string => {
        const [year, month, day] = dateString.split('-');
        const formattedDate = `${parseInt(day)}-${parseInt(month)}-${year}`;
        return formattedDate;
    };

    const handleSignup = async () => {
        if (fname && lname && dob && country && city) {
            console.log("Sending data to backend:", tempEmail, tempPassword, tempUsername, fname, lname, dob, country, city);
    
            if (fname && lname && dob && country && city) {
                console.log("Sending data to backend:", tempEmail, tempPassword, tempUsername, fname, lname, dob, country, city);
    
                try {
                    const response = await fetch('http://localhost:8081/user/register', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            email: tempEmail,
                            password: tempPassword,
                            username: tempUsername,
                            dob: formatDate(dob),
                            country: country,
                            city: city,
                        }),
                    });
    
                    console.log(JSON.stringify({
                        email: tempEmail,
                        password: tempPassword,
                        username: tempUsername,
                        dob: formatDate(dob),
                        country: country,
                        city: city,
                    }));
    
                    if (response.ok) {
                        const data = await response.text();
                        console.log("Registration successful:", data);
                        navigate('/home');
                    } else {
                        const errorData = await response.text();
                        console.error("Registration failed:", errorData);
                        setUIErrorMessage(errorData); // Set the error message state
                    }
                } catch (error) {
                    console.error("Error during registration:", error);
                    setUIErrorMessage('An unexpected error occurred. Please try again.'); // Set a generic error message
                }
            } else {
                setShowNamePopup(true);
            }
    
    
        } else {
            setShowNamePopup(true);
        }
    };

    const handleBackToFirstStep = () => {
        setStep(1);
        setEmail(tempEmail);
        if (passwordInputRef.current) passwordInputRef.current.value = '';
        if (passwordConfirmInputRef.current) passwordConfirmInputRef.current.value = '';
        setShowInvalidEmailPopup(false);
        setShowInvalidPasswordConfirmPopup(false);
    };

    const isValidEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const isValidPassword = (password: string) => {
        // Regular expressions for password requirements
        const uppercaseRegex = /[A-Z]/;
        const numberRegex = /[0-9]/;
        const specialCharacterRegex = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;
        // Test the input password against the regular expressions
        return (
            password.length >= 5 &&
            uppercaseRegex.test(password) &&
            numberRegex.test(password) &&
            specialCharacterRegex.test(password)
        );
    };

    const isValidUsername = (username: string) => {
        return username.length > 4;
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="relative">
                <div className="absolute inset-0 transform translate-x-2 translate-y-2 bg-purple-600 rounded-lg shadow-lg"></div>
                <div className="relative w-80 max-w-md p-12 bg-gray-300 dark:bg-gray-800 text-gray-900 dark:text-white shadow-lg rounded-lg">
                    <h1 className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-8 text-center">Sign Up</h1>
                    {step === 1 ? (
                        <>
                            <input
                                type="text"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                ref={emailInputRef}
                                className="w-full max-w-xs px-4 py-2 mb-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:border-purple-500"
                            />
                            {showInvalidEmailPopup && <div className="text-red-500 text-sm mb-4">Email is not valid</div>}
                            <input
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                ref={usernameInputRef}
                                className="w-full max-w-xs px-4 py-2 mb-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:border-purple-500"
                            />
                            {showUsernamePopup && <div className="text-red-500 text-sm mb-4">Username must be at least 5 characters long!</div>}
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                ref={passwordConfirmInputRef}
                                className="w-full max-w-xs px-4 py-2 mb-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:border-purple-500"
                            />
                            <input
                                type="password"
                                placeholder="Retype password"
                                value={passwordConfirm}
                                onChange={(e) => setPasswordConfirm(e.target.value)}
                                ref={passwordInputRef}
                                className="w-full max-w-xs px-4 py-2 mb-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:border-purple-500"
                            />
                            {showInvalidPasswordPopup && <div className="text-red-500 text-sm mb-4">Password is invalid! (should be 5+ characters and have at least 1 number & one special character) </div>}
                            {showInvalidPasswordConfirmPopup && <div className="text-red-500 text-sm mb-4">Passwords do not match</div>}
                            <button
                                onClick={handleNext}
                                className="w-full max-w-xs px-4 py-2 mb-4 bg-purple-600 text-white font-bold rounded-lg shadow-md hover:bg-purple-700 transition duration-300"
                            > Next </button>
                            <a
                                href="/"
                                className="text-sm text-purple-600 dark:text-purple-400 hover:underline mb-2"
                            > Already have an account? Log in </a>
                        </>
                    ) : (
                        <>
                            <input
                                type="text"
                                placeholder="First Name"
                                value={fname}
                                onChange={(e) => setFname(e.target.value)}
                                className="w-full max-w-xs px-4 py-2 mb-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:border-purple-500"
                            />
                            <input
                                type="text"
                                placeholder="Last Name"
                                value={lname}
                                onChange={(e) => setLname(e.target.value)}
                                className="w-full max-w-xs px-4 py-2 mb-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:border-purple-500"
                            />
                            <input
                                type="date"
                                placeholder="Date of Birth"
                                value={dob}
                                onChange={(e) => setDob(e.target.value)}
                                className="w-56 h-10 px-4 py-2 mb-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:border-purple-500"
                            />
                            <input
                                type="text"
                                placeholder="Country"
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                className="w-full max-w-xs px-4 py-2 mb-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:border-purple-500"
                            />
                            <input
                                type="text"
                                placeholder="City"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                className="w-full max-w-xs px-4 py-2 mb-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:border-purple-500"
                            />
                            {showNamePopup && <div className="text-red-500 text-sm mb-4">All data is required!</div>}
                            {errorMessage && <div className="text-red-500 mt-4">{errorMessage}</div>}                            <button
                                onClick={handleSignup}
                                className="w-full max-w-xs px-4 py-2 mb-4 bg-purple-600 text-white font-bold rounded-lg shadow-md hover:bg-purple-700 transition duration-300"
                            > Sign Up </button>

                            <button
                                onClick={handleBackToFirstStep}
                                className="w-full max-w-xs px-4 py-2 mb-4 bg-purple-600 text-white font-bold rounded-lg shadow-md hover:bg-purple-700 transition duration-300"
                            > Back </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
