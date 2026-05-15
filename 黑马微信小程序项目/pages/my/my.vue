<template>
  <view>
    <template v-if="!token">
      <!-- #ifdef MP-WEIXIN -->
      <my-login />
      <!-- #endif -->
      <!-- #ifdef H5 -->
      <my-login-h5 />
      <!-- #endif -->
    </template>
    <my-userinfo v-else />
  </view>
</template>

<script setup>
  import { computed, watch } from "vue";
  import { useCartBadge } from "@/composables/useCartBadge.js";
  useCartBadge();

  import { useUserStore } from "@/store/user.js";
  const userStore = useUserStore();

  const token = computed(() => userStore.token);

  let redirectTimer = null;

  // 在页面级别监听token变化，处理登录成功后的跳转
  watch(
    () => userStore.token,
    (newToken) => {
      if (newToken) {
        const redirectUrl = userStore.loginRedirect;
        if (redirectUrl) {
          // 清除之前的定时器
          if (redirectTimer) {
            clearTimeout(redirectTimer);
          }
          userStore.clearLoginRedirect();

          // 延迟跳转
          redirectTimer = setTimeout(() => {
            const tabBarPages = [
              "/pages/home/home",
              "/pages/cate/cate",
              "/pages/cart/cart",
              "/pages/my/my",
            ];
            if (tabBarPages.includes(redirectUrl)) {
              uni.switchTab({ url: redirectUrl });
            } else {
              uni.redirectTo({ url: redirectUrl });
            }
          }, 1500);
        }
      }
    },
  );

  // 页面卸载时清理定时器
  import { onUnload } from "@dcloudio/uni-app";
  onUnload(() => {
    if (redirectTimer) {
      clearTimeout(redirectTimer);
      redirectTimer = null;
    }
  });

  // #ifdef H5
  import MyLoginH5 from "@/components/my-login/my-login-h5.vue";
  // #endif
</script>

<style lang="scss"></style>
