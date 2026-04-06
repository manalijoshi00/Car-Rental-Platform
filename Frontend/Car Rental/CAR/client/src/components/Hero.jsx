import React, { useState, useEffect } from 'react'
import { assets, cityList } from '../assets/assets'

const Hero = () => {
   
    const [PickupLocation, setPickupLocation] = useState('')
    const [username, setUsername] = useState('')
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    useEffect(() => {
      // Check if user is logged in and get username
      const storedUsername = localStorage.getItem('username')
      const storedEmail = localStorage.getItem('email')
      const storedUserId = localStorage.getItem('userId')
      
      if (storedUsername && storedEmail && storedUserId) {
        setUsername(storedUsername)
        setIsLoggedIn(true)
      }
    }, [])


  return (
    <div className='h-screen flex flex-col items-center justify-center gap-14 bg-light text-center'>
        
        {isLoggedIn && username && (
          <div className='text-xl md:text-2xl text-gray-700 font-medium'>
            Welcome back, {username}! 👋
          </div>
        )}
        
        <h1 className='text-4xl md:text-5xl font-semibold'>Luxury cars on Rent</h1>

        <form className='flex flex-col md:flex-row items-start md:items-center justify-between p-6 rounded-lg md:rounded-full w-full max-w-80 md:max-w-200 bg-white shadow-[0px_8px_20px_rgba(0,0,0,0.1)]'>

          <div className='flex flex-col md:flex-row items-start md:items-center gap-10 min-md:ml-8'>
            <div>
              <select required value={PickupLocation} onChange={(e)=>setPickupLocation(e.target.value)}>
                <option value="">Pickup Location</option>
                {cityList.map((city)=><option key={city} value={city}>{city}</option>)}
              </select>
              <p className='px-1 text-sm text-gray-500'>{PickupLocation ? PickupLocation : 'Please Select Location'}</p>
            </div>
            <div className='flex flex-col items-start gap-2'>
              <label htmlFor="pickup-date">Pick-up Date</label>
              <input type="date" id='pickup-date' min={new Date().toISOString().split('T')[0]}className='text-sm text-gray-500' required/>

            </div>

            <div className='flex flex-col items-start gap-2'>
              <label htmlFor="return-date">Return Date</label>
              <input type="date" id='return-date' className='text-sm text-gray-500' required/>

            </div>
            </div>
            <button className='flex items-center justify-center gap-1 px-9 py-3 max-sm:mt-4 bg-primary hover:bg-primary-dull text-white rounded-full cursor-pointer' >
              <img src={assets.search_icon} alt="search"className='brightness-300' />
              Search</button>

          

        </form>

        <img src={assets.main_car} alt="car" className='max-h-74'/>
      
    </div>
  )
}

export default Hero
