import React from 'react';
import SearchBar from '../components/SearchBar';
import NavBar from '../components/Navbar';

const Messages: React.FC = () => {
    return (
        <div className='bg-white'>
            <div className='mt-5'>
            <SearchBar/>
            </div>
            <div className="flex flex-col items-center p-4 bg-gray-200 w-3/4 md:w-3/4 lg:w-1/2 xl:w-1/3 mx-auto mt-16 md:mt-24 md:px-4 lg:px-8 xl:px-12 h-[70vh] rounded-lg">
                <div className="flex flex-col gap-4 mt-4 wd justify-center">
                    <button className="bg-white text-gray-400 font-bold py-4 px-12 rounded-lg shadow-lg">No messages yet...</button>
        
                    <button className="bg-purple-500 text-white font-bold py-2 px-12 rounded-lg mt-[45vh] shadow-lg">Confirm</button>

                </div>
            </div>
            <div className='mt-6'>
                <NavBar/>
            </div>
        </div>
    );
};

export default Messages;
