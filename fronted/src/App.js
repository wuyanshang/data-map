import React, { useState } from 'react';
import { Radio } from 'antd';
import DataDistributionView from './dataDistribution/DataDistributionView';
import DataMapView from './dataMap/DataMapView';
import './App.css';

function App() {
  const [activeView, setActiveView] = useState('distribution');

  return (
    <div className="App">
      <div className="app-header">
        <h1 className="app-title">数据资产管理平台</h1>
        <Radio.Group 
          value={activeView} 
          onChange={(e) => setActiveView(e.target.value)}
          buttonStyle="solid"
        >
          <Radio.Button value="distribution">数据分布</Radio.Button>
          <Radio.Button value="map">数据流转</Radio.Button>
        </Radio.Group>
      </div>
      
      <div className="app-content">
        {activeView === 'distribution' ? <DataDistributionView /> : <DataMapView />}
      </div>
    </div>
  );
}

export default App;
