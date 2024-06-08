import React, { useState } from 'react';
import { FaQuestionCircle, FaFileAlt, FaBell } from 'react-icons/fa';
import SearchBar from '../components/SearchBar';
import Navbar from '../components/Navbar';

const HelpPage: React.FC = () => {
    const [view, setView] = useState<string>('main');

    const renderContent = () => {
        switch (view) {
            case 'faq':
                return <FAQ goBack={() => setView('main')} />;
            case 'terms':
                return <TermsAndConditions goBack={() => setView('main')} />;
            case 'emergency':
                return <Emergency goBack={() => setView('main')} />;
            default:
                return <MainView setView={setView} />;
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <div className="sticky top-0 z-50 w-full p-4 bg-gray-100 dark:bg-gray-900">
                <SearchBar placeholder="Search for parking spot" />
            </div>
            <div className="flex flex-col items-center flex-grow p-4 mb-16">
                <div className="w-full max-w-4xl p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                    {renderContent()}
                </div>
            </div>
            <Navbar />
        </div>
    );
};

const MainView: React.FC<{ setView: (view: string) => void }> = ({ setView }) => (
    <>
        <h2 className="text-3xl font-bold text-purple-500 mb-4">Get help</h2>
        <div className="space-y-4">
            <div className="flex items-center p-4 bg-gray-300 dark:bg-gray-700 rounded-lg shadow-md cursor-pointer" onClick={() => setView('faq')}>
                <FaQuestionCircle className="text-purple-600 mr-4" size={24} />
                <span className="text-lg">FAQ</span>
            </div>
            <div className="flex items-center p-4 bg-gray-300 dark:bg-gray-700 rounded-lg shadow-md cursor-pointer" onClick={() => setView('terms')}>
                <FaFileAlt className="text-purple-600 mr-4" size={24} />
                <span className="text-lg">Terms and conditions</span>
            </div>
            <div className="flex items-center p-4 bg-gray-300 dark:bg-gray-700 rounded-lg shadow-md cursor-pointer" onClick={() => setView('emergency')}>
                <FaBell className="text-purple-600 mr-4" size={24} />
                <span className="text-lg">Emergency</span>
            </div>
        </div>
    </>
);

const BackButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
    <button
        onClick={onClick}
        className="text-purple-600 border border-purple-600 rounded px-4 py-2 hover:bg-purple-600 hover:text-white transition duration-300"
    >
        Back
    </button>
);

const FAQ: React.FC<{ goBack: () => void }> = ({ goBack }) => {
    const [openQuestions, setOpenQuestions] = useState<number[]>([]);

    const toggleQuestion = (index: number) => {
        setOpenQuestions(prev => 
            prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
        );
    };

    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">FAQ</h1>
                <BackButton onClick={goBack} />
            </div>
            <p>Here you will find information about our smart parking solution, how it works, and answers to common questions.</p>
            <ul className="list-disc ml-5 mt-2 space-y-4">
                <li onClick={() => toggleQuestion(1)} className="cursor-pointer">
                    How does the parking detection work?
                    {openQuestions.includes(1) && (
                        <p className="ml-4 mt-2 mb-4 text-gray-700 dark:text-gray-300">The parking detection uses sensors and GPS data to identify whether a parking spot is occupied or free.</p>
                    )}
                </li>
                <li onClick={() => toggleQuestion(2)} className="cursor-pointer">
                    What data is used to identify parking spots?
                    {openQuestions.includes(2) && (
                        <p className="ml-4 mt-2 mb-4 text-gray-700 dark:text-gray-300">We use a combination of sensor data, GPS data, and heuristics to determine the status of parking spots.</p>
                    )}
                </li>
                <li onClick={() => toggleQuestion(3)} className="cursor-pointer">
                    How can I reserve a parking spot?
                    {openQuestions.includes(3) && (
                        <p className="ml-4 mt-2 mb-4 text-gray-700 dark:text-gray-300">You can reserve a parking spot through our web application by selecting a pin on the map, choosing the start date, time, and number of hours for the reservation, and then completing the payment.</p>
                    )}
                </li>
                <li onClick={() => toggleQuestion(4)} className="cursor-pointer">
                    What happens if I don't arrive at the reserved spot?
                    {openQuestions.includes(4) && (
                        <p className="ml-4 mt-2 mb-4 text-gray-700 dark:text-gray-300">If you do not arrive at the reserved spot within the allocated time, the reservation will be canceled and the spot will be made available to other users.</p>
                    )}
                </li>
                <li onClick={() => toggleQuestion(5)} className="cursor-pointer">
                    Can I see parking availability in real-time?
                    {openQuestions.includes(5) && (
                        <p className="ml-4 mt-2 mb-4 text-gray-700 dark:text-gray-300">Yes, our application provides real-time updates on parking availability using data from sensors and GPS.</p>
                    )}
                </li>
            </ul>
        </>
    );
};

const TermsAndConditions: React.FC<{ goBack: () => void }> = ({ goBack }) => (
    <>
        <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Terms and Conditions</h1>
            <BackButton onClick={goBack} />
        </div>
        <p>By using our application, you agree to the following terms and conditions...</p>
        <p>1. You must have a registered account to use the reservation system.</p>
        <p>2. Data collected from GPS and sensors will be used to provide accurate parking availability.</p>
        <p>3. Users are responsible for ensuring they have sufficient time to reach their reserved parking spot.</p>
        <p>4. The application provides suggestions based on real-time data and heuristics, but availability cannot be guaranteed.</p>
    </>
);

const Emergency: React.FC<{ goBack: () => void }> = ({ goBack }) => (
    <>
        <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Emergency</h1>
            <BackButton onClick={goBack} />
        </div>
        <p>If you have an emergency related to your parking experience, please contact our support team immediately:</p>
        <p>Phone: 0733182991</p>
        <p>Email: contact.smartparkinglot@gmail.com</p>
        <p>We also recommend following these steps if you encounter issues:</p>
        <ul className="list-disc ml-5 mt-2">
            <li>Ensure your vehicle is in a safe location.</li>
            <li>Contact local authorities if necessary.</li>
            <li>Use the app's emergency contact feature to notify our team.</li>
        </ul>
    </>
);

export default HelpPage;
