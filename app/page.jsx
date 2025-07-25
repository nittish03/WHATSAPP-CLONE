'use client'
import { useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import axios from "axios"
import { 
  MessageCircle, 
  Users, 
  Search, 
  Plus, 
  Send, 
  UserPlus, 
  MoreVertical,
  User,
  LogOut,
  Settings,
  Archive,
  Bell,
  Moon,
  Palette,
  X
} from "lucide-react"
import Image from "next/image"
import { toast } from "react-toastify"
import NewChatModal from "@/components/NewChatModal"

export default function ChatPage() {
  const { data: session } = useSession()
  const [chats, setChats] = useState([])
  const [selectedChat, setSelectedChat] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showNewChatModal, setShowNewChatModal] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showOptionsMenu, setShowOptionsMenu] = useState(false)

  useEffect(() => {
    loadChats()
  }, [])

  useEffect(() => {
    if (selectedChat) {
      loadMessages(selectedChat.id)
      
      const interval = setInterval(() => {
        loadMessages(selectedChat.id, true)
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [selectedChat])

  const loadChats = async () => {
    try {
      const response = await axios.get('/api/chats')
      setChats(response.data)
    } catch (error) {
      console.error('Error loading chats:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadMessages = async (chatId, isBackground = false) => {
    try {
      const response = await axios.get(`/api/chats/${chatId}/messages`)
      if (JSON.stringify(response.data) !== JSON.stringify(messages)) {
        setMessages(response.data)
      }
    } catch (error) {
      if (!isBackground) {
        console.error('Error loading messages:', error)
      }
    }
  }

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedChat) return

    try {
      await axios.post(`/api/chats/${selectedChat.id}/messages`, {
        content: newMessage
      })
      setNewMessage("")
      loadMessages(selectedChat.id)
      loadChats()
    } catch (error) {
      toast.error("Failed to send message")
    }
  }

  const handleChatCreated = (newChat) => {
    setChats(prev => [newChat, ...prev])
    setSelectedChat(newChat)
  }

  const getChatName = (chat) => {
    if (chat.isGroup) {
      return chat.name || 'Group Chat'
    }
    const otherParticipant = chat.participants.find(p => p.userId !== session?.user?.id)
    return otherParticipant?.user?.name || 'Unknown User'
  }

  const getChatAvatar = (chat) => {
    if (chat.isGroup) {
      return chat.avatar || null
    }
    const otherParticipant = chat.participants.find(p => p.userId !== session?.user?.id)
    return otherParticipant?.user?.image || null
  }

  const filteredChats = chats.filter(chat => 
    getChatName(chat).toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <MessageCircle className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Welcome to WhatsApp Clone</h2>
          <p className="text-gray-600 mb-6">Please sign in to start chatting</p>
          <div className="space-x-4">
            <button
              onClick={() => window.location.href = '/login'}
              className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => window.location.href = '/signup'}
              className="border border-green-500 text-green-500 px-6 py-2 rounded-lg hover:bg-green-50 transition-colors"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex bg-gray-100">
      {/* WhatsApp-style Sidebar */}
      <div className="w-full md:w-1/3 bg-white border-r border-gray-300 flex flex-col">
        {/* WhatsApp Header with Profile */}
        <div className="bg-gray-100 border-b border-gray-300">
          {/* Top Bar with Profile and Menu */}
          <div className="flex items-center justify-between p-4 bg-gray-200">
            {/* User Profile Section */}
            <div className="flex items-center space-x-3">
              <div 
                className="relative cursor-pointer"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-300 flex items-center justify-center">
                  {session?.user?.image ? (
                    <Image
                      src={`/api/image-proxy?url=${encodeURIComponent(session.user.image)}`}
                      alt="Profile"
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="h-6 w-6 text-gray-600" />
                  )}
                </div>
                {/* Online indicator */}
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              
              <div className="hidden md:block">
                <h3 className="font-medium text-gray-900 text-sm">
                  {session.user.name || session.user.email}
                </h3>
                <p className="text-xs text-gray-500">Online</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-1">
              {/* New Chat */}
              <button
                onClick={() => setShowNewChatModal(true)}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-300 rounded-full transition-colors"
                title="New Chat"
              >
                <MessageCircle className="h-5 w-5" />
              </button>

              {/* Options Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowOptionsMenu(!showOptionsMenu)}
                  className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-300 rounded-full transition-colors"
                  title="Menu"
                >
                  <MoreVertical className="h-5 w-5" />
                </button>

                {/* Options Dropdown */}
                {showOptionsMenu && (
                  <div className="absolute right-0 top-12 bg-white rounded-lg shadow-lg border border-gray-200 py-2 w-48 z-50">
                    <button
                      onClick={() => {
                        setShowNewChatModal(true)
                        setShowOptionsMenu(false)
                      }}
                      className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <UserPlus className="h-4 w-4" />
                      <span>New Group</span>
                    </button>
                    <button
                      onClick={() => setShowOptionsMenu(false)}
                      className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Archive className="h-4 w-4" />
                      <span>Archived</span>
                    </button>
                    <button
                      onClick={() => setShowOptionsMenu(false)}
                      className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </button>
                    <hr className="my-1 border-gray-200" />
                    <button
                      onClick={() => {
                        signOut({ callbackUrl: '/login' })
                        setShowOptionsMenu(false)
                      }}
                      className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Log out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="px-3 pb-3">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search or start new chat"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto bg-white">
          {filteredChats.length > 0 ? (
            filteredChats.map(chat => (
              <div
                key={chat.id}
                onClick={() => setSelectedChat(chat)}
                className={`flex items-center space-x-3 p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${
                  selectedChat?.id === chat.id ? 'bg-gray-100' : ''
                }`}
              >
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-300 flex items-center justify-center">
                    {getChatAvatar(chat) ? (
                      <Image
                        src={getChatAvatar(chat)}
                        alt="Avatar"
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-green-500 flex items-center justify-center text-white font-semibold text-lg">
                        {getChatName(chat).charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>

                {/* Chat Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-gray-900 truncate text-sm">
                      {getChatName(chat)}
                    </h3>
                    {chat.lastMessageAt && (
                      <span className="text-xs text-gray-500 flex-shrink-0">
                        {new Date(chat.lastMessageAt).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500 truncate">
                      {chat.lastMessage || 'No messages yet'}
                    </p>
                    {/* Message count badge could go here */}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <MessageCircle className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No chats yet</h3>
              <p className="text-gray-500 mb-4 text-sm">Start a conversation with your contacts</p>
              <button
                onClick={() => setShowNewChatModal(true)}
                className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition-colors flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Start chat</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="hidden md:flex flex-1 flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="bg-gray-100 border-b border-gray-300 p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-300 flex items-center justify-center">
                  {getChatAvatar(selectedChat) ? (
                    <Image
                      src={getChatAvatar(selectedChat)}
                      alt="Avatar"
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-green-500 flex items-center justify-center text-white font-semibold">
                      {getChatName(selectedChat).charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h2 className="font-medium text-gray-900">{getChatName(selectedChat)}</h2>
                  {selectedChat.isGroup ? (
                    <p className="text-sm text-gray-500">
                      {selectedChat.participants.length} participants
                    </p>
                  ) : (
                    <p className="text-sm text-gray-500">Online</p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-600 hover:bg-gray-200 rounded-full">
                    <Search className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-600 hover:bg-gray-200 rounded-full">
                    <MoreVertical className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map(message => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.senderId === session?.user?.id ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow-sm ${
                      message.senderId === session?.user?.id
                        ? 'bg-green-500 text-white rounded-br-none'
                        : 'bg-white text-gray-900 rounded-bl-none'
                    }`}
                  >
                    {selectedChat.isGroup && message.senderId !== session?.user?.id && (
                      <p className="text-xs font-semibold text-green-600 mb-1">
                        {message.sender.name}
                      </p>
                    )}
                    <p className="text-sm">{message.content}</p>
                    <p
                      className={`text-xs mt-1 text-right ${
                        message.senderId === session?.user?.id
                          ? 'text-green-100'
                          : 'text-gray-500'
                      }`}
                    >
                      {new Date(message.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <form onSubmit={sendMessage} className="p-4 bg-gray-100 border-t border-gray-300">
              <div className="flex items-center space-x-3">
                <div className="flex-1 bg-white rounded-full border border-gray-300 px-4 py-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message"
                    className="w-full outline-none text-sm"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition-colors"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mb-6">
                <MessageCircle className="h-16 w-16 text-gray-400" />
              </div>
              <h3 className="text-xl font-light text-gray-900 mb-2">WhatsApp Clone Web</h3>
              <p className="text-gray-500 text-sm max-w-md">
                Send and receive messages without keeping your phone online.<br />
                Use WhatsApp on up to 4 linked devices and 1 phone at the same time.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Profile Menu Modal */}
      {showProfileMenu && (
        <div className="fixed inset-0 bg-black/20 z-50" onClick={() => setShowProfileMenu(false)}>
          <div className="absolute left-4 top-20 bg-white rounded-lg shadow-xl border border-gray-200 w-80 p-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-300">
                {session?.user?.image ? (
                  <Image
                    src={`/api/image-proxy?url=${encodeURIComponent(session.user.image)}`}
                    alt="Profile"
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-green-500 flex items-center justify-center text-white text-xl font-semibold">
                    {session.user.name?.charAt(0) || 'U'}
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-medium text-lg text-gray-900">
                  {session.user.name || 'User'}
                </h3>
                <p className="text-sm text-gray-500">{session.user.email}</p>
                <p className="text-xs text-green-600 mt-1">Online</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <button className="flex items-center space-x-3 w-full p-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                <User className="h-5 w-5" />
                <span>Profile</span>
              </button>
              <button className="flex items-center space-x-3 w-full p-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </button>
              <hr className="my-2" />
              <button
                onClick={() => {
                  signOut({ callbackUrl: '/login' })
                  setShowProfileMenu(false)
                }}
                className="flex items-center space-x-3 w-full p-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <LogOut className="h-5 w-5" />
                <span>Log out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close menus */}
      {(showOptionsMenu || showProfileMenu) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setShowOptionsMenu(false)
            setShowProfileMenu(false)
          }} 
        />
      )}

      {/* New Chat Modal */}
      <NewChatModal
        isOpen={showNewChatModal}
        onClose={() => setShowNewChatModal(false)}
        onChatCreated={handleChatCreated}
      />
    </div>
  )
}
