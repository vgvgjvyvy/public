<template>
  <view>
    <view class="user-info">
      <view class="user-avatar">
        <image
          :src="userInfo.avatarUrl"
          class="avatar" />
      </view>
      <view class="user-name"> {{ userInfo.nickName }} </view>
    </view>

    <view class="panel-list">
      <view class="panel">
        <view class="panel-body">
          <view class="panel-item">
            <text>8</text>
            <text>收藏的店铺</text>
          </view>
          <view class="panel-item">
            <text>14</text>
            <text>收藏的商品</text>
          </view>
          <view class="panel-item">
            <text>18</text>
            <text>关注的商品</text>
          </view>
          <view class="panel-item">
            <text>84</text>
            <text>足迹</text>
          </view>
        </view>
      </view>
      <view class="panel">
        <view class="panel-title">
          <text>我的订单</text>
        </view>
        <view class="panel-body">
          <view class="panel-item">
            <image
              src="/static/my-icons/icon1.png"
              class="order-icon" />
            <text>待付款</text>
          </view>
          <view class="panel-item">
            <image
              src="/static/my-icons/icon2.png"
              class="order-icon" />
            <text>待收货</text>
          </view>
          <view class="panel-item">
            <image
              src="/static/my-icons/icon3.png"
              class="order-icon" />
            <text>退货/退款</text>
          </view>
          <view class="panel-item">
            <image
              src="/static/my-icons/icon4.png"
              class="order-icon" />
            <text>全部订单</text>
          </view>
        </view>
      </view>
      <view class="panel">
        <view class="panel-list-item">
          <text>收货地址</text>
          <uni-icons
            type="right"
            size="16" />
        </view>
        <view class="panel-list-item">
          <text>联系客服</text>
          <uni-icons
            type="right"
            size="16" />
        </view>
        <view
          class="panel-list-item"
          @click="logout">
          <text>退出登录</text>
          <uni-icons
            type="right"
            size="16" />
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
  defineOptions({
    name: "my-userinfo",
  });

  import { computed } from "vue";
  import { useUserStore } from "@/store/user.js";
  import { useAddressStore } from "@/store/address.js";
  const userStore = useUserStore();
  const addressStore = useAddressStore();

  const userInfo = computed(() => userStore.userInfo);

  const logout = () => {
    uni.showModal({
      title: "提示",
      content: "确定要退出登录吗？",
      success: (res) => {
        if (res.confirm) {
          userStore.clearToken();
          userStore.clearUserInfo();
          addressStore.clearAddress();
        }
      },
    });
  };
</script>

<style lang="scss" scoped>
  .user-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 400rpx;
    // background: linear-gradient(135deg, #ff6b6b 0%, #c00000 100%);
    background: #c00000;
    position: relative;
    overflow: hidden;

    &::before {
      content: "";
      position: absolute;
      top: -50%;
      right: -20%;
      width: 400rpx;
      height: 400rpx;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
    }

    &::after {
      content: "";
      position: absolute;
      bottom: -30%;
      left: -10%;
      width: 300rpx;
      height: 300rpx;
      background: rgba(255, 255, 255, 0.08);
      border-radius: 50%;
    }

    .user-avatar {
      width: 180rpx;
      height: 180rpx;
      border-radius: 50%;
      border: 6rpx solid rgba(255, 255, 255, 0.9);
      box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.25);
      margin-bottom: 24rpx;
      position: relative;
      z-index: 1;
      overflow: hidden;
      transition: transform 0.3s ease;

      &:active {
        transform: scale(1.05);
      }

      .avatar {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }

    .user-name {
      color: #fff;
      font-weight: 600;
      font-size: 34rpx;
      text-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.2);
      position: relative;
      z-index: 1;
      letter-spacing: 1rpx;
    }
  }

  .panel-list {
    padding: 0 24rpx;
    position: relative;
    top: -40rpx;
    z-index: 2;

    .panel {
      font-size: 26rpx;
      border-radius: 20rpx;
      padding: 24rpx;
      background-color: #fff;
      box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
      margin-bottom: 24rpx;
    }

    .panel-body {
      display: flex;
      align-items: center;
      justify-content: space-around;
    }

    .panel-title {
      font-size: 32rpx;
      font-weight: 600;
      padding-bottom: 20rpx;
      margin-bottom: 24rpx;
      border-bottom: 2rpx solid #f5f5f5;
      color: #333;

      text {
        position: relative;

        &::after {
          content: "";
          position: absolute;
          bottom: -20rpx;
          left: 10%;
          width: 80%;
          height: 2rpx;
          background: linear-gradient(90deg, #ff6b6b, #c00000);
        }
      }
    }

    .panel-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 12rpx 8rpx;
      transition: transform 0.2s ease;

      &:active {
        transform: scale(0.95);
      }

      text:first-child {
        font-size: 36rpx;
        font-weight: 700;
        color: #333;
        margin-bottom: 8rpx;
      }

      text:last-child {
        font-size: 24rpx;
        color: #999;
      }

      image {
        width: 64rpx;
        height: 64rpx;
        margin-bottom: 12rpx;
      }
    }

    .panel-list-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20rpx;
      border-bottom: 1rpx solid #f8f8f8;
      transition: all 0.2s ease;

      &:active {
        background-color: #fafafa;
        padding-left: 12rpx;
      }

      // &:first-child {
      //   padding-top: 0;
      // }

      &:last-child {
        border-bottom: none;
        // padding-bottom: 0;
      }

      text {
        font-size: 30rpx;
        color: #333;
        font-weight: 500;
      }
    }
  }
</style>
