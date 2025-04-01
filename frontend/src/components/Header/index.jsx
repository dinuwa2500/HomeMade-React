import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../../assets/Lgoo.png'
import Search from '../Search'
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles'
import { IconButton } from '@mui/material'
import { MdOutlineShoppingCart } from 'react-icons/md'
import Navigation from './Navigation'

const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
        right: -3,
        top: 13,
        border: `2px solid ${theme.palette.background.paper}`,
    },
}))







const Header = () => {
  return (
   
   <header className='bg-white'>
<div className='top-strip py-2 border-t-[1px] border-gray-200 border-b-[1px]'>
    <div className='container'>
        <div className='flex items-center justify-between'>
            <div className='col1 w-[50%]'>
                <p className='text-[14px] '>Get up to 50% off new season styles , limited time only</p>
            </div>

        <div className='flex items-center justify-end '>
            <ul className='flex items-center gap-3'>
                <li className='list-none'>
                    <Link to="/help-center" className='link text-[12px] transition'>Help Center</Link>
                </li>
                <li className='list-none'>
                <Link to="/order-tracking" className='link text-[12px] transition'>Order Tracking</Link>
                </li>
               
            </ul>
        </div>


        </div>
    </div>
    </div>


    <div className='header  py-4 border-b-[1px] border-gray-200 '>
        <div className='container flex items-center justify-between'>
            <div className='col1 w-[30%]'>
                <Link to="/" className='logo'>
                    <img src={logo} alt="logo" className='w-50' />
       
                </Link>
            </div>
           
            <div className='col2 w-[40%]'>
                <Search />
            </div>
            
            <div className='col3 w-[30%]  flex items-center pl-5'>
                <ul className='flex items-center gap-3'>
                    <li className='list-none'>
                        <Link to="/login" className='link text-[15px] transition font-[500] '>Login </Link>  | 
                        <Link to="/register" className='link text-[15px] transition font-[500]'>  Register</Link>
                    </li>
                    <li>
                        <IconButton aria-label="cart">
                            <StyledBadge badgeContent={4} color="secondary">
                                <MdOutlineShoppingCart className='text-[25px]' />
                            </StyledBadge>
                        </IconButton>
                    </li>
                 
                </ul>
                
            </div>

        </div>
    </div>


    <Navigation />


   </header>
  )
}

export default Header
