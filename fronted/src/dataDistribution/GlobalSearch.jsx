import React from 'react';
import { Input, Button, Icon, Radio } from 'antd';

const GlobalSearch = ({
  globalSearch,
  setGlobalSearch,
  searchType,
  setSearchType,
  handleGlobalSearch,
  searchResults,
  showSearchResults
}) => {
  // 获取安全级别对应的样式
  const getSecurityLevelStyle = (level) => {
    const styleMap = {
      '核心数据': {
        backgroundColor: 'rgba(254, 226, 226, 0.5)',
        color: '#b91c1c',
        borderColor: 'rgba(252, 165, 165, 0.5)'
      },
      '重要数据': {
        backgroundColor: 'rgba(254, 236, 220, 0.5)',
        color: '#c2410c',
        borderColor: 'rgba(253, 186, 116, 0.5)'
      },
      '敏感数据': {
        backgroundColor: 'rgba(224, 242, 254, 0.5)',
        color: '#1e40af',
        borderColor: 'rgba(147, 197, 253, 0.5)'
      },
      '其它一般数据': {
        backgroundColor: 'rgba(220, 252, 231, 0.5)',
        color: '#15803d',
        borderColor: 'rgba(134, 239, 172, 0.5)'
      }
    };
    return styleMap[level] || {
      backgroundColor: '#f5f5f5',
      color: '#595959',
      borderColor: '#d9d9d9'
    };
  };

  // 计算表格容器高度（超过5条时固定高度并滚动）
  const tableContainerHeight = searchResults.length > 5 ? '300px' : 'auto';

  return (
    <div className="search-box">
      <div className="search-input-row">
        <div className="search-input-wrapper">
          <Input
            placeholder="搜索表名、字段名"
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            onPressEnter={handleGlobalSearch}
            className="search-input"
          />
          <div className="search-type-selector">
            <Radio.Group 
              value={searchType} 
              onChange={(e) => setSearchType(e.target.value)}
            >
              <Radio value="table">搜表</Radio>
              <Radio value="field">搜字段</Radio>
            </Radio.Group>
          </div>
        </div>
        <Button 
          type="primary" 
          className="search-button"
          onClick={handleGlobalSearch}
        >
          <Icon type="search" /> 搜索
        </Button>
      </div>

      {/* Search Results */}
      {showSearchResults && (
        <div style={{ marginTop: '16px' }}>
          {searchResults.length > 0 ? (
            <div 
              style={{ 
                border: '1px solid rgba(0, 0, 0, 0.1)', 
                borderRadius: '8px', 
                overflow: 'hidden' 
              }}
            >
              <div 
                style={{ 
                  position: 'relative',
                  width: '100%',
                  overflowX: 'auto',
                  overflowY: tableContainerHeight === 'auto' ? 'visible' : 'auto',
                  maxHeight: tableContainerHeight
                }}
              >
                <table 
                  style={{ 
                    width: '100%', 
                    fontSize: '14px',
                    borderCollapse: 'collapse',
                    captionSide: 'bottom'
                  }}
                >
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }}>
                      <th 
                        style={{ 
                          color: 'oklch(0.145 0 0)',
                          height: '40px',
                          padding: '0 8px',
                          textAlign: 'center',
                          fontWeight: '500',
                          whiteSpace: 'nowrap',
                          verticalAlign: 'middle',
                          width: '18%'
                        }}
                      >
                        字段名
                      </th>
                      <th 
                        style={{ 
                          color: 'oklch(0.145 0 0)',
                          height: '40px',
                          padding: '0 8px',
                          textAlign: 'center',
                          fontWeight: '500',
                          whiteSpace: 'nowrap',
                          verticalAlign: 'middle',
                          width: '18%'
                        }}
                      >
                        表名
                      </th>
                      <th 
                        style={{ 
                          color: 'oklch(0.145 0 0)',
                          height: '40px',
                          padding: '0 8px',
                          textAlign: 'center',
                          fontWeight: '500',
                          whiteSpace: 'nowrap',
                          verticalAlign: 'middle',
                          width: '15%'
                        }}
                      >
                        系统
                      </th>
                      <th 
                        style={{ 
                          color: 'oklch(0.145 0 0)',
                          height: '40px',
                          padding: '0 8px',
                          textAlign: 'center',
                          fontWeight: '500',
                          whiteSpace: 'nowrap',
                          verticalAlign: 'middle',
                          width: '15%'
                        }}
                      >
                        安全级别
                      </th>
                      <th 
                        style={{ 
                          color: 'oklch(0.145 0 0)',
                          height: '40px',
                          padding: '0 8px',
                          textAlign: 'center',
                          fontWeight: '500',
                          whiteSpace: 'nowrap',
                          verticalAlign: 'middle',
                          width: '17%'
                        }}
                      >
                        业务视角
                      </th>
                      <th 
                        style={{ 
                          color: 'oklch(0.145 0 0)',
                          height: '40px',
                          padding: '0 8px',
                          textAlign: 'center',
                          fontWeight: '500',
                          whiteSpace: 'nowrap',
                          verticalAlign: 'middle',
                          width: '17%'
                        }}
                      >
                        属主视角
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {searchResults.map((result, index) => {
                      const isLastRow = index === searchResults.length - 1;
                      const securityStyle = getSecurityLevelStyle(result.securityLevel);
                      
                      return (
                        <tr 
                          key={index}
                          style={{ 
                            borderBottom: isLastRow ? 'none' : '1px solid rgba(0, 0, 0, 0.1)',
                            transition: 'background-color 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#ececf0';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          <td 
                            style={{ 
                              padding: '8px',
                              verticalAlign: 'middle',
                              whiteSpace: 'nowrap',
                              fontWeight: '500',
                              textAlign: 'center'
                            }}
                          >
                            {result.name}
                          </td>
                          <td 
                            style={{ 
                              padding: '8px',
                              verticalAlign: 'middle',
                              whiteSpace: 'nowrap',
                              textAlign: 'center'
                            }}
                          >
                            {result.table}
                          </td>
                          <td 
                            style={{ 
                              padding: '8px',
                              verticalAlign: 'middle',
                              whiteSpace: 'nowrap',
                              textAlign: 'center'
                            }}
                          >
                            {result.system}
                          </td>
                          <td 
                            style={{ 
                              padding: '8px',
                              verticalAlign: 'middle',
                              whiteSpace: 'nowrap',
                              textAlign: 'center'
                            }}
                          >
                            <span 
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '6px',
                                border: `1px solid ${securityStyle.borderColor}`,
                                padding: '2px 8px',
                                fontSize: '12px',
                                fontWeight: '500',
                                backgroundColor: securityStyle.backgroundColor,
                                color: securityStyle.color,
                                whiteSpace: 'nowrap',
                                width: 'fit-content'
                              }}
                            >
                              {result.securityLevel}
                            </span>
                          </td>
                          <td 
                            style={{ 
                              padding: '8px',
                              verticalAlign: 'middle',
                              whiteSpace: 'nowrap',
                              textAlign: 'center'
                            }}
                          >
                            {result.businessCategory}
                          </td>
                          <td 
                            style={{ 
                              padding: '8px',
                              verticalAlign: 'middle',
                              whiteSpace: 'nowrap',
                              textAlign: 'center'
                            }}
                          >
                            {result.owner}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <p 
              style={{ 
                color: '#717182',
                textAlign: 'center',
                padding: '16px 0'
              }}
            >
              未找到匹配的结果
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;