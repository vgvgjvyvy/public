// 声明第三方网络请求库的类型
declare module "@escook/request-miniprogram" {
  interface RequestOptions {
    url?: string;
    method?: string;
    data?: any;
    header?: Record<string, string>;
    timeout?: number;
    [key: string]: any;
  }

  interface ResponseData<T = any> {
    data: T;
    statusCode: number;
    header: Record<string, string>;
    [key: string]: any;
  }

  interface HttpRequest {
    baseURL?: string;
    get(
      url: string,
      data?: any,
      header?: Record<string, string>,
    ): Promise<ResponseData>;
    post(
      url: string,
      data?: any,
      header?: Record<string, string>,
    ): Promise<ResponseData>;
    put(
      url: string,
      data?: any,
      header?: Record<string, string>,
    ): Promise<ResponseData>;
    delete(
      url: string,
      data?: any,
      header?: Record<string, string>,
    ): Promise<ResponseData>;
    request(options: RequestOptions): Promise<ResponseData>;
    beforeRequest(
      callback: (config: RequestOptions) => void | Promise<void>,
    ): void;
    afterRequest(callback: (response: ResponseData) => void): void;
  }

  export const $http: HttpRequest;
}
