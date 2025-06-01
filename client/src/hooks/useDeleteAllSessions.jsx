import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { deleteAllSessions } from "../utils/auth";

const useDeleteAllSessions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAllSessions,
    onMutate: () => {
      const toastId = toast.loading("Deleting all sessions...");
      return { toastId };
    },
    onSuccess: (_, __, context) => {
      toast.update(context.toastId, {
        render: "All sessions deleted successfully!",
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

export default useDeleteAllSessions;
