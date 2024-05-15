import React from 'react';
import ReactComponent from '../assets/profile-Logo.png';
import ReactComponent1 from '../assets/trash.png';
import SearchBar from '../components/SearchBar';
import NavBar from '../components/Navbar';

const Cars: React.FC = () => {
    return (
        <div className='bg-white'>
            <div className='mt-5'>
            <SearchBar/>
            </div>
            <div className="flex flex-col items-center p-8 bg-gray-200 w-3/4 md:w-3/4 lg:w-1/2 xl:w-1/3 mx-auto mt-8 md:px-4 lg:px-8 xl:px-12 py-12 rounded-lg h-[150vw]">
                <img src={ReactComponent} alt="profile" className="w-24 h-24 rounded-full" />
                <div className="flex flex-col gap-2 mt-4 wd justify-center">
                    <button className="bg-white text-gray-400 font-bold py-4 px-8 rounded-lg shadow-lg flex items-center">
                        IS00AAA 
                        <img src={ReactComponent1} alt="trash icon" className="w-12 h-12 ml-2" />
                    </button>
                    
                    <button className="bg-purple-500 text-white font-bold py-2 px-12 rounded mt-[30vw] shadow-lg">Add Car</button>
                </div>
            </div>
            <div className='mt-6'>
                <NavBar/>
            </div>
        </div>
    );
};

export default Cars;
