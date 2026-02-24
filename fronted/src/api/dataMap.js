import request from '../utils/request';
import api from '../config/api';

/**
 * 数据地图 API 接口
 * 基础路径: /ddm/dataMap
 */
export default {
  // ==================== 全局搜索模块 ====================
  
  /**
   * 全局搜索
   * @param {Object} params - { keyword: String }
   */
  globalSearch: (params) => request({
    url: api + '/ddm/dataMap/globalSearch',
    method: 'post',
    data: {
      tableName: params.keyword,
      columnName: params.keyword
    }
  }),

  /**
   * 表名下拉列表
   * @param {Object} params - { keyword: String }
   */
  tableNameDropdown: (params) => request({
    url: api + '/ddm/dataMap/tableNameDropdown',
    method: 'post',
    data: {
      tableNameKeyword: params.keyword
    }
  }),

  /**
   * 字段名下拉列表
   * @param {Object} params - { keyword: String }
   */
  columnNameDropdown: (params) => request({
    url: api + '/ddm/dataMap/columnNameDropdown',
    method: 'post',
    data: {
      columnNameKeyword: params.keyword
    }
  }),

  // ==================== 安全视角模块 ====================
  
  /**
   * 安全视角统计
   */
  safetyStatistics: () => request({
    url: api + '/ddm/dataMap/safetyView/statistics',
    method: 'post',
    data: {}
  }),

  /**
   * 安全视角资产清单
   * @param {Object} params - { code: String, assetName?: String, pageNum?: Number, pageSize?: Number }
   */
  safetyAssetList: (params) => request({
    url: api + '/ddm/dataMap/safetyView/assetList',
    method: 'post',
    data: params
  }),

  /**
   * 安全视角资产详情
   * @param {Object} params - { assetId: Long, ...filters }
   */
  safetyAssetDetail: (params) => request({
    url: api + '/ddm/dataMap/safetyView/assetDetail',
    method: 'post',
    data: params
  }),

  // ==================== 业务视角模块 ====================
  
  /**
   * 业务视角统计
   */
  businessStatistics: () => request({
    url: api + '/ddm/dataMap/businessView/statistics',
    method: 'post',
    data: {}
  }),

  /**
   * 业务视角资产清单
   * @param {Object} params - { domainId: Long, assetName?: String, pageNum?: Number, pageSize?: Number }
   */
  businessAssetList: (params) => request({
    url: api + '/ddm/dataMap/businessView/assetList',
    method: 'post',
    data: params
  }),

  /**
   * 业务视角资产详情
   * @param {Object} params - { assetId: Long, ...filters }
   */
  businessAssetDetail: (params) => request({
    url: api + '/ddm/dataMap/businessView/assetDetail',
    method: 'post',
    data: params
  }),

  // ==================== 属主视角模块 ====================
  
  /**
   * 属主视角统计
   */
  ownerStatistics: () => request({
    url: api + '/ddm/dataMap/ownerView/statistics',
    method: 'post',
    data: {}
  }),

  /**
   * 属主视角资产清单
   * @param {Object} params - { dataOwner: String, assetName?: String, pageNum?: Number, pageSize?: Number }
   */
  ownerAssetList: (params) => request({
    url: api + '/ddm/dataMap/ownerView/assetList',
    method: 'post',
    data: params
  }),

  /**
   * 属主视角资产详情
   * @param {Object} params - { assetId: Long, ...filters }
   */
  ownerAssetDetail: (params) => request({
    url: api + '/ddm/dataMap/ownerView/assetDetail',
    method: 'post',
    data: params
  }),

  // ==================== 数据目录模块 ====================
  
  /**
   * 数据目录统计
   */
  catalogStatistics: () => request({
    url: api + '/ddm/dataMap/dataCatalog/statistics',
    method: 'post',
    data: {}
  }),

  /**
   * 数据目录资产清单
   * @param {Object} params - { domainId: Long, assetName?: String, pageNum?: Number, pageSize?: Number }
   */
  catalogAssetList: (params) => request({
    url: api + '/ddm/dataMap/dataCatalog/assetList',
    method: 'post',
    data: params
  }),

  /**
   * 数据目录资产详情
   * @param {Object} params - { assetId: Long, ...filters }
   */
  catalogAssetDetail: (params) => request({
    url: api + '/ddm/dataMap/dataCatalog/assetDetail',
    method: 'post',
    data: params
  }),

  // ==================== 字典接口 ====================
  
  /**
   * 获取安全分类字典
   */
  getSafetyClassification: () => request({
    url: api + '/ddm/dataMap/safetyClassification',
    method: 'post',
    data: {}
  }),

  /**
   * 获取业务分类列表
   */
  getBusinessCategory: () => request({
    url: api + '/ddm/dataMap/businessCategory',
    method: 'post',
    data: {}
  })
};
