import { useMutation, useQueryClient } from "@tanstack/react-query";
import { favoriteLink, updateLink } from "../utils/LinksFunc";
import { toast } from "react-toastify";

const useFavoriteLink= () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: favoriteLink,
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
      queryClient.invalidateQueries(['favorite-links']);
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

export default useFavoriteLink;
