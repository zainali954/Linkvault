import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../../utils/auth";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

   const { mutate: forgot, isPending } = useMutation({
    mutationFn: forgotPassword,
    onMutate: () => {
      const toastId = toast.loading('Sending password reset Email...');
      return { toastId };
    },
    onSuccess: (data, _, context) => {

      toast.update(context.toastId, {
        render: 'Password reset email sent successfully! Check your mail.',
        type: 'success',
        isLoading: false,
        autoClose: 3000,
      });
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
    e.preventDefault();
    if(email){
        forgot({email})
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-900 transition-colors px-4">
      <div
        className="w-full max-w-md bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-2xl shadow-xl p-8"
      >
        <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-6 text-center">
          Forgot your password?
        </h2>
        <p className="text-sm text-zinc-400 text-center">
          Enter your email and we’ll send you a link to reset your password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="email" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Email address
            </label>
            <input
              type="email"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="you@example.com"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-purple-600 hover:bg-purple-700 transition-colors text-white py-2 px-4 rounded-lg font-medium cursor-pointer"
          >
            Send Reset Link
          </button>
        </form>

        <div className="text-center text-sm text-zinc-500">
          Remember your password?{" "}
          <Link
            to="/login"
            className="text-purple-500 hover:underline hover:text-purple-400"
          >
            Go back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
