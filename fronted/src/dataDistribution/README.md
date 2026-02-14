# 数据分布视图 - 重构说明文档

## 📁 文件结构

```
/components/
├── DataDistributionView.jsx      # 主组件（父组件）
├── DataDistributionView.css      # 样式文件
├── GlobalSearch.jsx               # 全局搜索组件
├── SecurityView.jsx               # 安全视角组件
├── BusinessView.jsx               # 业务视角组件
├── OwnerView.jsx                  # 属主视角组件
├── CatalogView.jsx                # 数据目录组件
├── DataCard.jsx                   # 数据卡片组件
├── AssetCategoryModal.jsx         # 资产分类弹窗组件
└── TableDetailModal.jsx           # 表详情弹窗组件
```

## ✅ 重构要点

### 1. 模块化拆分

#### 主组件 (DataDistributionView.jsx)
- 负责状态管理和数据管理
- 通过 Props 传递数据给子组件
- 协调各个子组件的交互

#### 视角组件
- **SecurityView**: 安全视角，展示核心数据、重要数据等
- **BusinessView**: 业务视角，展示客户数据、保单数据等
- **OwnerView**: 属主视角，展示各部门的数据资产
- **CatalogView**: 数据目录，展示基础数据资产分类

#### 通用组件
- **DataCard**: 可复用的数据卡片组件
- **GlobalSearch**: 全局搜索功能组件

#### 弹窗组件
- **AssetCategoryModal**: 第一层弹窗，展示资产分类目录
- **TableDetailModal**: 第二层弹窗，展示库表字段详情

### 2. 样式抽离与隔离

#### CSS 类名规范
所有样式都包裹在 `.data-distribution-page-wrapper` 类名下，确保样式隔离：

```css
.data-distribution-page-wrapper {
  /* 页面容器样式 */
}

.data-distribution-page-wrapper .search-box {
  /* 搜索框样式 */
}

.data-distribution-page-wrapper .data-card {
  /* 卡片样式 */
}
```

#### 样式分类
- **全局搜索样式**: `.search-box`, `.search-input-row`, `.search-results`
- **视角切换样式**: `.view-tabs`, `.tab-button`
- **数据卡片样式**: `.data-card`, `.card-header`, `.card-body`
- **视图特定样式**: `.security-view`, `.business-view`, `.owner-view`, `.catalog-view`
- **弹窗样式**: `.modal-title`, `.asset-link`, `.expand-icon`

### 3. 搜索逻辑修改

#### 从多选改为单选
```jsx
// 旧版本（Checkbox 多选）
<Checkbox checked={searchByTable}>搜表</Checkbox>
<Checkbox checked={searchByField}>搜字段</Checkbox>

// 新版本（Radio 单选）
<Radio.Group value={searchType} onChange={(e) => setSearchType(e.target.value)}>
  <Radio value="table">搜表</Radio>
  <Radio value="field">搜字段</Radio>
</Radio.Group>
```

#### 搜索逻辑
```javascript
const handleGlobalSearch = () => {
  const results = fieldDatabase.filter(field => {
    if (searchType === 'field') {
      return field.name.toLowerCase().includes(searchTermLower);
    } else if (searchType === 'table') {
      return field.table.toLowerCase().includes(searchTermLower);
    }
    return false;
  });
};
```

### 4. 搜索结果列表优化

#### Table 配置
```jsx
<Table
  columns={searchColumns}
  dataSource={searchResults}
  pagination={false}              // 移除分页
  scroll={{ x: 'max-content', y: 300 }}  // 固定高度300px，支持水平和垂直滚动
  bordered
/>
```

#### 滚动说明
- **垂直滚动**: 当结果超过5条（约300px）时，显示垂直滚动条
- **水平滚动**: 当列宽总和超过容器宽度时，显示水平滚动条
- `x: 'max-content'`: 根据内容自动计算宽度
- `y: 300`: 固定高度300px

## 🎨 样式设计原则

### 主题色
- 主色: `#B8123E` (深红色)
- 悬停色: `#9a0f32` (更深的红色)

### 颜色映射
```javascript
// 安全级别颜色
const colorMap = {
  '核心数据': 'red',
  '重要数据': 'orange',
  '敏感数据': 'blue',
  '其它一般数据': 'green'
};
```

### 响应式断点
- 大屏 (>1200px): 3列布局
- 中屏 (768px-1200px): 2列布局
- 小屏 (<768px): 1列布局

## 📦 组件使用示例

### 基础使用
```jsx
import DataDistributionView from './components/DataDistributionView';

function App() {
  return <DataDistributionView />;
}
```

### 自定义数据
```jsx
// 在 DataDistributionView.jsx 中修改数据
const securityData = [
  { 
    level: '核心数据', 
    color: '#f5222d', 
    fieldCount: 125, 
    percentage: 18, 
    position: 'top', 
    systems: ['财务系统', '数据仓库'] 
  },
  // ... 更多数据
];
```

## 🔧 组件 Props 说明

### GlobalSearch
| Prop | 类型 | 说明 |
|------|------|------|
| globalSearch | string | 搜索关键词 |
| setGlobalSearch | function | 设置搜索关键词 |
| searchType | string | 搜索类型 ('table' / 'field') |
| setSearchType | function | 设置搜索类型 |
| handleGlobalSearch | function | 执行搜索 |
| searchResults | array | 搜索结果 |
| showSearchResults | boolean | 是否显示结果 |

### SecurityView / BusinessView / OwnerView
| Prop | 类型 | 说明 |
|------|------|------|
| data | array | 视图数据 |
| onCardClick | function | 卡片点击回调 |

### CatalogView
| Prop | 类型 | 说明 |
|------|------|------|
| data | array | 目录数据 |
| onCategoryClick | function | 分类点击回调 |

### DataCard
| Prop | 类型 | 说明 |
|------|------|------|
| item | object | 卡片数据 |
| onClick | function | 点击回调 |
| iconType | string | 图标类型 |
| titleKey | string | 标题字段名 |
| showTableCount | boolean | 是否显示表数量 |

### AssetCategoryModal
| Prop | 类型 | 说明 |
|------|------|------|
| selectedCategory | object | 选中的分类 |
| onClose | function | 关闭回调 |
| expandedCategories | Set | 展开的分类集合 |
| setExpandedCategories | function | 设置展开状态 |
| onAssetItemClick | function | 资产项点击回调 |

### TableDetailModal
| Prop | 类型 | 说明 |
|------|------|------|
| selectedAssetItem | object | 选中的资产项 |
| onClose | function | 关闭回调 |

## 🎯 核心优化

### 1. 代码组织
- ✅ 单一职责原则：每个组件只负责一个功能
- ✅ 可维护性：代码结构清晰，易于理解和修改
- ✅ 可复用性：DataCard 等组件可在多处使用

### 2. 性能优化
- ✅ 按需渲染：只渲染当前激活的视图
- ✅ 事件优化：使用合适的事件处理方式
- ✅ 样式隔离：避免样式冲突和全局污染

### 3. 用户体验
- ✅ 搜索优化：单选更明确，避免混淆
- ✅ 滚动优化：固定高度，支持大量数据展示
- ✅ 交互优化：卡片悬停效果，提升可点击性

## 📝 注意事项

1. **样式隔离**: 所有自定义样式必须在 `.data-distribution-page-wrapper` 类名下
2. **组件路径**: 确保所有组件的导入路径正确
3. **数据格式**: 传递给子组件的数据格式要与预期一致
4. **事件处理**: 父组件传递的回调函数要正确绑定 this
5. **CSS 优先级**: Ant Design 的样式可能需要用 `!important` 覆盖

## 🚀 扩展建议

1. **添加加载状态**: 可以在搜索时添加 Loading 效果
2. **错误处理**: 添加搜索失败的错误提示
3. **导出功能**: 支持搜索结果导出为 Excel
4. **高级筛选**: 支持多条件组合搜索
5. **数据缓存**: 缓存搜索结果，提升性能

## 📞 技术支持

如有问题，请联系开发团队或查看 Ant Design 官方文档：
https://3x.ant.design/components/overview-cn/
