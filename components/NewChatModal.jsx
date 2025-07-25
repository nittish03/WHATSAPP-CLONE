'use client'
import { useState, useEffect } from 'react'
import { X, Search, User, Users } from 'lucide-react'
import Image from 'next/image'
import axios from 'axios'
import { toast } from 'react-toastify'

export default function NewChatModal({ isOpen, onClose, onChatCreated }) {
  const [users, setUsers] = useState([])
  const [selectedUsers, setSelectedUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isGroup, setIsGroup] = useState(false)
  const [groupName, setGroupName] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      loadUsers()
    }
  }, [isOpen])

  const loadUsers = async () => {
    try {
      const response = await axios.get('/api/users')
      setUsers(response.data)
    } catch (error) {
      console.error('Error loading users:', error)
    }
  }

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const toggleUserSelection = (userId) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  const createChat = async () => {
    if (selectedUsers.length === 0) {
      toast.error('Please select at least one user')
      return
    }

    if (isGroup && !groupName.trim()) {
      toast.error('Please enter a group name')
      return
    }

    setLoading(true)
    try {
      const response = await axios.post('/api/chats', {
        participantIds: selectedUsers,
        isGroup: selectedUsers.length > 1 || isGroup,
        name: isGroup ? groupName : null
      })

      toast.success('Chat created successfully!')
      onChatCreated(response.data)
      handleClose()
    } catch (error) {
      toast.error('Failed to create chat')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setSelectedUsers([])
    setSearchTerm('')
    setGroupName('')
    setIsGroup(false)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">New Chat</h2>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Group toggle */}
        <div className="mb-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={isGroup}
              onChange={(e) => setIsGroup(e.target.checked)}
              className="rounded border-gray-300"
            />
            <span className="text-sm font-medium text-gray-700">Create Group Chat</span>
          </label>
        </div>

        {/* Group name input */}
        {isGroup && (
          <div className="mb-4">
            <input
              type="text"
              placeholder="Group name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        )}

        {/* Search */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {/* User list */}
        <div className="flex-1 overflow-y-auto mb-4">
          <div className="space-y-2">
            {filteredUsers.map(user => (
              <div
                key={user.id}
                onClick={() => toggleUserSelection(user.id)}
                className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedUsers.includes(user.id)
                    ? 'bg-green-100 border-2 border-green-500'
                    : 'hover:bg-gray-100'
                }`}
              >
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.name}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="h-5 w-5 text-gray-500" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{user.name}</h3>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                {selectedUsers.includes(user.id) && (
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Selected users count */}
        {selectedUsers.length > 0 && (
          <div className="mb-4 text-sm text-gray-600">
            {selectedUsers.length} user{selectedUsers.length > 1 ? 's' : ''} selected
          </div>
        )}

        {/* Create button */}
        <button
          onClick={createChat}
          disabled={loading || selectedUsers.length === 0}
          className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Creating...' : 'Create Chat'}
        </button>
      </div>
    </div>
  )
}
