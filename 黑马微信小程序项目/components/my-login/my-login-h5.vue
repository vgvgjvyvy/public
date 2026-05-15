<template>
  <view class="page">
    <view class="login-container">
      <view class="icon-wrapper">
        <uni-icons
          type="contact-filled"
          color="#fff"
          size="200rpx"></uni-icons>
      </view>

      <view class="form-container">
        <view class="input-item">
          <uni-icons
            type="phone"
            size="20"
            color="#999"></uni-icons>
          <input
            type="number"
            v-model="phone"
            placeholder="请输入手机号"
            maxlength="11"
            class="input-field" />
        </view>

        <view class="input-item">
          <uni-icons
            type="lock"
            size="20"
            color="#999"></uni-icons>
          <input
            type="number"
            v-model="code"
            placeholder="请输入验证码"
            maxlength="6"
            class="input-field" />
          <button
            class="code-btn"
            :disabled="isSending"
            @click="handleSendCode"
            type="default"
            size="mini">
            {{ isSending ? `${countdown}s后重新获取` : "获取验证码" }}
          </button>
        </view>

        <button
          class="btn-login"
          @click="handleLogin"
          type="primary">
          登录
        </button>
      </view>

      <text class="tips-text">登录后尽享更多权益</text>

      <view class="agreement">
        <checkbox-group @change="handleAgreeChange">
          <label class="agreement-label">
            <checkbox
              :checked="isAgreed"
              color="#e43535"
              style="transform: scale(0.7)" />
            <text class="agreement-text">
              我已阅读并同意
              <text class="link">《用户协议》</text>
              和
              <text class="link">《隐私政策》</text>
            </text>
          </label>
        </checkbox-group>
      </view>
    </view>
  </view>
</template>

<script setup>
  import { ref, computed } from "vue";
  import { useUserStore } from "@/store/user.js";
  import { getToken } from "@/api/api.js";
  import { onUnmounted } from "vue";

  defineOptions({
    name: "my-login-h5",
  });

  const userStore = useUserStore();
  let countdownTimer = null;

  // 表单数据
  const phone = ref("");
  const code = ref("");
  const isAgreed = ref(false);
  const isSending = ref(false);
  const countdown = ref(0);

  // 是否可以提交（仅用于样式判断，不禁用按钮）
  const canSubmit = computed(() => {
    return phone.value.length === 11 && code.value.length === 6;
  });

  // 验证手机号
  const isValidPhone = (phone) => {
    return /^1[3-9]\d{9}$/.test(phone);
  };

  // 发送验证码
  const handleSendCode = async () => {
    if (!isValidPhone(phone.value)) {
      uni.showToast({ title: "请输入正确的手机号", icon: "none" });
      return;
    }

    isSending.value = true;
    countdown.value = 60;

    try {
      // TODO: 调用后端API发送验证码
      // await sendSmsCode({ phone: phone.value });

      console.log("发送验证码到:", phone.value);
      uni.showToast({ title: "验证码已发送", icon: "success" });

      // 倒计时
      countdownTimer = setInterval(() => {
        countdown.value--;
        if (countdown.value <= 0) {
          clearInterval(countdownTimer);
          isSending.value = false;
        }
      }, 1000);
    } catch (err) {
      console.log("发送验证码失败:", err);
      uni.showToast({ title: "发送验证码失败", icon: "error" });
      isSending.value = false;
      countdown.value = 0;
    }
  };

  // 登录处理
  const handleLogin = async () => {
    if (!isValidPhone(phone.value)) {
      uni.showToast({ title: "请输入正确的手机号", icon: "none" });
      return;
    }

    if (code.value.length !== 6) {
      uni.showToast({ title: "请输入6位验证码", icon: "none" });
      return;
    }

    if (!isAgreed.value) {
      uni.showToast({ title: "请先同意用户协议", icon: "none" });
      return;
    }

    try {
      console.log("登录信息:", { phone: phone.value, code: code.value });

      // 模拟网络请求延迟
      await new Promise((resolve) => {
        setTimeout(resolve, 500);
      });

      // 模拟登录成功（学习阶段使用Mock数据）
      const mockToken = "mock_token_" + Date.now();
      console.log("模拟登录成功, token:", mockToken);

      // 设置用户信息
      userStore.setUserInfo({
        phone: phone.value,
        avatarUrl:
          "https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132",
        nickName: "用户" + phone.value.slice(-4),
      });

      userStore.setToken(mockToken);
      uni.showToast({ title: "登录成功", icon: "success" });

      // 等有真实后端后，使用以下代码：
      // const tokenRes = await getToken({
      //   phone: phone.value,
      //   code: code.value,
      // });
      // userStore.setToken(tokenRes.data.token);
    } catch (err) {
      console.log("登录失败:", err);
      uni.showToast({ title: "登录失败，请重试", icon: "error" });
    }
  };

  // 用户协议勾选
  const handleAgreeChange = (e) => {
    isAgreed.value = e.detail.value.length > 0;
  };

  // 组件卸载时清理定时器
  onUnmounted(() => {
    if (countdownTimer) {
      clearInterval(countdownTimer);
      countdownTimer = null;
    }
  });
</script>

<style lang="scss" scoped>
  .page {
    height: calc(100vh - var(--window-top) - var(--window-bottom));
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: linear-gradient(180deg, #fff5f5 0%, #ffffff 100%);
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
    margin-bottom: 60rpx;
    box-shadow: 0 12rpx 36rpx rgba(232, 93, 93, 0.5);
  }

  .form-container {
    width: 100%;
  }

  .input-item {
    display: flex;
    align-items: center;
    background: #f7f8fa;
    border-radius: 50rpx;
    padding: 0 30rpx;
    height: 100rpx;
    margin-bottom: 30rpx;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);

    .input-field {
      flex: 1;
      margin-left: 20rpx;
      font-size: 30rpx;
      color: #333;
    }

    .code-btn {
      background: linear-gradient(135deg, #e43535 0%, #da7979 100%);
      color: #fff;
      border: none;
      border-radius: 30rpx;
      padding: 0 24rpx;
      height: 60rpx;
      line-height: 60rpx;
      font-size: 24rpx;
      white-space: nowrap;

      &[disabled] {
        background: #ccc;
        color: #999;
      }
    }
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
    margin-top: 40rpx;

    &:active:not([disabled]) {
      transform: scale(0.98);
      box-shadow: 0 4rpx 12rpx rgba(232, 93, 93, 0.3);
    }
  }

  .btn-disabled {
    background: linear-gradient(135deg, #f5a6a6 0%, #f0c8c8 100%);
    box-shadow: none;
  }

  .tips-text {
    margin-top: 40rpx;
    font-size: 26rpx;
    color: #999999;
    letter-spacing: 1rpx;
  }

  .agreement {
    margin-top: 30rpx;
    width: 100%;

    .agreement-label {
      display: flex;
      align-items: center;
      justify-content: center;

      .agreement-text {
        font-size: 24rpx;
        color: #666;
        line-height: 1.6;

        .link {
          color: #e43535;
          // text-decoration: underline;
        }
      }
    }
  }
</style>
