<template>
  <view>
    <!-- 轮播图区域 -->
    <swiper
      :indicator-dots="true"
      :autoplay="true"
      :interval="3000"
      :duration="1000"
      :circular="true">
      <swiper-item
        v-for="item in goods_info.pics"
        :key="item.pics_id">
        <image
          :src="item.pics_big"
          @click="previewImage(item.pics_big)" />
      </swiper-item>
    </swiper>

    <!-- 商品信息区域 -->
    <view class="goods-info">
      <!-- 商品价格 -->
      <view class="goods-price">¥{{ goods_info.goods_price }}</view>
      <!-- 商品信息主体区域 -->
      <view class="goods-info-main">
        <!-- 商品名称 -->
        <view class="goods_name">{{ goods_info.goods_name }}</view>
        <!-- 收藏 -->
        <view class="goods_collect">
          <uni-icons
            type="star"
            size="20"
            color="gray"></uni-icons>

          <text>收藏</text>
        </view>
      </view>
      <!-- 商品运费 -->
      <view class="goods-freight">快递：免运费</view>
    </view>

    <rich-text :nodes="goods_info.goods_introduce"></rich-text>

    <!-- 商品导航组件区域 -->
    <view class="goods-nav">
      <uni-goods-nav
        :fill="true"
        :options="options"
        :buttonGroup="buttonGroup"
        @click="onClick"
        @buttonClick="buttonClick" />
    </view>
  </view>
</template>

<script setup>
  import { ref } from "vue";
  import { onLoad } from "@dcloudio/uni-app";
  import { getGoodsListDetail } from "@/api/api.js";

  const goods_info = ref({});

  const options = ref([
    {
      icon: "shop",
      text: "店铺",
    },
    {
      icon: "cart",
      text: "购物车",
      info: 2,
    },
  ]);

  const buttonGroup = ref([
    {
      text: "加入购物车",
      backgroundColor: "#ff0000",
      color: "#fff",
    },
    {
      text: "立即购买",
      backgroundColor: "#ffa200",
      color: "#fff",
    },
  ]);

  onLoad(async (options) => {
    const { goods_id } = options;
    await getGoodsListDetailData({
      goods_id,
    });
  });

  const getGoodsListDetailData = async (data) => {
    try {
      const res = await getGoodsListDetail(data);

      res.message.goods_introduce = res.message.goods_introduce.replace(
        /<img /g,
        "<img style='display:block;' ",
      );

      goods_info.value = res.message;
    } catch (error) {
      console.log(error);
    }
  };

  const previewImage = (currentUrl) => {
    uni.previewImage({
      current: currentUrl,
      urls: goods_info.value.pics.map((item) => item.pics_big),
    });
  };

  const onClick = (e) => {
    uni.showToast({
      title: `点击${e.content.text}`,
      icon: "none",
    });

    if (e.content.text === "购物车") {
      uni.switchTab({
        url: "/pages/cart/cart",
      });
    }
  };
  const buttonClick = (e) => {
    console.log(e);
    options.value[1].info++;
  };
</script>

<style lang="scss" scoped>
  swiper {
    height: 750rpx;

    image {
      width: 100%;
      height: 100%;
    }
  }

  .goods-info {
    padding: 20rpx;

    .goods-price {
      font-size: 36rpx;
      color: #c00000;
      margin: 20rpx 0;
    }

    .goods-info-main {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .goods_name {
      font-size: 26rpx;
      margin-right: 20rpx;
    }

    .goods_collect {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 140rpx;
      gap: 4rpx;
      font-size: 24rpx;
      color: gray;
      border-left: 2rpx solid #efefef;
    }

    .goods-freight {
      font-size: 24rpx;
      color: gray;
      margin: 20rpx 0;
    }
  }

  .goods-nav {
    position: sticky;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #fff;
    padding-bottom: constant(safe-area-inset-bottom); /* iOS < 11.2 */
    padding-bottom: env(safe-area-inset-bottom); /* iOS >= 11.2 */
  }
</style>
