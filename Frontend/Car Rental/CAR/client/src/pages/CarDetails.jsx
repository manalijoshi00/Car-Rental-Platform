import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import Loader from '../components/Loader'

const CarDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [car, setCar] = useState(null)
  const [pickupDate, setPickupDate] = useState("")
  const [returnDate, setReturnDate] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const currency = import.meta.env.VITE_CURRENCY || '$'

  // Get logged-in user ID from localStorage
  const loggedInUserId = localStorage.getItem('userId')

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Check if user is logged in
    if (!loggedInUserId) {
      alert("Please log in to book a car")
      navigate('/index.html')
      return
    }

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingDate: pickupDate,
          amount: car.dailyPrice, // Use dailyPrice from your Car entity
          timing: "09:00 AM - 06:00 PM",
          carDetails: `${car.brand} ${car.model}`,
          users: { id: parseInt(loggedInUserId) }, // Use 'id' field from Users entity
          car: { carId: car.carId } // Use carId from your Car entity
        })
      })

      const message = await response.text()
      
      if (response.ok) {
        alert(message)
        navigate("/my-bookings")
      } else {
        alert(message || "Booking failed")
      }
    } catch (error) {
      console.error("Error booking car:", error)
      alert("Error submitting booking")
    }
  }

  useEffect(() => {
    const fetchCar = async () => {
      try {
        setLoading(true)
        console.log('Fetching car with ID:', id)
        
        const response = await fetch(`/api/cars/${id}`)
        if (!response.ok) {
          throw new Error('Car not found')
        }
        
        const carData = await response.json()
        setCar(carData)
        setError('')
      } catch (err) {
        console.error('Error fetching car:', err)
        setError('Car not found or failed to load')
        setCar(null)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchCar()
    }
  }, [id])

  if (loading) {
    return <Loader />
  }

  if (error) {
    return (
      <div className='px-6 md:px-16 lg:px-24 xl:px-32 mt-16 text-center'>
        <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded'>
          {error}
        </div>
        <button
          onClick={() => navigate('/cars')}
          className='mt-4 bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dull'
        >
          Back to Cars
        </button>
      </div>
    )
  }

  return car ? (
    <div className='px-6 md:px-16 lg:p-24 xl:px-32 mt-16'>
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className='flex items-center gap-2 mb-6 text-gray-500 hover:text-gray-800 cursor-pointer'
      >
        <img src={assets.arrow_icon} alt='arrow' className='rotate-180 opacity-65' />
        Back to all cars
      </button>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12'>
        {/* Car Image and Details */}
        <div className='lg:col-span-2'>
          <img
            src={car.imageUrl ? (car.imageUrl.startsWith('http') ? car.imageUrl : car.imageUrl) : assets.car_image1}
            alt={`${car.brand} ${car.model}`}
            className='w-full h-auto md:max-h-100 object-cover rounded-xl mb-6 shadow-md'
            onError={(e) => {
              // Fallback if image fails to load
              e.target.src = assets.car_image1;
            }}
          />

          <div className='space-y-6'>
            <div>
              <h1 className='text-3xl font-bold'>{car.brand} {car.model}</h1>
              <p className='text-gray-500 text-lg'>{car.category} · {car.year}</p>
            </div>

            <hr className='border-borderColor my-6' />

            <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
              {[
                { icon: assets.users_icon, text: `${car.seatingCapacity} seats` },
                { icon: assets.fuel_icon, text: car.fuelType },
                { icon: assets.car_icon, text: car.transmission },
                { icon: assets.location_icon, text: car.location }
              ].map(({ icon, text }) => (
                <div key={text} className='flex flex-col items-center bg-light p-4 rounded-lg'>
                  <img src={icon} alt="" className='h-5 mb-2' />
                  <span className='text-sm text-gray-700'>{text}</span>
                </div>
              ))}
            </div>

            {/* Description */}
            <div>
              <h1 className='text-xl font-medium mb-3'>Description</h1>
              <p className='text-gray-500'>{car.description}</p>
            </div>

            {/* Features */}
            <div>
              <h1 className='text-xl font-medium mb-3'>Features</h1>
              <ul className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
                {["360 Camera", "Bluetooth", "GPS", "Heated Seats", "Rear View Mirror"].map((item) => (
                  <li key={item} className='flex items-center text-gray-500'>
                    <img src={assets.check_icon} className='h-4 mr-2' alt="check" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <form onSubmit={handleSubmit} className='shadow-lg h-max sticky top-18 rounded-xl p-6 space-y-6 text-gray-500'>
          <p className='flex items-center justify-between text-2xl text-gray-800 font-semibold'>
            {currency}{car.dailyPrice}
            <span className='text-base text-gray-400 font-formal'>per day</span>
          </p>
          <hr className='border-borderColor my-6' />

         
          <div className='flex flex-col gap-2'>
            <label htmlFor="pickup-date">Booking Date</label>
            <input
              type="date"
              className='border border-borderColor px-3 py-2 rounded-lg'
              required
              id='pickup-date'
              min={new Date().toISOString().split('T')[0]}
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
            />
          </div>

          <div className='flex flex-col gap-2'>
            <label htmlFor="return-date">Return Date (optional)</label>
            <input
              type="date"
              className='border border-borderColor px-3 py-2 rounded-lg'
              id='return-date'
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
            />
          </div>

          <button className='w-full bg-primary hover:bg-primary-dull transition-all py-3 font-medium text-white rounded-xl cursor-pointer'>
            Book Now
          </button>

          <p className='text-center text-sm'>No Credit card required to reserve</p>
        </form>
      </div>
    </div>
  ) : null
}

export default CarDetails
