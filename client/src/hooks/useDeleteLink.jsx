import { useMutation, useQueryClient } from "@tanstack/react-query";
import {  deletelink } from "../utils/LinksFunc";
import { toast } from "react-toastify";

const useDeleteLink = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletelink,
    onMutate: () => {
      const toastId = toast.loading('Deleting link...');
      return { toastId };
    },
    onSuccess: (data, _, context) => {
      toast.update(context.toastId, {
        render: 'link deleted successfully!',
        type: 'success',
        isLoading: false,
        autoClose: 3000,
      });
      queryClient.invalidateQueries(['links']);
    },
    onError: (error, _, context) => {
      toast.update(context.toastId, {
        render: error?.response?.data?.message || 'Something went wrong',
        type: 'error',
        isLoading: false,
        autoClose: 3000,
      })
    }
  });
};

export default useDeleteLink;
