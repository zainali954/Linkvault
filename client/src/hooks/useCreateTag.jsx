import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTag } from "../utils/TagsFunc";
import { toast } from "react-toastify";

const useCreateTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTag,
    onMutate: () => {
      const toastId = toast.loading('Creating tag...');
      return { toastId };
    },
    onSuccess: (data, _, context) => {
      toast.update(context.toastId, {
        render: 'Tag created successfully!',
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

export default useCreateTag;
