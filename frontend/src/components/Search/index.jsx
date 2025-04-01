import React from 'react'
import { Button } from '@mui/material'
import { IoSearch } from 'react-icons/io5'

const Search = () => {
  return (
    <div className='searchBox w-[100%] h-[50px] bg-[#e5e5e5] rounded-[5px] relative p-2 '>
        <input type="text" placeholder='Search for products, categories...' className='w-full h-full pl-10 bg-transparent outline-none' />
      <Button  color='primary' className='!absolute right-[5px] top-[5px] z-50 !w-[37px] h-[37px] !min-w-[37px] !rounded-full !text-black'>
        <IoSearch className='text-2xl text-black' />
      </Button>
    </div>
  )
}

export default Search
