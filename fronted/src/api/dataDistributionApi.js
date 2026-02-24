import axios from 'axios';

// 后端基础地址，如有需要可改成从环境变量读取
const BASE_URL = 'http://localhost:8080/api/data-distribution';

export const fetchSecurityDistribution = () =>
  axios.get(`${BASE_URL}/security`).then(res => res.data || []);

export const fetchBusinessDistribution = () =>
  axios.get(`${BASE_URL}/business`).then(res => res.data || []);

export const fetchOwnerDistribution = () =>
  axios.get(`${BASE_URL}/owners`).then(res => res.data || []);

export const globalSearch = (type, keyword) =>
  axios
    .get(`${BASE_URL}/global-search`, {
      params: { type, keyword },
    })
    .then(res => res.data || []);

export const fetchThemes = () =>
  axios.get(`${BASE_URL}/themes`).then(res => res.data || []);

export const fetchThemeStats = themeName =>
  axios
    .get(`${BASE_URL}/themes/${encodeURIComponent(themeName)}/stats`)
    .then(res => res.data || null);

export const fetchThemeDictionary = themeName =>
  axios
    .get(`${BASE_URL}/themes/${encodeURIComponent(themeName)}/dictionary`)
    .then(res => res.data || []);

