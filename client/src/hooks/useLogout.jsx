import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { logout } from "../utils/auth";
import { useAuth } from "../context/authContext";

const useLogout = ()=>{
    const {updateUser} = useAuth()
    return useMutation({
        mutationFn: logout,
        onMutate: () => {
          const toastId = toast.loading('logging out...');
          return { toastId };
        },
        onSuccess: (data, _, context) => {
          
          toast.update(context.toastId, {
            render: 'Logged-Out successfully!',
            type: 'success',
            isLoading: false,
            autoClose: 3000,
          });
          localStorage.removeItem("user")
          updateUser("")
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
    
}

export default useLogout;