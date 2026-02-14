import React from 'react';
import DataCard from './DataCard';
import { ownerIconMap } from './iconConfig';

const OwnerView = ({ data, onCardClick }) => {
  return (
    <div className="owner-view">
      {data.map((item, index) => {
        // 根据属主名称动态获取对应的图标
        const iconType = ownerIconMap[item.owner] || 'team';
        
        return (
          <DataCard
            key={index}
            item={item}
            onClick={() => onCardClick('owner', item.owner)}
            iconType={iconType}
            titleKey="owner"
            showTableCount={true}
          />
        );
      })}
    </div>
  );
};

export default OwnerView;
