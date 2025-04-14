import React, { useRef, useState } from 'react';

const OtpInput = () => {
  const [otp, setOtp] = useState(Array(6).fill(''));
  const inputsRef = useRef([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (element, index) => {
    const value = element.value.replace(/\D/, '');
    if (!value) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    if (index < 5 && value) {
      inputsRef.current[index + 1].focus();
    }

    if (index === 5 && newOtp.every((val) => val !== '')) {
      handleSubmit(newOtp.join(''));
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputsRef.current[index - 1].focus();
      } else {
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputsRef.current[index - 1].focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleSubmit = (otpValue) => {
    setIsSubmitting(true);
    setError('');

    // Simulate API call
    setTimeout(() => {
      if (otpValue === '123456') {
        // Example valid OTP
        console.log('OTP verified successfully');
        // Handle successful verification
      } else {
        setError('Invalid OTP. Please try again.');
        // Clear all inputs on error
        setOtp(Array(6).fill(''));
        inputsRef.current[0].focus();
      }
      setIsSubmitting(false);
    }, 1000);
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text/plain').replace(/\D/g, '');
    if (pasteData.length === 6) {
      const newOtp = pasteData.split('').slice(0, 6);
      setOtp(newOtp);
      inputsRef.current[5].focus();
      handleSubmit(newOtp.join(''));
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[250px] ">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md mx-4">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Verify OTP</h1>
          <p className="text-gray-600">
            We've sent an OTP to your registered email/phone.
          </p>
        </div>

        <div className="mb-6">
          <div className="flex justify-center gap-3 mb-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                inputMode="numeric"
                maxLength="1"
                value={digit}
                ref={(el) => (inputsRef.current[index] = el)}
                onChange={(e) => handleChange(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={handlePaste}
                disabled={isSubmitting}
                className={`w-12 h-14 text-center text-2xl font-medium border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                  error
                    ? 'border-red-500 shake-animation'
                    : 'border-gray-300 focus:border-blue-500'
                } ${digit && !error ? 'border-green-500' : ''}`}
              />
            ))}
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center mb-4">{error}</p>
          )}

          <div className="flex justify-between items-center text-sm">
            <button
              className="text-blue-600 hover:text-blue-800 font-medium"
              onClick={() => {
                setOtp(Array(6).fill(''));
                inputsRef.current[0].focus();
              }}
            >
              Clear
            </button>
            <button
              className="text-blue-600 hover:text-blue-800 font-medium"
              onClick={() => console.log('Resend OTP')}
            >
              Resend OTP
            </button>
          </div>
        </div>

        <div className="text-center text-sm text-gray-500">
          <p>Didn't receive the code?</p>
          <button className="text-blue-600 hover:text-blue-800 font-medium mt-1">
            Contact Support
          </button>
        </div>
      </div>

      {/* Add this to your global CSS */}
      <style jsx>{`
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
        }
        .shake-animation {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default OtpInput;
