<template>
  <view
    class="goods-item"
    :class="{ 'goods-item-click-animate': isClickAnimating }"
    @tap="handleContainerTap">
    <!-- 左侧的盒子 -->
    <view class="goods-item-left">
      <view
        class="radio-container"
        @tap.stop="handleRadioClick">
        <radio
          v-if="showRadio"
          :value="String(goods.goods_id)"
          :checked="goods.goods_state"
          @tap.stop="handleRadioClick"
          color="#c00000" />
      </view>
      <image
        @tap="handleClick"
        :src="goods.goods_small_logo || defaultImg"
        mode="aspectFill"
        class="goods-image" />
    </view>
    <!-- 右侧的盒子 -->
    <view class="goods-item-right">
      <view class="goods-name">{{ goods.goods_name }}</view>
      <view class="goods-info">
        <view class="price">¥{{ Number(goods.goods_price).toFixed(2) }}</view>
        <view @tap.stop>
          <uni-number-box
            v-if="showNumberBox"
            :min="1"
            :max="9"
            :value="goods.count"
            @change="handleNumberChange"></uni-number-box>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
  import { ref, onUnmounted } from "vue";

  const props = defineProps({
    goods: {
      type: Object,
      required: true,
      default: () => ({}),
    },
    showRadio: {
      type: Boolean,
      default: false,
    },
    showNumberBox: {
      type: Boolean,
      default: false,
    },
    clickTarget: {
      type: String,
      default: "image",
      validator: (value) => ["image", "container"].includes(value),
    },
  });

  const emit = defineEmits(["click", "radio-change", "num-change"]);

  const defaultImg = "../../static/default.jpg";
  const isClickAnimating = ref(false);
  let animationTimer = null;

  const handleClick = () => {
    if (animationTimer) {
      clearTimeout(animationTimer);
      animationTimer = null;
    }
    isClickAnimating.value = true;
    animationTimer = setTimeout(() => {
      isClickAnimating.value = false;
      animationTimer = null;
    }, 500);
    emit("click", props.goods);
  };

  const handleContainerTap = () => {
    if (props.clickTarget === "container") {
      handleClick();
    }
  };

  const handleRadioClick = () => {
    emit("radio-change", props.goods);
  };

  const handleNumberChange = (value) => {
    emit("num-change", {
      goods_id: props.goods.goods_id,
      goods_count: +value,
    });
  };

  onUnmounted(() => {
    if (animationTimer) {
      clearTimeout(animationTimer);
      animationTimer = null;
    }
  });
</script>

<style lang="scss" scoped>
  .goods-item {
    display: flex;
    padding: 20rpx;
    margin-bottom: 20rpx;
    background: #ffffff;
    border-radius: 16rpx;
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.08);
  }

  .goods-item-click-animate {
    animation: click-bounce 0.5s ease;
  }

  @keyframes click-bounce {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(0.96);
    }
    100% {
      transform: scale(1);
    }
  }

  .goods-item-left {
    margin-right: 20rpx;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;

    .radio-container {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
    }

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
      justify-content: space-between;
      align-items: center;
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
