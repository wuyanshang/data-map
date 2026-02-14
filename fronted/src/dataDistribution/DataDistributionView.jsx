import React from 'react';
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
  { level: '核心数据', fieldCount: 125, percentage: 18, position: 'top', systems: ['财务系统', '数据仓库'] },
  { level: '重要数据', fieldCount: 280, percentage: 33, position: 'top', systems: ['核心业务系统', '理赔系统'] },
  { level: '敏感数据', fieldCount: 245, percentage: 29, position: 'bottom', systems: ['CRM系统', '保单系统'] },
  { level: '其它一般数据', fieldCount: 175, percentage: 20, position: 'bottom', systems: ['渠道管理系统', '营销系统'] },
];

// Business view data
const businessData = [
  { category: '客户数据', fieldCount: 186, percentage: 20, systems: ['CRM系统'] },
  { category: '保单数据', fieldCount: 245, percentage: 27, systems: ['保单系统', '核心业务系统'] },
  { category: '理赔数据', fieldCount: 198, percentage: 22, systems: ['理赔系统'] },
  { category: '渠道数据', fieldCount: 142, percentage: 16, systems: ['渠道管理系统'] },
  { category: '财务数据', fieldCount: 154, percentage: 15, systems: ['财务系统'] },
];

// Owner view data
const ownerData = [
  { owner: '团险事业部', fieldCount: 168, tableCount: 28, systems: ['团险核心系统'] },
  { owner: '营运部', fieldCount: 325, tableCount: 52, systems: ['核心业务系统', '理赔系统'] },
  { owner: '客户管理部', fieldCount: 186, tableCount: 31, systems: ['CRM系统'] },
  { owner: '财务部', fieldCount: 246, tableCount: 41, systems: ['财务系统', '数据仓库'] },
];

// Catalog data
const catalogData = [
  {
    id: 'basic',
    name: '基础数据资产',
    description: '企业运营的基础数据资产',
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
                  { name: 'id_card', cnName: '身份证号', classification: '核心数据', dataOwner: '客户管理部' },
                ]
              },
            ],
          },
          {
            name: '客户联系方式',
            description: '客户的联系信息',
            tableCount: 2,
            fieldCount: 28,
            tables: [
              {
                system: 'CRM系统',
                table: 'customer_contact',
                tableCnName: '客户联系表',
                fields: [
                  { name: 'contact_id', cnName: '联系ID', classification: '重要数据', dataOwner: '客户管理部' },
                  { name: 'phone', cnName: '电话', classification: '敏感数据', dataOwner: '客户管理部' },
                  { name: 'email', cnName: '邮箱', classification: '敏感数据', dataOwner: '客户管理部' },
                ]
              },
            ],
          },
        ],
      },
      {
        id: 'basic-policy',
        name: '保单主题',
        theme: '保单数据',
        level1: '基础数据',
        level2: '保单信息',
        items: [
          {
            name: '保单基本信息',
            description: '保单的核心数据',
            tableCount: 2,
            fieldCount: 38,
            tables: [
              {
                system: '保单系统',
                table: 'policy_master',
                tableCnName: '保单主表',
                fields: [
                  { name: 'policy_id', cnName: '保单ID', classification: '核心数据', dataOwner: '营运部' },
                  { name: 'policy_no', cnName: '保单号', classification: '敏感数据', dataOwner: '营运部' },
                  { name: 'premium_amount', cnName: '保费', classification: '核心数据', dataOwner: '营运部' },
                ]
              },
            ],
          },
        ],
      },
      {
        id: 'basic-claim',
        name: '理赔主题',
        theme: '理赔数据',
        level1: '基础数据',
        level2: '理赔信息',
        items: [
          {
            name: '理赔案件信息',
            description: '理赔案件的基本信息',
            tableCount: 2,
            fieldCount: 42,
            tables: [
              {
                system: '理赔系统',
                table: 'claim_case',
                tableCnName: '理赔案件表',
                fields: [
                  { name: 'claim_id', cnName: '理赔ID', classification: '核心数据', dataOwner: '营运部' },
                  { name: 'claim_no', cnName: '理赔号', classification: '敏感数据', dataOwner: '营运部' },
                  { name: 'claim_amount', cnName: '理赔金额', classification: '核心数据', dataOwner: '营运部' },
                ]
              },
            ],
          },
        ],
      },
      {
        id: 'basic-channel',
        name: '渠道主题',
        theme: '渠道数据',
        level1: '基础数据',
        level2: '渠道信息',
        items: [
          {
            name: '渠道基本信息',
            description: '销售渠道的基本属性',
            tableCount: 2,
            fieldCount: 32,
            tables: [
              {
                system: '渠道管理系统',
                table: 'channel_info',
                tableCnName: '渠道信息表',
                fields: [
                  { name: 'channel_id', cnName: '渠道ID', classification: '其它一般数据', dataOwner: '营运部' },
                  { name: 'channel_name', cnName: '渠道名称', classification: '其它一般数据', dataOwner: '营运部' },
                  { name: 'sales_amount', cnName: '销售额', classification: '重要数据', dataOwner: '营运部' },
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
