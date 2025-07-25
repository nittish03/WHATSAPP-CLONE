'use client'
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import axios from "axios"
import { MessageCircle, Users, Search, Plus, Send } from "lucide-react"
import Image from "next/image"
import { toast } from "react-toastify"

export default function ChatPage() {
  const { data: session } = useSession()
  const [chats, setChats] = useState([])
  const [selectedChat, setSelectedChat] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    loadChats()
  }, [])

  useEffect(() => {
    if (selectedChat) {
      loadMessages(selectedChat.id)
      
      // Poll for new messages every 1 second
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
      loadChats() // Refresh chat list to update last message
    } catch (error) {
      toast.error("Failed to send message")
    }
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
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/3 bg-white border-r border-gray-300 flex flex-col">
        {/* Header */}
        <div className="p-4 bg-green-600 text-white">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">Chats</h1>
            <button className="p-2 hover:bg-green-700 rounded-full">
              <Plus className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search chats..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {filteredChats.map(chat => (
            <div
              key={chat.id}
              onClick={() => setSelectedChat(chat)}
              className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${
                selectedChat?.id === chat.id ? 'bg-green-50' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                  {getChatAvatar(chat) ? (
                    <Image
                      src={getChatAvatar(chat)}
                      alt="Avatar"
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-green-500 flex items-center justify-center text-white font-semibold">
                      {getChatName(chat).charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900 truncate">
                      {getChatName(chat)}
                    </h3>
                    {chat.lastMessageAt && (
                      <span className="text-xs text-gray-500">
                        {new Date(chat.lastMessageAt).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 truncate">
                    {chat.lastMessage || 'No messages yet'}
                  </p>
                </div>
              </div>
            </div>
          ))}
          {filteredChats.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              <MessageCircle className="mx-auto h-12 w-12 text-gray-300 mb-4" />
              <p>No chats found</p>
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 bg-green-600 text-white border-b">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-700 rounded-full flex items-center justify-center overflow-hidden">
                  {getChatAvatar(selectedChat) ? (
                    <Image
                      src={getChatAvatar(selectedChat)}
                      alt="Avatar"
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white font-semibold">
                      {getChatName(selectedChat).charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <h2 className="font-semibold">{getChatName(selectedChat)}</h2>
                  {selectedChat.isGroup && (
                    <p className="text-sm text-green-100">
                      {selectedChat.participants.length} participants
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map(message => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.senderId === session?.user?.id ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.senderId === session?.user?.id
                        ? 'bg-green-500 text-white'
                        : 'bg-white text-gray-900 border'
                    }`}
                  >
                    {selectedChat.isGroup && message.senderId !== session?.user?.id && (
                      <p className="text-xs font-semibold text-green-600 mb-1">
                        {message.sender.name}
                      </p>
                    )}
                    <p className="text-sm">{message.content}</p>
                    <p
                      className={`text-xs mt-1 ${
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
            <form onSubmit={sendMessage} className="p-4 border-t bg-white">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
                />
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
              <MessageCircle className="mx-auto h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Select a chat to start messaging
              </h3>
              <p className="text-gray-500">
                Choose from your existing conversations or start a new one
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
