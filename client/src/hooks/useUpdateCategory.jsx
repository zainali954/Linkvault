import { useMutation, useQueryClient } from "@tanstack/react-query";
import {updateCategory } from "../utils/CategoriesFunc";
import { toast } from "react-toastify";

const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCategory,
    onMutate: () => {
      const toastId = toast.loading('Updating category...');
      return { toastId };
    },
    onSuccess: (data, _, context) => {
      toast.update(context.toastId, {
        render: 'Category updated successfully!',
        type: 'success',
        isLoading: false,
        autoClose: 3000,
      });
      queryClient.invalidateQueries(['categories']);
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

export default useUpdateCategory;
