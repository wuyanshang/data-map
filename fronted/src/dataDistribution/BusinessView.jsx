import React from 'react';
import DataCard from './DataCard';
import { getBusinessStyle } from './iconConfig';

const BusinessView = ({ data, onCardClick }) => {
  return (
    <div className="business-view">
      {data.map((item, index) => {
        // 根据业务分类动态获取对应的图标和颜色
        const { icon, color } = getBusinessStyle(item.category);
        
        return (
          <DataCard
            key={index}
            item={{ ...item, color }}
            onClick={() => onCardClick('business', item.category)}
            IconComponent={icon}
            titleKey="category"
          />
        );
      })}
    </div>
  );
};

export default BusinessView;
