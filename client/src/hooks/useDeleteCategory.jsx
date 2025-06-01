import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCategory, deleteCategory } from "../utils/CategoriesFunc";
import { toast } from "react-toastify";

const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCategory,
    onMutate: () => {
      const toastId = toast.loading('Deleting category...');
      return { toastId };
    },
    onSuccess: (data, _, context) => {
      toast.update(context.toastId, {
        render: 'Category deleted successfully!',
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

export default useDeleteCategory;
