import request from "@/utils/request.js";
const baseURL = "/api/public/v1";

// 获取轮播图数据
export const getSwiperList = () => {
  return request({
    url: baseURL + "/home/swiperdata",
    method: "GET",
  });
};
// 获取分类导航数据
export const getNavList = () => {
  return request({
    url: baseURL + "/home/catitems",
    method: "GET",
  });
};

// 获取楼层的数据
export const getFloorList = () => {
  return request({
    url: baseURL + "/home/floordata",
    method: "GET",
  });
};

// 获取分类列表数据
export const getCateList = () => {
  return request({
    url: baseURL + "/categories",
    method: "GET",
  });
};

// 获取搜索结果列表数据
export const getSearchResult = (data) => {
  return request({
    url: baseURL + "/goods/qsearch",
    method: "GET",
    data,
  });
};

// 获取商品列表搜索结果数据
export const getGoodsList = (data) => {
  return request({
    url: baseURL + "/goods/search",
    method: "GET",
    data,
  });
};

// 获取商品详情数据
export const getGoodsListDetail = (data) => {
  return request({
    url: baseURL + "/goods/detail",
    method: "GET",
    data,
  });
};

// 获取token
export const getToken = (data) => {
  return request({
    url: baseURL + "/users/wxlogin",
    method: "POST",
    data,
  });
};

// 支付订单
export const payOrder = (data) => {
  return request({
    url: baseURL + "/my/orders/create",
    method: "POST",
    data,
  });
};
