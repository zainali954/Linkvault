import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { resendVerificationEmail, verifyEmail } from "../../utils/auth";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

export default function VerifyEmailPage() {
    const [timer, setTimer] = useState(60);
    const [resendDisabled, setResendDisabled] = useState(true);
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [searchParams] = useSearchParams();
    const existing = searchParams.get("email")

    const { mutate: resendVerifyEmail, isPending } = useMutation({
        mutationFn: resendVerificationEmail,
        onMutate: () => {
            const toastId = toast.loading('Resending...');
            return { toastId };
        },
        onSuccess: (data, _, context) => {

            toast.update(context.toastId, {
                render: 'Sent successfully!',
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

    useEffect(() => {
        if (existing) {
            setEmail(existing);
        }
    }, [existing]);

    useEffect(() => {
        let interval;
        if (resendDisabled) {
            interval = setInterval(() => {
                setTimer((prev) => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        setResendDisabled(false);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [resendDisabled]);

    const handleResend = async () => {
        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            setError("Please enter a valid email address.");
            return;
        }

        setError("");
        setResendDisabled(true);
        setTimer(60);

        try {
            resendVerifyEmail({ email })
        } catch (err) {
            console.error("Error resending verification email:", err);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-900 transition-colors px-4">
            <div
                className="w-full max-w-md bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-2xl shadow-xl p-8 text-center"
            >
                <div className="flex justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-mail-check"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M11 19h-6a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v6" /><path d="M3 7l9 6l9 -6" /><path d="M15 19l2 2l4 -4" /></svg>
                </div>
                <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                    Check your email
                </h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
                    We've sent a verification link to your email address. Please verify it to continue.
                </p>

                {!existing && !resendDisabled && (
                    <div className="mb-4">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
                        />
                        {error && (
                            <p className="text-red-500 text-sm mt-1">{error}</p>
                        )}
                    </div>
                )}


                <button
                    onClick={handleResend}
                    disabled={resendDisabled}
                    className={`w-full ${resendDisabled
                        ? "bg-zinc-400 cursor-not-allowed"
                        : "bg-purple-600 hover:bg-purple-700 cursor-pointer"
                        } text-white py-2 rounded-lg transition-all`}
                >
                    {resendDisabled ? `Resend in ${timer}s` : "Resend Verification Email"}
                </button>

                <div className="mt-6 text-sm text-zinc-600 dark:text-zinc-400">
                    Didn’t get the email? Check your spam folder or{" "}
                    <Link to={'/login'}
                        className="text-purple-600 dark:text-purple-400 hover:underline cursor-pointer"
                    >
                        go back to login
                    </Link>.
                </div>
            </div>
        </div>
    );
}
