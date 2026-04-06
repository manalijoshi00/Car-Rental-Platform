import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import CarCard from '../components/CarCard';
import Loader from '../components/Loader';

const Cars = () => {
  const location = useLocation();
  const [input, setInput] = useState('');
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch cars from backend
  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        
        // Check if search results passed via navigation state
        if (location.state?.cars) {
          setCars(location.state.cars);
          setInput(location.state.query || '');
          setLoading(false);
          return;
        }

        // Fetch all cars from backend (proxied via Vite)
        const response = await fetch('/api/cars');
        if (!response.ok) {
          throw new Error('Failed to fetch cars');
        }
        
        const data = await response.json();
        setCars(data);
        setError('');
      } catch (err) {
        console.error('Error fetching cars:', err);
        setError('Failed to load cars. Please try again later.');
        setCars([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, [location.state]);

  // Filter cars by search input
  const filteredCars = cars.filter((car) =>
    `${car.brand} ${car.model}`.toLowerCase().includes(input.toLowerCase())
  );

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      {/* Header & Search */}
      <div className='flex flex-col items-center py-20 bg-light max-md:px-4'>
        <Title
          title='Available Cars'
          subTitle='Browse our selection of premium vehicles available for your next adventure'
        />

        {/* Search Bar */}
        <div className='flex items-center bg-white px-4 mt-6 max-w-140 w-full h-12 rounded-full shadow'>
          <img src={assets.search_icon} className='w-4.5 h-4.5 mr-2' alt='Search' />
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            type='text'
            placeholder='Search by make, model, or features'
            className='w-full h-full outline-none text-gray-500'
          />
          <img src={assets.filter_icon} className='w-4.5 h-4.5 ml-2' alt='Filter' />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className='px-6 md:px-16 lg:px-24 xl:px-32 mt-10'>
          <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded xl:px-20 max-w-7xl mx-auto'>
            {error}
          </div>
        </div>
      )}

      {/* Result Count */}
      <div className='px-6 md:px-16 lg:px-24 xl:px-32 mt-10'>
        <p className='text-gray-500 xl:px-20 max-w-7xl mx-auto'>
          Showing {filteredCars.length} {filteredCars.length === 1 ? 'car' : 'cars'}
        </p>
      </div>

      {/* Car Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4 xl:px-20 max-w-7xl mx-auto px-4'>
        {filteredCars.length > 0 ? (
          filteredCars.map((car, index) => (
            <CarCard key={car.carId || index} car={car} />
          ))
        ) : (
          <p className='text-center col-span-full text-gray-500'>
            {error ? 'Unable to load cars.' : 'No cars found.'}
          </p>
        )}
      </div>
    </div>
  );
};

export default Cars;
