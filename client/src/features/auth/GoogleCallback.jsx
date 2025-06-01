import { useRef, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/authContext';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { googleLogin } from '../../utils/auth';

const GoogleCallback = () => {
  const hasRun = useRef(false);
  const navigate = useNavigate();
  const { updateUser } = useAuth();

  const { mutate: login } = useMutation({
    mutationFn: googleLogin,
    onMutate: () => {
      const toastId = toast.loading('Logging in...');
      return { toastId };
    },
    onSuccess: (data, _, context) => {
      toast.update(context.toastId, {
        render: 'Logged in successfully!',
        type: 'success',
        isLoading: false,
        autoClose: 3000,
      });
      localStorage.setItem("user", JSON.stringify(data?.data.user));
      updateUser(data?.data.user);
      navigate('/links');
    },
    onError: (error, _, context) => {
      toast.update(context.toastId, {
        render: error?.response?.data?.message || 'Something went wrong',
        type: 'error',
        isLoading: false,
        autoClose: 3000,
      });
    },
  });

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code");

    if (code && !hasRun.current) {
      hasRun.current = true;
      login({ code });
    } else if (!code) {
      navigate('/login');
    }
  }, [navigate]);

  return <p>Logging in...</p>;
};


export default GoogleCallback