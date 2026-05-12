// 基础配置
const BASE_URL = "https://api-hmugo-web.itheima.net";

// 请求计数器，用于处理并发请求
let pendingRequestsCount = 0;

// 请求拦截器
const requestInterceptor = (options) => {
  // 可以在这里添加 token、修改 header 等
  return {
    ...options,
    url: BASE_URL + options.url,
    header: {
      "Content-Type": "application/json",
      ...options.header,
    },
  };
};

// 响应拦截器
const responseInterceptor = (response) => {
  const { statusCode, data } = response;

  // HTTP 状态码判断
  if (statusCode !== 200) {
    return Promise.reject(new Error(`请求失败，状态码: ${statusCode}`));
  }

  // 业务状态码判断（根据实际接口调整）
  if (data.meta && data.meta.status !== 200) {
    return Promise.reject(new Error(data.meta.msg || "请求失败"));
  }

  return Promise.resolve(data);
};

// 封装请求
const request = async (options) => {
  try {
    // 增加请求计数
    pendingRequestsCount++;
    // 只在第一个请求时显示加载中
    if (pendingRequestsCount === 1) {
      uni.showLoading({
        title: "加载中...",
        mask: true,
      });
    }

    // 执行请求拦截器
    const interceptedOptions = requestInterceptor(options);

    // 使用 Promise 封装 uni.request 并等待结果
    const response = await new Promise((resolve, reject) => {
      uni.request({
        ...interceptedOptions,
        timeout: 10000, // 设置10秒超时
        success: (res) => resolve(res),
        fail: (err) => reject(new Error(err.errMsg || "网络请求失败")),
        complete: () => {
          // 减少请求计数
          pendingRequestsCount--;
          // 只有当所有请求都完成时才关闭加载中
          if (pendingRequestsCount === 0) {
            uni.hideLoading();
          }
        },
      });
    });

    // 执行响应拦截器并返回结果
    return await responseInterceptor(response);
  } catch (error) {
    // 统一错误提示
    uni.showToast({
      title: error.message || "请求失败",
      icon: "none",
      duration: 2000,
    });
    throw error;
  }
};

export default request;
