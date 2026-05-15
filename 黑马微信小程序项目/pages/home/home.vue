<template>
  <view>
    <!-- 骨架屏 -->
    <view
      v-if="isLoading"
      class="skeleton-container">
      <!-- 搜索框骨架屏 -->
      <view class="skeleton-search"></view>

      <!-- 轮播图骨架屏 -->
      <view class="skeleton-swiper"></view>

      <!-- 分类导航骨架屏 -->
      <view class="skeleton-nav-list">
        <view
          v-for="i in 10"
          :key="i"
          class="skeleton-nav-item">
        </view>
      </view>

      <!-- 楼层骨架屏 -->
      <view class="skeleton-floor-list">
        <view
          v-for="i in 3"
          :key="i"
          class="skeleton-floor-item">
          <view class="skeleton-floor-title"></view>
          <view class="skeleton-floor-img-box">
            <view class="skeleton-floor-img-left"></view>
            <view class="skeleton-floor-img-right">
              <view
                v-for="j in 4"
                :key="j"
                class="skeleton-floor-img-small">
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 实际内容 -->
    <view v-else>
      <!-- 搜索组件 -->
      <view class="search-box">
        <my-search @myClick="goToSearch"></my-search>
      </view>

      <!-- 轮播图区域 -->
      <view class="swiper-container">
        <swiper
          :indicator-dots="true"
          :autoplay="true"
          :interval="3000"
          :duration="500"
          :circular="true"
          indicator-color="rgba(255, 255, 255, 0.5)"
          indicator-active-color="#ffffff">
          <swiper-item
            v-for="item in swiperList"
            :key="item.goods_id">
            <navigator
              :url="
                '/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id
              "
              open-type="navigate"
              hover-class="swiper-hover"
              class="swiper-navigator">
              <image
                :src="item.image_src"
                mode="aspectFill"
                class="swiper-image" />
            </navigator>
          </swiper-item>
        </swiper>
      </view>

      <!-- 分类导航区域 -->
      <view class="nav-list">
        <view
          v-for="item in navList"
          :key="item.image_src"
          @click="handleNavClick(item)"
          hover-class="nav-hover"
          :hover-stay-time="150">
          <image
            :src="item.image_src"
            mode="" />
        </view>
      </view>

      <!-- 楼层区域 -->
      <view class="floor-list">
        <view
          class="floor-item"
          v-for="(item, index) in floorList"
          :key="index">
          <!-- 楼层标题 -->
          <image
            class="floor-title"
            :src="item.floor_title.image_src"
            mode="" />
          <!-- 楼层的图片区域 -->
          <view class="floor-img-box">
            <!-- 左侧大图片的盒子 -->
            <navigator
              class="floor-img-left"
              :url="item.product_list[0].navigator_url">
              <image
                :src="item.product_list[0].image_src"
                mode="aspectFill" />
            </navigator>
            <!-- 右侧 4 个小图片的盒子 -->
            <view class="floor-img-right">
              <navigator
                v-for="(img, index2) in item.product_list.slice(1)"
                :key="index2"
                :url="img.navigator_url">
                <image
                  :src="img.image_src"
                  mode="aspectFill" />
              </navigator>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
  import { ref } from "vue";
  import { onLoad } from "@dcloudio/uni-app";
  import { getSwiperList, getNavList, getFloorList } from "@/api/api.js";
  import { useCartBadge } from "@/composables/useCartBadge.js";

  useCartBadge();

  // 轮播图数据
  const swiperList = ref([]);
  // 分类导航数据
  const navList = ref([]);
  // 楼层的数据
  const floorList = ref([]);
  // 加载状态
  const isLoading = ref(true);

  // 页面加载时触发
  onLoad(async () => {
    await Promise.all([
      getSwiperListData(),
      getNavListData(),
      getFloorListData(),
    ]);
    isLoading.value = false;
  });

  // 获取轮播图数据
  const getSwiperListData = async () => {
    try {
      const res = await getSwiperList();
      swiperList.value = res.message;
      // console.log(res.message);
      // console.log(swiperList.value);
    } catch (error) {
      console.error("获取轮播图失败:", error);
    }
  };
  // 获取分类导航数据
  const getNavListData = async () => {
    try {
      const res = await getNavList();
      navList.value = res.message;
      // console.log(res.message);
      // console.log(navList.value);
    } catch (error) {
      console.error("获取分类导航失败:", error);
    }
  };
  // 获取楼层的数据
  const getFloorListData = async () => {
    try {
      const res = await getFloorList();
      res.message.forEach((item) => {
        item.product_list.forEach((item) => {
          item.navigator_url = item.navigator_url.replace(
            "pages",
            "subpkg/goods_list",
          );
        });
      });
      floorList.value = res.message;
      // console.log(res.message);
      // console.log(floorList.value);
    } catch (error) {
      console.error("获取楼层数据失败:", error);
    }
  };

  // 点击分类导航
  const handleNavClick = (item) => {
    if (item.name === "分类") {
      uni.switchTab({
        url: "/pages/cate/cate",
      });
    }
  };

  // 跳转到搜索页面
  const goToSearch = () => {
    uni.navigateTo({
      url: "/subpkg/search/search",
    });
  };
</script>

<style lang="scss" scoped>
  .search-box {
    position: sticky;
    top: 0;
    z-index: 999;
  }

  /* 骨架屏样式 */
  .skeleton-container {
    .skeleton-search,
    .skeleton-swiper,
    .skeleton-nav-item,
    .skeleton-floor-title,
    .skeleton-floor-img-left,
    .skeleton-floor-img-small {
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 37%, #f0f0f0 63%);
      background-size: 400% 100%;
      animation: skeleton-loading 1.4s ease infinite;
    }

    .skeleton-search {
      position: sticky;
      top: 0;
      z-index: 999;
      height: 72rpx;
      margin: 20rpx 24rpx;
      border-radius: 36rpx;
    }

    .skeleton-swiper {
      margin: 20rpx 24rpx;
      height: 350rpx;
      border-radius: 16rpx;
    }

    .skeleton-nav-list {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
      padding: 20rpx 0;
    }

    .skeleton-nav-item {
      width: 128rpx;
      height: 80rpx;
      border-radius: 8rpx;
    }

    .skeleton-floor-list {
      padding: 20rpx;
      background-color: #f5f5f5;
    }

    .skeleton-floor-item {
      background-color: #ffffff;
      border-radius: 16rpx;
      padding: 20rpx;
      margin-bottom: 20rpx;
    }

    .skeleton-floor-title {
      width: 100%;
      height: 60rpx;
      margin-bottom: 20rpx;
      border-radius: 8rpx;
    }

    .skeleton-floor-img-box {
      display: flex;
      gap: 16rpx;
    }

    .skeleton-floor-img-left {
      flex: 1;
      height: 420rpx;
      border-radius: 12rpx;
    }

    .skeleton-floor-img-right {
      flex: 1;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-template-rows: repeat(2, 1fr);
      gap: 12rpx;
    }

    .skeleton-floor-img-small {
      height: 200rpx;
      border-radius: 10rpx;
    }

    @keyframes skeleton-loading {
      0% {
        background-position: 100% 50%;
      }
      100% {
        background-position: 0 50%;
      }
    }
  }

  /* 轮播图容器 */
  .swiper-container {
    padding: 20rpx 24rpx;
    border-radius: 0 0 10rpx 10rpx;
    background: linear-gradient(135deg, #e0f7fa 0%, #b2dfdb 100%);

    swiper {
      height: 350rpx;
      border-radius: 16rpx;
      overflow: hidden;
      box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.15);

      swiper-item,
      .swiper-navigator,
      .swiper-image {
        width: 100%;
        height: 100%;
      }

      .swiper-navigator {
        border-radius: 16rpx;
        overflow: hidden;
      }

      .swiper-hover {
        opacity: 0.85;
        transform: scale(0.98);
        transition: all 0.2s ease;
      }

      /* 自定义指示点样式 */
      .wx-swiper-dots,
      .uni-swiper-dots {
        bottom: 16rpx;
      }
    }
  }

  /* 分类导航区域 */
  .nav-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    margin-top: 20rpx;

    view {
      transition: transform 0.15s ease;
    }

    .nav-hover {
      transform: scale(0.92);
      opacity: 0.85;
    }

    image {
      width: 128rpx;
      height: 140rpx;
    }
  }

  /* 楼层区域 */
  .floor-list {
    padding: 20rpx;
    background-color: #f5f5f5;
  }

  .floor-item {
    background-color: #ffffff;
    border-radius: 16rpx;
    padding: 20rpx;
    margin-bottom: 20rpx;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .floor-title {
    width: 100%;
    height: 60rpx;
    margin-bottom: 20rpx;
    border-radius: 8rpx;
  }

  .floor-img-box {
    display: flex;
    gap: 16rpx;
  }

  .floor-img-left {
    flex: 1;
    border-radius: 12rpx;
    overflow: hidden;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);

    image {
      display: block;
      width: 100%;
      height: 420rpx;
      border-radius: 12rpx;
      transition: transform 0.3s ease;
    }

    &:active image {
      transform: scale(0.98);
    }
  }

  .floor-img-right {
    flex: 1;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, 1fr);
    gap: 12rpx;

    navigator {
      border-radius: 10rpx;
      overflow: hidden;
      box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.08);

      image {
        display: block;
        width: 100%;
        height: 200rpx;
        border-radius: 10rpx;
        transition: transform 0.3s ease;
      }

      &:active image {
        transform: scale(0.96);
      }
    }
  }
</style>
