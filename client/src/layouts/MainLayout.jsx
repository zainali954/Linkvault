import { useState, useRef, useEffect } from 'react'
import useDarkMode from '../hooks/useDarkMode'
import Sidebar from '../components/Sidebar'

import {
  Moon02Icon,
  Sun03Icon,
  UserIcon,
  Menu01Icon,
  Settings01Icon,
  Logout02Icon,
} from 'hugeicons-react'
import { useNavigate } from 'react-router-dom'
import useLogout from '../hooks/useLogout'

const MainLayout = ({ Children }) => {
  const [isDarkMode, toggleDarkMode] = useDarkMode()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const menuRef = useRef(null)

    const navigate= useNavigate()
  

   const { mutate: logOutUser,  isPending } = useLogout()

  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className='min-h-screen h-screen flex bg-neutral-50 dark:bg-neutral-800'>
      {/* Sidebar */}
      <Sidebar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

      <div className='flex-1 overflow-auto'>

        {/* Topbar */}
        <div className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700 h-12 flex items-center justify-between px-4">
          {/* Left section */}
          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 dark:text-neutral-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              title="Toggle Menu"
            >
              <Menu01Icon size={18} />
            </button>

            <p className="text-black dark:text-neutral-100 font-bold">LinkVault</p>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-4 dark:text-neutral-200 relative" ref={menuRef}>
            <button
              onClick={toggleDarkMode}
              title='Toggle Theme'
              className="p-2 cursor-pointer rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              {isDarkMode ? <Sun03Icon size={18} /> : <Moon02Icon size={18} />}
            </button>

          

            {/* User menu button */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(prev => !prev)}
                title='User Profile'
                className="p-2 cursor-pointer rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <UserIcon size={18} />
              </button>

              {/* Dropdown menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-md shadow-lg z-50">
                  <button
                    className="flex items-center w-full px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-sm gap-2"
                    onClick={() => {
                      // Navigate to settings
                      navigate("/settings")
                    }}
                  >
                    <Settings01Icon size={16} /> Settings
                  </button>
                  <button
                    className="flex items-center w-full px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-sm gap-2"
                    disabled={isPending}
                    onClick={() => {
                      logOutUser()
                    }}
                  >
                    <Logout02Icon size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className='m-4'>
          {Children}
        </div>
      </div>
    </div>
  )
}

export default MainLayout
