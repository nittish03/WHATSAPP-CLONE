'use client'

import React, { FormEvent, useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import axios from 'axios';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import toast from 'react-hot-toast';
import { FcGoogle } from "react-icons/fc";
import { 
  FaEye, 
  FaEyeSlash, 
  FaUser, 
  FaEnvelope, 
  FaLock,
  FaShieldAlt,
  FaArrowLeft
} from 'react-icons/fa';

const SignUpPage = () => {
  const router = useRouter();
  const {data : session} = useSession();
  
  useEffect(()=>{
    if(session){
      router.push("/")
    }
  },[session])
  
  const [otp, setOtp] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [register, setRegister] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    const loading = toast.loading("Signing in with Google...");
    try {
      signIn("google", { callbackUrl: "/" });
      toast.dismiss(loading);
    } catch (error) {
      toast.dismiss(loading);
      toast.error("Failed to sign in with Google");
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password || !username) {
      setError('Please fill in all fields');
      return;
    }
    try {
      setIsLoading(true);
      const loading = toast.loading("Creating account...");
      const response = await axios.post("/api/auth/register", { username, email, password });
      toast.dismiss(loading);
      if (response) {
        toast.success("OTP sent successfully");
        setRegister(true);
      } else {
        toast.error("Signup failed");
      }
    } catch (e) {
      toast.error("Signup failed");
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  }

  const handleOTP = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError("OTP must be 6 digits");
      return;
    }
    try {
      setIsLoading(true);
      const loading = toast.loading("Verifying...");
      const response = await axios.post("/api/auth/otp-verification", { email, otp });
      toast.dismiss(loading);
      if (response) {
        toast.success("Account created successfully");
        await signIn("credentials", { email, password, callbackUrl: "/", redirect: true });
        router.push("/login");
      } else {
        toast.error("Failed to verify OTP");
      }
    } catch (e) {
      toast.error("Verification failed");
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/auth/resend-otp", { email });
      if (response) {
        toast.success("OTP resent successfully");
      } else {
        toast.error("Failed to resend OTP");
      }
    } catch (error) {
      toast.error("Failed to resend OTP");
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-md">
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-3 sm:p-4">
          
          {!register ? (
            <>
              {/* Header */}
              <div className="text-center mb-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <FaUser className="text-white text-lg" />
                </div>
                <h1 className="text-xl font-bold text-gray-900 mb-1">Create Account</h1>
                <p className="text-sm text-gray-600">Join us today and get started</p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Username Input */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <FaUser className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => { 
                    setUsername(e.target.value); 
                    setError(''); 
                  }}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="Enter your email"
                  required
                />
                  </div>
                </div>


            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { 
                    setEmail(e.target.value); 
                    setError(''); 
                  }}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Password
  </label>
  <div className="relative flex items-center">
    <FaLock className="absolute left-3 text-gray-400 z-10" />
    <input
      type={showPass ? "text" : "password"}
      value={password}
      onChange={(e) => { 
        setPassword(e.target.value); 
        setError(''); 
      }}
      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
      placeholder="Enter your password"
      required
    />
    <button
      type="button"
      onClick={() => setShowPass(!showPass)}
      className="absolute right-2 text-gray-400 hover:text-gray-600 z-10"
    >
      {showPass ? <FaEyeSlash /> : <FaEye />}
    </button>
  </div>
</div>
                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-2">
                    <p className="text-red-600 text-xs">{error}</p>
                  </div>
                )}

                {/* Sign Up Button */}
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 text-sm rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating Account...
                    </div>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="my-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-3 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>
              </div>

              {/* Google Sign In */}
              <button
                onClick={handleClick}
                className="w-full flex items-center justify-center py-2 px-3 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-4 focus:ring-gray-200 transition-all"
              >
                <FcGoogle className="text-lg mr-2" />
                <span className="font-medium text-gray-700">Continue with Google</span>
              </button>

              {/* Sign In Link */}
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-600">
                  Already have an account?{' '}
                  <button 
                    onClick={() => router.push('/login')} 
                    className="text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    Sign In
                  </button>
                </p>
              </div>
            </>
          ) : (
            <>
              {/* OTP Header */}
              <div className="text-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <FaShieldAlt className="text-white text-lg" />
                </div>
                <h1 className="text-xl font-bold text-gray-900 mb-1">Verify Email</h1>
                <p className="text-xs text-gray-600">
                  Enter the 6-digit code sent to<br />
                  <span className="font-semibold text-blue-600">{email}</span>
                </p>
              </div>

              {/* OTP Form */}
              <form onSubmit={handleOTP} className="space-y-4">
                <div className="flex justify-center">
                  <InputOTP 
                    maxLength={6} 
                    onChange={(value) => {
                      if (/^\d*$/.test(value)) {
                        setOtp(value);
                        setError('');
                      } else {
                        setError("Only numbers allowed");
                      }
                    }}
                  >
                    <InputOTPGroup className="flex justify-center gap-2">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <InputOTPSlot
                          key={i}
                          index={i}
                          className="w-8 h-10 text-sm font-bold text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-2">
                    <p className="text-red-600 text-xs">{error}</p>
                  </div>
                )}

                {/* Verify Button */}
                <button 
                  type="submit" 
                  disabled={isLoading || otp.length !== 6}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 text-sm rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Verifying...
                    </div>
                  ) : (
                    'Verify OTP'
                  )}
                </button>

                {/* Footer Links */}
                <div className="text-center space-y-2">
                  <p className="text-xs text-gray-600">
                    Didn't receive the code?{' '}
                    <button 
                      onClick={handleResendOTP}
                      className="text-blue-600 hover:text-blue-700 font-semibold"
                    >
                      Resend
                    </button>
                  </p>
                  
                  <button 
                    type="button" 
                    onClick={() => setRegister(false)}
                    className="flex items-center justify-center text-xs text-gray-600 hover:text-gray-800 transition-colors mx-auto"
                  >
                    <FaArrowLeft className="mr-1 text-xs" />
                    Change Email
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
