import React, { useState } from 'react';
import { Modal, Icon, Input, Button, Select } from 'antd';

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

  if (!selectedCategory) return null;

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
    >
      <p className="modal-subtitle">查看数据资产的完整目录清单</p>
      
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
        
        <Input
          placeholder="搜索资产项名称..."
          value={assetNameFilter}
          onChange={(e) => setAssetNameFilter(e.target.value)}
          className="filter-input"
          onPressEnter={() => {}}
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