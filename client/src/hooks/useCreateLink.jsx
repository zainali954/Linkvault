import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createLink } from "../utils/LinksFunc";
import { toast } from "react-toastify";

const useCreateLink = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createLink,
    onMutate: () => {
      const toastId = toast.loading('Creating Link...');
      return { toastId };
    },
    onSuccess: (data, _, context) => {
      toast.update(context.toastId, {
        render: 'Link Created successfully!',
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

export default useCreateLink;
