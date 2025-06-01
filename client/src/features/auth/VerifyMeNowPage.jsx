import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import { verifyEmail } from "../../utils/auth";

export default function VerifyNowPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const navigate = useNavigate();

  const enabled = !!token && !!email;

  const { status } = useQuery({
    queryKey: ['verify-email', email, token],
    queryFn: () => verifyEmail({ email, token }),
    enabled,
    retry: false,
    refetchOnWindowFocus: false,
    onSuccess: () => {
      toast.success("Verified successfully!");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Verification failed.");
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-900 px-4">
      <div className="w-full max-w-md bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-2xl shadow-xl p-8 text-center">
        {status === "pending" && (
          <div className="flex flex-col items-center gap-4">
            <LoaderIcon />
            <p className="text-zinc-700 dark:text-zinc-300 text-sm">
              Verifying your email...
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center gap-4">
            <CheckIcon />
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
              Email Verified!
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
              Your email has been successfully verified. You can now log in.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition cursor-pointer"
            >
              Go to Login
            </button>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center gap-4">
            <ErrorIcon />
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
              Verification Failed
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
              The link is invalid or has expired. Please request a new one.
            </p>
            <button
              onClick={() => {
                const url = email ? `/verify-email?email=${email}` : "/verify-email";
                navigate(url);
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition cursor-pointer"
            >
              Request Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Icons can be separate components for cleaner code
function LoaderIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="icon icon-tabler icon-tabler-loader-2 text-purple-600"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 3a9 9 0 1 0 9 9" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="icon icon-tabler icon-tabler-circle-check text-green-600"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
      <path d="M9 12l2 2l4 -4" />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="icon icon-tabler icon-tabler-circle-x text-red-600"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
      <path d="M10 10l4 4m0 -4l-4 4" />
    </svg>
  );
}
