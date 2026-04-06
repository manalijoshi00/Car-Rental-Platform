import React, { useState } from 'react';
import Title from '../../components/owner/Title';
import { assets } from '../../assets/assets';

const AddCar = () => {
  const currency = import.meta.env.VITE_CURRENCY;
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [car, setCar] = useState({
    brand: '',
    model: '',
    year: 0,
    pricePerDay: 0,
    category: '',
    transmission: '',
    fuel_type: '',
    seating_capacity: 0,
    location: '',
    description: '',
  });

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Get owner ID from localStorage
      const ownerId = localStorage.getItem('userId');
      if (!ownerId) {
        alert('Please login first');
        return;
      }

      // Prepare car data
      const carData = {
        ...car,
        owner: ownerId,
        isAvailable: true,
        createdAt: new Date().toISOString()
      };

      // For now, we'll use a placeholder image URL since image upload endpoint doesn't exist
      // You can implement image upload in your Spring Boot backend later
      if (image) {
        carData.image = "https://images.unsplash.com/photo-1633332755192-727a95c4013d?q=80&w=300";
      }

      // Save car to Spring Boot backend
      const response = await fetch('http://localhost:8080/api/cars', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(carData),
      });

      if (response.ok) {
        const result = await response.json();
        alert('Car added successfully!');
        
        // Reset form
        setCar({
          brand: '',
          model: '',
          year: 0,
          pricePerDay: 0,
          category: '',
          transmission: '',
          fuel_type: '',
          seating_capacity: 0,
          location: '',
          description: '',
        });
        setImage(null);
      } else {
        const errorData = await response.text();
        alert('Error saving car: ' + errorData);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Network error: Unable to connect to server. Please check if your Spring Boot backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='px-4 py-10 md:px-10 flex-1'>
      <Title
        title="Add New Car"
        subTitle="Fill in details to list a new car for booking, including pricing, availability and car specifications."
      />

      <form
        onSubmit={onSubmitHandler}
        className='flex flex-col gap-5 text-gray-500 text-sm mt-6 max-w-xl'
      >
        {/* car image */}
        <div className='flex items-center gap-2 w-full'>
          <label htmlFor="car-image">
            <img
              src={image ? URL.createObjectURL(image) : assets.upload_icon}
              alt=""
              className='h-14 rounded cursor-pointer'
            />
            <input
              type="file"
              id="car-image"
              accept='image/*'
              hidden
              onChange={e => setImage(e.target.files[0])}
            />
          </label>
          <p className='text-sm text-gray-500'>Upload a picture of your car</p>
        </div>

        {/* car brand and model */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='flex flex-col w-full'>
            <label>Brand</label>
            <input
              type="text"
              placeholder='e.g. BMW, Mercedes, Audi'
              required
              className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none'
              value={car.brand}
              onChange={e => setCar({ ...car, brand: e.target.value })}
            />
          </div>
          <div className='flex flex-col w-full'>
            <label>Model</label>
            <input
              type="text"
              placeholder='e.g. X5, E-Class, M4'
              required
              className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none'
              value={car.model}
              onChange={e => setCar({ ...car, model: e.target.value })}
            />
          </div>
        </div>

        {/* car year, price, category */}
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
          <div className='flex flex-col w-full'>
            <label>Year</label>
            <input
              type="number"
              placeholder='2025'
              required
              min="1900"
              max="2030"
              className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none'
              value={car.year}
              onChange={e => setCar({ ...car, year: Number(e.target.value) })}
            />
          </div>
          <div className='flex flex-col w-full'>
            <label>Daily Price ({currency})</label>
            <input
              type="number"
              placeholder='100'
              required
              min="1"
              className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none'
              value={car.pricePerDay}
              onChange={e => setCar({ ...car, pricePerDay: Number(e.target.value) })}
            />
          </div>
          <div className='flex flex-col w-full'>
            <label>Category</label>
            <select
              onChange={e => setCar({ ...car, category: e.target.value })}
              value={car.category}
              required
              className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none'
            >
              <option value="">Select a category</option>
              <option value="Sedan">Sedan</option>
              <option value="SUV">SUV</option>
              <option value="Van">Van</option>
              <option value="Hatchback">Hatchback</option>
              <option value="Coupe">Coupe</option>
              <option value="Convertible">Convertible</option>
            </select>
          </div>
        </div>

        {/* car transmission, fuel type, seating capacity */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='flex flex-col w-full'>
            <label>Transmission</label>
            <select
              onChange={e => setCar({ ...car, transmission: e.target.value })}
              value={car.transmission}
              required
              className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none'
            >
              <option value="">Select a Transmission</option>
              <option value="Automatic">Automatic</option>
              <option value="Manual">Manual</option>
              <option value="Semi-Automatic">Semi-Automatic</option>
            </select>
          </div>
          <div className='flex flex-col w-full'>
            <label>Fuel Type</label>
            <select
              onChange={e => setCar({ ...car, fuel_type: e.target.value })}
              value={car.fuel_type}
              required
              className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none'
            >
              <option value="">Select a Fuel Type</option>
              <option value="Gas">Gas</option>
              <option value="Diesel">Diesel</option>
              <option value="Petrol">Petrol</option>
              <option value="Electric">Electric</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>
          <div className='flex flex-col w-full'>
            <label>Seating Capacity</label>
            <input
              type="number"
              placeholder='4'
              required
              min="1"
              max="12"
              className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none'
              value={car.seating_capacity}
              onChange={e => setCar({ ...car, seating_capacity: Number(e.target.value) })}
            />
          </div>
        </div>

        {/* car location */}
        <div className='flex flex-col w-full'>
          <label>Location</label>
          <select
            onChange={e => setCar({ ...car, location: e.target.value })}
            value={car.location}
            required
            className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none'
          >
            <option value="">Select a Location</option>
            <option value="New York">New York</option>
            <option value="Los Angeles">Los Angeles</option>
            <option value="Houston">Houston</option>
            <option value="Chicago">Chicago</option>
            <option value="Miami">Miami</option>
            <option value="Seattle">Seattle</option>
          </select>
        </div>

        {/* car description */}
        <div className='flex flex-col w-full'>
          <label>Description</label>
          <textarea
            rows={5}
            placeholder='e.g. A Luxurious SUV with a spacious interior and a powerful engine'
            required
            className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none'
            value={car.description}
            onChange={e => setCar({ ...car, description: e.target.value })}
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`flex items-center gap-2 px-4 py-2.5 mt-4 bg-primary text-white rounded-md font-medium w-max cursor-pointer ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Adding Car...
            </>
          ) : (
            <>
              <img src={assets.tick_icon} alt="" />
              List Your Car
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default AddCar;
