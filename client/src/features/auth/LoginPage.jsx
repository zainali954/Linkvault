import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { login } from "../../utils/auth";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Loading02Icon } from "hugeicons-react";
import { useAuth } from "../../context/authContext";

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { user, updateSessionId, updateUser } = useAuth()

  const { mutate: loginUser, isPending } = useMutation({
    mutationFn: login,
    onMutate: () => {
      const toastId = toast.loading('logging in...');
      return { toastId };
    },
    onSuccess: (data, _, context) => {

      toast.update(context.toastId, {
        render: 'Logged-In successfully!',
        type: 'success',
        isLoading: false,
        autoClose: 3000,
      });
      if (data?.data.user.isVerified) {
        localStorage.setItem("user", JSON.stringify(data?.data.user))
        localStorage.setItem("sessionId", data?.data.sessionId)
        updateSessionId(data?.data.sessionId)
      }
      updateUser(data?.data.user)

      if (data?.data.user) {
        navigate("/links")
      }
    },
    onError: (error, _, context) => {
      toast.update(context.toastId, {
        render: error?.response?.data?.message || 'Something went wrong',
        type: 'error',
        isLoading: false,
        autoClose: 3000,
      })
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    loginUser({ email, password })
  }
  useEffect(() => {

    if (user) {
      navigate("/links", { replace: true });
    }

  }, [user])


  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const redirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URI;
  const scope = import.meta.env.VITE_GOOGLE_SCOPE || "openid email profile";
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&access_type=offline&prompt=consent`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-900 transition-colors px-4">
      <div
        className="w-full max-w-md bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-2xl shadow-xl p-8"
      >
        <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-6 text-center">
          Welcome Back
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="••••••••"
            />
          </div>
          <Link to={'/forgot-password'} className="text-right text-sm text-purple-600 dark:text-purple-400 hover:underline cursor-pointer">
            Forgot password?
          </Link>
          <button
            disabled={isPending}
            className="w-full cursor-pointer flex justify-center bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition-all"
          >
            {isPending ? <Loading02Icon size={18} className="animate-spin" /> : "Sign In"}
          </button>
        </form>
        <div className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
          Don’t have an account?{" "}
          <Link to={'/signup'} className="text-purple-600 dark:text-purple-400 hover:underline cursor-pointer">
            Sign up
          </Link>
        </div>

        <div className="mt-6">
          <button
            onClick={() => window.location.href = googleAuthUrl}
            className="cursor-pointer w-full flex items-center justify-center gap-3 py-2 px-4 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all text-zinc-700 dark:text-zinc-200 font-medium"
          >
            <svg className="w-5 h-5" viewBox="0 0 533.5 544.3">
              <path
                fill="#4285F4"
                d="M533.5 278.4c0-17.4-1.6-34.1-4.6-50.3H272v95.3h146.9c-6.3 33.5-25 61.9-53.4 81.2l85.7 66.7c49.9-46 78.3-113.8 78.3-193z"
              />
              <path
                fill="#34A853"
                d="M272 544.3c72.6 0 133.5-24 178-65.3l-85.7-66.7c-23.8 16-54.3 25.4-92.3 25.4-70.9 0-131-47.9-152.5-112.4l-89.7 69.2c42.4 83.3 129.3 139.8 241.9 139.8z"
              />
              <path
                fill="#FBBC05"
                d="M119.5 325.3c-10.3-30.2-10.3-62.5 0-92.7l-89.7-69.2C4.6 212.4 0 243.5 0 272s4.6 59.6 29.8 108.6l89.7-69.3z"
              />
              <path
                fill="#EA4335"
                d="M272 107.7c39.5-.6 77.4 13.9 106.4 40.2l79.2-79.2C414.8 24 345.8 0 272 0 159.4 0 72.4 56.6 29.8 139.8l89.7 69.2c21.6-64.5 81.6-112.4 152.5-112.3z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>
        </div>


      </div>
    </div>
  );
}
