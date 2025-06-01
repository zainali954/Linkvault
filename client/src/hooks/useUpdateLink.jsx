import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateLink } from "../utils/LinksFunc";
import { toast } from "react-toastify";

const useUpdateLink = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateLink,
    onMutate: () => {
      const toastId = toast.loading('Updating link...');
      return { toastId };
    },
    onSuccess: (data, _, context) => {
      toast.update(context.toastId, {
        render: 'Link updated successfully!',
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

export default useUpdateLink;
