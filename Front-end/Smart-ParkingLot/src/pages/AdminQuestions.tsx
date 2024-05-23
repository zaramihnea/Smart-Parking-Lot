import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';

const AdminQuestions: React.FC = () => {
  const initialQuestions = [
    { id: 1, question: 'How many cars can I add?', answer: '' },
    { id: 2, question: 'Where is th map?', answer: '' },
    { id: 3, question: 'How can i reserve a spot?', answer: '' }
  ];

  const [questions, setQuestions] = useState(initialQuestions);
  const [answeredQuestions, setAnsweredQuestions] = useState<string[]>([]);
  const navigate = useNavigate();

  const handleAnswerChange = (id: number, answer: string) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, answer } : q));
  };

  const handleSendAnswer = (id: number) => {
    const question = questions.find(q => q.id === id);
    if (question) {
      // Implement your send answer logic here (e.g., send to backend)
      console.log(`Answer sent for question ${id}: ${question.answer}`);
      setAnsweredQuestions([...answeredQuestions, `Answer sent for question: ${question.question}`]);
      setQuestions(questions.filter(q => q.id !== id));
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
      <div className="flex-grow p-4">
        <SearchBar placeholder="Search for parking spot" />
        <div className="mt-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-purple-500">Pending Questions</h1>
          <button
            onClick={() => navigate(-1)} // Correcting the back navigation
            className="px-4 py-2 bg-purple-600 text-white font-bold rounded-lg shadow-md hover:bg-purple-700 transition duration-300"
          >
            Back
          </button>
        </div>
        <div className="mt-6 max-w-md mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
          {questions.map(q => (
            <div key={q.id} className="mb-4">
              <div className="bg-gray-700 p-4 rounded-lg shadow-md mb-2">
                <p className="text-white">{q.question}</p>
              </div>
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="Send answer"
                  value={q.answer}
                  onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                  className="flex-grow px-4 py-2 bg-gray-700 text-white rounded-lg shadow-md focus:outline-none focus:bg-gray-600"
                />
                <button
                  onClick={() => handleSendAnswer(q.id)}
                  className="ml-2 px-4 py-2 bg-purple-600 text-white font-bold rounded-lg shadow-md hover:bg-purple-700 transition duration-300"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-9.608 9.608a.708.708 0 01-1.252-.504V3.728a.708.708 0 011.252-.504l9.608 9.608a.708.708 0 010 1.008z" /></svg>
                </button>
              </div>
            </div>
          ))}
          {answeredQuestions.map((msg, index) => (
            <div key={index} className="bg-green-600 p-4 rounded-lg shadow-md mb-2">
              <p className="text-white">{msg}</p>
            </div>
          ))}
        </div>
      </div>
      <Navbar />
    </div>
  );
};

export default AdminQuestions;
