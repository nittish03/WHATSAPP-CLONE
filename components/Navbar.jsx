'use client'
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { usePathname } from "next/navigation"
import { 
  Menu, 
  X, 
  User, 
  BookOpen, 
  Award, 
  Users, 
  LogOut, 
  BarChart3, 
  FileText, 
  MessageSquare,
  Target,
  Settings
} from "lucide-react"
import Image from "next/image"

export default function NavBar() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  const studentLinks = [
    { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
    { href: "/skills", label: "Browse Skills", icon: Award },
    { href: "/user-skills", label: "My Skills", icon: Target },
    { href: "/courses", label: "Courses", icon: BookOpen },
    { href: "/my-courses", label: "My Courses", icon: BookOpen },
    { href: "/assignments", label: "Assignments", icon: FileText },
    { href: "/discussions", label: "Discussions", icon: MessageSquare },
  ]

  const adminLinks = [
    { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/skills", label: "Manage Skills", icon: Award },
    { href: "/admin/courses", label: "Manage Courses", icon: BookOpen },
    { href: "/admin/assignments", label: "Assignments", icon: FileText },
    { href: "/admin/analytics", label: "Analytics", icon: Settings },
    { href: "/discussions", label: "Discussions", icon: MessageSquare },
  ]

  const instructorLinks = [
    { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
    { href: "/courses", label: "My Courses", icon: BookOpen },
    { href: "/assignments", label: "Assignments", icon: FileText },
    { href: "/discussions", label: "Discussions", icon: MessageSquare },
  ]

  const getLinks = () => {
    if (session?.user?.role === "admin") return adminLinks
    if (session?.user?.role === "instructor") return instructorLinks
    return studentLinks
  }

  const links = getLinks()

  return (
    <>
      <nav
        className={`sticky top-0 px-4 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-200' 
            : 'bg-white/90 backdrop-blur-md shadow-md'
        }`}
      >
        <div className="flex justify-between items-center h-16">
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center justify-center">
            <Link href="/" className="font-extrabold text-lg bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent mr-8">
              Winnovation
            </Link>

            {session && (
              <div className="flex items-center gap-1 text-xs">
                {links.map((link) => {
                  const Icon = link.icon
                  const isActive = pathname === link.href
                  
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`flex items-center text-xs gap-2 px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md'
                          : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-xs xl:text-sm">{link.label}</span>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-3">
            {session ? (
              <Link href="/profile">
                <div className="flex items-center space-x-3">
                  {/* User Profile */}
                  <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors duration-200">
<div className="relative h-7 w-7 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center overflow-hidden">
  {session?.user?.image ? (
    <img 
      src={`/api/image-proxy?url=${encodeURIComponent(session.user.image)}`}
      alt="User profile"
      height={28}
      width={28}
      className="h-full w-full object-cover object-center"
    />
  ) : (
    <User className="h-4 w-4 text-white" />
  )}
</div>

                    
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-gray-900 truncate max-w-24 xl:max-w-32">
                        {session.user.name || session.user.email}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        session.user.role === "admin" 
                          ? "bg-red-100 text-red-700"
                          : session.user.role === "instructor"
                          ? "bg-blue-100 text-blue-700" 
                          : "bg-green-100 text-green-700"
                      }`}>
                        {session.user.role === "admin" ? "Admin" : 
                         session.user.role === "instructor" ? "Instructor" : "Student"}
                      </span>
                    </div>
                  </div>

                  {/* Logout Button */}
                  <button
                    onClick={() => signOut({ callbackUrl: '/login' })}
                    className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="text-sm font-medium hidden xl:block">Logout</span>
                  </button>
                </div>
              </Link>
            ) : (
              /* Guest Navigation */
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors duration-200"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 shadow-md"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-blue-600 p-2 rounded-lg transition-colors duration-200"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white/95 backdrop-blur-lg">
            <div className="px-4 py-4 space-y-3">
              {session ? (
                <>
                  {/* Mobile User Info */}
                  <div className="flex items-center space-x-3 px-3 py-3 bg-gray-50 rounded-lg">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                      {session?.user?.image ? (
                        <Image 
                          src={`/api/image-proxy?url=${encodeURIComponent(session.user.image)}`}
                          alt="User profile"
                          height={40}
                          width={40}
                          className="rounded-full"
                        />
                      ) : (
                        <User className="h-5 w-5 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {session.user.name || session.user.email}
                      </div>
                      <span className={`inline-block mt-1 px-2 py-1 text-xs rounded-full font-medium ${
                        session.user.role === "admin" 
                          ? "bg-red-100 text-red-700"
                          : session.user.role === "instructor"
                          ? "bg-blue-100 text-blue-700" 
                          : "bg-green-100 text-green-700"
                      }`}>
                        {session.user.role === "admin" ? "Admin" : 
                         session.user.role === "instructor" ? "Instructor" : "Student"}
                      </span>
                    </div>
                  </div>

                  {/* Mobile Navigation Links */}
                  <div className="space-y-1">
                    {links.map((link) => {
                      const Icon = link.icon
                      const isActive = pathname === link.href
                      
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors duration-200 ${
                            isActive
                              ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                              : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                          }`}
                          onClick={() => setIsOpen(false)}
                        >
                          <Icon className="h-5 w-5" />
                          <span>{link.label}</span>
                        </Link>
                      )
                    })}
                  </div>

                  {/* Mobile Profile Link */}
                  <Link
                    href="/profile"
                    className="flex items-center space-x-3 px-3 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    <Settings className="h-5 w-5" />
                    <span>Profile Settings</span>
                  </Link>

                  {/* Mobile Logout */}
                  <button
                    onClick={() => {
                      signOut({ callbackUrl: '/login' })
                      setIsOpen(false)
                    }}
                    className="flex items-center space-x-3 px-3 py-3 text-gray-700 hover:text-red-600 hover:bg-red-50 w-full text-left rounded-lg transition-colors duration-200"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                /* Mobile Guest Navigation */
                <div className="space-y-2">
                  <Link
                    href="/login"
                    className="block px-3 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-medium transition-colors duration-200 text-center"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-3 rounded-lg text-sm font-medium transition-colors duration-200 text-center"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
      
      {/* Overlay for mobile menu */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
