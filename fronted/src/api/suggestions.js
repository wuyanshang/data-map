import request from '../utils/request';
import api from '../config/api';

// 搜索建议相关接口
export default {
  // 全局搜索建议（GlobalSearch 组件使用）
  getGlobalSearchSuggestions: (params) => request({
    url: api + '/ddms/ddasset/suggestions/global',
    method: 'post',
    data: params
  }),

  // 资产名称搜索建议（AssetCategoryModal 组件使用）
  getAssetNameSuggestions: (params) => request({
    url: api + '/ddms/ddasset/suggestions/assetName',
    method: 'post',
    data: params
  }),

  // 表详情筛选建议（TableDetailModal 组件使用）
  getTableDetailSuggestions: (params) => request({
    url: api + '/ddms/ddasset/suggestions/tableDetail',
    method: 'post',
    data: params
  })
};
