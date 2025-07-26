'use client'

import React, { useEffect, useState } from 'react';
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
import { MessageCircle, UserPlus } from 'lucide-react';

const SignUpPage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  
  useEffect(() => {
    if (session) {
      router.push("/")
    }
  }, [session, router])
  
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || !username) {
      setError('Please fill in all fields');
      return;
    }
    
    if (!email.includes("@") || !email.includes(".")) {
      setError("Please enter a valid email address");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
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

  const handleOTP = async (e) => {
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

  const handleResendOTP = async (e) => {
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-green-600 rounded-full blur-3xl"></div>
        </div>

        {/* Main Card */}
        <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-green-100 p-8 md:p-10">
          
          {!register ? (
            <>
              {/* Header */}
              <div className="text-center mb-8">
                {/* WhatsApp-style Logo */}
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <UserPlus className="text-white text-2xl" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
                <p className="text-gray-600">Join WhatsApp Clone and start chatting</p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Username Input */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Full Name
                  </label>
                  <div className="relative group">
                    <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => { 
                        setUsername(e.target.value); 
                        setError(''); 
                      }}
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </div>

                {/* Email Input */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Email Address
                  </label>
                  <div className="relative group">
                    <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => { 
                        setEmail(e.target.value); 
                        setError(''); 
                      }}
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
                      placeholder="Enter your email address"
                      required
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Password
                  </label>
                  <div className="relative group">
                    <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 transition-colors z-10" />
                    <input
                      type={showPass ? "text" : "password"}
                      value={password}
                      onChange={(e) => { 
                        setPassword(e.target.value); 
                        setError(''); 
                      }}
                      className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
                      placeholder="Create a strong password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-green-500 transition-colors z-10"
                    >
                      {showPass ? <FaEyeSlash className="text-lg" /> : <FaEye className="text-lg" />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Password must be at least 6 characters long
                  </p>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border-l-4 border-red-400 rounded-lg p-4">
                    <div className="flex">
                      <div className="ml-3">
                        <p className="text-red-700 text-sm font-medium">{error}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Sign Up Button */}
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-green-600 hover:to-green-700 focus:ring-4 focus:ring-green-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                      Creating Account...
                    </div>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="my-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500 font-medium">Or continue with</span>
                  </div>
                </div>
              </div>

              {/* Google Sign In */}
              <button
                onClick={handleClick}
                className="w-full flex items-center justify-center py-4 px-4 border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 focus:ring-4 focus:ring-gray-200 transition-all duration-200 bg-white"
              >
                <FcGoogle className="text-2xl mr-3" />
                <span className="font-semibold text-gray-700 text-lg">Continue with Google</span>
              </button>

              {/* Sign In Link */}
              <div className="mt-8 text-center">
                <p className="text-gray-600">
                  Already have an account?{' '}
                  <button 
                    onClick={() => router.push('/login')} 
                    className="text-green-600 hover:text-green-700 font-bold transition-colors"
                  >
                    Sign In
                  </button>
                </p>
              </div>

              {/* Additional Info */}
              <div className="mt-6 text-center">
                <p className="text-xs text-gray-500">
                  By creating an account, you agree to our{' '}
                  <a href="#" className="text-green-600 hover:underline">Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" className="text-green-600 hover:underline">Privacy Policy</a>
                </p>
              </div>
            </>
          ) : (
            <>
              {/* OTP Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <FaShieldAlt className="text-white text-2xl" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify Your Email</h1>
                <p className="text-gray-600 mb-2">
                  We've sent a 6-digit verification code to
                </p>
                <p className="font-semibold text-green-600 text-lg">{email}</p>
              </div>

              {/* OTP Form */}
              <form onSubmit={handleOTP} className="space-y-6">
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
                    <InputOTPGroup className="flex justify-center gap-3">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <InputOTPSlot
                          key={i}
                          index={i}
                          className="w-12 h-14 text-lg font-bold text-center border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border-l-4 border-red-400 rounded-lg p-4">
                    <div className="flex">
                      <div className="ml-3">
                        <p className="text-red-700 text-sm font-medium">{error}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Verify Button */}
                <button 
                  type="submit" 
                  disabled={isLoading || otp.length !== 6}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-green-600 hover:to-green-700 focus:ring-4 focus:ring-green-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                      Verifying...
                    </div>
                  ) : (
                    'Verify & Create Account'
                  )}
                </button>

                {/* Footer Links */}
                <div className="text-center space-y-4">
                  <p className="text-gray-600">
                    Didn't receive the code?{' '}
                    <button 
                      onClick={handleResendOTP}
                      className="text-green-600 hover:text-green-700 font-semibold transition-colors"
                    >
                      Resend Code
                    </button>
                  </p>
                  
                  <button 
                    type="button" 
                    onClick={() => setRegister(false)}
                    className="flex items-center justify-center text-gray-600 hover:text-green-600 transition-colors mx-auto group"
                  >
                    <FaArrowLeft className="mr-2 text-sm group-hover:transform group-hover:-translate-x-1 transition-transform" />
                    <span className="font-medium">Change Email Address</span>
                  </button>
                </div>
              </form>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            © 2024 WhatsApp Clone. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
