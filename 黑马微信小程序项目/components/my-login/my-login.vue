<template>
  <view class="page">
    <view class="login-container">
      <view class="icon-wrapper">
        <uni-icons
          type="contact-filled"
          color="#fff"
          size="200rpx"></uni-icons>
      </view>
      <button
        open-type="getUserInfo"
        @getuserinfo="handleGetUserInfo"
        class="btn-login"
        type="primary">
        一键登录
      </button>
      <text class="tips-text">登录后尽享更多权益</text>
    </view>
  </view>
</template>

<script setup>
  import { useUserStore } from "@/store/user.js";
  import { getToken } from "@/api/api.js";

  defineOptions({
    name: "my-login",
  });

  const userStore = useUserStore();
  let loginTimer = null;

  // 用户授权之后,获取用户的基本信息;
  const handleGetUserInfo = (res) => {
    console.log("用户授权信息:", res);
    if (res.detail.userInfo) {
      userStore.setUserInfo(res.detail.userInfo);
      getTokenData(res.detail);
    }
  };

  const getTokenData = async (info) => {
    try {
      // 先调用 login 获取 code
      const loginRes = await uni.login();
      console.log("获取 login code 成功:", loginRes);

      // 检查 code 是否存在
      if (!loginRes.code) {
        throw new Error("获取登录 code 失败");
      }

      // 学习阶段：使用 Mock 数据模拟登录成功
      console.log("模拟登录，用户信息:", info);
      const mockToken = "mock_token_" + Date.now();

      // 模拟网络请求延迟
      await new Promise((resolve) => {
        loginTimer = setTimeout(resolve, 500);
      });

      console.log("模拟获取 token 成功:", mockToken);
      userStore.setToken(mockToken);
      uni.showToast({ title: "登录成功", icon: "success" });

      // 等有真实后端后，取消下面的注释并删除上面的 Mock 代码：
      // const query = {
      //   code: loginRes.code,
      //   encryptedData: info.encryptedData,
      //   iv: info.iv,
      //   rawData: info.rawData,
      //   signature: info.signature,
      // };
      // const tokenRes = await getToken(query);
      // console.log("获取token成功:", tokenRes);
      // userStore.setToken(tokenRes.data.token);
      // uni.showToast({ title: "登录成功", icon: "success" });
    } catch (err) {
      console.log("登录失败:", err);
      uni.showToast({ title: "登录失败", icon: "error" });
    }
  };
</script>

<style lang="scss" scoped>
  .page {
    height: calc(100vh - var(--window-top) - var(--window-bottom));

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .login-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 60rpx 40rpx;
    width: 100%;
    max-width: 600rpx;
  }

  .icon-wrapper {
    width: 240rpx;
    height: 240rpx;
    background: linear-gradient(135deg, #e43535 0%, #da7979 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 100rpx;
    box-shadow: 0 12rpx 36rpx rgba(232, 93, 93, 0.5);
  }

  .btn-login {
    width: 100% !important;
    height: 100rpx;
    line-height: 100rpx;
    background: linear-gradient(135deg, #e43535 0%, #da7979 100%);
    color: #ffffff;
    border-radius: 50rpx;
    font-size: 34rpx;
    font-weight: bold;
    letter-spacing: 4rpx;
    border: none;
    box-shadow: 0 8rpx 24rpx rgba(232, 93, 93, 0.4);
    transition: all 0.3s ease;

    &:active {
      transform: scale(0.98);
      box-shadow: 0 4rpx 12rpx rgba(232, 93, 93, 0.3);
    }
  }

  .tips-text {
    margin-top: 40rpx;
    font-size: 26rpx;
    color: #999999;
    letter-spacing: 1rpx;
  }
</style>
