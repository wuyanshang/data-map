import React from 'react';
import DataCard from './DataCard';

const BusinessView = ({ data, onCardClick }) => {
  return (
    <div className="business-view">
      {data.map((item, index) => (
        <DataCard
          key={index}
          item={item}
          onClick={() => onCardClick('business', item.category)}
          iconType="file-text"
          titleKey="category"
        />
      ))}
    </div>
  );
};

export default BusinessView;
