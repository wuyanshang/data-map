/**
 * 字段映射工具
 * 用途：将后端返回字段映射为前端期望格式
 * 
 * 后端接口文档：数据地图接口文档.md
 * 前端开发文档：fronted/开发文档.md
 */

/**
 * 全局搜索结果映射
 * 后端字段 → 前端字段
 * @param {Object} apiData - 后端返回的搜索结果
 * @returns {Object} 前端期望的搜索结果格式
 */
export const mapGlobalSearchResult = (apiData) => ({
  name: apiData.columnName,           // 字段名
  table: apiData.tableName,           // 表名
  system: apiData.appName,            // 系统名
  securityLevel: apiData.safetyClassificationName,  // 安全级别
  businessCategory: apiData.domainName,             // 业务分类
  owner: apiData.dataOwner            // 数据属主
});

/**
 * 统计数据聚合与映射（通用函数）
 * 将后端返回的扁平数据按指定字段分组聚合
 * @param {Array} apiData - 后端返回的统计数据数组
 * @param {String} groupByField - 分组字段名
 * @param {String} nameField - 名称字段名
 * @returns {Array} 聚合后的统计数据
 */
export const mapStatistics = (apiData, groupByField, nameField) => {
  if (!Array.isArray(apiData) || apiData.length === 0) {
    return [];
  }

  // 按指定字段分组
  const grouped = {};
  
  apiData.forEach(item => {
    const key = item[groupByField];
    if (!grouped[key]) {
      grouped[key] = {
        [nameField]: item[nameField] || item.name || item.domainName || item.dataOwner,
        fieldCount: 0,
        systems: [],
        _groupKey: key  // 保留原始分组键
      };
    }
    grouped[key].fieldCount += item.cnt || 0;
    if (item.appName && !grouped[key].systems.includes(item.appName)) {
      grouped[key].systems.push(item.appName);
    }
  });
  
  // 计算百分比
  const total = Object.values(grouped).reduce((sum, item) => sum + item.fieldCount, 0);
  return Object.values(grouped).map(item => ({
    ...item,
    percentage: total > 0 ? Math.round((item.fieldCount / total) * 100) : 0
  }));
};

/**
 * 安全视角统计映射
 * 后端返回: { code, name, appName, cnt }
 * 前端期望: { level, fieldCount, percentage, position, systems, code }
 * @param {Array} apiData - 后端返回的安全统计数据
 * @returns {Array} 前端期望的安全统计格式
 */
export const mapSecurityStatistics = (apiData) => {
  if (!Array.isArray(apiData) || apiData.length === 0) {
    return [];
  }

  const mapped = mapStatistics(apiData, 'code', 'name');
  
  // 添加 position 字段（前2个top，后2个bottom）
  // 添加 level 字段（安全级别名称）
  return mapped.map((item, index) => ({
    level: item.name,           // 安全级别名称
    fieldCount: item.fieldCount,
    percentage: item.percentage,
    position: index < 2 ? 'top' : 'bottom',
    systems: item.systems,
    code: item._groupKey        // 保留 code 用于后续查询
  }));
};

/**
 * 业务视角统计映射
 * 后端返回: { domainId, domainName, appName, cnt }
 * 前端期望: { category, fieldCount, percentage, systems, domainId }
 * @param {Array} apiData - 后端返回的业务统计数据
 * @returns {Array} 前端期望的业务统计格式
 */
export const mapBusinessStatistics = (apiData) => {
  if (!Array.isArray(apiData) || apiData.length === 0) {
    return [];
  }

  const mapped = mapStatistics(apiData, 'domainId', 'domainName');
  
  return mapped.map(item => ({
    category: item.domainName,  // 业务分类名称
    fieldCount: item.fieldCount,
    percentage: item.percentage,
    systems: item.systems,
    domainId: item._groupKey    // 保留 domainId 用于后续查询
  }));
};

/**
 * 属主视角统计映射
 * 后端返回: { dataOwner, appName, cnt }
 * 前端期望: { owner, fieldCount, tableCount, systems }
 * @param {Array} apiData - 后端返回的属主统计数据
 * @returns {Array} 前端期望的属主统计格式
 */
export const mapOwnerStatistics = (apiData) => {
  if (!Array.isArray(apiData) || apiData.length === 0) {
    return [];
  }

  const mapped = mapStatistics(apiData, 'dataOwner', 'dataOwner');
  
  return mapped.map(item => ({
    owner: item.dataOwner,      // 数据属主
    fieldCount: item.fieldCount,
    tableCount: item.tableCount || 0,  // 注意：后端可能未提供此字段
    systems: item.systems
  }));
};

/**
 * 数据目录统计映射
 * 后端返回: { domainId, domainName, tableCnt, columnCnt }
 * 前端期望: 嵌套的树形结构
 * @param {Array} apiData - 后端返回的目录统计数据
 * @returns {Array} 前端期望的目录统计格式
 */
export const mapCatalogStatistics = (apiData) => {
  if (!Array.isArray(apiData) || apiData.length === 0) {
    return [];
  }

  // 数据目录需要构建树形结构
  return apiData.map(item => ({
    id: `catalog-${item.domainId}`,
    name: item.domainName,
    description: `包含 ${item.tableCnt} 张表，${item.columnCnt} 个字段`,
    domainId: item.domainId,
    tableCount: item.tableCnt,
    fieldCount: item.columnCnt,
    categories: []  // 需要点击后加载
  }));
};

/**
 * 资产清单映射为树形结构
 * 后端返回扁平数据，前端需要树形结构
 * @param {Array} apiData - 后端返回的资产清单数据
 * @returns {Array} 树形结构的资产分类
 */
export const mapAssetListToTree = (apiData) => {
  if (!Array.isArray(apiData) || apiData.length === 0) {
    return [];
  }

  const tree = {};
  
  apiData.forEach(item => {
    // 使用 domainId 和 twoCategoryId 作为分组键
    const categoryKey = `${item.domainId}-${item.twoCategoryId}`;
    
    if (!tree[categoryKey]) {
      tree[categoryKey] = {
        id: categoryKey,
        theme: item.domainName,         // 主题（一级分类）
        level1: item.domainName,        // 一级分类
        level2: item.twoCategoryName,   // 二级分类
        items: []
      };
    }
    
    // 添加资产项
    tree[categoryKey].items.push({
      name: item.assetName,
      assetId: item.assetId,
      description: `${item.threeCategoryName || ''} - ${item.fourCategoryName || ''}`.trim()
    });
  });
  
  return Object.values(tree);
};

/**
 * 资产详情映射（按表分组）
 * 后端返回扁平的字段列表，前端需要按表分组
 * @param {Array} apiData - 后端返回的资产详情数据
 * @returns {Object} 包含 tables 数组的对象
 */
export const mapAssetDetailToTables = (apiData) => {
  if (!Array.isArray(apiData) || apiData.length === 0) {
    return { tables: [] };
  }

  const tables = {};
  
  apiData.forEach(item => {
    const tableKey = item.tableName;
    
    if (!tables[tableKey]) {
      tables[tableKey] = {
        system: item.appName,           // 应用系统名称
        table: item.tableName,          // 表英文名
        tableCnName: item.tableDesc,    // 表中文名
        fields: []
      };
    }
    
    // 添加字段信息
    tables[tableKey].fields.push({
      name: item.columnName,                        // 字段英文名
      cnName: item.columnDesc,                      // 字段中文名
      classification: item.safetyClassificationName, // 数据分级
      dataOwner: item.dataOwner                     // 数据属主
    });
  });
  
  return {
    tables: Object.values(tables)
  };
};

/**
 * 表名下拉列表映射
 * 提取 tableName 字段
 * @param {Array} apiData - 后端返回的表名列表
 * @returns {Array<String>} 表名字符串数组
 */
export const mapTableNameDropdown = (apiData) => {
  if (!Array.isArray(apiData)) {
    return [];
  }
  return apiData.map(item => item.tableName).filter(Boolean);
};

/**
 * 字段名下拉列表映射
 * 提取 columnName 字段
 * @param {Array} apiData - 后端返回的字段名列表
 * @returns {Array<String>} 字段名字符串数组
 */
export const mapColumnNameDropdown = (apiData) => {
  if (!Array.isArray(apiData)) {
    return [];
  }
  return apiData.map(item => item.columnName).filter(Boolean);
};

/**
 * 资产名称建议映射
 * 提取 assetName 字段
 * @param {Array} apiData - 后端返回的资产列表
 * @returns {Array<String>} 资产名称字符串数组
 */
export const mapAssetNameSuggestions = (apiData) => {
  if (!Array.isArray(apiData)) {
    return [];
  }
  return apiData.map(item => item.assetName).filter(Boolean);
};
