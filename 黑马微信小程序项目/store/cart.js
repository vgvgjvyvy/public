import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";

export const useCartStore = defineStore("cart", () => {
  // 购物车商品列表（从本地存储初始化）
  const cartList = ref(uni.getStorageSync("cartList") || []);

  // 计算购物车商品总数
  const totalCount = computed(() => {
    return cartList.value.reduce((sum, item) => sum + item.count, 0);
  });

  // 计算购物车商品总金额
  const totalPrice = computed(() => {
    return cartList.value
      .filter((item) => item.goods_state)
      .reduce((sum, item) => sum + item.goods_price * item.count, 0)
      .toFixed(2);
  });

  // 获取已勾选的商品列表
  const checkedGoods = computed(() => {
    return cartList.value.filter(item => item.goods_state);
  });

  // 计算已勾选商品的总数量（考虑每个商品的 count）
  const checkedCount = computed(() => {
    return cartList.value
      .filter((item) => item.goods_state)
      .reduce((sum, item) => sum + item.count, 0);
  });

  // 是否全选
  const isAllChecked = computed(() => {
    return (
      cartList.value.length > 0 &&
      cartList.value.every((item) => item.goods_state)
    );
  });

  // 添加商品到购物车
  function addToCart(goods) {
    const existIndex = cartList.value.findIndex(
      (item) => item.goods_id === goods.goods_id,
    );
    if (existIndex !== -1) {
      cartList.value[existIndex].count += goods.count || 1;
    } else {
      cartList.value.push({
        ...goods,
        count: goods.count || 1,
        goods_state: true,
      });
    }
  }

  // 更新商品数量
  function updateCount(goodsId, count) {
    const goods = cartList.value.find((item) => item.goods_id === goodsId);
    if (goods) {
      goods.count = count;
    }
  }

  // 更新商品勾选状态
  function updateGoodsState(goodsId, state) {
    const goods = cartList.value.find((item) => item.goods_id === goodsId);
    if (goods) {
      goods.goods_state = state;
    }
  }

  // 全选/取消全选
  function updateAllGoodsState(state) {
    cartList.value.forEach((item) => {
      item.goods_state = state;
    });
  }

  // 删除商品
  function removeGoods(goodsId) {
    const index = cartList.value.findIndex((item) => item.goods_id === goodsId);
    if (index !== -1) {
      cartList.value.splice(index, 1);
    }
  }

  // 清空购物车
  function clearCart() {
    cartList.value = [];
  }

  // 监听购物车数据变化，自动保存到本地存储
  watch(
    cartList,
    (newVal) => {
      uni.setStorageSync("cartList", newVal);
    },
    { deep: true },
  );

  // 设置购物车列表(用于从服务器同步数据)
  function setCartList(list) {
    cartList.value = list;
  }

  return {
    cartList,
    totalCount,
    totalPrice,
    checkedGoods,
    checkedCount,
    isAllChecked,
    addToCart,
    updateCount,
    updateGoodsState,
    updateAllGoodsState,
    removeGoods,
    clearCart,
    setCartList,
  };
});
