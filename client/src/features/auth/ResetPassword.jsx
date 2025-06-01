import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { resetPassword } from "../../utils/auth";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

    const { mutate: reset, isPending } = useMutation({
    mutationFn: resetPassword,
    onMutate: () => {
      const toastId = toast.loading('Reseting password...');
      return { toastId };
    },
    onSuccess: (data, _, context) => {

      toast.update(context.toastId, {
        render: 'Password reset successfully!',
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

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    if(password && token){
        reset({password, token})
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-900 transition-colors px-4">
      <div
        className="w-full max-w-md bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-2xl shadow-xl p-8"
      >
        <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-6 text-center">
          Reset Your Password
        </h2>
        <p className="text-sm text-zinc-400 text-center">
          Enter a strong new password to secure your account.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">New Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="New password"
            />
          </div>

          <div className="flex flex-col">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Confirm Password</label>
            <input
              type="password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Confirm new password"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 transition-colors text-white py-2 px-4 rounded-lg font-medium cursor-pointer"
          >
            Reset Password
          </button>
        </form>

        <div className="text-center text-sm text-zinc-500">
          Back to{" "}
          <Link
            to="/login"
            className="text-purple-500 hover:underline hover:text-purple-400"
          >
            login
          </Link>
        </div>
      </div>
    </div>
  );
}
