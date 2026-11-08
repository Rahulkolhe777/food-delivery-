import { useCart } from '@/features/cart';

export function useRestaurantCartSync(restaurant) {
  const cart = useCart();
  const isCurrentRestaurantCart = cart.restaurantId === restaurant?._id;

  const getItemQuantity = (itemId) => {
    if (!isCurrentRestaurantCart) return 0;
    const found = cart.items.find((i) => i.menuItemId === itemId);
    return found ? found.quantity : 0;
  };

  const handleAddItem = (item) => {
    if (!restaurant?.isOpen) return;
    cart.addItem(restaurant._id, restaurant.name, {
      menuItemId: item._id,
      name: item.name,
      price: item.price,
      isVeg: item.isVeg,
      quantity: 1,
    });
  };

  const handleIncrease = (item) => {
    if (!restaurant?.isOpen) return;
    const currentQty = getItemQuantity(item._id);
    if (currentQty === 0) {
      handleAddItem(item);
    } else {
      cart.updateQuantity(item._id, currentQty + 1);
    }
  };

  const handleDecrease = (item) => {
    const currentQty = getItemQuantity(item._id);
    if (currentQty > 0) {
      cart.updateQuantity(item._id, currentQty - 1);
    }
  };

  return {
    ...cart,
    isCurrentRestaurantCart,
    getItemQuantity,
    handleAddItem,
    handleIncrease,
    handleDecrease,
  };
}
