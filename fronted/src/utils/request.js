import axios from 'axios';

// 创建 axios 实例
const service = axios.create({
  timeout: 10000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 可以在这里添加 token 等认证信息
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers['Authorization'] = `Bearer ${token}`;
    // }
    return config;
  },
  error => {
    console.error('请求错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data;
    
    // 根据实际后端返回格式调整
    // 假设后端返回格式: { code: 200, data: {...}, message: '成功' }
    if (res.code !== 200 && res.code !== undefined) {
      console.error('接口错误:', res.message || '请求失败');
      return Promise.reject(new Error(res.message || '请求失败'));
    }
    
    return res;
  },
  error => {
    console.error('响应错误:', error);
    return Promise.reject(error);
  }
);

// 封装请求方法
const request = (config) => {
  return service(config);
};

export default request;
