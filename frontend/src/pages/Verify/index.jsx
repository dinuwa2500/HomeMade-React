import React from 'react';

import security from '../../../src/assets/shield.png';
import OtpInput from '../../components/OTPbox';

const Verify = () => {
  return (
    <section className="section py-10 rounded-md shadow-md">
      <div className="container">
        <div className="card shadow-md w-[500px] m-auto rounded-md bg-white p-5 px-10">
          <div className="text-center flex items-center justify-center">
            <img src={security} width="80" />
          </div>
          <h3 className="text-center text-[20px] font-semibold text-black mb-6">
            Verify OTP
          </h3>

          <OtpInput />
        </div>
      </div>
    </section>
  );
};

export default Verify;
