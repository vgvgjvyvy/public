<template>
  <view>
    <view
      class="cart-container"
      v-if="goodsList.length !== 0">
      <!-- 收货地址组件 -->
      <my-address></my-address>

      <!-- 商品列表的标题区域 -->
      <view class="cart-title">
        <uni-icons
          type="shop"
          size="26"></uni-icons>

        <view class="title-text">购物车</view>
      </view>

      <!-- 商品列表 -->
      <view class="goods-list">
        <uni-swipe-action>
          <uni-swipe-action-item
            v-for="item in goodsList"
            :key="item.goods_id"
            @change="(e) => handleSwipeChange(e, item)">
            <!-- 自定义右侧删除按钮 -->
            <template #right>
              <view
                class="delete-btn"
                @click="deleteGoods(item)"
                >删除</view
              >
            </template>
            <my-goods
              :show-radio="true"
              :show-number-box="true"
              :goods="item"
              @click="goToDetail"
              @radio-change="handleGoodsClick"
              @num-change="handleNumChange" />
          </uni-swipe-action-item>
        </uni-swipe-action>
      </view>

      <!-- 结算组件 -->
      <my-settle></my-settle>
    </view>

    <!-- 空白购物车的区域 -->
    <view
      v-else
      class="empty-cart">
      <view class="empty-wrapper">
        <image
          class="empty-image"
          src="/static/cart_empty@2x.png"
          mode="scaleToFill" />
        <text class="empty-text">购物车空空如也~</text>
        <text class="empty-desc">快去挑选心仪的商品吧</text>
        <button
          class="go-shopping-btn"
          @click="goToShopping">
          去逛逛
        </button>
      </view>
    </view>
  </view>
</template>

<script setup>
  import { useCartBadge } from "@/composables/useCartBadge.js";
  import { useCartStore } from "@/store/cart.js";
  import { ref, onBeforeUnmount } from "vue";
  import MyGoods from "@/components/my-goods/my-goods.vue";

  useCartBadge();
  const cartStore = useCartStore();
  const goodsList = cartStore.cartList;
  const openedItemId = ref(null);
  let resetTimer = null;

  // 删除商品的选项
  const options = [
    {
      text: "删除",
    },
  ];

  // 删除商品
  const deleteGoods = (goods) => {
    cartStore.removeGoods(goods.goods_id);
  };

  // 点击商品项，切换选中状态
  const handleGoodsClick = (goods) => {
    cartStore.updateGoodsState(goods.goods_id, !goods.goods_state);
  };

  // 跳转详情页
  const goToDetail = (item) => {
    console.log("goToDetail被调用，商品ID:", item.goods_id);
    console.log("当前打开的项ID:", openedItemId.value);
    // 如果有打开的滑动项，则不跳转
    if (openedItemId.value !== null) {
      console.log("滑动面板打开，阻止跳转");
      return;
    }
    uni.navigateTo({
      url: "/subpkg/goods_detail/goods_detail?goods_id=" + item.goods_id,
    });
  };

  // 滑动状态变化
  const handleSwipeChange = (e, item) => {
    console.log("滑动事件触发:", e, "商品ID:", item.goods_id);
    // e 直接是字符串: 'right' | 'left' | 'none'
    if (e === "right" || e === "left") {
      openedItemId.value = item.goods_id;
      // 清除之前的定时器
      if (resetTimer) clearTimeout(resetTimer);
    } else {
      // 延迟重置，避免点击事件在状态重置后触发跳转
      if (resetTimer) clearTimeout(resetTimer);
      resetTimer = setTimeout(() => {
        openedItemId.value = null;
        console.log("延迟重置打开项:", openedItemId.value);
      }, 300);
    }
    console.log("当前打开的项:", openedItemId.value);
  };

  // 数量变化处理
  const handleNumChange = (e) => {
    cartStore.updateCount(e.goods_id, e.goods_count);
  };

  // 组件卸载时清理定时器
  onBeforeUnmount(() => {
    if (resetTimer) {
      clearTimeout(resetTimer);
      resetTimer = null;
    }
  });

  // 去逛逛按钮
  const goToShopping = () => {
    uni.switchTab({
      url: "/pages/home/home",
    });
  };
</script>

<style lang="scss" scoped>
  .cart-container {
    padding-bottom: 100rpx;
  }

  .cart-title {
    display: flex;
    align-items: center;
    padding: 20rpx;
    border-bottom: 2rpx solid #dcdcdc;

    .title-text {
      font-size: 28rpx;
      margin-left: 10rpx;
    }
  }

  .goods-list {
    padding: 20rpx;

    .delete-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 160rpx;
      margin-bottom: 20rpx;
      background-color: #c00000;
      border-radius: 16rpx;
      color: #ffffff;
      font-size: 28rpx;
    }
  }

  .empty-cart {
    height: calc(100vh - var(--window-top) - var(--window-bottom));
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(180deg, #f5f7fa 0%, #ffffff 100%);

    .empty-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      // padding-top: 200rpx;
      animation: fadeIn 0.6s ease-in-out;
    }

    .empty-image {
      width: 280rpx;
      height: 280rpx;
      margin-bottom: 40rpx;
      opacity: 0.6;
      filter: drop-shadow(0 8rpx 16rpx rgba(0, 0, 0, 0.08));
      animation: float 3s ease-in-out infinite;
    }

    .empty-text {
      font-size: 32rpx;
      font-weight: 600;
      color: #333333;
      margin-bottom: 16rpx;
      letter-spacing: 1rpx;
    }

    .empty-desc {
      font-size: 26rpx;
      color: #999999;
      margin-bottom: 60rpx;
    }

    .go-shopping-btn {
      width: 400rpx;
      height: 88rpx;
      line-height: 88rpx;
      background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
      border-radius: 44rpx;
      color: #ffffff;
      font-size: 30rpx;
      font-weight: 500;
      border: none;
      box-shadow: 0 8rpx 24rpx rgba(255, 107, 107, 0.3);
      transition: all 0.3s ease;

      &:active {
        transform: scale(0.95);
        box-shadow: 0 4rpx 12rpx rgba(255, 107, 107, 0.2);
      }
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20rpx);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes float {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10rpx);
    }
  }
</style>
