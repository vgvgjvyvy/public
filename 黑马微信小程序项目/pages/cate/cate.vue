<template>
  <view class="page">
    <!-- 搜索组件 -->
    <my-search @myClick="goToSearch"></my-search>

    <view class="scroll-view-container">
      <!-- 左侧滑动区域 -->
      <scroll-view
        class="left-scroll-view"
        scroll-y>
        <view
          class="left-scroll-view-item"
          :class="{ active: active === item.cat_id }"
          @click="handleCategoryClick(item.cat_id)"
          v-for="item in cateList"
          :key="item.cat_id">
          {{ item.cat_name }}
        </view>
      </scroll-view>

      <!-- 右侧滑动区域 -->
      <scroll-view
        class="right-scroll-view"
        scroll-y
        :scroll-top="scrollTop">
        <view
          class="right-scroll-view-item"
          v-for="item in subCateList"
          :key="item.cat_id">
          <!-- 二级分类的标题 -->
          <view class="cate-lv2-title">
            <view class="title-line"></view>
            <text class="title-text">{{ item.cat_name }}</text>
            <view class="title-line"></view>
          </view>
          <!-- 当前二级分类下的三级分类列表 -->
          <view class="cate-lv3-list">
            <view
              class="cate-lv3-item"
              @click="handleSubCategoryClick(subItem.cat_id)"
              v-for="subItem in item.children"
              :key="subItem.cat_id">
              <!-- 三级分类的图片 -->
              <view class="icon-wrapper">
                <image
                  :src="subItem.cat_icon"
                  mode="aspectFit" />
              </view>
              <!-- 三级分类的文本 -->
              <text class="item-name">{{ subItem.cat_name }}</text>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script setup>
  import { ref } from "vue";
  import { onLoad } from "@dcloudio/uni-app";
  import { getCateList } from "@/api/api.js";
  import { useCartBadge } from "@/composables/useCartBadge.js";

  useCartBadge();

  // 分类列表数据
  const cateList = ref([]);
  // 二级分类列表数据
  const subCateList = ref([]);

  // 默认激活项
  const active = ref(0);
  // 滚动列表回到顶部
  const scrollTop = ref(0);

  onLoad(() => {
    getCateListData();
  });

  const getCateListData = async () => {
    try {
      const res = await getCateList();
      cateList.value = res.message;
      active.value = res.message[0].cat_id;
      subCateList.value = res.message[0].children || [];
    } catch (error) {
      console.error("获取分类列表数据失败:", error);
    }
  };

  // 切换分类导航
  const handleCategoryClick = (catId) => {
    active.value = catId;

    // 点击分类导航时，更新二级分类列表
    subCateList.value =
      cateList.value.find((item) => item.cat_id === catId).children || [];

    // 点击分类导航时，滚动到顶部
    scrollTop.value = Math.random();
  };

  // 跳转到商品列表页面
  const handleSubCategoryClick = (cid) => {
    uni.navigateTo({
      url: "/subpkg/goods_list/goods_list?cid=" + cid,
    });
  };

  // 跳转到搜索页面
  const goToSearch = () => {
    uni.navigateTo({
      url: "/subpkg/search/search",
    });
  };
</script>

<style lang="scss" scoped>
  .page {
    display: flex;
    flex-direction: column;
    // 自动减去顶部导航栏和底部TabBar高度，适配各种机型（包括iPhone刘海屏）
    height: calc(100vh - var(--window-top) - var(--window-bottom));
    // 或者使用安全区域适配（更兼容刘海屏）
    // padding-top: var(--window-top);
    // padding-bottom: var(--window-bottom);
    // height: 100vh;
    // box-sizing: border-box;
  }

  .scroll-view-container {
    display: flex;
    // flex: 1; // 占满可用空间
    overflow: hidden;
  }

  .left-scroll-view {
    min-width: 200rpx;
    max-width: 200rpx;
    // height: 100%; // 确保高度继承
  }

  .right-scroll-view {
    flex: 1;
    background-color: #fff;
    // height: 100%; // 确保高度继承
  }

  // 左侧列表样式
  .left-scroll-view-item {
    background-color: #f7f7f7;
    line-height: 120rpx;
    text-align: center;
    font-size: 24rpx;

    &.active {
      position: relative;
      background: #fff;

      &::before {
        position: absolute;
        top: 50%;
        left: 0;
        transform: translateY(-50%);
        content: "";
        display: block;
        width: 6rpx;
        height: 60rpx;
        background-color: #c00000;
      }
    }
  }

  // 右侧滚动区域
  .right-scroll-view {
    flex: 1;
    background-color: #f8f8f8;
    padding: 20rpx;
  }

  .right-scroll-view-item {
    background-color: #ffffff;
    border-radius: 20rpx;
    padding: 30rpx 20rpx;
    margin-bottom: 20rpx;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
  }

  // 二级分类标题样式
  .cate-lv2-title {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-bottom: 30rpx;

    .title-line {
      flex: 1;
      height: 2rpx;
      background: linear-gradient(to right, transparent, #e0e0e0, transparent);
    }

    .title-text {
      font-size: 28rpx;
      font-weight: 600;
      color: #333;
      padding: 0 20rpx;
      position: relative;
    }
  }

  // 三级分类网格布局
  .cate-lv3-list {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20rpx;

    .cate-lv3-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 10rpx 8rpx;
      background-color: #fafafa;
      border-radius: 16rpx;
      transition: all 0.3s ease;

      &:active {
        transform: scale(0.95);
        background-color: #f0f0f0;
      }

      .icon-wrapper {
        width: 120rpx;
        height: 120rpx;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 12rpx;
        overflow: hidden;
        background-color: #f5f5f5;

        image {
          width: 80rpx;
          height: 80rpx;
        }
      }

      .item-name {
        font-size: 24rpx;
        color: #666;
        text-align: center;
        line-height: 1.4;
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
</style>
