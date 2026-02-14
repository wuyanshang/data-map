import React from 'react';
import { Icon } from 'antd';

const DataCard = ({ item, onClick, IconComponent, titleKey, showTableCount = false }) => {
  const title = item[titleKey];
  
  return (
    <div className="data-card" onClick={onClick}>
      <div className="card-header">
        <div className="card-header-left">
          <div className="card-icon" style={{ background: item.color }}>
            {IconComponent && <IconComponent size={24} color="#fff" />}
          </div>
          <div>
            <h3 className="card-title">{title}</h3>
            <p className="card-subtitle">{item.systems.join('、')}</p>
          </div>
        </div>
        <Icon type="right" className="card-arrow" />
      </div>
      <div className="card-body">
        <div>
          <p className="card-count primary">{item.fieldCount}</p>
          <p className="card-label">字段数量</p>
          {titleKey === 'category' && (
            <p className="card-systems">{item.systems.join('、')}</p>
          )}
        </div>
        {item.percentage !== undefined && (
          <div className="card-percentage-wrapper">
            <p className="card-percentage">{item.percentage}%</p>
            <p className="card-percentage-label">占比</p>
          </div>
        )}
        {showTableCount && item.tableCount !== undefined && (
          <div>
            <p className="card-count">{item.tableCount}</p>
            <p className="card-label">数据表</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataCard;
