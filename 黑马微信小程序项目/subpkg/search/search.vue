<template>
  <view>
    <view class="search-box">
      <uni-search-bar
        :radius="100"
        cancelButton="none"
        placeholder="请输入搜索内容"
        :focus="true"
        @input="input"></uni-search-bar>
    </view>

    <!-- 骨架屏 -->
    <view
      class="skeleton-list"
      v-if="isLoading && !showTimeoutTip">
      <view
        v-for="i in 15"
        :key="i"
        class="skeleton-item">
        <view class="skeleton-icon skeleton-pulse"></view>
        <view class="skeleton-text skeleton-pulse"></view>
        <view class="skeleton-icon-right skeleton-pulse"></view>
      </view>
    </view>

    <!-- 搜索建议列表 -->
    <view
      class="search-suggest"
      v-if="searchResult.length > 0 && !isLoading">
      <view
        v-for="(item, index) in searchResult"
        @click="handleSearchClick(item)"
        :key="item.goods_id"
        class="suggest-item"
        :style="{ animationDelay: `${index * 0.05}s` }"
        hover-class="suggest-item-hover"
        :hover-stay-time="150">
        <uni-icons
          type="search"
          size="14"
          color="#999999"></uni-icons>
        <view class="suggest-item-name">{{ item.goods_name }}</view>
        <uni-icons
          type="right"
          size="14"
          color="#cccccc"></uni-icons>
      </view>
    </view>

    <!-- 超时提示 -->
    <view
      class="timeout-tip"
      v-if="showTimeoutTip">
      <uni-icons
        type="info"
        size="16"
        color="#999999"></uni-icons>
      <text>加载较慢，请稍候...</text>
    </view>

    <!-- 搜索历史 -->
    <view class="search-history">
      <!-- 标题区域 -->
      <view class="history-title">
        <text>搜索历史</text>
        <uni-icons
          @click="handleClearHistory"
          type="trash"
          size="20"></uni-icons>
      </view>
      <!-- 列表区域 -->
      <view
        class="history-item"
        v-if="searchHistory.length > 0 && searchResult.length === 0">
        <uni-tag
          @click="handleHistoryClick(item)"
          custom-style="background-color: #f8f8f8; color: #222222; border: 2rpx solid #eeeeee; border-radius: 8rpx; font-size: 26rpx;  padding: 6rpx 16rpx; "
          :text="item"
          v-for="(item, index) in searchHistory"
          :key="index"></uni-tag>
      </view>
    </view>
  </view>
</template>

<script setup>
  import { ref, onUnmounted } from "vue";
  import { getSearchResult } from "@/api/api.js";

  // 使用 ref 存储定时器，确保组件实例级别的作用域隔离
  const timer = ref(null);
  // 超时定时器
  const timeoutTimer = ref(null);
  // 搜索内容
  const searchContent = ref("");
  // 搜索结果列表
  const searchResult = ref([]);
  // 加载状态
  const isLoading = ref(false);
  // 超时提示显示状态
  const showTimeoutTip = ref(false);
  // 搜索历史
  const searchHistory = ref([]);
  // 从本地存储获取搜索历史
  searchHistory.value = uni.getStorageSync("searchHistory") || [];

  const input = (e) => {
    // 清除之前的定时器
    if (timer.value) {
      clearTimeout(timer.value);
    }
    // 设置新的定时器，延时300ms执行搜索（防抖）
    timer.value = setTimeout(() => {
      searchContent.value = e;
      timer.value = null;

      // 获取搜索结果列表数据
      getSearchResultData(searchContent.value);
    }, 300);
  };

  // 组件卸载时清除定时器，防止内存泄漏
  onUnmounted(() => {
    if (timer.value) {
      clearTimeout(timer.value);
      timer.value = null;
    }
    if (timeoutTimer.value) {
      clearTimeout(timeoutTimer.value);
      timeoutTimer.value = null;
    }
  });

  const getSearchResultData = async (searchContent) => {
    // 判断搜索关键词是否为空
    if (!searchContent) {
      searchResult.value = [];
      isLoading.value = false;
      showTimeoutTip.value = false;
      return;
    }

    // 设置加载状态
    isLoading.value = true;
    showTimeoutTip.value = false;

    // 设置超时定时器（2秒后显示提示）
    timeoutTimer.value = setTimeout(() => {
      if (isLoading.value) {
        showTimeoutTip.value = true;
      }
    }, 2000);

    try {
      // 调用接口获取搜索结果列表数据
      const res = await getSearchResult({
        query: searchContent,
      });
      searchResult.value = res.message;

      saveSearchHistory(searchContent);
    } catch (error) {
      console.log(error);
      searchResult.value = [];
    } finally {
      // 清除加载状态和超时定时器
      isLoading.value = false;
      showTimeoutTip.value = false;
      if (timeoutTimer.value) {
        clearTimeout(timeoutTimer.value);
        timeoutTimer.value = null;
      }
    }
  };

  const saveSearchHistory = (searchContent) => {
    // 添加搜索历史
    searchHistory.value.unshift(searchContent);
    // 去重
    searchHistory.value = [...new Set(searchHistory.value)];
    // 保存到本地存储
    uni.setStorageSync("searchHistory", searchHistory.value);
  };

  // 处理搜索点击点击事件
  const handleSearchClick = (item) => {
    // 导航到搜索结果页
    uni.navigateTo({
      url: "/subpkg/goods_detail/goods_detail?goods_id=" + item.goods_id,
    });
  };

  // 处理清除搜索历史点击事件
  const handleClearHistory = () => {
    // 清空搜索历史
    searchHistory.value = [];
    // 保存到本地存储
    uni.setStorageSync("searchHistory", searchHistory.value);
  };

  // 处理搜索历史点击事件
  const handleHistoryClick = (item) => {
    // 导航到搜索结果页
    uni.navigateTo({
      url: "/subpkg/goods_list/goods_list?query=" + item,
    });
    // 保存搜索历史
    saveSearchHistory(item);
  };
</script>

<style lang="scss" scoped>
  .search-box {
    position: sticky;
    top: 0;
    z-index: 999;
  }

  .search-suggest {
    padding: 0 24rpx;
    background-color: #f7f8fa;
    margin: 0 20rpx 20rpx;
    border-radius: 16rpx;

    .suggest-item {
      display: flex;
      align-items: center;
      padding: 24rpx 20rpx;
      background-color: #ffffff;
      margin-bottom: 2rpx;
      border-radius: 8rpx;
      transition: all 0.2s ease;
      animation: slideInUp 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;

      &:first-child {
        border-radius: 8rpx 8rpx 0 0;
      }

      &:last-child {
        margin-bottom: 0;
        border-radius: 0 0 8rpx 8rpx;
      }
    }

    .suggest-item-hover {
      background-color: #f5f6f8;
      transform: translateX(4rpx);
    }

    .suggest-item-name {
      flex: 1;
      font-size: 28rpx;
      color: #333333;
      margin: 0 16rpx;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-weight: 400;
    }
  }

  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(20rpx);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  // 骨架屏样式
  .skeleton-list {
    padding: 0 24rpx;
    background-color: #f7f8fa;
    margin: 0 20rpx 20rpx;
    border-radius: 16rpx;

    .skeleton-item {
      display: flex;
      align-items: center;
      padding: 24rpx 20rpx;
      background-color: #ffffff;
      margin-bottom: 2rpx;
      border-radius: 8rpx;

      &:first-child {
        border-radius: 8rpx 8rpx 0 0;
      }

      &:last-child {
        margin-bottom: 0;
        border-radius: 0 0 8rpx 8rpx;
      }
    }

    .skeleton-icon,
    .skeleton-icon-right {
      width: 28rpx;
      height: 28rpx;
      border-radius: 50%;
      background-color: #f0f0f0;
      flex-shrink: 0;
    }

    .skeleton-icon-right {
      border-radius: 0;
      width: 20rpx;
      height: 20rpx;
      clip-path: polygon(
        0 0,
        60% 50%,
        0 100%,
        15% 100%,
        15% 100%,
        45% 50%,
        15% 0
      );
      background-color: #f0f0f0;
    }

    .skeleton-text {
      flex: 1;
      height: 32rpx;
      margin: 0 16rpx;
      background-color: #f0f0f0;
      border-radius: 4rpx;
    }

    .skeleton-pulse {
      animation: pulse 1.5s ease-in-out infinite;
    }
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }

    50% {
      opacity: 0.5;
    }
  }

  // 超时提示样式
  .timeout-tip {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 30rpx;
    margin: 0 20rpx 20rpx;
    background-color: #f7f8fa;
    border-radius: 16rpx;
    font-size: 28rpx;
    color: #999999;

    text {
      margin-left: 12rpx;
    }
  }

  // 搜索历史样式
  .search-history {
    padding: 10rpx 20rpx;

    .history-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 10rpx;
      font-size: 28rpx;
      color: #333333;
      border-bottom: 2rpx solid #efefef;
    }

    .history-item {
      display: flex;
      flex-wrap: wrap;
      gap: 16rpx;
      align-items: center;
      padding: 24rpx 0;
      font-size: 28rpx;
      color: #333333;
    }
  }
</style>
