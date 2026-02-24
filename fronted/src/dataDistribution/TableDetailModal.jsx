import React, { useState, useEffect, useCallback } from 'react';
import { Modal, AutoComplete, Button, Icon } from 'antd';
import suggestionsApi from '../../api/suggestions';

const TableDetailModal = ({ selectedAssetItem, onClose }) => {
  const [filterSystem, setFilterSystem] = useState('');
  const [filterTable, setFilterTable] = useState('');
  const [filterField, setFilterField] = useState('');
  const [filterCnName, setFilterCnName] = useState('');
  const [filterOwner, setFilterOwner] = useState('');
  
  // 各个字段的建议列表
  const [systemSuggestions, setSystemSuggestions] = useState([]);
  const [tableSuggestions, setTableSuggestions] = useState([]);
  const [fieldSuggestions, setFieldSuggestions] = useState([]);
  const [cnNameSuggestions, setCnNameSuggestions] = useState([]);
  const [ownerSuggestions, setOwnerSuggestions] = useState([]);
  
  // 防抖定时器
  const [debounceTimers, setDebounceTimers] = useState({});

  if (!selectedAssetItem) return null;

  // 通用的防抖搜索函数
  const fetchSuggestions = useCallback(async (fieldType, value, setSuggestionsFn) => {
    if (!value || value.trim() === '') {
      setSuggestionsFn([]);
      return;
    }

    try {
      const response = await suggestionsApi.getTableDetailSuggestions({
        fieldType: fieldType,
        keyword: value,
        assetItem: selectedAssetItem.name
      });
      
      setSuggestionsFn(response.data?.suggestions || []);
    } catch (error) {
      console.error(`获取${fieldType}建议失败:`, error);
      setSuggestionsFn([]);
    }
  }, [selectedAssetItem.name]);

  // 创建防抖处理函数
  const createDebounceHandler = (fieldType, setSuggestionsFn) => (value) => {
    // 清除该字段之前的定时器
    if (debounceTimers[fieldType]) {
      clearTimeout(debounceTimers[fieldType]);
    }
    
    // 设置新的定时器
    const timer = setTimeout(() => {
      fetchSuggestions(fieldType, value, setSuggestionsFn);
    }, 300);
    
    setDebounceTimers(prev => ({ ...prev, [fieldType]: timer }));
  };

  // 各个字段的处理函数
  const handleSystemChange = (value) => {
    setFilterSystem(value);
    createDebounceHandler('system', setSystemSuggestions)(value);
  };

  const handleTableChange = (value) => {
    setFilterTable(value);
    createDebounceHandler('table', setTableSuggestions)(value);
  };

  const handleFieldChange = (value) => {
    setFilterField(value);
    createDebounceHandler('field', setFieldSuggestions)(value);
  };

  const handleCnNameChange = (value) => {
    setFilterCnName(value);
    createDebounceHandler('cnName', setCnNameSuggestions)(value);
  };

  const handleOwnerChange = (value) => {
    setFilterOwner(value);
    createDebounceHandler('owner', setOwnerSuggestions)(value);
  };

  // 清理所有定时器
  useEffect(() => {
    return () => {
      Object.values(debounceTimers).forEach(timer => {
        if (timer) clearTimeout(timer);
      });
    };
  }, [debounceTimers]);

  const getTableData = () => {
    const data = [];
    selectedAssetItem.tables
      .filter(table =>
        (!filterSystem || table.system.includes(filterSystem)) &&
        (!filterTable || table.table.includes(filterTable) || table.tableCnName.includes(filterTable))
      )
      .forEach((table, tableIdx) => {
        table.fields
          .filter(field => 
            (!filterField || field.name.includes(filterField)) &&
            (!filterCnName || field.cnName.includes(filterCnName)) &&
            (!filterOwner || field.dataOwner.includes(filterOwner))
          )
          .forEach((field, fieldIdx) => {
            data.push({
              key: `${tableIdx}-${fieldIdx}`,
              system: fieldIdx === 0 ? table.system : '',
              table: fieldIdx === 0 ? table.table : '',
              tableCnName: fieldIdx === 0 ? table.tableCnName : '',
              fieldName: field.name,
              cnName: field.cnName,
              classification: field.classification,
              dataOwner: field.dataOwner,
            });
          });
      });
    return data;
  };

  const getSecurityLevelClass = (level) => {
    const classMap = {
      '核心数据': 'badge-red',
      '重要数据': 'badge-orange',
      '敏感数据': 'badge-blue',
      '其它一般数据': 'badge-green'
    };
    return classMap[level] || 'badge-default';
  };

  const handleClearFilters = () => {
    setFilterSystem('');
    setFilterTable('');
    setFilterField('');
    setFilterCnName('');
    setFilterOwner('');
  };

  const hasActiveFilters = filterSystem || filterTable || filterField || filterCnName || filterOwner;
  const tableData = getTableData();

  return (
    <Modal
      title={<div className="modal-title">{selectedAssetItem.name} - 库表字段详情</div>}
      visible={true}
      onCancel={onClose}
      footer={null}
      width="95%"
      className="table-detail-modal"
      centered
      bodyStyle={{ maxHeight: '75vh', overflowY: 'auto' }}
      maskClosable={false}
      keyboard={true}
    >
      {/* 筛选区域 - 2行3列布局 */}
      <div className="modal-filter-area">
        {/* 第1行：3个输入框 */}
        <AutoComplete
          placeholder="筛选系统..."
          value={filterSystem}
          onChange={handleSystemChange}
          onSelect={(value) => setFilterSystem(value)}
          dataSource={systemSuggestions}
          className="filter-input"
        />
        <AutoComplete
          placeholder="筛选表名..."
          value={filterTable}
          onChange={handleTableChange}
          onSelect={(value) => setFilterTable(value)}
          dataSource={tableSuggestions}
          className="filter-input"
        />
        <AutoComplete
          placeholder="筛选字段..."
          value={filterField}
          onChange={handleFieldChange}
          onSelect={(value) => setFilterField(value)}
          dataSource={fieldSuggestions}
          className="filter-input"
        />
        
        {/* 第2行：2个输入框 + 按钮组 */}
        <AutoComplete
          placeholder="筛选中文名称..."
          value={filterCnName}
          onChange={handleCnNameChange}
          onSelect={(value) => setFilterCnName(value)}
          dataSource={cnNameSuggestions}
          className="filter-input"
        />
        <AutoComplete
          placeholder="筛选数据所有者..."
          value={filterOwner}
          onChange={handleOwnerChange}
          onSelect={(value) => setFilterOwner(value)}
          dataSource={ownerSuggestions}
          className="filter-input"
        />
        <div className="filter-buttons">
          <Button 
            type="primary"
            className="search-button"
            icon="search"
          >
            搜索
          </Button>
          {hasActiveFilters && (
            <Button 
              className="clear-button"
              icon="close"
              onClick={handleClearFilters}
            >
              清除
            </Button>
          )}
        </div>
      </div>
      
      {/* 表格 */}
      <div className="table-wrapper">
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>系统名称</th>
                <th>表名</th>
                <th>表中文名</th>
                <th>字段名</th>
                <th>字段中文名</th>
                <th>数据分级</th>
                <th>数据属主</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row) => (
                <tr key={row.key}>
                  <td>{row.system}</td>
                  <td>{row.table}</td>
                  <td>{row.tableCnName}</td>
                  <td className="font-medium">{row.fieldName}</td>
                  <td>{row.cnName}</td>
                  <td>
                    <span className={`badge ${getSecurityLevelClass(row.classification)}`}>
                      {row.classification}
                    </span>
                  </td>
                  <td>{row.dataOwner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Modal>
  );
};

export default TableDetailModal;