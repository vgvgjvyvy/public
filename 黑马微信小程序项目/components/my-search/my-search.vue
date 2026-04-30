<template>
  <view
    class="search-container"
    @click="handleClick">
    <view class="search-box">
      <uni-icons
        type="search"
        size="18"></uni-icons>
      <text class="placeholder">搜索</text>
    </view>
  </view>
</template>

<script setup>
  import { ref } from "vue";

  defineOptions({
    name: "my-search",
  });

  // 声明自定义事件
  const emit = defineEmits(["myClick"]);

  const props = defineProps({
    bgColor: {
      type: String,
      default: "#c00000",
    },
  });

  // 点击处理函数
  const handleClick = () => {
    emit("myClick");
  };
</script>

<style lang="scss" scoped>
  .search-container {
    padding: 10px;
    background-color: v-bind("props.bgColor");
  }

  .search-box {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 30rpx;
    background-color: #fff;
    padding: 10rpx 20rpx;
  }

  .placeholder {
    font-size: 26rpx;
    margin-left: 10rpx;
  }
</style>
