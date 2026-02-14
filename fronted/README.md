# 数据分布视图项目

基于 React 17 + Ant Design 3.x 的数据分布可视化项目

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm start
```

项目会自动在浏览器中打开 `http://localhost:3000`

### 构建生产版本

```bash
npm run build
```

## 项目结构

```
src/
├── dataDistribution/          # 数据分布视图模块
│   ├── DataDistributionView.jsx    # 主组件
│   ├── DataDistributionView.css    # 样式文件
│   ├── GlobalSearch.jsx            # 全局搜索
│   ├── SecurityView.jsx            # 安全视角
│   ├── BusinessView.jsx            # 业务视角
│   ├── OwnerView.jsx               # 属主视角
│   ├── CatalogView.jsx             # 数据目录
│   ├── DataCard.jsx                # 数据卡片
│   ├── AssetCategoryModal.jsx      # 资产分类弹窗
│   └── TableDetailModal.jsx        # 表详情弹窗
├── App.js                     # 应用入口组件
└── index.js                   # 应用入口文件
```

## 功能特性

- 🔍 全局搜索：支持按表名或字段名搜索
- 🛡️ 安全视角：按数据安全级别分类展示
- 💼 业务视角：按业务类别分类展示
- 👥 属主视角：按数据属主部门分类展示
- 📚 数据目录：完整的数据资产目录树
- 📊 Mock 数据：内置完整的模拟数据，可直接运行查看效果

## 技术栈

- React 17
- Ant Design 3.x
- Webpack 4
- Babel 7
- lucide-react (图标库)

## 开发说明

项目使用 Webpack Dev Server 进行开发，支持热更新。修改代码后会自动刷新浏览器。

所有的 Mock 数据都在 `DataDistributionView.jsx` 中定义，可以根据需要修改。
