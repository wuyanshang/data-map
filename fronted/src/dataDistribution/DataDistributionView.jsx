import React, { useEffect } from 'react';
import { Radio, Icon } from 'antd';
import './DataDistributionView.css';
import GlobalSearch from './GlobalSearch';
import SecurityView from './SecurityView';
import BusinessView from './BusinessView';
import OwnerView from './OwnerView';
import CatalogView from './CatalogView';
import AssetCategoryModal from './AssetCategoryModal';
import TableDetailModal from './TableDetailModal';
import { Shield, Building2, Users, Database, UserCheck, FileText, Receipt, TrendingUp, DollarSign, Bank } from 'lucide-react';
import {
  fetchSecurityDistribution,
  fetchBusinessDistribution,
  fetchOwnerDistribution,
  globalSearch as apiGlobalSearch,
  fetchThemes,
  fetchThemeStats,
  fetchThemeDictionary,
} from '../api/dataDistributionApi';

// Mock field database for global search
const fieldDatabase = [
  { name: 'customer_id', table: 'customer_info', system: 'CRM系统', securityLevel: '核心数据', businessCategory: '客户数据', owner: '客户管理部' },
  { name: 'customer_id', table: 'customer_info', system: 'CRM系统', securityLevel: '核心数据', businessCategory: '客户数据', owner: '客户管理部' },
  { name: 'customer_id', table: 'customer_info', system: 'CRM系统', securityLevel: '核心数据', businessCategory: '客户数据', owner: '客户管理部' },
  { name: 'customer_id', table: 'customer_info', system: 'CRM系统', securityLevel: '核心数据', businessCategory: '客户数据', owner: '客户管理部' },
  { name: 'customer_id', table: 'customer_info', system: 'CRM系统', securityLevel: '核心数据', businessCategory: '客户数据', owner: '客户管理部' },
  { name: 'customer_id', table: 'customer_info', system: 'CRM系统', securityLevel: '核心数据', businessCategory: '客户数据', owner: '客户管理部' },
  { name: 'customer_id', table: 'customer_info', system: 'CRM系统', securityLevel: '核心数据', businessCategory: '客户数据', owner: '客户管理部' },
  { name: 'customer_name', table: 'customer_info', system: 'CRM系统', securityLevel: '敏感数据', businessCategory: '客户数据', owner: '客户管理部' },
  { name: 'phone_number', table: 'customer_contact', system: 'CRM系统', securityLevel: '敏感数据', businessCategory: '客户数据', owner: '客户管理部' },
  { name: 'policy_no', table: 'policy_master', system: '保单系统', securityLevel: '敏感数据', businessCategory: '保单数据', owner: '营运部' },
  { name: 'premium_amount', table: 'policy_detail', system: '核心业务系统', securityLevel: '重要数据', businessCategory: '保单数据', owner: '营运部' },
  { name: 'claim_amount', table: 'claim_record', system: '理赔系统', securityLevel: '重要数据', businessCategory: '理赔数据', owner: '营运部' },
  { name: 'channel_id', table: 'channel_info', system: '渠道管理系统', securityLevel: '其它一般数据', businessCategory: '渠道数据', owner: '营运部' },
  { name: 'transaction_amount', table: 'financial_transaction', system: '财务系统', securityLevel: '核心数据', businessCategory: '财务数据', owner: '财务部' },
];

// 进度：将原本的 mock 常量删除，统一改为从后端接口加载真实数据

const DataDistributionView = () => {
  const [activeView, setActiveView] = React.useState('security');
  const [globalSearch, setGlobalSearch] = React.useState('');
  const [searchType, setSearchType] = React.useState('table'); // 'table' or 'field'
  const [searchResults, setSearchResults] = React.useState([]);
  const [showSearchResults, setShowSearchResults] = React.useState(false);

  // 从后端加载的数据分布
  const [securityData, setSecurityData] = React.useState([]);
  const [businessData, setBusinessData] = React.useState([]);
  const [ownerData, setOwnerData] = React.useState([]);

  // 目录视图用到的主题及数据字典
  const [catalogData, setCatalogData] = React.useState([]);

  const [selectedCategory, setSelectedCategory] = React.useState(null);
  const [selectedAssetItem, setSelectedAssetItem] = React.useState(null);
  const [expandedCategories, setExpandedCategories] = React.useState(new Set());

  // 初次加载时拉取安全 / 业务 / 属主分布及主题信息
  useEffect(() => {
    fetchSecurityDistribution()
      .then(list => {
        if (!Array.isArray(list)) {
          setSecurityData([]);
          return;
        }
        // 后端没有 position、percentage 字段，这里按顺序简单分成上下两行，百分比按 fieldCount 占比计算
        const total = list.reduce((sum, item) => sum + (item.fieldCount || 0), 0) || 1;
        const mapped = list.map((item, index) => ({
          level: item.level || '未知',
          fieldCount: item.fieldCount || 0,
          percentage: Math.round(((item.fieldCount || 0) * 100) / total),
          systems: item.systems ? item.systems.split(',') : [],
          position: index < 2 ? 'top' : 'bottom',
        }));
        setSecurityData(mapped);
      })
      .catch(() => {
        setSecurityData([]);
      });

    fetchBusinessDistribution()
      .then(list => {
        if (!Array.isArray(list)) {
          setBusinessData([]);
          return;
        }
        const total = list.reduce((sum, item) => sum + (item.fieldCount || 0), 0) || 1;
        const mapped = list.map(item => ({
          category: item.category || '未知',
          fieldCount: item.fieldCount || 0,
          percentage: Math.round(((item.fieldCount || 0) * 100) / total),
          systems: item.systems ? item.systems.split(',') : [],
        }));
        setBusinessData(mapped);
      })
      .catch(() => {
        setBusinessData([]);
      });

    fetchOwnerDistribution()
      .then(list => {
        if (!Array.isArray(list)) {
          setOwnerData([]);
          return;
        }
        const mapped = list.map(item => ({
          owner: item.owner || '未知',
          fieldCount: item.fieldCount || 0,
          tableCount: item.tableCount || 0,
          systems: item.systems ? item.systems.split(',') : [],
        }));
        setOwnerData(mapped);
      })
      .catch(() => {
        setOwnerData([]);
      });

    // 目录数据：基于主题 + 数据字典组装
    fetchThemes()
      .then(themes => {
        if (!Array.isArray(themes) || themes.length === 0) {
          setCatalogData([]);
          return;
        }
        // 这里只做一个简单实现：按每个主题构造一个 catalog，category = 该主题下的二级分类、资产项聚合
        Promise.all(
          themes.map(theme =>
            fetchThemeDictionary(theme.themeName).then(items => ({
              themeName: theme.themeName,
              items: Array.isArray(items) ? items : [],
            }))
          )
        ).then(all => {
          const catalogs = all.map((entry, idx) => {
            const { themeName, items } = entry;
            // 按 (theme, level2Category) 作为一个 category
            const categoryMap = {};
            items.forEach(row => {
              const level2 = row.level2Category || '未分组';
              const level3 = row.level3Category || '未分组';
              const key = `${themeName}-${level2}-${level3}`;
              if (!categoryMap[key]) {
                categoryMap[key] = {
                  id: key,
                  name: level3,
                  theme: themeName,
                  level1: level2,
                  level2: level3,
                  items: [],
                };
              }
              // 按 assetName 聚合为一个资产项
              const category = categoryMap[key];
              let assetItem = category.items.find(i => i.name === row.assetName);
              if (!assetItem) {
                assetItem = {
                  name: row.assetName,
                  description: '',
                  tableCount: 0,
                  fieldCount: 0,
                  tables: [],
                };
                category.items.push(assetItem);
              }
              // 按 (systemName, tableName) 聚合 table
              const tableKey = `${row.systemName || ''}|${row.tableName || ''}`;
              let table = assetItem.tables.find(
                t => t.system === row.systemName && t.table === row.tableName
              );
              if (!table) {
                table = {
                  system: row.systemName || '',
                  table: row.tableName || '',
                  tableCnName: row.tableName || '',
                  fields: [],
                };
                assetItem.tables.push(table);
              }
              // 字段
              table.fields.push({
                name: row.columnName || '',
                cnName: row.columnName || '',
                classification: row.safetyClassification || '',
                dataOwner: row.assetName || '',
              });
              assetItem.fieldCount += 1;
            });
            // 计算 tableCount
            Object.values(categoryMap).forEach(c => {
              c.items.forEach(item => {
                item.tableCount = item.tables.length;
              });
            });

            return {
              id: themeName || `theme-${idx}`,
              name: themeName,
              description: `${themeName} 相关的数据资产`,
              categories: Object.values(categoryMap),
            };
          });
          setCatalogData(catalogs);
        });
      })
      .catch(() => {
        setCatalogData([]);
      });
  }, []);

  // Handle global search（改为调用后端接口）
  const handleGlobalSearch = async () => {
    if (!globalSearch.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    try {
      const results = await apiGlobalSearch(searchType, globalSearch.trim());
      // 后端返回字段：name, tableName, system, securityLevel, businessCategory, owner
      const mapped = Array.isArray(results)
        ? results.map(item => ({
            name: item.name,
            table: item.tableName,
            system: item.system,
            securityLevel: item.securityLevel,
            businessCategory: item.businessCategory,
            owner: item.owner,
          }))
        : [];
      setSearchResults(mapped);
      setShowSearchResults(true);
    } catch (e) {
      setSearchResults([]);
      setShowSearchResults(true);
    }
  };

  const handleCardClick = (type, value) => {
    // 根据不同视角生成合适的mock数据
    let mockFields = [];
    let mockDataOwner = '数据部';
    
    if (type === 'security') {
      // 安全视角：数据分级就是value本身
      mockFields = [
        { name: 'field_1', cnName: '字段1', classification: value, dataOwner: '客户管理部' },
        { name: 'field_2', cnName: '字段2', classification: value, dataOwner: '营运部' },
        { name: 'field_3', cnName: '字段3', classification: value, dataOwner: '财务部' }
      ];
    } else if (type === 'business') {
      // 业务视角：根据业务类别分配合适的数据分级
      const businessToClassification = {
        '客户数据': ['核心数据', '敏感数据', '重要数据'],
        '保单数据': ['核心数据', '敏感数据', '重要数据'],
        '理赔数据': ['敏感数据', '重要数据', '其它一般数据'],
        '渠道数据': ['重要数据', '其它一般数据', '其它一般数据'],
        '财务数据': ['核心数据', '核心数据', '敏感数据']
      };
      const classifications = businessToClassification[value] || ['核心数据', '敏感数据', '重要数据'];
      mockFields = [
        { name: 'field_1', cnName: '字段1', classification: classifications[0], dataOwner: '客户管理部' },
        { name: 'field_2', cnName: '字段2', classification: classifications[1], dataOwner: '营运部' },
        { name: 'field_3', cnName: '字段3', classification: classifications[2], dataOwner: '财务部' }
      ];
    } else if (type === 'owner') {
      // 属主视角：根据属主分配合适的数据分级
      const ownerToClassification = {
        '团险事业部': ['核心数据', '敏感数据', '重要数据'],
        '营运部': ['敏感数据', '重要数据', '其它一般数据'],
        '客户管理部': ['核心数据', '敏感数据', '敏感数据'],
        '财务部': ['核心数据', '核心数据', '敏感数据']
      };
      const classifications = ownerToClassification[value] || ['核心数据', '敏感数据', '重要数据'];
      mockDataOwner = value;
      mockFields = [
        { name: 'field_1', cnName: '字段1', classification: classifications[0], dataOwner: value },
        { name: 'field_2', cnName: '字段2', classification: classifications[1], dataOwner: value },
        { name: 'field_3', cnName: '字段3', classification: classifications[2], dataOwner: value }
      ];
    }
    
    const mockCategories = [{
      id: 'mock-1',
      name: value,
      theme: value,
      level1: '数据分类',
      level2: '详细信息',
      items: [
        {
          name: value + '数据集',
          description: '详细数据',
          tableCount: 2,
          fieldCount: 20,
          tables: [
            {
              system: 'CRM系统',
              table: 'sample_table',
              tableCnName: '示例表',
              fields: mockFields
            }
          ]
        }
      ]
    }];
    setSelectedCategory({ level: value, categories: mockCategories });
  };

const viewTabs = [
  { key: 'security', label: '安全视角', Icon: Shield },
  { key: 'business', label: '业务视角', Icon: Building2 },
  { key: 'owner', label: '属主视角', Icon: Users },
  { key: 'catalog', label: '数据目录', Icon: Database },
];

  return (
    <div className="data-distribution-page-wrapper">
      <div className="page-container">
        {/* Global Search */}
        <GlobalSearch
          globalSearch={globalSearch}
          setGlobalSearch={setGlobalSearch}
          searchType={searchType}
          setSearchType={setSearchType}
          handleGlobalSearch={handleGlobalSearch}
          searchResults={searchResults}
          showSearchResults={showSearchResults}
        />

        {/* View Tabs */}
        <div className="view-tabs">
          {viewTabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveView(tab.key)}
              className={`view-tab-button ${activeView === tab.key ? 'active' : ''}`}
            >
              <tab.Icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* View Content */}
        {activeView === 'security' && (
           <SecurityView data={securityData} onCardClick={handleCardClick} />
        )}

        {activeView === 'business' && (
          <BusinessView data={businessData} onCardClick={handleCardClick} />
        )}

        {activeView === 'owner' && (
          <OwnerView data={ownerData} onCardClick={handleCardClick} />
        )}

        {activeView === 'catalog' && (
          <CatalogView data={catalogData} onCategoryClick={setSelectedCategory} />
        )}
      </div>

      {/* Modals */}
      <AssetCategoryModal
        selectedCategory={selectedCategory}
        onClose={() => setSelectedCategory(null)}
        expandedCategories={expandedCategories}
        setExpandedCategories={setExpandedCategories}
        onAssetItemClick={setSelectedAssetItem}
      />

      <TableDetailModal
        selectedAssetItem={selectedAssetItem}
        onClose={() => setSelectedAssetItem(null)}
      />
    </div>
  );
};

export default DataDistributionView;
