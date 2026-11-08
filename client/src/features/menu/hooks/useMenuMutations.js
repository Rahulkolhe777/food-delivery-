import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/context/ToastContext';
import {
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from '@/features/menu/services/menu.service';

export function useMenuMutations(selectedId, { onSuccessCreate, onSuccessUpdate, onSuccessDelete }) {
  const queryClient = useQueryClient();
  const { success, error: toastError } = useToast();

  const invalidateMenu = () => {
    queryClient.invalidateQueries({ queryKey: ['menu', selectedId] });
  };

  const createMutation = useMutation({
    mutationFn: (payload) => createMenuItem(selectedId, payload),
    onSuccess: (res) => {
      success('Dish Created', `"${res.menuItem?.name || 'Dish'}" was added to the menu.`);
      invalidateMenu();
      onSuccessCreate?.(res);
    },
    onError: (err) => {
      toastError('Creation Failed', err.response?.data?.message || 'Could not create menu item.');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ itemId, payload }) => updateMenuItem(selectedId, itemId, payload),
    onSuccess: (res) => {
      success('Dish Updated', `"${res.menuItem?.name || 'Dish'}" was successfully updated.`);
      invalidateMenu();
      onSuccessUpdate?.(res);
    },
    onError: (err) => {
      toastError('Update Failed', err.response?.data?.message || 'Could not update menu item.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (itemId) => deleteMenuItem(selectedId, itemId),
    onSuccess: (res, itemId) => {
      success('Dish Deleted', 'Dish was removed from the catalog.');
      invalidateMenu();
      onSuccessDelete?.(itemId);
    },
    onError: (err) => {
      toastError('Delete Failed', err.response?.data?.message || 'Could not delete menu item.');
    },
  });

  const toggleStockMutation = useMutation({
    mutationFn: ({ itemId, isAvailable }) =>
      updateMenuItem(selectedId, itemId, { isAvailable: !isAvailable }),
    onSuccess: (res) => {
      const isAvail = res.menuItem?.isAvailable;
      success('Stock Status Changed', `Dish marked as ${isAvail ? 'In Stock' : 'Sold Out'}.`);
      invalidateMenu();
    },
    onError: (err) => {
      toastError('Stock Update Failed', err.response?.data?.message || 'Could not update availability.');
    },
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
    toggleStockMutation,
  };
}

