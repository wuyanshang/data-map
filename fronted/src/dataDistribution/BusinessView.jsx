import React from 'react';
import DataCard from './DataCard';
import { businessIconMap } from './iconConfig';

const BusinessView = ({ data, onCardClick }) => {
  return (
    <div className="business-view">
      {data.map((item, index) => {
        // 根据业务分类动态获取对应的图标
        const iconType = businessIconMap[item.category] || 'file-text';
        
        return (
          <DataCard
            key={index}
            item={item}
            onClick={() => onCardClick('business', item.category)}
            iconType={iconType}
            titleKey="category"
          />
        );
      })}
    </div>
  );
};

export default BusinessView;
