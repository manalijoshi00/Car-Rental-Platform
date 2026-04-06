import React, { useEffect, useState } from 'react'
import { assets } from '../../assets/assets'
import Title from '../../components/owner/Title'

const Dashboard = () => {
  const currency = import.meta.env.VITE_CURRENCY

  const [data, setData] = useState({
    totalCars: 0,
    totalBookings: 0,
    pendingBookings: 0,
    completeBookings: 0,
    recentBookings: [],
    monthlyRevenue: 0,
  })

  const [loading, setLoading] = useState(true)

  // Fetch dashboard data from Spring Boot backend
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        
        // Get user info from localStorage
        const storedUserId = localStorage.getItem('userId')
        const storedRole = localStorage.getItem('userRole')
        
        if (!storedUserId) {
          console.log('No user ID found')
          return
        }

        // Fetch cars data
        let carsResponse
        try {
          carsResponse = await fetch(`http://localhost:8080/api/cars/owner/${storedUserId}`)
        } catch (err) {
          console.log('Cars API not available, using fallback')
          carsResponse = { ok: false }
        }

        // Fetch bookings data
        let bookingsResponse
        try {
          bookingsResponse = await fetch(`http://localhost:8080/api/bookings/owner/${storedUserId}`)
        } catch (err) {
          console.log('Bookings API not available, using fallback')
          bookingsResponse = { ok: false }
        }

        // Process cars data
        let totalCars = 0
        if (carsResponse.ok) {
          const carsData = await carsResponse.json()
          totalCars = carsData.length || 0
        }

        // Process bookings data
        let totalBookings = 0
        let pendingBookings = 0
        let completeBookings = 0
        let recentBookings = []
        let monthlyRevenue = 0

        if (bookingsResponse.ok) {
          const bookingsData = await bookingsResponse.json()
          totalBookings = bookingsData.length || 0
          
          // Calculate pending and completed bookings
          pendingBookings = bookingsData.filter(booking => 
            booking.status === 'pending' || booking.status === 'confirmed'
          ).length || 0
          
          completeBookings = bookingsData.filter(booking => 
            booking.status === 'completed' || booking.status === 'cancelled'
          ).length || 0

          // Get recent bookings (last 5)
          recentBookings = bookingsData
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5)
            .map(booking => ({
              ...booking,
              car: {
                brand: booking.car?.brand || 'Unknown',
                model: booking.car?.model || 'Unknown'
              },
              createdAt: booking.createdAt || new Date().toISOString(),
              price: booking.price || 0,
              status: booking.status || 'pending'
            }))

          // Calculate monthly revenue
          const currentMonth = new Date().getMonth()
          const currentYear = new Date().getFullYear()
          
          monthlyRevenue = bookingsData
            .filter(booking => {
              const bookingDate = new Date(booking.createdAt)
              return bookingDate.getMonth() === currentMonth && 
                     bookingDate.getFullYear() === currentYear &&
                     (booking.status === 'completed' || booking.status === 'confirmed')
            })
            .reduce((total, booking) => total + (booking.price || 0), 0)
        }

        // Update state with real data
        setData({
          totalCars,
          totalBookings,
          pendingBookings,
          completeBookings,
          recentBookings,
          monthlyRevenue
        })

      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        // Fallback to default values
        setData({
          totalCars: 0,
          totalBookings: 0,
          pendingBookings: 0,
          completeBookings: 0,
          recentBookings: [],
          monthlyRevenue: 0
        })
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const dashboardCards = [
     {title: "Total cars", value: data.totalCars, icon: assets.carIconColored},
     {title: "Total Bookings", value: data.totalBookings, icon: assets.listIconColored},
     {title: "Pending", value: data.pendingBookings, icon: assets.cautionIconColored},
     {title: "Completed", value: data.completeBookings, icon: assets.listIconColored}
  ]

  if (loading) {
    return (
      <div className='px-4 pt-10 md:px-10 flex-1'>
        <Title title="Admin Dashboard" subTitle="Loading dashboard data..." />
        <div className='flex items-center justify-center h-64'>
          <div className='text-gray-500'>Loading dashboard data...</div>
        </div>
      </div>
    )
  }

  return (
    <div className='px-4 pt-10 md:px-10 flex-1'>
      <Title title="Admin Dashboard" subTitle="Monitor overall platform performance including total cars, bookings, revenue, and recent activities"/>
      <div className='grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-8 max-w-3xl'>
        {dashboardCards.map((card, index)=>(
          <div key={index} className='flex gap-2 items-center justify-between p-4 rounded-md border border-borderColor'>
            <div>
              <h1 className='text-xs text-gray-500'>{card.title}</h1>
              <p className='text-lg font-semibold'>{card.value}</p>
            </div>
            <div className='flex items-center justify-center w-10 h-10 rounded-full bg-primary/10'>
              <img src={card.icon} alt="" className='h-4 w-4'/>
            </div>
          </div>
        ))}
      </div>

      <div className='flex flex-wrap items-start gap-6 mb-8 w-full'>
        {/*recent booking */}
        <div className='p-4 md:p-6 border border-borderColor rounded-md max-w-lg w-full'>
          <h1 className='text-lg font-medium'>Recent Bookings</h1>
          <p className='text-gray-500'> Latest customer bookings</p>
          {data.recentBookings.length > 0 ? (
            data.recentBookings.map((booking, index)=>(
              <div key={index} className='mt-4 flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <div className='hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-primary/10'>
                    <img src={assets.listIconColored} alt="" className='h-5 w-5' />
                  </div>
                  <div>
                    <p>{booking.car.brand} {booking.car.model}</p>
                    <p className='text-sm text-gray-500'>
                      {new Date(booking.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className='flex items-center gap-2 font-medium'>
                  <p className='text-sm text-gray-500'>{currency}{booking.price}</p>
                  <p className='px-3 py-0.5 border border-borderColor rounded-full text-sm capitalize'>{booking.status}</p>
                </div>
              </div>
            ))
          ) : (
            <div className='mt-4 text-gray-500 text-center py-8'>
              No recent bookings found
            </div>
          )}
        </div>
        
        {/*monthly revenue */}
        <div className='p-4 md:p-6 mb-6 border border-borderColor rounded-md w-full md:max-w-xs'>
          <h1 className='text-lg font-medium'>Monthly Revenue</h1>
          <p className='text-gray-500'>Revenue for current month</p>
          <p className='text-3xl mt-6 font-semibold text-primary'>{currency}{data.monthlyRevenue}</p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
