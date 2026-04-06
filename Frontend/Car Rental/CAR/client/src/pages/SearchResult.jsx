import React from 'react';
import { useLocation } from 'react-router-dom';

const SearchResults = () => {
  const location = useLocation();
  const { cars = [], query = '' } = location.state || {};

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Search Results for "{query}"
      </h1>
      {cars.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cars.map((car) => (
            <div key={car.id} className="border rounded-lg p-4 shadow">
              <h2 className="text-lg font-semibold">{car.brand} {car.model}</h2>
              <p>Year: {car.year}</p>
              <p>Price: ${car.price}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No cars found.</p>
      )}
    </div>
  );
};

export default SearchResults;
