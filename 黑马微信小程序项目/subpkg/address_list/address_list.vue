<template>
  <view class="page-container">
    <view class="address-list">
      <view
        v-for="item in addressList"
        :key="item.id"
        class="address-item"
        @click="selectAddress(item)">
        <view class="address-content">
          <view class="address-info">
            <view class="name-phone">
              <text class="name">{{ item.name }}</text>
              <text class="phone">{{ item.phone }}</text>
            </view>
            <view class="address-detail">{{ item.address }}</view>
            <view
              v-if="item.isDefault"
              class="default-tag">
              默认
            </view>
            <view
              v-else
              class="set-default-btn"
              @click.stop="setDefaultAddress(item)">
              <uni-icons
                type="star"
                size="16"
                color="#c00000"></uni-icons>
              <text>设为默认</text>
            </view>
          </view>
          <view
            class="address-actions"
            @click.stop>
            <view
              class="action-btn edit-btn"
              @click="editAddress(item)">
              <uni-icons
                type="compose"
                size="18"
                color="#c00000"></uni-icons>
            </view>
            <view
              class="action-btn delete-btn"
              @click="deleteAddressItem(item)">
              <uni-icons
                type="trash"
                size="18"
                color="#999"></uni-icons>
            </view>
          </view>
        </view>
      </view>

      <view
        v-if="addressList.length === 0"
        class="empty-box">
        <image
          class="empty-icon"
          src="/static/empty-address.png"
          mode="aspectFit"></image>
        <text class="empty-text">暂无收货地址</text>
        <text class="empty-tip">点击下方按钮添加新地址</text>
      </view>
    </view>

    <view class="add-btn-container">
      <button
        class="add-btn"
        @click="addNewAddress">
        新增收货地址
      </button>
    </view>
  </view>
</template>

<script setup>
  import { computed } from "vue";
  import { useAddressStore } from "@/store/address.js";

  defineOptions({
    name: "address-list",
  });

  const addressStore = useAddressStore();
  const addressList = computed(() => addressStore.addressList);

  const addNewAddress = () => {
    uni.navigateTo({
      url: "/subpkg/address_edit/address_edit",
    });
  };

  const editAddress = (item) => {
    uni.navigateTo({
      url: `/subpkg/address_edit/address_edit?id=${item.id}`,
    });
  };

  const selectAddress = (item) => {
    addressStore.saveAddress(item);
    uni.showToast({
      title: "已选择地址",
      icon: "success",
    });
    setTimeout(() => {
      uni.navigateBack();
    }, 1500);
  };

  const deleteAddressItem = (item) => {
    uni.showModal({
      title: "提示",
      content: "确定要删除这个地址吗？",
      success: (res) => {
        if (res.confirm) {
          addressStore.deleteAddress(item.id);
          uni.showToast({
            title: "删除成功",
            icon: "success",
          });
        }
      },
    });
  };

  const setDefaultAddress = (item) => {
    addressStore.setDefaultAddress(item.id);
    uni.showToast({
      title: "已设为默认地址",
      icon: "success",
    });
  };
</script>

<style lang="scss" scoped>
  .page-container {
    min-height: 100vh;
    background-color: #f5f5f5;
    padding-bottom: 160rpx;
  }

  .address-list {
    padding: 20rpx;
  }

  .address-item {
    background-color: #fff;
    border-radius: 16rpx;
    padding: 30rpx;
    margin-bottom: 20rpx;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;

    &:active {
      transform: scale(0.98);
      box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);
    }
  }

  .address-content {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .address-info {
    flex: 1;

    .name-phone {
      display: flex;
      align-items: center;
      margin-bottom: 16rpx;

      .name {
        font-size: 32rpx;
        color: #333;
        font-weight: 600;
        margin-right: 20rpx;
        max-width: 300rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .phone {
        font-size: 28rpx;
        color: #666;
      }
    }

    .address-detail {
      font-size: 26rpx;
      color: #666;
      line-height: 1.6;
      margin-bottom: 16rpx;
      padding-right: 20rpx;
      word-break: break-all;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .default-tag {
      display: inline-block;
      padding: 6rpx 16rpx;
      background: linear-gradient(135deg, #c00000 0%, #e63946 100%);
      color: #fff;
      font-size: 22rpx;
      border-radius: 20rpx;
      font-weight: 500;
    }

    .set-default-btn {
      display: inline-flex;
      align-items: center;
      gap: 8rpx;
      padding: 6rpx 16rpx;
      background-color: #f5f5f5;
      color: #c00000;
      font-size: 22rpx;
      border-radius: 20rpx;
      font-weight: 500;
      border: 2rpx solid #c00000;
      transition: all 0.2s ease;

      &:active {
        background-color: #fff0f0;
        transform: scale(0.95);
      }
    }
  }

  .address-actions {
    display: flex;
    gap: 20rpx;
    padding-top: 10rpx;
  }

  .action-btn {
    width: 60rpx;
    height: 60rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background-color: #f5f5f5;

    &.edit-btn {
      &:active {
        background-color: #fff0f0;
      }
    }

    &.delete-btn {
      &:active {
        background-color: #f0f0f0;
      }
    }
  }

  .empty-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 200rpx 0;

    .empty-icon {
      width: 240rpx;
      height: 240rpx;
      margin-bottom: 40rpx;
    }

    .empty-text {
      font-size: 32rpx;
      color: #333;
      font-weight: 500;
      margin-bottom: 16rpx;
    }

    .empty-tip {
      font-size: 26rpx;
      color: #999;
    }
  }

  .add-btn-container {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 30rpx;
    background-color: #fff;
    box-shadow: 0 -4rpx 12rpx rgba(0, 0, 0, 0.05);

    .add-btn {
      background: linear-gradient(135deg, #c00000 0%, #e63946 100%);
      color: #fff;
      border: none;
      border-radius: 50rpx;
      font-size: 32rpx;
      font-weight: 500;
      height: 88rpx;
      line-height: 88rpx;

      &::after {
        border: none;
      }

      &:active {
        opacity: 0.9;
      }
    }
  }
</style>
