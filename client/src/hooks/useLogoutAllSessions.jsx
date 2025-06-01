import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { logoutOtherSessions } from "../utils/auth"; 

const useLogoutAllSessions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutOtherSessions, 
    onMutate: () => {
      const toastId = toast.loading("Logging out...");
      return { toastId };
    },
    onSuccess: (_, __, context) => {
      toast.update(context.toastId, {
        render: "Logged out from other sessions successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      queryClient.invalidateQueries(["sessions"]);
    },
    onError: (error, _, context) => {
      toast.update(context.toastId, {
        render: error?.response?.data?.message || "Something went wrong",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    },
  });

};

export default useLogoutAllSessions;
