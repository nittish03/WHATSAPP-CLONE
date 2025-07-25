'use client'

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FcGoogle } from "react-icons/fc";
import { signIn, useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { 
  FaEye, 
  FaEyeSlash, 
  FaEnvelope, 
  FaLock,
} from 'react-icons/fa';
import { MessageCircle } from 'lucide-react';

const LoginPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = () => {
    const loading = toast.loading("Signing in with Google...");
    try {
      signIn("google", { callbackUrl: "/chat" });
      toast.dismiss(loading);
    } catch (error) {
      toast.dismiss(loading);
      toast.error("Failed to sign in with Google");
    }
  };

  useEffect(() => {
    if (session) {
      router.push("/chat");
    }
  }, [session, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    
    if (!email.includes("@") || !email.includes(".")) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    const loading = toast.loading("Signing in...");
    
    try {
      const result = await signIn("credentials", {
        email,
        password,
        callbackUrl: "/chat",
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
        toast.error("Invalid credentials");
      } else {
        toast.success("Signed in successfully");
        router.push("/chat");
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
      toast.error("Sign in failed");
    } finally {
      toast.dismiss(loading);
      setIsLoading(false);
    }
  };

  return (
    <div className=" bg-gradient-to-br from-green-50 via-white to-green-100 flex items-center justify-center">
      <div className="w-full max-w-lg">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-green-600 rounded-full blur-3xl"></div>
        </div>

        {/* Main Card */}
        <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-green-100 p-8 md:p-10">
          {/* Header */}
          <div className="text-center mb-4">
            {/* WhatsApp-style Logo */}
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg">
              <MessageCircle className="text-white text-2xl" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to continue to WhatsApp Clone</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
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
                  placeholder="Enter your password"
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

            {/* Forgot Password */}
            <div className="text-right">
              <button 
                type="button"
                className="text-sm text-green-600 hover:text-green-700 font-semibold transition-colors"
              >
                Forgot password?
              </button>
            </div>

            {/* Sign In Button */}
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-green-600 hover:to-green-700 focus:ring-4 focus:ring-green-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                  Signing In...
                </div>
              ) : (
                'Sign In'
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
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center py-4 px-4 border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 focus:ring-4 focus:ring-gray-200 transition-all duration-200 bg-white"
          >
            <FcGoogle className="text-2xl mr-3" />
            <span className="font-semibold text-gray-700 text-lg">Continue with Google</span>
          </button>

          {/* Sign Up Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <button 
                onClick={() => router.push('/signup')} 
                className="text-green-600 hover:text-green-700 font-bold transition-colors"
              >
                Create Account
              </button>
            </p>
          </div>

          {/* Additional Info */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              By signing in, you agree to our{' '}
              <a href="#" className="text-green-600 hover:underline">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-green-600 hover:underline">Privacy Policy</a>
            </p>
          </div>
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

export default LoginPage;
