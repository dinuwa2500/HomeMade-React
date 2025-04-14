import React from 'react';
import { Button, Typography, TextField } from '@mui/material';
const MyProfile = () => {
  return (
    <div className="card shadow-md rounded-md p-5 bg-white">
      <h2 className="pb-3 text-xl font-semibold">My Profile</h2>
      <hr className="mb-4" />

      <form>
        <div className="flex flex-wrap gap-5">
          <div className="w-[48%]">
            <TextField
              fullWidth
              label="Full Name"
              defaultValue="Lakviru Perera"
              variant="outlined"
              margin="normal"
            />
          </div>

          <div className="w-[48%]">
            <TextField
              fullWidth
              label="Email"
              defaultValue="lakviri@gmail.com"
              variant="outlined"
              margin="normal"
            />
          </div>

          <div className="w-[48%]">
            <TextField
              fullWidth
              label="Phone"
              defaultValue="07XXXXXXXX"
              variant="outlined"
              margin="normal"
            />
          </div>
        </div>

        <div className="mt-6">
          <Button
            variant="contained"
            color="primary"
            className="!bg-blue-600"
            onClick={(e) => {
              e.preventDefault();
              console.log('Profile update clicked');
            }}
          >
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MyProfile;
