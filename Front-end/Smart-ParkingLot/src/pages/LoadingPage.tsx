import  { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import loadingGif from '../assets/animation.gif'; 

export default function LoadingPage() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      const searchParams = new URLSearchParams(location.search);
      const query = searchParams.get('query');
      navigate(`/results?query=${query}`);
    }, 3000);

    return () => clearTimeout(timer);
  }, [location, navigate]);

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen bg-gray-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <img src={loadingGif} alt="Loading" className="w-40 h-35" />
      <p className="text-xl mt-4">Picking the best spot for you...</p>
    </motion.div>
  );
}
