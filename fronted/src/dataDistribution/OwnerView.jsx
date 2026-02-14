import React from 'react';
import DataCard from './DataCard';

const OwnerView = ({ data, onCardClick }) => {
  return (
    <div className="owner-view">
      {data.map((item, index) => (
        <DataCard
          key={index}
          item={item}
          onClick={() => onCardClick('owner', item.owner)}
          iconType="team"
          titleKey="owner"
          showTableCount={true}
        />
      ))}
    </div>
  );
};

export default OwnerView;
