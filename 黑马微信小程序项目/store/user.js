import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useUserStore = defineStore("user", () => {
  // 登录凭证
  const token = ref(uni.getStorageSync("token") || null);
  // 用户信息
  const userInfo = ref(uni.getStorageSync("userInfo") || {});
  // 登录跳转来源
  const loginRedirect = ref(null);

  // 设置登录凭证
  function setToken(newToken) {
    token.value = newToken;
    uni.setStorageSync("token", newToken);
  }

  // 设置用户信息
  function setUserInfo(newUserInfo) {
    userInfo.value = newUserInfo;
    uni.setStorageSync("userInfo", newUserInfo);
  }

  // 清空用户信息
  function clearUserInfo() {
    userInfo.value = {};
    uni.removeStorageSync("userInfo");
  }

  // 清空登录凭证
  function clearToken() {
    token.value = null;
    uni.removeStorageSync("token");
  }

  // 设置登录跳转来源
  function setLoginRedirect(redirect) {
    loginRedirect.value = redirect;
  }

  // 清除登录跳转来源
  function clearLoginRedirect() {
    loginRedirect.value = null;
  }

  // 监听 token 变化，自动保存到本地存储
  watch(token, (newVal) => {
    if (newVal) {
      uni.setStorageSync("token", newVal);
    } else {
      uni.removeStorageSync("token");
    }
  });

  return {
    token,
    userInfo,
    loginRedirect,
    setToken,
    setUserInfo,
    clearToken,
    clearUserInfo,
    setLoginRedirect,
    clearLoginRedirect,
  };
});
