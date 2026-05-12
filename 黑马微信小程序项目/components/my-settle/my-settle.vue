<template>
  <view class="my-settle">
    <!-- 全选 -->
    <view class="radio">
      <radio
        color="#c00000"
        :checked="isAllChecked"
        @tap="handleAllCheckChange" />
      <text @tap="handleAllCheckChange">全选</text>
    </view>

    <!-- 合计 -->
    <view class="total">
      合计：<text class="price">￥{{ totalPrice }}</text>
    </view>

    <!-- 结算 -->
    <view class="settle-btn">
      <text>结算({{ checkedCount }})</text>
    </view>
  </view>
</template>

<script setup>
  defineOptions({
    name: "my-settle",
  });

  import { computed } from "vue";
  import { useCartStore } from "@/store/cart.js";

  const cartStore = useCartStore();
  const isAllChecked = computed(() => cartStore.isAllChecked);
  const totalPrice = computed(() => cartStore.totalPrice);
  const checkedCount = computed(() => cartStore.checkedCount);

  // 全选/取消全选
  const handleAllCheckChange = () => {
    cartStore.updateAllGoodsState(!isAllChecked.value);
  };
</script>

<style lang="scss" scoped>
  .my-settle {
    position: fixed;
    left: 0;
    right: 0;
    height: 100rpx;
    background-color: #fff;
    /* #ifdef H5 */
    bottom: 50px; /* H5 中给 tabBar 留出空间 */
    /* #endif */

    /* #ifdef MP-WEIXIN */
    bottom: 0; /* 小程序中贴底 */
    /* #endif */
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 28rpx;
    padding-left: 40rpx;
    border-radius: 16rpx 16rpx 0 0;
    overflow: hidden;
  }

  .radio {
    display: flex;
    align-items: center;
  }

  .price {
    color: #c00000;
    font-weight: 600;
  }

  .settle-btn {
    background: #c00000;
    color: #fff;
    height: 100rpx;
    line-height: 100rpx;
    text-align: center;
    padding: 0 50rpx;
  }
</style>
