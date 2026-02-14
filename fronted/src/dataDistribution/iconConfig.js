/**
 * 图标和颜色配置文件
 * 
 * 用途：集中管理数据分布视图的图标和颜色配置
 * 原则：数据和样式分离，易于维护和扩展
 */

// ========================================
// 图标映射配置 (使用antd图标)
// ========================================

/**
 * 业务视角图标映射
 * 根据Figma设计，映射到antd图标系统
 */
export const businessIconMap = {
  '客户数据': 'user',           // UserCheck -> user
  '保单数据': 'file-text',      // FileText -> file-text
  '理赔数据': 'transaction',    // Receipt -> transaction
  '渠道数据': 'rise',           // TrendingUp -> rise
  '财务数据': 'dollar'          // BadgeDollarSign -> dollar
};

/**
 * 属主视角图标映射
 */
export const ownerIconMap = {
  '团险事业部': 'bank',         // Building2 -> bank
  '营运部': 'team',             // Users -> team
  '客户管理部': 'user',         // UserCheck -> user
  '财务部': 'dollar'            // BadgeDollarSign -> dollar
};

/**
 * 安全视角图标
 * 所有安全级别使用统一的安全图标
 */
export const securityIcon = 'safety-certificate';  // Shield -> safety-certificate

/**
 * 数据目录图标映射
 */
export const catalogIconMap = {
  'basic': 'database',      // 基础数据资产
  'metrics': 'rise',        // 指标数据资产
  'tags': 'tag'             // 标签数据资产 (antd使用tag，不是tags)
};

// ========================================
// 颜色配置 (从Figma设计提取)
// ========================================

/**
 * 安全视角颜色配置
 */
export const securityColors = {
  '核心数据': '#f5222d',        // 红色
  '重要数据': '#fa8c16',        // 橙色
  '敏感数据': '#1890ff',        // 蓝色
  '其它一般数据': '#52c41a'     // 绿色
};

/**
 * 业务视角颜色配置
 */
export const businessColors = {
  '客户数据': '#722ed1',        // 紫色
  '保单数据': '#1890ff',        // 蓝色
  '理赔数据': '#52c41a',        // 绿色
  '渠道数据': '#faad14',        // 黄色
  '财务数据': '#f5222d'         // 红色
};

/**
 * 属主视角颜色配置
 */
export const ownerColors = {
  '团险事业部': '#597ef7',      // 靛蓝色
  '营运部': '#1890ff',          // 蓝色
  '客户管理部': '#52c41a',      // 绿色
  '财务部': '#722ed1'           // 紫色
};

/**
 * 数据目录颜色配置
 */
export const catalogColors = {
  'basic': '#1890ff',           // 蓝色
  'metrics': '#52c41a',         // 绿色
  'tags': '#722ed1'             // 紫色
};

// ========================================
// 辅助函数
// ========================================

/**
 * 获取业务视角的图标和颜色
 * @param {string} category - 业务分类名称
 * @returns {{icon: string, color: string}}
 */
export function getBusinessStyle(category) {
  return {
    icon: businessIconMap[category] || 'question-circle',
    color: businessColors[category] || '#d9d9d9'
  };
}

/**
 * 获取属主视角的图标和颜色
 * @param {string} owner - 属主名称
 * @returns {{icon: string, color: string}}
 */
export function getOwnerStyle(owner) {
  return {
    icon: ownerIconMap[owner] || 'question-circle',
    color: ownerColors[owner] || '#d9d9d9'
  };
}

/**
 * 获取安全视角的颜色
 * @param {string} level - 安全级别
 * @returns {string}
 */
export function getSecurityColor(level) {
  return securityColors[level] || '#d9d9d9';
}

/**
 * 获取数据目录的图标和颜色
 * @param {string} catalogId - 目录ID (basic/metrics/tags)
 * @returns {{icon: string, color: string}}
 */
export function getCatalogStyle(catalogId) {
  return {
    icon: catalogIconMap[catalogId] || 'folder',
    color: catalogColors[catalogId] || '#d9d9d9'
  };
}
