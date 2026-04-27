<template>
  <view>
    <!-- 轮播图区域 -->
    <swiper
      :indicator-dots="true"
      :autoplay="true"
      :interval="3000"
      :duration="500"
      :circular="true"
      :current="currentSwiper"
      @change="handleSwiperChange">
      <swiper-item
        v-for="item in swiperList"
        :key="item.goods_id">
        <navigator
          :url="'/subpkg/goods_detail/goods_detail?id=' + item.goods_id"
          open-type="navigate"
          hover-class="navigator-hover">
          <image
            :src="item.image_src"
            mode="" />
        </navigator>
      </swiper-item>
    </swiper>

    <!-- 分类导航区域 -->
    <view class="nav-list">
      <view
        v-for="item in navList"
        :key="item.image_src"
        @click="handleNavClick(item)">
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
              :style="{ width: item.product_list[0].image_width + 'rpx' }"
              mode="widthFix" />
          </navigator>
          <!-- 右侧 4 个小图片的盒子 -->
          <view class="floor-img-right">
            <navigator
              v-for="(img, index2) in item.product_list.slice(1)"
              :key="index2"
              :url="img.navigator_url">
              <image
                :src="img.image_src"
                :style="{ width: img.image_width + 'rpx' }"
                mode="widthFix" />
            </navigator>
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

  // 轮播图数据
  const swiperList = ref([]);
  // 分类导航数据
  const navList = ref([]);
  // 楼层的数据
  const floorList = ref([]);

  // 页面加载时触发
  onLoad(() => {
    getSwiperListData();
    getNavListData();
    getFloorListData();
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
</script>

<style lang="scss" scoped>
  /* 轮播图区域 */
  swiper {
    height: 330rpx;

    swiper-item,
    navigator,
    image {
      width: 100%;
      height: 100%;
    }
  }

  /* 分类导航区域 */
  .nav-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    margin: 10rpx 0;

    image {
      width: 128rpx;
      height: 140rpx;
    }
  }

  .floor-title {
    width: 100%;
    height: 60rpx;
  }

  .floor-img-box {
    display: flex;
    padding-left: 10rpx;
  }

  .floor-img-right {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
  }
</style>
