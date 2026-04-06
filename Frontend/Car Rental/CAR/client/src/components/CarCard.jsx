import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const CarCard = ({car}) => {
    const currency = import.meta.env.VITE_CURRENCY

    const navigate = useNavigate()

    // Handle image URL - use uploaded image or fallback to default
    const getImageUrl = () => {
        if (car.imageUrl) {
            // If it's a full URL, use it directly
            if (car.imageUrl.startsWith('http')) {
                return car.imageUrl;
            }
            // If it's a relative path, prepend the backend URL; keep absolute if backend serves static
            return `${car.imageUrl.startsWith('/') ? '' : '/'}${car.imageUrl}`;
        }
        // Fallback to a default car image
        return assets.car_image1 || '/default-car.jpg';
    };

  return (
    <div onClick={()=>{navigate(`/car-details/${car.carId}`); scrollTo(0,0)}} className='group rounded-xl overflow-hidden shadow-lg hover:-translate-y-1 transition-all duration-500 cursor-pointer'>
        <div className='relative h-48 overflow-hidden'>
            <img 
                src={getImageUrl()} 
                alt={`${car.brand} ${car.model}`} 
                className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'
                onError={(e) => {
                    // Fallback if image fails to load
                    e.target.src = assets.car_image1 || '/default-car.jpg';
                }}
            />

            <p className='absolute top-4 left-4 bg-primary/90 text-white text-xs px-2.5 py-1 rounded-full'>Available Now</p>

            <div className='absolute bottom-4 right-4 bg-black/80 backrop-blur-sm text-white px-3 py-2 rounded-lg'>
               <span className='text-sm text-white/80'>{currency}{car.dailyPrice}</span>
                <span className='font-semibold'> / day</span>
            </div>
        </div>

        <div className='p-4 sm:p-5'>
            <div className='flex justify-between items-start mb-2'>
                <div>
                    <h3 className='text-lg font-medium'>{car.brand} {car.model}</h3>
                    <p className='text-muted-foreground text-sm'>{car.category} . {car.year}</p>
                </div>

            </div>

            <div className='mt-4 grid grid-cols-2 gap-y-2 text-gray-600'>
                <div className='flex items-center text-sm text-muted-foreground'>
                    <img src={assets.users_icon} alt="" className='h-4 mr-2'/>
                    <span>{car.seatingCapacity} Seats</span>
                </div>
                <div className='flex items-center text-sm text-muted-foreground'>
                    <img src={assets.fuel_icon} alt="" className='h-4 mr-2'/>
                    <span>{car.fuelType}</span>
                </div>
                <div className='flex items-center text-sm text-muted-foreground'>
                    <img src={assets.car_icon} alt="" className='h-4 mr-2'/>
                    <span>{car.transmission}</span>
                </div>

                <div className='flex items-center text-sm text-muted-foreground'>
                    <img src={assets.location_icon} alt="" className='h-4 mr-2'/>
                    <span>{car.location}</span>
                </div>
               

            </div>
             
        </div>
      
    </div>
  )
}

export default CarCard
