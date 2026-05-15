<template>
  <view class="my-settle">
    <!-- 自定义遮罩 -->
    <view
      v-if="showLoginMask"
      class="custom-mask"
      @tap.stop="preventTap">
      <view class="mask-content">
        <text class="mask-text">请先登录，{{ countdown }}秒后跳转到登录页</text>
      </view>
    </view>

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
      合计：<text class="price">￥{{ totalPrice || "0.00" }}</text>
    </view>

    <!-- 结算 -->
    <view
      class="settle-btn"
      @tap="handleSettle">
      <text>结算({{ checkedCount || "0" }})</text>
    </view>
  </view>
</template>

<script setup>
  defineOptions({
    name: "my-settle",
  });

  import { computed, ref, onUnmounted } from "vue";
  import { useCartStore } from "@/store/cart.js";
  import { useUserStore } from "@/store/user.js";
  import { useAddressStore } from "@/store/address.js";
  import { payOrder } from "@/api/api.js";

  const cartStore = useCartStore();
  const addressStore = useAddressStore();
  const userStore = useUserStore();
  const isAllChecked = computed(() => cartStore.isAllChecked);
  const totalPrice = computed(() => cartStore.totalPrice);
  const checkedCount = computed(() => cartStore.checkedCount);
  const address = computed(() => addressStore.selectedAddress);
  const token = computed(() => userStore.token);

  // 自定义遮罩状态
  const showLoginMask = ref(false);
  const countdown = ref(3);
  // 定时器引用，用于组件卸载时清理
  const timer = ref(null);

  // 阻止点击事件（用于遮罩层）
  const preventTap = () => {
    // 仅用于阻止事件冒泡，不需要任何逻辑
  };

  // 全选/取消全选
  const handleAllCheckChange = () => {
    cartStore.updateAllGoodsState(!isAllChecked.value);
  };

  // 结算
  const handleSettle = () => {
    if (!checkedCount.value) {
      uni.showToast({
        title: "请选择商品",
        icon: "none",
      });
      return;
    }

    // 是否选择了收货地址
    if (!address.value) {
      uni.showToast({
        title: "请选择地址",
        icon: "none",
      });
      return;
    }

    // 是否已登录
    if (!token.value) {
      // 隐藏TabBar，让遮罩可以完全覆盖
      uni.hideTabBar();

      showLoginMask.value = true;
      countdown.value = 3;

      timer.value = setInterval(() => {
        countdown.value--;
        if (countdown.value <= 0) {
          clearInterval(timer.value);
          timer.value = null;
          showLoginMask.value = false;
          // 显示TabBar
          uni.showTabBar();
          // 保存来源页面信息到本地存储
          const pages = getCurrentPages();
          console.log("pages", pages);

          const currentPage = pages[pages.length - 1];
          const currentRoute = `/${currentPage.route}`;
          userStore.setLoginRedirect(currentRoute);
          uni.switchTab({
            url: "/pages/my/my",
          });
        }
      }, 1000);
      return;
    }

    // 支付订单
    submitPayOrder();
  };

  // 组件卸载时清理定时器
  onUnmounted(() => {
    if (timer.value) {
      clearInterval(timer.value);
      timer.value = null;
    }
  });

  const submitPayOrder = async () => {
    try {
      const res = await payOrder({
        // order_price: totalPrice.value,
        order_price: 0.01,
        consignee: address.value.name,
        goods: cartStore.checkedGoods.map((item) => ({
          goods_id: item.id,
          goods_number: item.goods_count,
          goods_price: item.goods_price,
        })),
      });
      console.log("支付订单成功:", res);
      uni.showToast({ title: "支付订单成功", icon: "success" });
    } catch (err) {
      console.log("支付订单失败:", err);
      uni.showToast({ title: "支付订单失败", icon: "error" });
    }
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

  .total {
    display: flex;
    align-items: center;

    .price {
      color: #c00000;
      font-weight: 600;
      display: inline-block;
      max-width: 200rpx;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
  }

  .settle-btn {
    background: #c00000;
    color: #fff;
    height: 100rpx;
    line-height: 100rpx;
    text-align: center;
    min-width: 230rpx;
    padding: 0 20rpx;

    text {
      display: inline-block;
      max-width: 230rpx;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
  }

  // 自定义遮罩样式
  .custom-mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;

    .mask-content {
      background-color: rgba(0, 0, 0, 0.8);
      padding: 40rpx 60rpx;
      border-radius: 16rpx;
      max-width: 80%;

      .mask-text {
        color: #fff;
        font-size: 32rpx;
        text-align: center;
        display: block;
      }
    }
  }
</style>
