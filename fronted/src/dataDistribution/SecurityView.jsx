import React from 'react';
import { Icon } from 'antd';
import DataCard from './DataCard';
import { securityIcon, getSecurityColor } from './iconConfig';

const SecurityView = ({ data, onCardClick }) => {
  const topData = data.filter(item => item.position === 'top');
  const bottomData = data.filter(item => item.position === 'bottom');

  return (
    <div className="security-view">
      {/* Top row */}
      <div className="card-row">
        {topData.map((item, index) => {
          const color = getSecurityColor(item.level);
          return (
            <DataCard
              key={index}
              item={{ ...item, color }}
              onClick={() => onCardClick('security', item.level)}
              IconComponent={securityIcon}
              titleKey="level"
            />
          );
        })}
      </div>

      {/* Bottom row */}
      <div className="card-row">
        {bottomData.map((item, index) => {
          const color = getSecurityColor(item.level);
          return (
            <DataCard
              key={index}
              item={{ ...item, color }}
              onClick={() => onCardClick('security', item.level)}
              IconComponent={securityIcon}
              titleKey="level"
            />
          );
        })}
      </div>
    </div>
  );
};

export default SecurityView;
