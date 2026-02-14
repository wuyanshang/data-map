import React from 'react';
import { Icon } from 'antd';

const CatalogView = ({ data, onCategoryClick }) => {
  return (
    <div className="catalog-view">
      {data.map((catalog, index) => (
        <div key={index} className="catalog-card">
          <div className="catalog-header">
            <div className="catalog-header-content">
              <div className="catalog-icon" style={{ background: catalog.color }}>
                <Icon type="database" />
              </div>
              <div>
                <h2 className="catalog-title">{catalog.name}</h2>
                <p className="catalog-description">{catalog.description}</p>
              </div>
            </div>
          </div>
          <div className="catalog-body">
            <div className="catalog-categories">
              {catalog.categories.map((category, catIndex) => (
                <div
                  key={catIndex}
                  onClick={() => onCategoryClick({ level: catalog.name, categories: catalog.categories })}
                  className="category-item"
                >
                  <div className="category-header">
                    <h3 className="category-name">{category.name}</h3>
                    <Icon type="right" className="category-arrow" />
                  </div>
                  <p className="category-theme">{category.theme}</p>
                  <div className="category-stats">
                    <div>
                      <p className="stat-value primary">
                        {category.items.reduce((sum, item) => sum + item.fieldCount, 0)}
                      </p>
                      <p className="stat-label">字段</p>
                    </div>
                    <div>
                      <p className="stat-value">
                        {category.items.reduce((sum, item) => sum + item.tableCount, 0)}
                      </p>
                      <p className="stat-label">表</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CatalogView;
