import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useAddressStore = defineStore("address", () => {
  // 当前选中的地址
  const selectedAddress = ref(uni.getStorageSync("address") || null);
  // 地址列表
  const addressList = ref(uni.getStorageSync("addressList") || []);

  // 保存收货地址（选中的地址）
  function saveAddress(address) {
    selectedAddress.value = address;
  }

  // 清空收货地址
  function clearAddress() {
    selectedAddress.value = null;
  }

  // 保存地址到列表
  function addAddress(address) {
    const newAddress = {
      id: Date.now(),
      ...address,
      isDefault: addressList.value.length === 0,
    };
    addressList.value.push(newAddress);
    saveAddressList();
    return newAddress;
  }

  // 更新地址
  function updateAddress(id, updatedData) {
    const index = addressList.value.findIndex((item) => item.id === id);
    if (index !== -1) {
      addressList.value[index] = {
        ...addressList.value[index],
        ...updatedData,
      };
      saveAddressList();
    }
  }

  // 删除地址
  function deleteAddress(id) {
    const index = addressList.value.findIndex((item) => item.id === id);
    if (index !== -1) {
      addressList.value.splice(index, 1);
      saveAddressList();
      // 如果删除的是当前选中的地址,则清空选中状态
      if (selectedAddress.value && selectedAddress.value.id === id) {
        clearAddress();
      }
    }
  }

  // 设置默认地址
  function setDefaultAddress(id) {
    addressList.value.forEach((item) => {
      item.isDefault = item.id === id;
    });
    saveAddressList();
  }

  // 保存地址列表到本地存储
  function saveAddressList() {
    uni.setStorageSync("addressList", addressList.value);
  }

  // 监听地址变化，自动保存到本地存储
  watch(
    selectedAddress,
    (newVal) => {
      if (newVal) {
        uni.setStorageSync("address", newVal);
      } else {
        uni.removeStorageSync("address");
      }
    },
    { deep: true },
  );

  return {
    selectedAddress,
    addressList,
    saveAddress,
    clearAddress,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
  };
});
