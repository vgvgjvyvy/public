<template>
  <view>
    <view class="goods-list">
      <my-goods
        @click="goToDetail"
        v-for="item in goodsList"
        :key="item.goods_id"
        :goods="item"
        :click-target="'container'" />
    </view>
  </view>
</template>

<script setup>
  import { ref } from "vue";
  import { onLoad, onReachBottom, onPullDownRefresh } from "@dcloudio/uni-app";
  import { getGoodsList } from "@/api/api.js";
  import MyGoods from "@/components/my-goods/my-goods.vue";

  const queryObj = ref({
    query: "",
    cid: "",
    pagenum: 1,
    pagesize: 10,
  });

  const goodsList = ref([]);
  const total = ref(0);
  // 节流阀（true表示可用，false表示正在请求中）
  const throttle = ref(true);

  onLoad(function (options) {
    queryObj.value.query = options.query || "";
    queryObj.value.cid = options.cid || "";

    getGoodsListData();
  });

  const getGoodsListData = async (isAppend = false) => {
    // 节流阀：如果正在请求中则直接返回
    if (!throttle.value) return;
    throttle.value = false;

    try {
      const res = await getGoodsList(queryObj.value);
      if (isAppend) {
        goodsList.value = [...goodsList.value, ...res.message.goods];
      } else {
        goodsList.value = res.message.goods;
      }
      total.value = res.message.total;
      // 增加页码
      queryObj.value.pagenum++;
    } catch (error) {
      console.log(error);
      if (isAppend) {
        queryObj.value.pagenum--;
      }
    } finally {
      throttle.value = true;
    }
  };

  // 上拉加载更多
  const loadMore = async () => {
    // 判断是否还有更多数据

    if (goodsList.value.length >= total.value) {
      uni.showToast({
        title: "没有更多数据了",
        icon: "none",
      });
      return;
    }

    getGoodsListData(true);
  };

  // 页面触底时触发
  onReachBottom(() => {
    loadMore();
  });

  onPullDownRefresh(async () => {
    // 重置关键数据
    queryObj.value.pagenum = 1;
    goodsList.value = [];
    total.value = 0;
    throttle.value = true;

    // 重新发起请求
    await getGoodsListData();
    uni.stopPullDownRefresh();
  });

  // 跳转详情页
  const goToDetail = (item) => {
    uni.navigateTo({
      url: "/subpkg/goods_detail/goods_detail?goods_id=" + item.goods_id,
    });
  };
</script>
<style lang="scss" scoped>
  .goods-list {
    padding: 20rpx;
  }
</style>
