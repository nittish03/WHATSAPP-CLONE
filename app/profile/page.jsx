'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { toast } from 'react-toastify'
import { 
  User, 
  Camera, 
  Save, 
  ArrowLeft, 
  Mail, 
  Lock,
  Eye,
  EyeOff,
  Calendar,
  Edit3,
  MessageCircle,
  Info
} from 'lucide-react'
import Image from 'next/image'

export default function ProfilePage() {
  const { data: session, update: updateSession } = useSession()
  const router = useRouter()
  const fileInputRef = useRef(null)

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    image: '',
    createdAt: '',
    updatedAt: ''
  })

  const [originalImage, setOriginalImage] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [imageUploading, setImageUploading] = useState(false)
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })

  useEffect(() => {
    if (!session) {
      router.push('/login')
      return
    }
    loadProfile()
  }, [session, router])

  const loadProfile = async () => {
    try {
      const response = await axios.get('/api/profile')
      setProfile(response.data)
      setOriginalImage(response.data.image)
    } catch (error) {
      console.error('Error loading profile:', error)
      toast.error('Failed to load profile')
    }
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    try {
      setImageUploading(true)
      const formData = new FormData()
      formData.append('file', file)

      // Upload to Google Drive
      const response = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      const newImageUrl = response.data.imageUrl

      // Update profile state
      setProfile(prev => ({ ...prev, image: newImageUrl }))

      // Immediately update session and database
      const profileResponse = await axios.put('/api/profile', {
        name: profile.name,
        image: newImageUrl,
        oldFileId: originalImage?.includes('drive.google.com') 
          ? originalImage.split('id=')[1] 
          : null
      })

      // Update session immediately
      await updateSession({
        ...session,
        user: {
          ...session.user,
          image: newImageUrl
        }
      })

      setOriginalImage(newImageUrl)
      toast.success('Profile picture updated successfully')
    } catch (error) {
      console.error('Error uploading image:', error)
      toast.error(error.response?.data?.error || 'Failed to upload image')
      // Revert to original image on error
      setProfile(prev => ({ ...prev, image: originalImage }))
    } finally {
      setImageUploading(false)
    }
  }

  const handleSave = async () => {
    if (!profile.name.trim()) {
      toast.error('Name is required')
      return
    }

    try {
      setLoading(true)
      
      const response = await axios.put('/api/profile', {
        name: profile.name,
        image: profile.image,
        oldFileId: originalImage?.includes('drive.google.com') 
          ? originalImage.split('id=')[1] 
          : null
      })

      setProfile(response.data)
      setOriginalImage(response.data.image)
      setIsEditing(false)
      
      // Update session data
      await updateSession({
        ...session,
        user: {
          ...session.user,
          name: response.data.name,
          image: response.data.image
        }
      })

      toast.success('Profile updated successfully')
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error(error.response?.data?.error || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error('All password fields are required')
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match')
      return
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long')
      return
    }

    try {
      setLoading(true)
      await axios.put('/api/profile/password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      })

      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setShowPasswordForm(false)
      toast.success('Password updated successfully')
    } catch (error) {
      console.error('Error updating password:', error)
      toast.error(error.response?.data?.error || 'Failed to update password')
    } finally {
      setLoading(false)
    }
  }

  // Helper function to get image through proxy
  const getImageSrc = (imageUrl) => {
    if (!imageUrl) return null
    // Always use proxy for all images to avoid Next.js config dependency
    return `/api/image-proxy?url=${encodeURIComponent(imageUrl)}`
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100">
      <div className="max-w-6xl mx-auto py-4 sm:py-8 px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-green-100 rounded-full transition-colors"
            >
              <ArrowLeft className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Profile</h1>
              <p className="text-sm sm:text-base text-gray-600">Manage your WhatsApp Clone profile</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          {/* Profile Card */}
          <div className="xl:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl border border-green-100 p-4 sm:p-6">
              {/* Profile Image */}
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-gray-100 border-4 border-green-200 mx-auto">
                    {session?.user?.image ? (
                      <Image
                        src={getImageSrc(session.user.image)}
                        alt="Profile"
                        width={128}
                        height={128}
                        className="w-full h-full object-cover object-center"
                        style={{
                          objectPosition: 'center center'
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-green-500">
                        <User className="h-12 w-12 sm:h-16 sm:w-16 text-white" />
                      </div>
                    )}
                  </div>
                  
                  {/* Upload Button */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={imageUploading}
                    className="absolute bottom-0 right-0 bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition-colors shadow-lg border-4 border-white"
                  >
                    {imageUploading ? (
                      <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-white"></div>
                    ) : (
                      <Camera className="h-3 w-3 sm:h-4 sm:w-4" />
                    )}
                  </button>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
                
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mt-4 truncate">
                  {session?.user?.name || profile.name}
                </h2>
                <p className="text-gray-600 text-sm sm:text-base truncate">
                  {session?.user?.email || profile.email}
                </p>
                <div className="flex items-center justify-center mt-2 text-xs sm:text-sm text-gray-500">
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  Joined {new Date(profile.createdAt).toLocaleDateString()}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-3">
                {/* Save Button - Only show when editing */}
                {isEditing && (
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="w-full flex items-center justify-center space-x-2 bg-blue-500 text-white py-2.5 sm:py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white"></div>
                    ) : (
                      <Save className="h-4 w-4 sm:h-5 sm:w-5" />
                    )}
                    <span className="text-sm sm:text-base">{loading ? 'Saving...' : 'Save Changes'}</span>
                  </button>
                )}
                
                {/* Edit Button */}
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="w-full flex items-center justify-center space-x-2 bg-green-500 text-white py-2.5 sm:py-3 rounded-lg hover:bg-green-600 transition-colors"
                >
                  <Edit3 className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="text-sm sm:text-base">{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
                </button>
                
                {/* Change Password Button */}
                <button
                  onClick={() => setShowPasswordForm(!showPasswordForm)}
                  className="w-full flex items-center justify-center space-x-2 border border-green-500 text-green-600 py-2.5 sm:py-3 rounded-lg hover:bg-green-50 transition-colors"
                >
                  <Lock className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="text-sm sm:text-base">Change Password</span>
                </button>
              </div>
            </div>
          </div>

          {/* Details Card */}
          <div className="xl:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl border border-green-100 p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-6">Account Information</h3>
              
              <div className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Display Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                      disabled={!isEditing}
                      className="w-full pl-10 sm:pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all duration-200 disabled:bg-gray-50 disabled:text-gray-600 text-sm sm:text-base"
                      placeholder="Enter your display name"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    This is the name that will be shown to other users in chats
                  </p>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
                    <input
                      type="email"
                      value={profile.email}
                      disabled
                      className="w-full pl-10 sm:pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-600 cursor-not-allowed text-sm sm:text-base"
                      placeholder="Email cannot be changed"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Your email address cannot be changed for security reasons
                  </p>
                </div>

                {/* About Section */}
                <div className="bg-green-50 rounded-xl p-4">
                  <div className="flex items-start space-x-3">
                    <Info className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-green-800 mb-1 text-sm sm:text-base">About WhatsApp Clone</h4>
                      <p className="text-xs sm:text-sm text-green-700">
                        Connect with friends and family through secure messaging. Your privacy and security are our top priority.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Account Stats */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-gray-50 rounded-xl p-3 sm:p-4 text-center">
                    <MessageCircle className="h-6 w-6 sm:h-8 sm:w-8 text-green-500 mx-auto mb-2" />
                    <div className="text-xl sm:text-2xl font-bold text-gray-900">0</div>
                    <div className="text-xs sm:text-sm text-gray-600">Active Chats</div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-xl p-3 sm:p-4 text-center">
                    <User className="h-6 w-6 sm:h-8 sm:w-8 text-green-500 mx-auto mb-2" />
                    <div className="text-xl sm:text-2xl font-bold text-gray-900">0</div>
                    <div className="text-xs sm:text-sm text-gray-600">Contacts</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Password Change Form */}
            {showPasswordForm && (
              <div className="bg-white rounded-2xl shadow-xl border border-green-100 p-4 sm:p-6 mt-6">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-6">Change Password</h3>
                
                <div className="space-y-4">
                  {/* Current Password */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
                      <input
                        type={showPasswords.current ? "text" : "password"}
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                        className="w-full pl-10 sm:pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all duration-200 text-sm sm:text-base"
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.current ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
                      <input
                        type={showPasswords.new ? "text" : "password"}
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                        className="w-full pl-10 sm:pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all duration-200 text-sm sm:text-base"
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.new ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
                      <input
                        type={showPasswords.confirm ? "text" : "password"}
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className="w-full pl-10 sm:pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all duration-200 text-sm sm:text-base"
                        placeholder="Confirm new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.confirm ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Password Requirements */}
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-600">
                      Password must be at least 6 characters long
                    </p>
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                    <button
                      onClick={handlePasswordChange}
                      disabled={loading}
                      className="flex-1 flex items-center justify-center space-x-2 bg-green-500 text-white py-3 rounded-xl hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      {loading ? (
                        <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white"></div>
                      ) : (
                        <Lock className="h-4 w-4 sm:h-5 sm:w-5" />
                      )}
                      <span className="text-sm sm:text-base">{loading ? 'Updating...' : 'Update Password'}</span>
                    </button>
                    
                    <button
                      onClick={() => {
                        setShowPasswordForm(false)
                        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
                      }}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors text-sm sm:text-base"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
