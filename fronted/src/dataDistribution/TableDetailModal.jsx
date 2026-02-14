import React, { useState } from 'react';
import { Modal, Input, Button, Icon } from 'antd';

const TableDetailModal = ({ selectedAssetItem, onClose }) => {
  const [filterSystem, setFilterSystem] = useState('');
  const [filterTable, setFilterTable] = useState('');
  const [filterField, setFilterField] = useState('');
  const [filterCnName, setFilterCnName] = useState('');
  const [filterOwner, setFilterOwner] = useState('');

  if (!selectedAssetItem) return null;

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
              displayAttr: field.displayAttr,
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
      '一般数据': 'badge-green'
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
      bodyStyle={{ maxHeight: '75vh', overflowY: 'auto' }}
    >
      <p className="modal-description">{selectedAssetItem.description}</p>
      
      {/* 筛选区域 - 2行3列布局 */}
      <div className="modal-filter-area">
        {/* 第1行：3个输入框 */}
        <Input
          placeholder="筛选系统..."
          value={filterSystem}
          onChange={(e) => setFilterSystem(e.target.value)}
          className="filter-input"
        />
        <Input
          placeholder="筛选表名..."
          value={filterTable}
          onChange={(e) => setFilterTable(e.target.value)}
          className="filter-input"
        />
        <Input
          placeholder="筛选字段..."
          value={filterField}
          onChange={(e) => setFilterField(e.target.value)}
          className="filter-input"
        />
        
        {/* 第2行：2个输入框 + 按钮组 */}
        <Input
          placeholder="筛选中文名称..."
          value={filterCnName}
          onChange={(e) => setFilterCnName(e.target.value)}
          className="filter-input"
        />
        <Input
          placeholder="筛选数据所有者..."
          value={filterOwner}
          onChange={(e) => setFilterOwner(e.target.value)}
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
                <th>展示属性</th>
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
                  <td>{row.displayAttr}</td>
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