import React, { useState, useEffect } from 'react';
import { Radio, Icon } from 'antd';
import './DataDistributionView.css';
import GlobalSearch from './GlobalSearch';
import SecurityView from './SecurityView';
import BusinessView from './BusinessView';
import OwnerView from './OwnerView';
import CatalogView from './CatalogView';
import AssetCategoryModal from './AssetCategoryModal';
import TableDetailModal from './TableDetailModal';
import { Shield, Building2, Users, Database } from 'lucide-react';
import dataMapApi from '../api/dataMap';
import {
  mapGlobalSearchResult,
  mapSecurityStatistics,
  mapBusinessStatistics,
  mapOwnerStatistics,
  mapCatalogStatistics,
  mapAssetListToTree
} from '../utils/fieldMapper';

const DataDistributionView = () => {
  const [activeView, setActiveView] = useState('security');
  const [globalSearch, setGlobalSearch] = useState('');
  const [searchType, setSearchType] = useState('table'); // 'table' or 'field'
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedAssetItem, setSelectedAssetItem] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState(new Set());

  // 数据状态
  const [securityData, setSecurityData] = useState([]);
  const [businessData, setBusinessData] = useState([]);
  const [ownerData, setOwnerData] = useState([]);
  const [catalogData, setCatalogData] = useState([]);
  const [loading, setLoading] = useState(false);

  // 加载统计数据
  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    setLoading(true);
    try {
      const [security, business, owner, catalog] = await Promise.all([
        dataMapApi.safetyStatistics(),
        dataMapApi.businessStatistics(),
        dataMapApi.ownerStatistics(),
        dataMapApi.catalogStatistics()
      ]);

      setSecurityData(mapSecurityStatistics(security));
      setBusinessData(mapBusinessStatistics(business));
      setOwnerData(mapOwnerStatistics(owner));
      setCatalogData(mapCatalogStatistics(catalog));
    } catch (error) {
      console.error('加载统计数据失败:', error);
      // 如果加载失败，使用空数据
      setSecurityData([]);
      setBusinessData([]);
      setOwnerData([]);
      setCatalogData([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle global search
  const handleGlobalSearch = async () => {
    if (!globalSearch.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    setLoading(true);
    try {
      const results = await dataMapApi.globalSearch({ 
        keyword: globalSearch,
        type: searchType 
      });
      
      if (Array.isArray(results)) {
        setSearchResults(results.map(mapGlobalSearchResult));
      } else {
        setSearchResults([]);
      }
      setShowSearchResults(true);
    } catch (error) {
      console.error('搜索失败:', error);
      setSearchResults([]);
      setShowSearchResults(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = async (type, value) => {
    setLoading(true);
    try {
      let apiMethod, params;
      
      if (type === 'security') {
        // 安全视角：需要找到对应的 code
        const securityItem = securityData.find(item => item.level === value);
        apiMethod = dataMapApi.safetyAssetList;
        params = { code: securityItem?.code || value };
      } else if (type === 'business') {
        // 业务视角：需要找到对应的 domainId
        const businessItem = businessData.find(item => item.category === value);
        apiMethod = dataMapApi.businessAssetList;
        params = { domainId: businessItem?.domainId || 1 };
      } else if (type === 'owner') {
        // 属主视角：直接使用属主名称
        apiMethod = dataMapApi.ownerAssetList;
        params = { dataOwner: value };
      }
      
      const assetList = await apiMethod(params);
      
      if (assetList && assetList.records) {
        const categories = mapAssetListToTree(assetList.records);
        setSelectedCategory({ level: value, categories });
      } else {
        // 如果没有数据，显示空状态
        setSelectedCategory({ level: value, categories: [] });
      }
    } catch (error) {
      console.error('加载资产清单失败:', error);
      // 显示空状态
      setSelectedCategory({ level: value, categories: [] });
    } finally {
      setLoading(false);
    }
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
