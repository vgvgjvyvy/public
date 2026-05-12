subpkg/address_edit/address_edit.vue
<template>
  <view class="page-container">
    <view class="form-container">
      <!-- 收货人 -->
      <view class="form-item">
        <text class="label">收货人</text>
        <input
          class="input"
          v-model="formData.name"
          placeholder="请输入收货人姓名"
          maxlength="20" />
      </view>

      <!-- 手机号 -->
      <view class="form-item">
        <text class="label">手机号</text>
        <input
          class="input"
          v-model="formData.phone"
          type="number"
          placeholder="请输入手机号"
          maxlength="11" />
      </view>

      <!-- 省市区选择 -->
      <view
        class="form-item"
        @click="showRegionPicker">
        <text class="label">省市区</text>
        <view class="region-picker">
          <text
            class="region-text"
            :class="{ placeholder: !regionText }">
            {{ regionText || "请选择省市区" }}
          </text>
          <uni-icons
            type="right"
            size="16"
            color="#999"></uni-icons>
        </view>
      </view>

      <!-- 详细地址 -->
      <view class="form-item detail-item">
        <text class="label">详细地址</text>
        <textarea
          class="textarea"
          v-model="formData.detail"
          placeholder="请输入详细地址（街道、门牌号等）"
          maxlength="200"
          :auto-height="true" />
      </view>
    </view>

    <!-- 保存按钮 -->
    <view class="save-btn-container">
      <button
        class="save-btn"
        @click="saveAddress">
        保存地址
      </button>
    </view>

    <!-- 省市区选择弹窗 -->
    <uni-popup
      ref="regionPopup"
      type="bottom"
      @change="onPopupChange">
      <view class="picker-content">
        <view class="picker-header">
          <text
            class="cancel-btn"
            @click="closePicker"
            >取消</text
          >
          <text class="title">选择省市区</text>
          <text
            class="confirm-btn"
            @click="confirmRegion"
            >确定</text
          >
        </view>
        <view class="picker-body">
          <!-- 省份选择 -->
          <view
            class="step-selector"
            v-if="currentStep === 0">
            <view class="step-header">
              <text class="step-title">选择省份</text>
            </view>
            <scroll-view
              class="step-list"
              scroll-y>
              <view
                class="step-item"
                v-for="(item, index) in provinceList"
                :key="index"
                :class="{ active: selectedProvince === index }"
                @click="selectProvince(index)">
                <text>{{ item.text }}</text>
                <uni-icons
                  type="right"
                  size="16"
                  color="#999"></uni-icons>
              </view>
            </scroll-view>
          </view>

          <!-- 城市选择 -->
          <view
            class="step-selector"
            v-else-if="currentStep === 1">
            <view class="step-header">
              <view
                class="back-btn"
                @click="backToProvince">
                <uni-icons
                  type="left"
                  size="20"
                  color="#333"></uni-icons>
                <text>选择城市</text>
              </view>
            </view>
            <scroll-view
              class="step-list"
              scroll-y>
              <view
                class="step-item"
                v-for="(item, index) in cityList"
                :key="index"
                :class="{ active: selectedCity === index }"
                @click="selectCity(index)">
                <text>{{ item.text }}</text>
                <uni-icons
                  type="right"
                  size="16"
                  color="#999"></uni-icons>
              </view>
            </scroll-view>
          </view>

          <!-- 区县选择 -->
          <view
            class="step-selector"
            v-else-if="currentStep === 2">
            <view class="step-header">
              <view
                class="back-btn"
                @click="backToCity">
                <uni-icons
                  type="left"
                  size="20"
                  color="#333"></uni-icons>
                <text>选择区县</text>
              </view>
            </view>
            <scroll-view
              class="step-list"
              scroll-y>
              <view
                class="step-item"
                v-for="(item, index) in areaList"
                :key="index"
                :class="{ active: selectedArea === index }"
                @click="selectArea(index)">
                <text>{{ item.text }}</text>
              </view>
            </scroll-view>
          </view>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script setup>
  import { ref, computed } from "vue";
  import { onLoad } from "@dcloudio/uni-app";
  import { useAddressStore } from "@/store/address.js";
  import { regionData } from "@/utils/region-data.js";

  defineOptions({
    name: "address-edit",
  });

  const addressStore = useAddressStore();

  const addressId = ref(null);
  const isEditMode = ref(false);

  const formData = ref({
    name: "",
    phone: "",
    detail: "",
  });

  const showPicker = ref(false);
  const regionPopup = ref(null);
  const selectedProvince = ref(-1);
  const selectedCity = ref(-1);
  const selectedArea = ref(-1);
  const currentStep = ref(0); // 0: 省份, 1: 城市, 2: 区县

  onLoad((options) => {
    if (options && options.id) {
      addressId.value = Number(options.id);
      isEditMode.value = true;
      loadAddressData(addressId.value);
    }
  });

  const loadAddressData = (id) => {
    const address = addressStore.addressList.find((item) => item.id === id);
    if (address) {
      formData.value.name = address.name;
      formData.value.phone = address.phone;

      const fullAddress = address.address;
      // 解析省市区和详细地址
      const match = fullAddress.match(
        /^(.+?省|.+?市|.+?自治区)(.+?市|.+?州|.+?地区)(.+?区|.+?县|.+?市)(.+)$/,
      );
      if (match) {
        const province = match[1];
        const city = match[2];
        const area = match[3];
        const detail = match[4];

        formData.value.detail = detail;

        // 查找并设置省市区索引
        const provinceIndex = regionData.findIndex(
          (item) => item.text === province,
        );
        if (provinceIndex !== -1) {
          selectedProvince.value = provinceIndex;

          const cityData = regionData[provinceIndex].children || [];
          const cityIndex = cityData.findIndex((item) => item.text === city);
          if (cityIndex !== -1) {
            selectedCity.value = cityIndex;

            const areaData = cityData[cityIndex].children || [];
            const areaIndex = areaData.findIndex((item) => item.text === area);
            if (areaIndex !== -1) {
              selectedArea.value = areaIndex;
            }
          }
        }
      } else {
        // 如果无法解析，将整个地址作为详细地址
        formData.value.detail = fullAddress;
      }
    }
  };

  const provinceList = computed(() => regionData);

  const cityList = computed(() => {
    if (selectedProvince.value >= 0) {
      return regionData[selectedProvince.value].children || [];
    }
    return [];
  });

  const areaList = computed(() => {
    if (selectedProvince.value >= 0 && selectedCity.value >= 0) {
      return cityList.value[selectedCity.value]?.children || [];
    }
    return [];
  });

  const regionText = computed(() => {
    if (
      selectedProvince.value >= 0 &&
      selectedCity.value >= 0 &&
      selectedArea.value >= 0
    ) {
      const province = provinceList.value[selectedProvince.value].text;
      const city = cityList.value[selectedCity.value].text;
      const area = areaList.value[selectedArea.value].text;
      return `${province}${city}${area}`;
    }
    return "";
  });

  const showRegionPicker = () => {
    currentStep.value = 0;
    regionPopup.value.open();
  };

  const closePicker = () => {
    regionPopup.value.close();
  };

  const onPopupChange = (e) => {
    showPicker.value = e.type === "open";
  };

  const selectProvince = (index) => {
    selectedProvince.value = index;
    selectedCity.value = 0;
    selectedArea.value = 0;
    currentStep.value = 1;
  };

  const selectCity = (index) => {
    selectedCity.value = index;
    selectedArea.value = 0;
    currentStep.value = 2;
  };

  const selectArea = (index) => {
    selectedArea.value = index;
  };

  const backToProvince = () => {
    currentStep.value = 0;
  };

  const backToCity = () => {
    currentStep.value = 1;
  };

  const confirmRegion = () => {
    closePicker();
  };

  const validateForm = () => {
    if (!formData.value.name.trim()) {
      uni.showToast({ title: "请输入收货人", icon: "none" });
      return false;
    }
    if (!formData.value.phone.trim()) {
      uni.showToast({ title: "请输入手机号", icon: "none" });
      return false;
    }
    if (!/^1[3-9]\d{9}$/.test(formData.value.phone)) {
      uni.showToast({ title: "手机号格式不正确", icon: "none" });
      return false;
    }
    if (!regionText.value) {
      uni.showToast({ title: "请选择省市区", icon: "none" });
      return false;
    }
    if (!formData.value.detail.trim()) {
      uni.showToast({ title: "请输入详细地址", icon: "none" });
      return false;
    }
    return true;
  };

  const saveAddress = () => {
    if (!validateForm()) return;

    const fullAddress = `${regionText.value}${formData.value.detail}`;

    if (isEditMode.value && addressId.value) {
      addressStore.updateAddress(addressId.value, {
        name: formData.value.name,
        phone: formData.value.phone,
        address: fullAddress,
      });
      uni.showToast({ title: "更新成功", icon: "success" });
    } else {
      addressStore.addAddress({
        name: formData.value.name,
        phone: formData.value.phone,
        address: fullAddress,
      });
      uni.showToast({ title: "添加成功", icon: "success" });
    }

    setTimeout(() => {
      uni.navigateBack();
    }, 1500);
  };
</script>

<style lang="scss" scoped>
  .page-container {
    min-height: 100vh;
    background-color: #f5f5f5;
    padding-bottom: 120rpx;
  }

  .form-container {
    background-color: #fff;
    margin: 20rpx;
    border-radius: 16rpx;
    padding: 0 30rpx;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
  }

  .form-item {
    display: flex;
    align-items: center;
    padding: 30rpx 0;
    border-bottom: 1rpx solid #f0f0f0;

    &:last-child {
      border-bottom: none;
    }

    .label {
      width: 160rpx;
      font-size: 28rpx;
      color: #333;
      flex-shrink: 0;
    }

    .input {
      flex: 1;
      font-size: 28rpx;
      color: #333;
      padding: 10rpx 0;
    }

    .region-picker {
      flex: 1;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .region-text {
        font-size: 28rpx;
        color: #333;

        &.placeholder {
          color: #999;
        }
      }
    }
  }

  .detail-item {
    align-items: flex-start;

    .label {
      padding-top: 10rpx;
    }

    .textarea {
      flex: 1;
      font-size: 28rpx;
      color: #333;
      min-height: 120rpx;
      padding: 10rpx 0;
    }
  }

  .save-btn-container {
    padding: 40rpx 30rpx;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #fff;
    box-shadow: 0 -4rpx 12rpx rgba(0, 0, 0, 0.05);

    .save-btn {
      background: linear-gradient(135deg, #c00000 0%, #e63946 100%);
      color: #fff;
      border: none;
      border-radius: 50rpx;
      font-size: 32rpx;
      font-weight: 500;
      height: 88rpx;
      line-height: 88rpx;

      &::after {
        border: none;
      }

      &:active {
        opacity: 0.9;
      }
    }
  }

  .picker-mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999;
    display: flex;
    align-items: flex-end;
  }

  .picker-content {
    width: 100%;
    background-color: #fff;
    border-radius: 24rpx 24rpx 0 0;
    overflow: hidden;
  }

  .picker-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20rpx 30rpx;
    border-bottom: 1rpx solid #f0f0f0;

    .cancel-btn {
      font-size: 28rpx;
      color: #999;
    }

    .title {
      font-size: 30rpx;
      color: #333;
      font-weight: 500;
    }

    .confirm-btn {
      font-size: 28rpx;
      color: #c00000;
      font-weight: 500;
    }
  }

  .picker-body {
    height: 500rpx;
  }

  .step-selector {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .step-header {
    padding: 20rpx 30rpx;
    border-bottom: 1rpx solid #f0f0f0;
    background-color: #fafafa;

    .step-title {
      font-size: 28rpx;
      color: #333;
      font-weight: 500;
    }

    .back-btn {
      display: flex;
      align-items: center;
      gap: 8rpx;
      font-size: 28rpx;
      color: #333;
    }
  }

  .step-list {
    height: 400rpx;
  }

  .step-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 28rpx 30rpx;
    font-size: 28rpx;
    color: #333;
    border-bottom: 1rpx solid #f5f5f5;

    &.active {
      background-color: #fff5f5;
      color: #c00000;
      font-weight: 500;
    }

    &:active {
      background-color: #fafafa;
    }
  }
</style>
