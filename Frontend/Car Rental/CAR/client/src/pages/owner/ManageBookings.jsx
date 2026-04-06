import React, { useEffect, useState } from 'react'
import Title from '../../components/owner/Title'

const currency = import.meta.env.VITE_CURRENCY

const ManageBookings = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchOwnerBookings = async () => {
    try {
      setLoading(true)
      setError('')
      const res = await fetch('/api/bookings')
      if (!res.ok) throw new Error('Failed to fetch bookings')
      const data = await res.json()
      setBookings(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Error fetching bookings:', err)
      setError('Failed to load bookings')
      setBookings([])
    } finally {
      setLoading(false)
    }
  }

  const updateBookingStatus = async (bookingId, newStatus, index) => {
    try {
      // Optimistic UI update
      setBookings(prev => {
        const next = [...prev]
        next[index] = { ...next[index], status: newStatus }
        return next
      })

      // Try a PATCH endpoint first; if backend expects PUT to full resource, adjust as needed
      const res = await fetch(`/api/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })

      if (!res.ok) {
        // Fallback: try PUT to main resource with status field
        const resPut = await fetch(`/api/bookings/${bookingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus })
        })
        if (!resPut.ok) throw new Error('Failed to update status')
      }
    } catch (err) {
      console.error('Error updating status:', err)
      // Revert on failure
      setBookings(prev => {
        const next = [...prev]
        next[index] = { ...next[index], status: 'pending' }
        return next
      })
      alert('Failed to update status')
    }
  }

  useEffect(() => {
    fetchOwnerBookings()
  }, [])

  return (
    <div className='px-4 pt-10 md:px-10 w-full'>
      <Title
        title='Manage Bookings'
        subTittle='View all listed cars, update their details, or remove them from the booking platform.'
      />
      {error && (
        <div className='mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded'>
          {error}
        </div>
      )}
      <div className='max-w-3xl w-full rounded-md overflow-hidden border border-borderColor mt-6'>
        <table className='w-full border-collapse text-left text-sm text-gray-600'>
          <thead className='text-gray-500'>
            <tr>
              <th className='p-3 font-medium'>Car</th>
              <th className='p-3 font-medium'>Date Range</th>
              <th className='p-3 font-medium'>Total</th>
              <th className='p-3 font-medium max-md:hidden'>Payment</th>
              <th className='p-3 font-medium'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className='p-3' colSpan={5}>Loading...</td>
              </tr>
            ) : bookings.map((booking, index) => (
              <tr key={index} className='border-t border-borderColor text-gray-500'>
                
                {/* Car column */}
                <td className='p-3 flex items-center gap-3'>
                  <img
                    src={booking?.car?.imageUrl ? `http://localhost:8080${booking.car.imageUrl}` : booking?.car?.image}
                    alt='Car'
                    className='h-12 w-12 aspect-square rounded-md object-cover'
                  />
                  <p className='font-medium max-md:hidden'>
                    {booking?.car?.brand} {booking?.car?.model}
                  </p>
                </td>

                {/* Date range */}
                <td className='p-3'>
                  {(booking?.pickupDate || booking?.bookingDate || '')?.split('T')[0]} to {(booking?.returnDate || booking?.bookingDate || '')?.split('T')[0]}
                </td>

                {/* Total */}
                <td className='p-3'>
                  {currency}{booking?.amount ?? booking?.price}
                </td>

                {/* Payment */}
                <td className='p-3 max-md:hidden'>
                  <span className='bg-gray-100 px-3 py-1 rounded-full text-xs'>Offline</span>
                </td>

                {/* Actions */}
                <td className='p-3'>
                  {booking?.status === 'pending' ? (
                    <select
                      value={booking.status}
                      className='px-2 py-1.5 mt-1 rounded-md border border-borderColor text-gray-500'
                      onChange={(e) => updateBookingStatus(booking.id || booking.bookingId, e.target.value, index)}
                    >
                      <option value='pending'>Pending</option>
                      <option value='cancelled'>Cancelled</option>
                      <option value='confirmed'>Confirmed</option>
                    </select>
                  ) : (
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        booking?.status === 'confirmed'
                          ? 'bg-green-100 text-green-500'
                          : 'bg-red-100 text-red-500'
                      }`}
                    >
                      {booking?.status}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ManageBookings
