import request from "@/utils/request.js";

// 获取轮播图数据
export const getSwiperList = () => {
  return request({
    url: "/api/public/v1/home/swiperdata",
    method: "GET",
  });
};
// 获取分类导航数据
export const getNavList = () => {
  return request({
    url: "/api/public/v1/home/catitems",
    method: "GET",
  });
};

// 获取楼层的数据
export const getFloorList = () => {
  return request({
    url: "/api/public/v1/home/floordata",
    method: "GET",
  });
};

// 获取分类列表数据
export const getCateList = () => {
  return request({
    url: "/api/public/v1/categories",
    method: "GET",
  });
};
