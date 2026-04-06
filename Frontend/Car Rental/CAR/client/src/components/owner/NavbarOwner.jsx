import React, { useState, useEffect } from 'react'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom';

const NavbarOwner = () => {
  const [user, setUser] = useState({
    name: 'Owner',
    email: '',
    role: ''
  });

  useEffect(() => {
    // Get user data from localStorage
    const storedUsername = localStorage.getItem('username');
    const storedEmail = localStorage.getItem('email');
    const storedRole = localStorage.getItem('userRole');
    
    if (storedUsername || storedEmail || storedRole) {
      setUser({
        name: storedUsername || 'Owner',
        email: storedEmail || '',
        role: storedRole || ''
      });
    }
  }, []);

  return (
    <div className='flex items-center justify-between px-6 md:px-10 py-4 text-gray-500 border-b border-borderColor relative transition-all'>
      <Link to='/'>
        <img src={assets.logo} className='h-7' alt="" />
      </Link>
      <p>Welcome, {user.name}</p>
    </div>
  )
}

export default NavbarOwner
