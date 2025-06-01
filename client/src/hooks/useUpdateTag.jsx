import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTag } from "../utils/TagsFunc";
import { toast } from "react-toastify";

const useUpdateTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTag,
    onMutate: () => {
      const toastId = toast.loading('Updating tag...');
      return { toastId };
    },
    onSuccess: (data, _, context) => {
      toast.update(context.toastId, {
        render: 'Tag updated successfully!',
        type: 'success',
        isLoading: false,
        autoClose: 3000,
      });
      queryClient.invalidateQueries(['tags']);
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

export default useUpdateTag;
