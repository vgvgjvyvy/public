<template>
  <view class="page-container">
    <!-- 选择收货地址的盒子 -->
    <view
      class="address-choose-box"
      v-if="!hasAddress">
      <button
        @click="chooseAddress"
        class="address-btn"
        type="default"
        size="mini">
        <text class="btn-icon">+</text>
        <text class="btn-text">选择收货地址</text>
      </button>
    </view>

    <!-- 渲染收货信息的盒子 -->
    <view
      class="address-info-box"
      @click="chooseAddress"
      v-else>
      <view class="address-content">
        <view class="address-left">
          <view class="address-name-phone">
            <text class="label">收货人：</text>
            <text class="value name-value">{{
              addressStore.selectedAddress.name
            }}</text>
            <text class="divider">|</text>
            <text class="label">手机号：</text>
            <text class="value phone-value">
              {{ addressStore.selectedAddress.phone }}
            </text>
          </view>

          <view class="address-details">
            <text class="label">详细地址：</text>
            <text class="value">{{
              addressStore.selectedAddress.address
            }}</text>
          </view>
        </view>

        <view class="address-arrow">
          <uni-icons
            type="right"
            size="20"
            color="#999"></uni-icons>
        </view>
      </view>
    </view>

    <!-- 底部的边框线 -->
    <image
      class="address-line"
      src="/static/cart_border@2x.png"
      mode=""></image>
  </view>
</template>

<script setup>
  import { computed } from "vue";
  import { useAddressStore } from "@/store/address.js";

  defineOptions({
    name: "my-address",
  });

  const addressStore = useAddressStore();

  const hasAddress = computed(() => {
    const addr = addressStore.selectedAddress;
    return addr?.name && addr?.phone && addr?.address;
  });

  const chooseAddress = () => {
    // #ifdef MP-WEIXIN
    // 微信小程序环境使用原生地址选择器
    uni.chooseAddress({
      success: (res) => {
        addressStore.saveAddress({
          name: res.userName,
          phone: res.telNumber,
          address: `${res.provinceName}${res.cityName}${res.countyName}${res.detailInfo}`,
        });
      },
      fail: (err) => {
        console.error("选择地址失败:", err);
      },
    });
    // #endif

    // #ifdef H5
    // H5环境跳转到地址列表页
    uni.navigateTo({ url: "/subpkg/address_list/address_list" });
    // #endif
  };
</script>

<style lang="scss" scoped>
  .page-container {
    display: flex;
    flex-direction: column;
  }

  .address-line {
    width: 750rpx;
    height: 10rpx;
  }

  .address-choose-box {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 46rpx 0;
    background-color: #f8f8f8;

    .address-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20rpx 60rpx;
      background: linear-gradient(135deg, #f28b8b 0%, #ffd4a8 100%);
      border: none;
      border-radius: 50rpx;
      box-shadow: 0 8rpx 24rpx rgba(242, 139, 139, 0.35);
      color: #ffffff;
      font-size: 28rpx;
      font-weight: 500;
      transition: all 0.3s ease;

      &::after {
        border: none;
      }

      &:active {
        transform: scale(0.95);
        box-shadow: 0 4rpx 12rpx rgba(242, 139, 139, 0.25);
      }

      .btn-icon {
        font-size: 32rpx;
        font-weight: bold;
        margin-right: 12rpx;
        line-height: 1;
      }

      .btn-text {
        line-height: 1;
      }
    }
  }

  .address-info-box {
    background-color: #fff;
    padding: 30rpx;

    .address-content {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .address-left {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 20rpx;
        padding-right: 20rpx;

        .address-name-phone {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 8rpx;

          .label {
            font-size: 26rpx;
            color: #666;
          }

          .value {
            font-size: 28rpx;
            color: #333;
            font-weight: 500;

            &.name-value {
              color: #333;
              max-width: 180rpx;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }

            &.phone-value {
              color: #333;
            }
          }

          .divider {
            font-size: 24rpx;
            color: #ddd;
            margin: 0 8rpx;
          }
        }

        .address-details {
          display: flex;
          align-items: flex-start;

          .label {
            font-size: 26rpx;
            color: #666;
            flex-shrink: 0;
          }

          .value {
            font-size: 26rpx;
            color: #666;
            flex: 1;
            line-height: 1.5;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            word-break: break-all;
            min-width: 0;
          }
        }
      }

      .address-arrow {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }
    }
  }
</style>
