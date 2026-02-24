import React, { useState, useCallback, useMemo, useEffect } from 'react';
import ReactFlow, {
  Controls,
  Background,
  addEdge,
} from 'react-flow-renderer';
import { Upload, Search, Download, X, Database, Table, BarChart3 } from 'lucide-react';
import { Button, Input, Checkbox } from 'antd';
import './DataMapView.css';

// 模拟初始数据流转关系
const initialFlows = [
  { 
    id: '1', 
    sourceSystem: 'CRM系统', 
    targetSystem: '数据仓库', 
    tables: [
      { name: '客户信息表', fieldCount: 15 },
      { name: '订单表', fieldCount: 12 },
      { name: '联系人表', fieldCount: 8 }
    ] 
  },
  { 
    id: '2', 
    sourceSystem: '数据仓库', 
    targetSystem: 'BI系统', 
    tables: [
      { name: '汇总表', fieldCount: 20 },
      { name: '维度表', fieldCount: 10 }
    ] 
  },
  { 
    id: '3', 
    sourceSystem: 'ERP系统', 
    targetSystem: '数据仓库', 
    tables: [
      { name: '产品表', fieldCount: 18 },
      { name: '库存表', fieldCount: 10 },
      { name: '供应商表', fieldCount: 12 }
    ] 
  },
  { 
    id: '4', 
    sourceSystem: 'CRM系统', 
    targetSystem: '营销系统', 
    tables: [
      { name: '客户标签表', fieldCount: 8 },
      { name: '活动响应表', fieldCount: 14 }
    ] 
  },
  { 
    id: '5', 
    sourceSystem: '营销系统', 
    targetSystem: '数据仓库', 
    tables: [
      { name: '营销活动表', fieldCount: 16 },
      { name: '转化数据表', fieldCount: 9 }
    ] 
  },
  { 
    id: '6', 
    sourceSystem: 'BI系统', 
    targetSystem: '报表系统', 
    tables: [
      { name: '分析结果表', fieldCount: 25 }
    ] 
  },
];

// 生成节点和边
function generateNodesAndEdges(flows, activeSystems, activeTables) {
  let filteredFlows = flows;
  
  if (activeSystems.length > 0) {
    filteredFlows = filteredFlows.filter(
      flow => activeSystems.includes(flow.sourceSystem) || activeSystems.includes(flow.targetSystem)
    );
  }
  
  if (activeTables.length > 0) {
    filteredFlows = filteredFlows.filter(
      flow => flow.tables.some(table => activeTables.includes(table.name))
    );
  }

  const systemsSet = new Set();
  filteredFlows.forEach(flow => {
    systemsSet.add(flow.sourceSystem);
    systemsSet.add(flow.targetSystem);
  });
  const systems = Array.from(systemsSet);

  const nodes = systems.map((system, index) => {
    const angle = (index / systems.length) * 2 * Math.PI;
    const radius = 300;
    const x = 500 + radius * Math.cos(angle);
    const y = 350 + radius * Math.sin(angle);

    return {
      id: system,
      type: 'default',
      position: { x, y },
      data: { 
        label: (
          <div className="node-content">
            <Database size={20} color="#B8123E" />
            <div className="node-label">{system}</div>
          </div>
        )
      },
      style: {
        background: '#fff',
        border: '2px solid #B8123E',
        borderRadius: '8px',
        padding: '12px 16px',
        minWidth: '120px',
        fontSize: '14px',
      },
    };
  });

  const edges = filteredFlows.map(flow => ({
    id: flow.id,
    source: flow.sourceSystem,
    target: flow.targetSystem,
    type: 'smoothstep',
    animated: true,
    arrowHeadType: 'arrowclosed',
    style: { stroke: '#B8123E', strokeWidth: 2 },
  }));

  return { nodes, edges, filteredFlows };
}

const DataMapView = () => {
  const [flows] = useState(initialFlows);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSystems, setActiveSystems] = useState([]);
  const [activeTables, setActiveTables] = useState([]);
  const [selectedEdge, setSelectedEdge] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchByTable, setSearchByTable] = useState(true);
  const [searchBySystem, setSearchBySystem] = useState(true);
  const [rfInstance, setRfInstance] = useState(null);

  const statistics = useMemo(() => {
    const allTables = new Set();
    let totalFields = 0;
    const relationCount = flows.length;

    flows.forEach(flow => {
      flow.tables.forEach(table => {
        allTables.add(table.name);
        totalFields += table.fieldCount;
      });
    });

    return {
      tableCount: allTables.size,
      fieldCount: totalFields,
      relationCount,
    };
  }, [flows]);

  const { nodes, edges, filteredFlows } = useMemo(
    () => generateNodesAndEdges(flows, activeSystems, activeTables),
    [flows, activeSystems, activeTables]
  );

  const [elements, setElements] = useState([]);

  useEffect(() => {
    const allElements = [...nodes, ...edges];
    setElements(allElements);

    // #region agent log
    (function () {
      try {
        const container = document.querySelector('.data-map-view .react-flow');
        const rect = container ? container.getBoundingClientRect() : null;
        fetch('http://127.0.0.1:7427/ingest/7a12311b-d3d5-4203-82bd-85dcca6457a1', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Debug-Session-Id': 'eefdff',
          },
          body: JSON.stringify({
            sessionId: 'eefdff',
            runId: 'run1',
            hypothesisId: 'H1',
            location: 'src/dataMap/DataMapView.jsx:173',
            message: 'ReactFlow elements and container size',
            data: {
              nodes: nodes.length,
              edges: edges.length,
              elements: allElements.length,
              containerRect: rect
                ? {
                    width: rect.width,
                    height: rect.height,
                    top: rect.top,
                    left: rect.left,
                  }
                : null,
            },
            timestamp: Date.now(),
          }),
        }).catch(() => {});
      } catch (e) {
        // ignore logging errors
      }
    })();
    // #endregion agent log

    if (rfInstance && allElements.length > 0) {
      setTimeout(() => {
        rfInstance.fitView({ padding: 0.2 });
      }, 50);
    }
  }, [nodes, edges, rfInstance]);

  const onConnect = useCallback(
    (params) => setElements((els) => addEdge(params, els)),
    []
  );

  const handleEdgeClick = useCallback((_, edge) => {
    const flow = flows.find(f => f.id === edge.id);
    if (flow) {
      setSelectedEdge(flow);
      setSelectedNode(null);
    }
  }, [flows]);

  const handleNodeClick = useCallback((_, node) => {
    setSelectedNode(node.id);
    setSelectedEdge(null);
  }, []);

  const allSystems = Array.from(new Set(flows.flatMap(f => [f.sourceSystem, f.targetSystem])));
  const allTables = Array.from(new Set(flows.flatMap(f => f.tables.map(t => t.name))));

  const handleSearch = () => {
    const terms = searchTerm.split(/[,，;；\s]+/).filter(t => t.trim());
    const systems = [];
    const tables = [];
    
    terms.forEach(term => {
      const trimmedTerm = term.trim();
      if (searchBySystem) {
        const matchedSystems = allSystems.filter(s => s.includes(trimmedTerm));
        systems.push(...matchedSystems);
      }
      if (searchByTable) {
        const matchedTables = allTables.filter(t => t.includes(trimmedTerm));
        tables.push(...matchedTables);
      }
    });
    
    setActiveSystems([...new Set(systems)]);
    setActiveTables([...new Set(tables)]);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setActiveSystems([]);
    setActiveTables([]);
  };

  return (
    <div className="data-map-view">
      {/* Header */}
      <div className="data-map-header">
        <div className="header-content">
          <div className="statistics-group">
            <div className="statistic-card">
              <div className="statistic-content">
                <div className="statistic-info">
                  <div className="statistic-label">表数量</div>
                  <div className="statistic-value">{statistics.tableCount}</div>
                </div>
                <Table size={24} className="statistic-icon" />
              </div>
            </div>
            <div className="statistic-card">
              <div className="statistic-content">
                <div className="statistic-info">
                  <div className="statistic-label">字段数量</div>
                  <div className="statistic-value">{statistics.fieldCount}</div>
                </div>
                <BarChart3 size={24} className="statistic-icon" />
              </div>
            </div>
            <div className="statistic-card">
              <div className="statistic-content">
                <div className="statistic-info">
                  <div className="statistic-label">流转关系数量</div>
                  <div className="statistic-value">{statistics.relationCount}</div>
                </div>
                <Database size={24} className="statistic-icon" />
              </div>
            </div>
          </div>

          <div className="action-buttons">
            <Button onClick={() => setShowSearch(!showSearch)} className="action-btn">
              <Search size={16} />
              搜索
            </Button>
          </div>
        </div>

        {showSearch && (
          <div className="search-section">
            <div className="search-content">
              <div className="search-input-wrapper">
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="输入系统名或表名，多个用逗号分隔..."
                  onPressEnter={handleSearch}
                  className="search-input"
                />
                <p className="search-hint">支持多个搜索词，用逗号分隔</p>
                <div className="search-options">
                  <Checkbox checked={searchByTable} onChange={(e) => setSearchByTable(e.target.checked)}>
                    搜表
                  </Checkbox>
                  <Checkbox checked={searchBySystem} onChange={(e) => setSearchBySystem(e.target.checked)}>
                    搜系统
                  </Checkbox>
                </div>
              </div>

              <div className="search-actions">
                <Button type="primary" onClick={handleSearch} className="search-btn">
                  <Search size={16} />
                  查询
                </Button>
                {(activeSystems.length > 0 || activeTables.length > 0) && (
                  <Button onClick={clearSearch} className="clear-btn">
                    <X size={16} />
                  </Button>
                )}
              </div>
            </div>

            {(activeSystems.length > 0 || activeTables.length > 0) && (
              <div className="filter-tags">
                <p className="filter-result">找到 {filteredFlows.length} 条流转关系</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ReactFlow 画布 */}
      <div className="flow-canvas">
        <ReactFlow
          elements={elements}
          onConnect={onConnect}
          onNodeClick={handleNodeClick}
          onEdgeClick={handleEdgeClick}
          onLoad={(instance) => {
            setRfInstance(instance);
          }}
          nodesDraggable={true}
          nodesConnectable={false}
          elementsSelectable={true}
          fitView={true}
          fitViewOptions={{ padding: 0.3 }}
        >
          <Background color="#e5e7eb" gap={16} />
          <Controls />
        </ReactFlow>

        <div className="flow-legend-overlay">
          <div className="legend-title">图例</div>
          <div className="legend-item">
            <div className="legend-node"></div>
            <span>系统节点</span>
          </div>
          <div className="legend-item">
            <div className="legend-edge"></div>
            <span>数据流向</span>
          </div>
        </div>
      </div>

      {/* 简化版侧边栏 */}
      {selectedEdge && (
        <div className="sidebar">
          <div className="sidebar-content">
            <div className="sidebar-header">
              <h2 className="sidebar-title">流转详情</h2>
              <button onClick={() => setSelectedEdge(null)} className="close-btn">
                <X size={20} />
              </button>
            </div>
            <div className="sidebar-body">
              <div className="info-item">
                <p className="info-label">源系统</p>
                <p className="info-value">{selectedEdge.sourceSystem}</p>
              </div>
              <div className="info-item">
                <p className="info-label">目标系统</p>
                <p className="info-value">{selectedEdge.targetSystem}</p>
              </div>
              <div className="info-item">
                <p className="info-label">涉及表 ({selectedEdge.tables.length})</p>
                <div className="table-list">
                  {selectedEdge.tables.map((table, index) => (
                    <div key={index} className="table-item">
                      <p className="table-name">{table.name}</p>
                      <p className="table-fields">{table.fieldCount} 个字段</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataMapView;
