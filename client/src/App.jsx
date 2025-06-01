import React from 'react'
import MainLayout from './layouts/MainLayout'
import LinkList from './features/links/LinkList'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import CategoriesList from './features/categories/CategoriesList'
import TagsList from './features/tags/TagsList'
import { ToastContainer } from 'react-toastify'
import FavoriteLinks from './features/favorite/FavoriteLinks'
import HomePage from './pages/HomePage'
import LoginPage from './features/auth/LoginPage'
import SignupPage from './features/auth/SignupPage'
import ForgotPasswordPage from './features/auth/ForgotPassword'
import ResetPasswordPage from './features/auth/ResetPassword'
import GoogleCallback from './features/auth/GoogleCallback'
import VerifyEmailPage from './features/auth/VerifyEmailPage'
import VerifyNowPage from './features/auth/VerifyMeNowPage'
import ProtectedRoute from './utils/ProtectedRoute'
import Settings from './pages/SettingsPage'
import SessionsPage from './pages/SessionsPage'
import useDarkMode from './hooks/useDarkMode'

const App = () => {
  const queryClient = new QueryClient()
  const [darkMode] = useDarkMode()
  return (
    <div>
      <QueryClientProvider client={queryClient}>
        <ToastContainer
          theme= {darkMode ?'dark' : 'light'}
        />
        <BrowserRouter>
          <Routes>

            <Route path={'/login'} element={<LoginPage />} />
            <Route path={'/forgot-password'} element={<ForgotPasswordPage />} />
            <Route path={'/reset-password'} element={<ResetPasswordPage />} />
            <Route path={'/signup'} element={<SignupPage />} />
            <Route path={'/auth/google/callback'} element={<GoogleCallback />} />
            <Route path={'/verify-email'} element={<VerifyEmailPage />} />
            <Route path={'/verify'} element={<VerifyNowPage />} />

            <Route path='/' element={<HomePage />} />
            <Route path='/links' element={<ProtectedRoute><MainLayout Children={<LinkList />} /></ProtectedRoute>} />
            <Route path='/categories' element={<ProtectedRoute><MainLayout Children={<CategoriesList />} /></ProtectedRoute>} />
            <Route path='/tags' element={<ProtectedRoute><MainLayout Children={<TagsList />} /></ProtectedRoute>} />
            <Route path='/favorite' element={<ProtectedRoute><MainLayout Children={<FavoriteLinks />} /></ProtectedRoute>} />
            <Route path='/settings' element={<ProtectedRoute><MainLayout Children={<Settings />} /></ProtectedRoute>} />
            <Route path='/sessions' element={<ProtectedRoute><MainLayout Children={<SessionsPage />} /></ProtectedRoute>} />


          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </div>
  )
}

export default App
