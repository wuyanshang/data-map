import React from 'react';
import DataCard from './DataCard';
import { getOwnerStyle } from './iconConfig';

const OwnerView = ({ data, onCardClick }) => {
  return (
    <div className="owner-view">
      {data.map((item, index) => {
        // 根据属主名称动态获取对应的图标和颜色
        const { icon, color } = getOwnerStyle(item.owner);
        
        return (
          <DataCard
            key={index}
            item={{ ...item, color }}
            onClick={() => onCardClick('owner', item.owner)}
            IconComponent={icon}
            titleKey="owner"
            showTableCount={true}
          />
        );
      })}
    </div>
  );
};

export default OwnerView;
