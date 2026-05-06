<template>
  <view
    class="goods-item"
    hover-class="goods-item-hover"
    @click="handleClick">
    <!-- 左侧的盒子 -->
    <view class="goods-item-left">
      <image
        :src="goods.goods_small_logo || defaultImg"
        mode="aspectFill"
        class="goods-image" />
    </view>
    <!-- 右侧的盒子 -->
    <view class="goods-item-right">
      <view class="goods-name">{{ goods.goods_name }}</view>
      <view class="goods-info">
        <view class="price">¥{{ Number(goods.goods_price).toFixed(2) }}</view>
      </view>
    </view>
  </view>
</template>

<script setup>
  const props = defineProps({
    goods: {
      type: Object,
      required: true,
      default: () => ({}),
    },
  });

  const emit = defineEmits(['click']);

  const defaultImg = "../../static/default.jpg";

  const handleClick = () => {
    emit('click', props.goods);
  };
</script>

<style lang="scss">
  .goods-item {
    display: flex;
    padding: 20rpx;
    margin-bottom: 20rpx;
    background: #ffffff;
    border-radius: 16rpx;
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
  }

  .goods-item-hover {
    transform: scale(0.98);
    box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.12);
  }

  .goods-item-left {
    margin-right: 20rpx;
    flex-shrink: 0;

    .goods-image {
      width: 180rpx;
      height: 180rpx;
      border-radius: 12rpx;
      background: #f9f9f9;
    }
  }

  .goods-item-right {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 8rpx 0;

    .goods-name {
      font-size: 28rpx;
      color: #333333;
      line-height: 1.4;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      text-overflow: ellipsis;
      font-weight: 500;
    }

    .goods-info {
      display: flex;
      align-items: flex-end;
      gap: 16rpx;
    }

    .price {
      font-size: 34rpx;
      font-weight: bold;
      color: #ff4400;
      line-height: 1;
    }
  }
</style>
