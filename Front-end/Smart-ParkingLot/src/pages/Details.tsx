import React from 'react';
import ReactComponent from '../assets/profile-Logo.png';
import SearchBar from '../components/SearchBar';
import NavBar from '../components/Navbar';

const Profiles: React.FC = () => {
    return (
        <div className='bg-white'>
            <div className='mt-5'>
            <SearchBar/>
            </div>
            <div className="flex flex-col items-center p-4 bg-gray-200 w-3/4 md:w-3/4 lg:w-1/2 xl:w-1/3 mx-auto mt-8 md:px-4 lg:px-8 xl:px-12 rounded-lg">
                <img src={ReactComponent} alt="profile" className="w-24 h-24 rounded-full" />
                <div className="flex flex-col gap-4 mt-4 wd justify-center">
                    <button className="bg-white text-gray-400 font-bold py-4 px-12 rounded-lg shadow-lg">Name</button>
                    <button className="bg-white text-gray-400 font-bold py-4 px-12 rounded-lg shadow-lg">Address</button>
                    <button className="bg-white text-gray-400 font-bold py-4 px-12 rounded-lg shadow-lg">Country</button>
                    <button className="bg-white text-gray-400 font-bold py-4 px-12 rounded-lg shadow-lg">Phone Number</button>
                    <button className="bg-white text-gray-400 font-bold py-4 px-12 rounded-lg shadow-lg">Email</button>
                    <button className="bg-purple-500 text-white font-bold py-2 px-12 rounded-lg mt-8 shadow-lg">Confirm</button>
                </div>
            </div>
            <div className='mt-6'>
                <NavBar/>
            </div>
        </div>
    );
};

export default Profiles;
