import React, { useState, useEffect, useCallback } from 'react';
import { Modal, Icon, AutoComplete, Button, Select } from 'antd';
import suggestionsApi from '../../api/suggestions';

const { Option } = Select;

const AssetCategoryModal = ({
  selectedCategory,
  onClose,
  expandedCategories,
  setExpandedCategories,
  onAssetItemClick
}) => {
  const [level2Filter, setLevel2Filter] = useState('');
  const [assetNameFilter, setAssetNameFilter] = useState('');
  const [assetNameSuggestions, setAssetNameSuggestions] = useState([]);
  const [debounceTimer, setDebounceTimer] = useState(null);

  if (!selectedCategory) return null;

  // 防抖获取资产名称建议
  const fetchAssetNameSuggestions = useCallback(async (value) => {
    if (!value || value.trim() === '') {
      setAssetNameSuggestions([]);
      return;
    }

    try {
      const response = await suggestionsApi.getAssetNameSuggestions({
        keyword: value,
        level: selectedCategory.level
      });
      
      setAssetNameSuggestions(response.data?.suggestions || []);
    } catch (error) {
      console.error('获取资产名称建议失败:', error);
      setAssetNameSuggestions([]);
    }
  }, [selectedCategory.level]);

  // 处理资产名称输入变化
  const handleAssetNameChange = (value) => {
    setAssetNameFilter(value);
    
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    
    const timer = setTimeout(() => {
      fetchAssetNameSuggestions(value);
    }, 300);
    
    setDebounceTimer(timer);
  };

  // 清理定时器
  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  const toggleExpand = (categoryId) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const handleClearFilters = () => {
    setLevel2Filter('');
    setAssetNameFilter('');
  };

  // 获取所有二级分类用于下拉选择
  const level2Options = Array.from(
    new Set(selectedCategory.categories.map(cat => cat.level2))
  );

  return (
    <Modal
      title={<div className="modal-title">{selectedCategory.level}</div>}
      visible={true}
      onCancel={onClose}
      footer={null}
      width="80%"
      className="asset-category-modal"
      bodyStyle={{ maxHeight: '75vh', overflowY: 'auto' }}
      maskClosable={false}
      keyboard={true}
    >
      {/* 搜索区域 */}
      <div className="modal-search-area">
        <Select
          value={level2Filter || undefined}
          onChange={setLevel2Filter}
          placeholder="选择二级分类"
          className="filter-select"
          style={{ width: 220 }}
          allowClear
          showSearch
          optionFilterProp="children"
        >
          {level2Options.map((level2, index) => (
            <Option key={index} value={level2}>{level2}</Option>
          ))}
        </Select>
        
        <AutoComplete
          placeholder="搜索资产项名称..."
          value={assetNameFilter}
          onChange={handleAssetNameChange}
          onSelect={(value) => setAssetNameFilter(value)}
          dataSource={assetNameSuggestions}
          className="filter-input"
          style={{ width: 220 }}
        />
        
        <Button 
          type="primary"
          className="search-button"
          icon="search"
        >
          搜索
        </Button>
        
        <Button 
          className="clear-button"
          icon="close"
          onClick={handleClearFilters}
        >
          清除
        </Button>
      </div>
      
      {/* 表格 */}
      <div className="table-wrapper">
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th style={{ width: '18%' }}>主题</th>
                <th style={{ width: '18%' }}>一级分类</th>
                <th style={{ width: '18%' }}>二级分类</th>
                <th style={{ width: '40%' }}>资产项名称</th>
                <th style={{ width: '6%' }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {selectedCategory.categories
                .filter(category => !level2Filter || category.level2 === level2Filter)
                .flatMap((category, categoryIndex) => {
                  const filteredItems = category.items.filter(
                    item => !assetNameFilter || item.name.includes(assetNameFilter)
                  );
                  const isExpanded = expandedCategories.has(category.id);
                  const rows = [];
                  
                  // Category header row
                  rows.push(
                    <tr key={`category-${categoryIndex}`}>
                      <td className="font-medium">{category.theme}</td>
                      <td className="font-medium">{category.level1}</td>
                      <td className="font-medium">{category.level2}</td>
                      <td className="category-placeholder">
                        {isExpanded 
                          ? `共 ${filteredItems.length} 项资产` 
                          : `点击"+"查看，共 ${filteredItems.length} 项数据资产`}
                      </td>
                      <td rowSpan={isExpanded ? filteredItems.length + 1 : 1} className="align-top">
                        <button
                          onClick={() => toggleExpand(category.id)}
                          className="expand-button"
                          title={isExpanded ? '收起' : '展开'}
                        >
                          <Icon 
                            type={isExpanded ? 'minus' : 'plus'} 
                            className="expand-icon"
                          />
                        </button>
                      </td>
                    </tr>
                  );
                  
                  // Expanded item rows
                  if (isExpanded) {
                    filteredItems.forEach((item, itemIndex) => {
                      rows.push(
                        <tr key={`${categoryIndex}-${itemIndex}`}>
                          <td colSpan={3}></td>
                          <td>
                            <button
                              onClick={() => onAssetItemClick(item)}
                              className="asset-link"
                            >
                              {item.name}
                            </button>
                          </td>
                        </tr>
                      );
                    });
                  }
                  
                  return rows;
                })}
            </tbody>
          </table>
        </div>
      </div>
    </Modal>
  );
};

export default AssetCategoryModal;