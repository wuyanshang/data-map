import React from 'react';
import { Radio } from 'antd';
import './DataDistributionView.css';
import GlobalSearch from './GlobalSearch';
import SecurityView from './SecurityView';
import BusinessView from './BusinessView';
import OwnerView from './OwnerView';
import CatalogView from './CatalogView';
import AssetCategoryModal from './AssetCategoryModal';
import TableDetailModal from './TableDetailModal';
import { Shield, Building2, Users, Database, FileText, Receipt, UserCheck, BadgeDollarSign, TrendingUp, ArrowRight, Table as TableIcon, Search, X, ChevronRight, Plus, Minus, Download, Upload } from 'lucide-react';

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

// Security view data
const securityData = [
  { level: '核心数据', color: '#f5222d', fieldCount: 125, percentage: 18, position: 'top', systems: ['财务系统', '数据仓库'] },
  { level: '重要数据', color: '#fa8c16', fieldCount: 280, percentage: 33, position: 'top', systems: ['核心业务系统', '理赔系统'] },
  { level: '敏感数据', color: '#1890ff', fieldCount: 245, percentage: 29, position: 'bottom', systems: ['CRM系统', '保单系统'] },
  { level: '其它一般数据', color: '#52c41a', fieldCount: 175, percentage: 20, position: 'bottom', systems: ['渠道管理系统', '营销系统'] },
];

// Business view data
const businessData = [
  { category: '客户数据', color: '#722ed1', fieldCount: 186, percentage: 20, systems: ['CRM系统'] },
  { category: '保单数据', color: '#1890ff', fieldCount: 245, percentage: 27, systems: ['保单系统', '核心业务系统'] },
  { category: '理赔数据', color: '#52c41a', fieldCount: 198, percentage: 22, systems: ['理赔系统'] },
  { category: '渠道数据', color: '#faad14', fieldCount: 142, percentage: 16, systems: ['渠道管理系统'] },
  { category: '财务数据', color: '#f5222d', fieldCount: 154, percentage: 15, systems: ['财务系统'] },
];

// Owner view data
const ownerData = [
  { owner: '团险事业部', color: '#597ef7', fieldCount: 168, tableCount: 28, systems: ['团险核心系统'] },
  { owner: '营运部', color: '#1890ff', fieldCount: 325, tableCount: 52, systems: ['核心业务系统', '理赔系统'] },
  { owner: '客户管理部', color: '#52c41a', fieldCount: 186, tableCount: 31, systems: ['CRM系统'] },
  { owner: '财务部', color: '#722ed1', fieldCount: 246, tableCount: 41, systems: ['财务系统', '数据仓库'] },
];

// Catalog data
const catalogData = [
  {
    id: 'basic',
    name: '基础数据资产',
    description: '企业运营的基础数据资产',
    color: '#1890ff',
    categories: [
      {
        id: 'basic-customer',
        name: '客户主题',
        theme: '客户数据',
        level1: '基础数据',
        level2: '客户信息',
        items: [
          {
            name: '客户基本信息',
            description: '客户的基本属性数据',
            tableCount: 3,
            fieldCount: 45,
            tables: [
              {
                system: 'CRM系统',
                table: 'customer_info',
                tableCnName: '客户信息表',
                fields: [
                  { name: 'customer_id', cnName: '客户ID', classification: '核心数据', dataOwner: '客户管理部' },
                  { name: 'customer_name', cnName: '客户名称', classification: '敏感数据', dataOwner: '客户管理部' },
                ]
              },
            ],
          },
        ],
      },
    ],
  },
];

const DataDistributionView = () => {
  const [activeView, setActiveView] = React.useState('security');
  const [globalSearch, setGlobalSearch] = React.useState('');
  const [searchType, setSearchType] = React.useState('table'); // 'table' or 'field'
  const [searchResults, setSearchResults] = React.useState([]);
  const [showSearchResults, setShowSearchResults] = React.useState(false);

  const [selectedCategory, setSelectedCategory] = React.useState(null);
  const [selectedAssetItem, setSelectedAssetItem] = React.useState(null);
  const [expandedCategories, setExpandedCategories] = React.useState(new Set());

  // Handle global search
  const handleGlobalSearch = () => {
    if (!globalSearch.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const searchTermLower = globalSearch.toLowerCase();
    const results = fieldDatabase.filter(field => {
      if (searchType === 'field') {
        return field.name.toLowerCase().includes(searchTermLower);
      } else if (searchType === 'table') {
        return field.table.toLowerCase().includes(searchTermLower);
      }
      return false;
    });

    setSearchResults(results);
    setShowSearchResults(true);
  };

  const handleCardClick = (type, value) => {
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
              fields: [
                { name: 'id', cnName: 'ID', classification: value, displayAttr: '标识', dataOwner: '数据部' }
              ]
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
              <tab.Icon style={{ width: '20px', height: '20px' }} />
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
