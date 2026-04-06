import React, { useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import Title from '../components/Title'

const MyBookings = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const currency = import.meta.env.VITE_CURRENCY

  const fetchMyBookings = async () => {
    try {
      setLoading(true)
      setError('')
      const userId = localStorage.getItem('userId')
      if (!userId) {
        setBookings([])
        return
      }
      const res = await fetch(`/api/bookings/user/${userId}`)
      if (!res.ok) throw new Error('Failed to fetch bookings')
      const data = await res.json()
      setBookings(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Error fetching my bookings:', err)
      setError('Failed to load bookings')
      setBookings([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMyBookings()
  }, [])

  return (
    <div className='px-6 md:px-16 lg:px-24 xl:px-32 2xl:px-48 mt-16 text-sm max-w-7xl mx-auto'>
      <Title
        title="My Bookings"
        subTitle="View and manage all your car bookings"
        align="left"/>

      {/* Bookings List */}
      <div>
        {loading && (
          <div className='mt-4 bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded'>Loading...</div>
        )}
        {error && (
          <div className='mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded'>{error}</div>
        )}
        {bookings.map((booking, index)=>(
          <div key={booking.id || booking.bookingId || index} className='grid grid-cols-4 gap-6 p-6 border border-borderColor rounded-lg mt-5 first:mt-12'>
            {/*car image + info */}
            <div className='md:col-span-1'>
              <div className='rounded-md overflow-hidden mb-3'>
                <img src={booking.car?.imageUrl ? `http://localhost:8080${booking.car.imageUrl}` : booking.car?.image} alt='' className='w-full h-auto aspect-video object-cover'/>

              </div>
              <p className='text-lg font-medium mt-2'>{booking.car?.brand} {booking.car?.model}</p>
              <p className='text-gray-500'>{booking.car?.year} . {booking.car?.category} . {booking.car?.location}</p>

            </div>
            {/*booking info */}
            <div className='md:col-span-2'>
              <div className='flex items-center gap-2'>
                <p className='px-3 py-1.5 bg-light rounded'>Booking #{index+1}</p>
                <p className={`px-3 py-1 text-xs rounded-full ${booking.status ==='confirmed' ? 'bg-green-400/15 text-green-600' : booking.status === 'pending' ? 'bg-gray-400/15 text-gray-600' : 'bg-red-400/15 text-red-600'}`}>{booking.status}</p>
              </div>
              <div className='flex items-start gap-2 mt-3'>
                <img src={assets.calendar_icon_colored} alt="" className='w-4 h-4 mt-1' />
                <div>
                  <p className='text-gray-500'>Rental Period</p>
                  <p>{(booking.pickupDate || booking.bookingDate)?.split('T')[0]} To {(booking.returnDate || booking.bookingDate)?.split('T')[0]}</p>
                </div>
              </div>

              <div className='flex items-start gap-2 mt-3'>
                <img src={assets.location_icon_colored} alt="" className='w-4 h-4 mt-1' />
                <div>
                  <p className='text-gray-500'>Pick-up Location</p>
                  <p>{booking.car.location}</p>
                </div>
              </div>
               </div>
               {/*price */}
               <div className='md:col-span-1 flex flex-col justify-between gap-6 '>
                <div className='text-sm text-gray-500 text-right'>
                  <p>Total Price</p>
                   <h1 className='text-2xl font-semibold text-primary'>{currency}{booking.amount ?? booking.price}</h1>
                   <p>Booked on {(booking.createdAt || booking.bookingDate)?.split('T')[0]}</p>
                </div>

               </div>

          </div>
        ))}
      </div>
     
    </div>
  )
}

export default MyBookings
