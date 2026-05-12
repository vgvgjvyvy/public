import { onShow } from "@dcloudio/uni-app";
import { useCartStore } from "@/store/cart.js";
import { watch } from "vue";

export function useCartBadge() {
  const cartStore = useCartStore();

  const isTabBarPage = () => {
    const pages = getCurrentPages();
    if (pages.length === 0) return true;
    const currentPage = pages[pages.length - 1];
    const tabBarPages = [
      "pages/home/home",
      "pages/cate/cate",
      "pages/cart/cart",
      "pages/my/my",
    ];
    return tabBarPages.includes(currentPage.route);
  };

  const updateCartBadge = () => {
    if (!isTabBarPage()) return;

    const count = cartStore.totalCount;
    if (count > 0) {
      uni.setTabBarBadge({
        index: 2,
        text: count > 99 ? "99+" : String(count),
      });
    } else {
      uni.removeTabBarBadge({
        index: 2,
      });
    }
  };

  watch(
    () => cartStore.totalCount,
    () => {
      updateCartBadge();
    },
  );

  onShow(() => {
    updateCartBadge();
  });

  return {
    updateCartBadge,
  };
}
