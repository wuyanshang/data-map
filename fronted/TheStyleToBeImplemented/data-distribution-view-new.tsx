import { Shield, Building2, Users, Database, FileText, Receipt, UserCheck, BadgeDollarSign, TrendingUp, ArrowRight, Table as TableIcon, Search, X, ChevronRight, Plus, Minus, Download, Upload } from 'lucide-react';
import { useState, useMemo, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/app/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';

// 字段数据类型
interface FieldData {
  name: string;
  table: string;
  system: string;
  securityLevel: string;
  businessCategory: string;
  owner: string;
  // 指标相关字段（可选）
  theme?: string;
  secondaryCategory?: string;
  metricOwner?: string;
  metricCnName?: string;
  businessDefinition?: string;
  calculationFormula?: string;
  isMetric?: boolean;
}

// 资产项数据类型
interface AssetItem {
  name: string;
  description: string;
  tableCount: number;
  fieldCount: number;
  tables: Array<{
    system: string;
    table: string;
    tableCnName: string;
    fields: Array<{ 
      name: string; 
      cnName: string;
      classification: string;
      displayAttr: string;
      dataOwner: string;
    }>;
  }>;
}

// 数据目录分类类型
interface CatalogCategory {
  id: string;
  name: string;
  theme: string;
  level1: string;
  level2: string;
  items: AssetItem[];
}

// 基础数据资产指标项
interface BasicMetricItem {
  theme: string;
  secondaryCategory: string;
  metricOwner: string;
  metricCnName: string;
  businessDefinition: string;
  calculationFormula: string;
  dimension: string;
}

// 标签数据资产指标项
interface TagMetricItem {
  reportName: string;
  reportOwner: string;
  metricCnName: string;
  submitter: string;
  externalDefinition: string;
  companyBusinessDefinition: string;
  calculationFormula: string;
  dimension: string;
}

// 客户标签目录项
interface CustomerTagItem {
  level1: string;
  level2: string;
  level3: string;
  level4: string;
  tagName: string;
  businessRule: string;
  tagAttribute: string;
  customerScope: string;
  tagOwner: string;
}

export function DataDistributionView() {
  const [activeView, setActiveView] = useState<'security' | 'business' | 'owner' | 'catalog'>('security');
  const [globalSearch, setGlobalSearch] = useState('');
  const [searchByTable, setSearchByTable] = useState(true);
  const [searchByField, setSearchByField] = useState(true);
  const [searchByMetric, setSearchByMetric] = useState(true);
  const [searchByTag, setSearchByTag] = useState(true);
  const [searchResults, setSearchResults] = useState<FieldData[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  
  // 第一层弹窗：显示数据资产目录清单
  const [selectedCategory, setSelectedCategory] = useState<{ level: string; categories: CatalogCategory[] } | null>(null);
  // 第二层弹窗：显示库表字段
  const [selectedAssetItem, setSelectedAssetItem] = useState<AssetItem | null>(null);
  
  // 第一层弹窗搜索状态
  const [level2Filter, setLevel2Filter] = useState('');
  const [assetNameFilter, setAssetNameFilter] = useState('');
  
  // 第二层弹窗筛选状态
  const [filterSystem, setFilterSystem] = useState('');
  const [filterTable, setFilterTable] = useState('');
  const [filterField, setFilterField] = useState('');
  const [filterCnName, setFilterCnName] = useState('');
  const [filterOwner, setFilterOwner] = useState('');
  
  // 第一层弹窗展开/收起状态 - 使用分类ID作为key
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  
  // 数据目录特殊弹窗状态
  const [showBasicMetricsDialog, setShowBasicMetricsDialog] = useState(false);
  const [showBusinessMetricsDialog, setShowBusinessMetricsDialog] = useState(false);
  const [showReportMetricsDialog, setShowReportMetricsDialog] = useState(false);
  const [showCustomerTagsDialog, setShowCustomerTagsDialog] = useState(false);
  
  // 导出弹窗状态
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [exportSecurityLevel, setExportSecurityLevel] = useState(true);
  const [exportDataCatalog, setExportDataCatalog] = useState(true);
  const [exportMetrics, setExportMetrics] = useState(true);
  const [exportTags, setExportTags] = useState(true);
  
  // 导入弹窗状态
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importSecurityLevel, setImportSecurityLevel] = useState(true);
  const [importDataCatalog, setImportDataCatalog] = useState(true);
  const [importMetrics, setImportMetrics] = useState(true);
  const [importTags, setImportTags] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // 指标弹窗筛选状态
  const [filterMetricName, setFilterMetricName] = useState('');
  const [filterMetricOwner, setFilterMetricOwner] = useState('');
  const [filterReportName, setFilterReportName] = useState('');
  const [filterReportOwner, setFilterReportOwner] = useState('');
  const [filterSubmitter, setFilterSubmitter] = useState('');
  
  // 客户标签筛选状态
  const [filterTagName, setFilterTagName] = useState('');
  const [filterLevel2, setFilterLevel2] = useState('');

  // 模拟字段数据库 - 用于全局搜索
  const fieldDatabase: FieldData[] = [
    { name: 'customer_id', table: 'customer_info', system: 'CRM系统', securityLevel: '核心数据', businessCategory: '客户数据', owner: '客户管理部' },
    { name: 'customer_name', table: 'customer_info', system: 'CRM系统', securityLevel: '敏感数据', businessCategory: '客户数据', owner: '客户管理部' },
    { name: 'phone_number', table: 'customer_contact', system: 'CRM系统', securityLevel: '敏感数据', businessCategory: '客户数据', owner: '客户管理部' },
    { name: 'policy_no', table: 'policy_master', system: '保单系统', securityLevel: '敏感数据', businessCategory: '保单数据', owner: '营运部' },
    { name: 'premium_amount', table: 'policy_detail', system: '核心业务系统', securityLevel: '重要数据', businessCategory: '保单数据', owner: '营运部' },
    { name: 'claim_amount', table: 'claim_record', system: '理赔系统', securityLevel: '重要数据', businessCategory: '理赔数据', owner: '营运部' },
    { name: 'channel_id', table: 'channel_info', system: '渠道管理系统', securityLevel: '其它一般数据', businessCategory: '渠道数据', owner: '营运部' },
    { name: 'transaction_amount', table: 'financial_transaction', system: '财务系统', securityLevel: '核心数据', businessCategory: '财务数据', owner: '财务部' },
    // 指标数据
    { 
      name: 'premium_income', 
      table: '', 
      system: '', 
      securityLevel: '', 
      businessCategory: '', 
      owner: '',
      isMetric: true,
      theme: '保险业务',
      secondaryCategory: '保费指标',
      metricOwner: '营运部',
      metricCnName: '保费收入',
      businessDefinition: '统计期间内公司实际收到的所有保险产品的保费总额，包括新单保费和续期保费',
      calculationFormula: 'SUM(新单保费) + SUM(续期保费)'
    },
    { 
      name: 'policy_count', 
      table: '', 
      system: '', 
      securityLevel: '', 
      businessCategory: '', 
      owner: '',
      isMetric: true,
      theme: '保险业务',
      secondaryCategory: '保单指标',
      metricOwner: '营运部',
      metricCnName: '保单件数',
      businessDefinition: '统计期间内新增的有效保单总数量',
      calculationFormula: 'COUNT(DISTINCT policy_no)'
    },
    { 
      name: 'customer_retention_rate', 
      table: '', 
      system: '', 
      securityLevel: '', 
      businessCategory: '', 
      owner: '',
      isMetric: true,
      theme: '客户分析',
      secondaryCategory: '客户指标',
      metricOwner: '客户管理部',
      metricCnName: '客户留存率',
      businessDefinition: '统计期间内继续持有有效保单的客户占比',
      calculationFormula: '(期末活跃客户数 / 期初客户数) * 100%'
    },
  ];

  // 安全视角数据
  const securityData = [
    {
      level: '核心数据',
      color: 'bg-red-500',
      fieldCount: 125,
      percentage: 18,
      position: 'top',
      systems: ['财务系统', '数据仓库'],
    },
    {
      level: '重要数据',
      color: 'bg-orange-500',
      fieldCount: 280,
      percentage: 33,
      position: 'top',
      systems: ['核心业务系统', '理赔系统'],
    },
    {
      level: '敏感数据',
      color: 'bg-blue-500',
      fieldCount: 245,
      percentage: 29,
      position: 'bottom',
      systems: ['CRM系统', '保单系统'],
    },
    {
      level: '其它一般数据',
      color: 'bg-green-500',
      fieldCount: 175,
      percentage: 20,
      position: 'bottom',
      systems: ['渠道管理系统', '营销系统'],
    },
  ];

  // 业务视角数据
  const businessData = [
    {
      category: '客户数据',
      icon: UserCheck,
      color: 'bg-purple-500',
      fieldCount: 186,
      percentage: 20,
      systems: ['CRM系统'],
    },
    {
      category: '保单数据',
      icon: FileText,
      color: 'bg-blue-500',
      fieldCount: 245,
      percentage: 27,
      systems: ['保单系统', '核心业务系统'],
    },
    {
      category: '理赔数据',
      icon: Receipt,
      color: 'bg-green-500',
      fieldCount: 198,
      percentage: 22,
      systems: ['理赔系统'],
    },
    {
      category: '渠道数据',
      icon: TrendingUp,
      color: 'bg-yellow-500',
      fieldCount: 142,
      percentage: 16,
      systems: ['渠道管理系统'],
    },
    {
      category: '财务数据',
      icon: BadgeDollarSign,
      color: 'bg-red-500',
      fieldCount: 154,
      percentage: 15,
      systems: ['财务系统'],
    },
  ];

  // 属主视角数据
  const ownerData = [
    {
      owner: '团险事业部',
      icon: Building2,
      color: 'bg-indigo-500',
      fieldCount: 168,
      tableCount: 28,
      systems: ['团险核心系统', '团险管理系统'],
    },
    {
      owner: '营运部',
      icon: Users,
      color: 'bg-blue-500',
      fieldCount: 325,
      tableCount: 52,
      systems: ['核心业务系统', '理赔系统', '渠道管理系统'],
    },
    {
      owner: '客户管理部',
      icon: UserCheck,
      color: 'bg-green-500',
      fieldCount: 186,
      tableCount: 31,
      systems: ['CRM系统'],
    },
    {
      owner: '财务部',
      icon: BadgeDollarSign,
      color: 'bg-purple-500',
      fieldCount: 246,
      tableCount: 41,
      systems: ['财务系统', '数据仓库'],
    },
  ];

  // 数据目录数据 - 扩展版本
  const catalogData = [
    {
      id: 'basic',
      name: '基础数据资产',
      description: '企业运营的基础数据资产',
      icon: Database,
      color: 'bg-blue-500',
      categories: [
        {
          id: 'basic-customer',
          name: '客户主题',
          theme: '客户数据',
          level1: '基础数据',
          level2: '客户信息',
          items: [
            {
              name: '客户基本信息',
              description: '客户的基本属性数据',
              tableCount: 3,
              fieldCount: 45,
              tables: [
                { system: 'CRM系统', table: 'customer_info', tableCnName: '客户信息表', fields: [
                  { name: 'customer_id', cnName: '客户ID', classification: '核心数据', displayAttr: '客户标识', dataOwner: '客户管理部' },
                  { name: 'customer_name', cnName: '客户名称', classification: '敏感数据', displayAttr: '客户名称', dataOwner: '客户管理部' },
                  { name: 'gender', cnName: '性别', classification: '一般数据', displayAttr: '性别', dataOwner: '客户管理部' },
                  { name: 'birth_date', cnName: '出生日期', classification: '敏感数据', displayAttr: '出生日期', dataOwner: '客户管理部' },
                  { name: 'id_number', cnName: '身份证号', classification: '核心数据', displayAttr: '身份证号', dataOwner: '客户管理部' },
                ]},
                { system: 'CRM系统', table: 'customer_profile', tableCnName: '客户资料表', fields: [
                  { name: 'profile_id', cnName: '资料ID', classification: '核心数据', displayAttr: '资料标识', dataOwner: '客户管理部' },
                  { name: 'occupation', cnName: '职业', classification: '敏感数据', displayAttr: '职业', dataOwner: '客户管理部' },
                  { name: 'income_level', cnName: '收入水平', classification: '核心数据', displayAttr: '收入水平', dataOwner: '客户管理部' },
                ]},
              ],
            },
            {
              name: '客户联系方式',
              description: '客户的联系信息',
              tableCount: 2,
              fieldCount: 18,
              tables: [
                { system: 'CRM系统', table: 'customer_contact', tableCnName: '客户联系表', fields: [
                  { name: 'contact_id', cnName: '联系ID', classification: '重要数据', displayAttr: '联系标识', dataOwner: '客户管理部' },
                  { name: 'phone_number', cnName: '电话号码', classification: '敏感数据', displayAttr: '电话号码', dataOwner: '客户管理部' },
                  { name: 'email', cnName: '电子邮件', classification: '敏感数据', displayAttr: '电子邮件', dataOwner: '客户管理部' },
                  { name: 'address', cnName: '地址', classification: '敏感数据', displayAttr: '地址', dataOwner: '客户管理部' },
                ]},
              ],
            },
            {
              name: '客户关系管理',
              description: '客户关系和互动记录',
              tableCount: 2,
              fieldCount: 28,
              tables: [
                { system: 'CRM系统', table: 'customer_relationship', tableCnName: '客户关系表', fields: [
                  { name: 'relationship_id', cnName: '关系ID', classification: '一般数据', displayAttr: '关系标识', dataOwner: '客户管理部' },
                  { name: 'relationship_type', cnName: '关系类型', classification: '一般数据', displayAttr: '关系类型', dataOwner: '客户管理部' },
                  { name: 'start_date', cnName: '开始日期', classification: '一般数据', displayAttr: '开始日期', dataOwner: '客户管理部' },
                ]},
              ],
            },
          ],
        },
        {
          id: 'basic-policy',
          name: '保单主题',
          theme: '保单数据',
          level1: '基础数据',
          level2: '保单信息',
          items: [
            {
              name: '保单基本信息',
              description: '保单的核心数据',
              tableCount: 2,
              fieldCount: 32,
              tables: [
                { system: '保单系统', table: 'policy_master', tableCnName: '保单主表', fields: [
                  { name: 'policy_id', cnName: '保单ID', classification: '核心数据', displayAttr: '保单标识', dataOwner: '营运部' },
                  { name: 'policy_no', cnName: '保单号', classification: '敏感数据', displayAttr: '保单号', dataOwner: '营运部' },
                  { name: 'policy_type', cnName: '保单类型', classification: '一般数据', displayAttr: '保单类����', dataOwner: '营运部' },
                  { name: 'effective_date', cnName: '生效日期', classification: '重要数据', displayAttr: '生��日期', dataOwner: '营运部' },
                ]},
              ],
            },
            {
              name: '保单详细信息',
              description: '保单的详细条款和内容',
              tableCount: 1,
              fieldCount: 25,
              tables: [
                { system: '保单系统', table: 'policy_detail', tableCnName: '保单详情表', fields: [
                  { name: 'detail_id', cnName: '详情ID', classification: '重要数据', displayAttr: '详情标识', dataOwner: '营运部' },
                  { name: 'premium_amount', cnName: '保费金额', classification: '核心数据', displayAttr: '保费金额', dataOwner: '营运部' },
                  { name: 'coverage_amount', cnName: '保额', classification: '核心数据', displayAttr: '保额', dataOwner: '营运部' },
                ]},
              ],
            },
          ],
        },
        {
          id: 'basic-claim',
          name: '理赔主题',
          theme: '理赔数据',
          level1: '基础数据',
          level2: '理赔信息',
          items: [
            {
              name: '理赔案件信息',
              description: '理赔案件的基本信息',
              tableCount: 2,
              fieldCount: 38,
              tables: [
                { system: '理赔系统', table: 'claim_case', tableCnName: '理赔案件表', fields: [
                  { name: 'claim_id', cnName: '理赔ID', classification: '核心数据', displayAttr: '理赔标识', dataOwner: '营运部' },
                  { name: 'claim_no', cnName: '理赔号', classification: '敏感数据', displayAttr: '理赔号', dataOwner: '营运部' },
                  { name: 'claim_type', cnName: '理赔类型', classification: '一般数据', displayAttr: '理赔类型', dataOwner: '营运部' },
                  { name: 'claim_date', cnName: '理赔日期', classification: '重要数据', displayAttr: '理赔日期', dataOwner: '营运部' },
                  { name: 'claim_amount', cnName: '理赔金额', classification: '核心数据', displayAttr: '理赔金额', dataOwner: '营运部' },
                ]},
              ],
            },
            {
              name: '理赔审核记录',
              description: '理赔审核的流程和结果',
              tableCount: 1,
              fieldCount: 22,
              tables: [
                { system: '理赔系统', table: 'claim_review', tableCnName: '理赔审核表', fields: [
                  { name: 'review_id', cnName: '审核ID', classification: '重要数据', displayAttr: '审核标识', dataOwner: '营运部' },
                  { name: 'review_status', cnName: '审核状态', classification: '一般数据', displayAttr: '审核状态', dataOwner: '营运部' },
                  { name: 'reviewer', cnName: '审核人', classification: '敏感数据', displayAttr: '审核人', dataOwner: '营运部' },
                ]},
              ],
            },
            {
              name: '理赔支付信息',
              description: '理赔款项支付记录',
              tableCount: 1,
              fieldCount: 19,
              tables: [
                { system: '理赔系统', table: 'claim_payment', tableCnName: '理赔支付表', fields: [
                  { name: 'payment_id', cnName: '支付ID', classification: '核心数据', displayAttr: '支付标识', dataOwner: '营运部' },
                  { name: 'payment_amount', cnName: '支付金额', classification: '核心数据', displayAttr: '支付金额', dataOwner: '营运部' },
                  { name: 'payment_date', cnName: '支付日期', classification: '重要数据', displayAttr: '支付日期', dataOwner: '营运部' },
                ]},
              ],
            },
          ],
        },
        {
          id: 'basic-channel',
          name: '渠道主题',
          theme: '渠道数据',
          level1: '基础数据',
          level2: '渠道信息',
          items: [
            {
              name: '渠道基本信息',
              description: '销售渠道的基本属性',
              tableCount: 2,
              fieldCount: 28,
              tables: [
                { system: '渠道管理系统', table: 'channel_info', tableCnName: '渠道信息表', fields: [
                  { name: 'channel_id', cnName: '渠道ID', classification: '一般数据', displayAttr: '渠道标识', dataOwner: '营运部' },
                  { name: 'channel_name', cnName: '渠道名称', classification: '一般数据', displayAttr: '渠道名称', dataOwner: '营运部' },
                  { name: 'channel_type', cnName: '渠道类型', classification: '一般数据', displayAttr: '渠道类型', dataOwner: '营运部' },
                  { name: 'region', cnName: '地区', classification: '一般数据', displayAttr: '地区', dataOwner: '营运部' },
                ]},
              ],
            },
            {
              name: '渠道业绩信息',
              description: '渠道的业绩和考核数据',
              tableCount: 1,
              fieldCount: 24,
              tables: [
                { system: '渠道管理系统', table: 'channel_performance', tableCnName: '渠道业绩表', fields: [
                  { name: 'performance_id', cnName: '业绩ID', classification: '一般数据', displayAttr: '业绩标识', dataOwner: '营运部' },
                  { name: 'sales_amount', cnName: '销售额', classification: '重要数据', displayAttr: '销售额', dataOwner: '营运部' },
                  { name: 'target_amount', cnName: '目标金额', classification: '重要数据', displayAttr: '目标金额', dataOwner: '营运部' },
                ]},
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'metrics',
      name: '指标数据资产',
      description: '业务分析和决策支持指标',
      icon: TrendingUp,
      color: 'bg-green-500',
      categories: [
        {
          id: 'metrics-business',
          name: '业务经营指标',
          theme: '业务分析',
          level1: '指标数据',
          level2: '业务KPI',
          items: [
            {
              name: '保费收入指标',
              description: '各类保费收入统计',
              tableCount: 2,
              fieldCount: 24,
              tables: [
                { system: '数据仓库', table: 'premium_metrics', tableCnName: '保费指标表', fields: [
                  { name: 'metric_id', cnName: '指标ID', classification: '一般数据', displayAttr: '指标标识', dataOwner: '营运部' },
                  { name: 'premium_amount', cnName: '保费金额', classification: '重要数据', displayAttr: '保费金额', dataOwner: '营运部' },
                  { name: 'period', cnName: '周期', classification: '一般数据', displayAttr: '周期', dataOwner: '营运部' },
                ]},
              ],
            },
            {
              name: '客户增长指标',
              description: '客户数量和质量指标',
              tableCount: 1,
              fieldCount: 18,
              tables: [
                { system: '数据仓库', table: 'customer_growth_metrics', tableCnName: '客户增长指标表', fields: [
                  { name: 'new_customers', cnName: '新客户', classification: '一般数据', displayAttr: '新客户', dataOwner: '营运部' },
                  { name: 'active_customers', cnName: '活跃客户', classification: '一般数据', displayAttr: '活跃客户', dataOwner: '营运部' },
                ]},
              ],
            },
            {
              name: '理赔率指标',
              description: '理赔率和损失率统计',
              tableCount: 1,
              fieldCount: 16,
              tables: [
                { system: '数据仓库', table: 'claim_ratio_metrics', tableCnName: '理赔率指标表', fields: [
                  { name: 'claim_ratio', cnName: '理赔率', classification: '重要数据', displayAttr: '理赔率', dataOwner: '营运部' },
                  { name: 'loss_ratio', cnName: '损失率', classification: '重要数据', displayAttr: '损失率', dataOwner: '营运部' },
                ]},
              ],
            },
          ],
        },
        {
          id: 'metrics-report',
          name: '监管报告指标',
          theme: '报告分析',
          level1: '指标数据',
          level2: '报告KPI',
          items: [
            {
              name: '财务报告指标',
              description: '财务报表相关指标',
              tableCount: 2,
              fieldCount: 35,
              tables: [
                { system: '数据仓库', table: 'financial_report_metrics', tableCnName: '财务报告指标表', fields: [
                  { name: 'revenue', cnName: '收入', classification: '核心数据', displayAttr: '收入', dataOwner: '财务部' },
                  { name: 'profit', cnName: '利润', classification: '核心数据', displayAttr: '利润', dataOwner: '财务部' },
                  { name: 'cost', cnName: '成本', classification: '重要数据', displayAttr: '成本', dataOwner: '财务部' },
                ]},
              ],
            },
            {
              name: '运营报告指标',
              description: '运营效率相关指标',
              tableCount: 1,
              fieldCount: 28,
              tables: [
                { system: '数据仓库', table: 'operation_report_metrics', tableCnName: '运营报告指标表', fields: [
                  { name: 'efficiency_rate', cnName: '效率率', classification: '一般数据', displayAttr: '效率率', dataOwner: '营运部' },
                  { name: 'processing_time', cnName: '处理时间', classification: '一般数据', displayAttr: '处理时间', dataOwner: '营运部' },
                ]},
              ],
            },
            {
              name: '市场报告指标',
              description: '市场表现相关指标',
              tableCount: 1,
              fieldCount: 22,
              tables: [
                { system: '数据仓库', table: 'market_report_metrics', tableCnName: '市场报告指标表', fields: [
                  { name: 'market_share', cnName: '市场份额', classification: '重要数据', displayAttr: '市场份额', dataOwner: '营运部' },
                  { name: 'growth_rate', cnName: '增长率', classification: '重要数据', displayAttr: '增长率', dataOwner: '营运部' },
                ]},
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'tags',
      name: '标签数据资产',
      description: '客户和产品的标签体系',
      icon: FileText,
      color: 'bg-purple-500',
      categories: [
        {
          id: 'tags-customer',
          name: '客户标签',
          theme: '客户画像',
          level1: '标签数据',
          level2: '客户标签',
          items: [
            {
              name: '客户价值标签',
              description: '客户价值分层标签',
              tableCount: 1,
              fieldCount: 12,
              tables: [
                { system: 'CRM系统', table: 'customer_value_tags', tableCnName: '客户价值标签表', fields: [
                  { name: 'customer_id', cnName: '客户ID', classification: '核心数据', displayAttr: '客户标识', dataOwner: '客户管理部' },
                  { name: 'value_level', cnName: '价值等级', classification: '一般数据', displayAttr: '价值等级', dataOwner: '客户管理部' },
                  { name: 'potential_score', cnName: '潜力评分', classification: '一般数据', displayAttr: '潜力评分', dataOwner: '客户管理部' },
                ]},
              ],
            },
            {
              name: '客户行为标签',
              description: '客户行为特征标签',
              tableCount: 1,
              fieldCount: 15,
              tables: [
                { system: 'CRM系统', table: 'customer_behavior_tags', tableCnName: '客户行为标签表', fields: [
                  { name: 'customer_id', cnName: '客户ID', classification: '核心数据', displayAttr: '客户标识', dataOwner: '客户管理部' },
                  { name: 'purchase_frequency', cnName: '购买频率', classification: '一般数据', displayAttr: '购买频率', dataOwner: '客户管理部' },
                  { name: 'channel_preference', cnName: '渠道偏好', classification: '一般数据', displayAttr: '渠道偏好', dataOwner: '客户管理部' },
                ]},
              ],
            },
            {
              name: '客户风险标签',
              description: '客户风险评估标签',
              tableCount: 1,
              fieldCount: 13,
              tables: [
                { system: 'CRM系统', table: 'customer_risk_tags', tableCnName: '客户风险标签表', fields: [
                  { name: 'customer_id', cnName: '客户ID', classification: '核心数据', displayAttr: '客户标识', dataOwner: '客户管理部' },
                  { name: 'risk_level', cnName: '风险等级', classification: '重要数据', displayAttr: '风险等级', dataOwner: '客户管理部' },
                  { name: 'risk_score', cnName: '风险评分', classification: '重要数据', displayAttr: '风险评分', dataOwner: '客户管理部' },
                ]},
              ],
            },
          ],
        },
        {
          id: 'tags-agent',
          name: '营销员标签',
          theme: '营销员画像',
          level1: '标签数据',
          level2: '营销员标签',
          items: [
            {
              name: '营销员业绩标签',
              description: '营销员业绩分层标签',
              tableCount: 1,
              fieldCount: 18,
              tables: [
                { system: '营销系统', table: 'agent_performance_tags', tableCnName: '营销员业绩标签表', fields: [
                  { name: 'agent_id', cnName: '营销员ID', classification: '一般数据', displayAttr: '营销员标识', dataOwner: '营运部' },
                  { name: 'performance_level', cnName: '业绩等级', classification: '一般数据', displayAttr: '业绩等级', dataOwner: '营运部' },
                  { name: 'sales_rank', cnName: '销售排名', classification: '一般数据', displayAttr: '销售排名', dataOwner: '营运部' },
                ]},
              ],
            },
            {
              name: '营销员能力标签',
              description: '营销员能力和特长标签',
              tableCount: 1,
              fieldCount: 16,
              tables: [
                { system: '营销系统', table: 'agent_capability_tags', tableCnName: '营销员能力标签表', fields: [
                  { name: 'agent_id', cnName: '营销员ID', classification: '一般数据', displayAttr: '营销员标识', dataOwner: '营运部' },
                  { name: 'skill_level', cnName: '技能等级', classification: '一般数据', displayAttr: '技能等级', dataOwner: '营运部' },
                  { name: 'expertise_area', cnName: '专长领域', classification: '一般数据', displayAttr: '专长领域', dataOwner: '营运部' },
                ]},
              ],
            },
            {
              name: '营销员活跃度标签',
              description: '营销员活跃度评估标签',
              tableCount: 1,
              fieldCount: 14,
              tables: [
                { system: '营销系统', table: 'agent_activity_tags', tableCnName: '营销员活跃度标签表', fields: [
                  { name: 'agent_id', cnName: '营销员ID', classification: '一般数据', displayAttr: '营销员标识', dataOwner: '营运部' },
                  { name: 'activity_level', cnName: '活跃度等级', classification: '一般数据', displayAttr: '活跃度等级', dataOwner: '营运部' },
                  { name: 'last_active_date', cnName: '最后活跃日期', classification: '一般数据', displayAttr: '最后活跃日期', dataOwner: '营运部' },
                ]},
              ],
            },
          ],
        },
      ],
    },
  ];

  // 基础数据资产的指标数据
  const basicMetricsData: BasicMetricItem[] = [
    { theme: '客户主题', secondaryCategory: '客户增长', metricOwner: '张三', metricCnName: '新客户数', businessDefinition: '当月新增客户数量', calculationFormula: 'COUNT(DISTINCT customer_id) WHERE create_date >= MONTH_START', dimension: '月度' },
    { theme: '客户主题', secondaryCategory: '客户增长', metricOwner: '张三', metricCnName: '活跃客户数', businessDefinition: '当月有交互的客户数量', calculationFormula: 'COUNT(DISTINCT customer_id) WHERE last_active_date >= MONTH_START', dimension: '月度' },
    { theme: '客户主题', secondaryCategory: '客户价值', metricOwner: '李四', metricCnName: '客户终身价值', businessDefinition: '客户生命周期内预期产生的总价值', calculationFormula: 'SUM(revenue) / COUNT(DISTINCT customer_id)', dimension: '累计' },
    { theme: '保单主题', secondaryCategory: '保单业绩', metricOwner: '王五', metricCnName: '保费收入', businessDefinition: '当期收取的保费总额', calculationFormula: 'SUM(premium_amount) WHERE payment_date BETWEEN START_DATE AND END_DATE', dimension: '月度' },
    { theme: '保单主题', secondaryCategory: '保单业绩', metricOwner: '王五', metricCnName: '新增保单数', businessDefinition: '当期新签发的保单数量', calculationFormula: 'COUNT(policy_id) WHERE issue_date >= MONTH_START', dimension: '���度' },
    { theme: '理赔主题', secondaryCategory: '理赔效率', metricOwner: '赵六', metricCnName: '平均理赔周期', businessDefinition: '从报案到结案的平均天数', calculationFormula: 'AVG(DATEDIFF(settlement_date, claim_date))', dimension: '月度' },
    { theme: '理赔主题', secondaryCategory: '理赔成本', metricOwner: '赵六', metricCnName: '理赔率', businessDefinition: '赔款支出占保费收入的比例', calculationFormula: 'SUM(claim_amount) / SUM(premium_amount)', dimension: '年度' },
  ];

  // 标签数据资产的指标数据
  const tagMetricsData: TagMetricItem[] = [
    { reportName: '偿付能力报告', reportOwner: '监管报告部', metricCnName: '实际资本', submitter: '张三', externalDefinition: '按照监管要求计算的实际资本���额', companyBusinessDefinition: '公司实际拥有的资本', calculationFormula: 'SUM(equity) + SUM(reserves)', dimension: '季度' },
    { reportName: '偿付能力报告', reportOwner: '监管报告部', metricCnName: '最低资本', submitter: '张三', externalDefinition: '按照监管标准要求的最低资本', companyBusinessDefinition: '监管要求的最低资本额', calculationFormula: 'SUM(risk_capital) * regulatory_rate', dimension: '季度' },
    { reportName: '偿付能力报告', reportOwner: '监管报告部', metricCnName: '综合偿付能力充足率', submitter: '李四', externalDefinition: '实际资本与最低资本的比率', companyBusinessDefinition: '反映公司偿付能力的核心指标', calculationFormula: '实际资本 / 最低资本 * 100%', dimension: '季度' },
    { reportName: '业绩报告', reportOwner: '财务部', metricCnName: '保费收入', submitter: '王五', externalDefinition: '会计准则下的保费收入', companyBusinessDefinition: '当期确认的保费收入', calculationFormula: 'SUM(premium_revenue)', dimension: '月度' },
    { reportName: '业绩报告', reportOwner: '财务部', metricCnName: '投资收益', submitter: '王五', externalDefinition: '投资活动产生的收益', companyBusinessDefinition: '投资组合的收益', calculationFormula: 'SUM(investment_income)', dimension: '月度' },
    { reportName: '风险报告', reportOwner: '风险管理部', metricCnName: '风险敞口', submitter: '赵六', externalDefinition: '可能面临损失的最大金额', companyBusinessDefinition: '当前承保的最大风险金额', calculationFormula: 'SUM(sum_assured)', dimension: '月度' },
  ];

  // 客户标签目录数据
  const customerTagsData: CustomerTagItem[] = [
    { level1: '客户基本信息', level2: '人口统计信息', level3: '年龄', level4: '18-25岁', tagName: '青年客户', businessRule: '年龄在18-25岁之间的客户', tagAttribute: '静态', customerScope: '所有个人客户', tagOwner: '客户管理部' },
    { level1: '客户基本信息', level2: '人口统计信息', level3: '年龄', level4: '26-35岁', tagName: '青壮年客户', businessRule: '年龄在26-35岁之间的客户', tagAttribute: '静态', customerScope: '所有个人客户', tagOwner: '客户管理部' },
    { level1: '客户基本信息', level2: '人口统计信息', level3: '年龄', level4: '36-45岁', tagName: '中年客户', businessRule: '年龄在36-45岁之间的客户', tagAttribute: '静态', customerScope: '所有个人客户', tagOwner: '客户管理部' },
    { level1: '客户基本信息', level2: '人口统计信息', level3: '年龄', level4: '46-55岁', tagName: '中老年客户', businessRule: '年龄在46-55岁之间的客户', tagAttribute: '静态', customerScope: '所有个人客户', tagOwner: '客户管理部' },
    { level1: '客户基本信息', level2: '人口统计信息', level3: '年龄', level4: '56岁以上', tagName: '老年客户', businessRule: '年龄在56岁及以上的客户', tagAttribute: '静态', customerScope: '所有个人客户', tagOwner: '客户管理部' },
    { level1: '客户基本信息', level2: '人口统计信息', level3: '性别', level4: '男', tagName: '男性客户', businessRule: '性别为男的客户', tagAttribute: '静态', customerScope: '所有个人客户', tagOwner: '客户管理部' },
    { level1: '客户基本信息', level2: '人口统计信息', level3: '性别', level4: '女', tagName: '女性客户', businessRule: '性别为女的客户', tagAttribute: '静态', customerScope: '所有个人客户', tagOwner: '客户管理部' },
    { level1: '客户基本信息', level2: '地域信息', level3: '省份', level4: '广东省', tagName: '广东客户', businessRule: '居住地在广东省的客户', tagAttribute: '静态', customerScope: '所有个人客户', tagOwner: '客户管理部' },
    { level1: '客户基本信息', level2: '地域信息', level3: '省份', level4: '上海市', tagName: '上海客户', businessRule: '居住地在上海市的客户', tagAttribute: '静态', customerScope: '所有个人客户', tagOwner: '客户管理部' },
    { level1: '客户基本信息', level2: '地域信息', level3: '省份', level4: '北京市', tagName: '北京客户', businessRule: '居住地在北京市的客户', tagAttribute: '静态', customerScope: '所有个人客户', tagOwner: '客户管理部' },
    { level1: '客户基本信息', level2: '地域信息', level3: '城市等级', level4: '一线城市', tagName: '一线城市客户', businessRule: '居住在一线城市的客户', tagAttribute: '静态', customerScope: '所有个人客户', tagOwner: '客户管理部' },
    { level1: '客户基本信息', level2: '地域信息', level3: '城市等级', level4: '二线城市', tagName: '二线城市客户', businessRule: '居住在二线城市的客户', tagAttribute: '静态', customerScope: '所有个人客户', tagOwner: '客户管理部' },
    { level1: '客户行为特征', level2: '购买行为', level3: '购买频次', level4: '高频客户', tagName: '高频购买客户', businessRule: '近12个月购买次数≥10次的客户', tagAttribute: '动态', customerScope: '有购买记录的客户', tagOwner: '营运部' },
    { level1: '客户行为特征', level2: '购买行为', level3: '购买频次', level4: '中频客户', tagName: '中频购买客户', businessRule: '近12个月购买次数在5-9次的客户', tagAttribute: '动态', customerScope: '有购买记录的客户', tagOwner: '营运部' },
    { level1: '客户行为特征', level2: '购买行为', level3: '购买频次', level4: '低频客户', tagName: '低频购买客户', businessRule: '近12个月购买次数<5次的客户', tagAttribute: '动态', customerScope: '有购买记录的客户', tagOwner: '营运部' },
    { level1: '客户行为特征', level2: '购买行为', level3: '购买金额', level4: '高价值客户', tagName: '高价值客户', businessRule: '近12个月累计保费≥10万元的客户', tagAttribute: '动态', customerScope: '有购买记录的客户', tagOwner: '营运部' },
    { level1: '客户行为特征', level2: '购买行为', level3: '购买金额', level4: '中价值客户', tagName: '中价值客户', businessRule: '近12个月累计保费在3-10万元的客户', tagAttribute: '动态', customerScope: '有购买记录的客户', tagOwner: '营运部' },
    { level1: '客户行为特征', level2: '购买行为', level3: '购买金额', level4: '低价值客户', tagName: '低价值客户', businessRule: '近12个月累计保费<3万元的客户', tagAttribute: '动态', customerScope: '有购买记录的客户', tagOwner: '营运部' },
    { level1: '客户价值分层', level2: 'RFM模型', level3: 'R-最近购买', level4: 'R1-最近1个月内', tagName: 'R1客户', businessRule: '最近一次购买在1个月内的客户', tagAttribute: '动态', customerScope: '有购买记录的客户', tagOwner: '数据管理部' },
    { level1: '客户价值分层', level2: 'RFM模型', level3: 'R-最近购买', level4: 'R2-最近3个月内', tagName: 'R2客户', businessRule: '最近一次购买在1-3个月内的客户', tagAttribute: '动态', customerScope: '有购买记录的客户', tagOwner: '数据管理部' },
    { level1: '客户价值分层', level2: 'RFM模型', level3: 'R-最近购买', level4: 'R3-最近6个月内', tagName: 'R3客户', businessRule: '最近一次购买在3-6个月内的客户', tagAttribute: '动态', customerScope: '有购买记录的客户', tagOwner: '数据管理部' },
    { level1: '客户价值分层', level2: 'RFM模型', level3: 'F-购买频率', level4: 'F1-高频（>10次）', tagName: 'F1客户', businessRule: '购买频率高于10次的客户', tagAttribute: '动态', customerScope: '有购买记录的客户', tagOwner: '数据管理部' },
    { level1: '客户价值分层', level2: 'RFM模型', level3: 'F-购买频率', level4: 'F2-中频（5-10次）', tagName: 'F2客户', businessRule: '购买频率在5-10次的客户', tagAttribute: '动态', customerScope: '有购买记录的客户', tagOwner: '数据管理部' },
    { level1: '客户价值分层', level2: 'RFM模型', level3: 'F-购买频率', level4: 'F3-低频（<5次）', tagName: 'F3客户', businessRule: '购买频率低于5次的客户', tagAttribute: '动态', customerScope: '有购买记录的客户', tagOwner: '数据管理部' },
  ];

  // 为每个安全等级生成详细数据
  const generateSecurityLevelData = (level: string): CatalogCategory[] => {
    return [
      {
        id: `${level}-customer`,
        name: '客户数据',
        theme: '客户主题',
        level1: '客户信息',
        level2: '基本信息',
        items: [
          {
            name: '客户基本信息表',
            description: '客户核心属性',
            tableCount: 1,
            fieldCount: 15,
            tables: [
              { system: 'CRM系统', table: 'customer_info', tableCnName: '客户信息表', fields: [
                { name: 'customer_id', cnName: '客户ID', classification: level, displayAttr: '客户标识', dataOwner: '客户管理部' },
                { name: 'customer_name', cnName: '客户名称', classification: level, displayAttr: '客户名称', dataOwner: '客户管理部' },
                { name: 'gender', cnName: '性别', classification: level, displayAttr: '性别', dataOwner: '客户管理部' },
              ]},
            ],
          },
          {
            name: '客户联系方式',
            description: '客户联系信息',
            tableCount: 1,
            fieldCount: 12,
            tables: [
              { system: 'CRM系统', table: 'customer_contact', tableCnName: '客户联系表', fields: [
                { name: 'phone_number', cnName: '电话号码', classification: level, displayAttr: '电话号码', dataOwner: '客户管理部' },
                { name: 'email', cnName: '电子邮件', classification: level, displayAttr: '电子邮件', dataOwner: '客户管理部' },
              ]},
            ],
          },
        ],
      },
      {
        id: `${level}-policy`,
        name: '保单数据',
        theme: '保单主题',
        level1: '保单信息',
        level2: '保单详情',
        items: [
          {
            name: '保单主表',
            description: '保单核心数据',
            tableCount: 1,
            fieldCount: 20,
            tables: [
              { system: '保单系统', table: 'policy_master', tableCnName: '保单主表', fields: [
                { name: 'policy_id', cnName: '保单ID', classification: level, displayAttr: '保单标识', dataOwner: '营运部' },
                { name: 'policy_no', cnName: '保单号', classification: level, displayAttr: '保单号', dataOwner: '营运部' },
              ]},
            ],
          },
          {
            name: '保单详细信息',
            description: '保单详细条款',
            tableCount: 1,
            fieldCount: 18,
            tables: [
              { system: '保单系统', table: 'policy_detail', tableCnName: '保单详情表', fields: [
                { name: 'premium_amount', cnName: '保费金额', classification: level, displayAttr: '保费金额', dataOwner: '营运部' },
                { name: 'coverage_amount', cnName: '保额', classification: level, displayAttr: '保额', dataOwner: '营运部' },
              ]},
            ],
          },
        ],
      },
      {
        id: `${level}-claim`,
        name: '理赔数据',
        theme: '理赔主题',
        level1: '理赔信息',
        level2: '理赔处理',
        items: [
          {
            name: '理赔案件',
            description: '理赔案件信息',
            tableCount: 1,
            fieldCount: 22,
            tables: [
              { system: '理赔系统', table: 'claim_case', tableCnName: '理赔案件表', fields: [
                { name: 'claim_id', cnName: '理赔ID', classification: level, displayAttr: '理赔标识', dataOwner: '营运部' },
                { name: 'claim_amount', cnName: '理赔金额', classification: level, displayAttr: '理赔金额', dataOwner: '营运部' },
              ]},
            ],
          },
        ],
      },
      {
        id: `${level}-financial`,
        name: '财务数据',
        theme: '财务主题',
        level1: '财务信息',
        level2: '财务交易',
        items: [
          {
            name: '财务交易记录',
            description: '财务交易数据',
            tableCount: 1,
            fieldCount: 25,
            tables: [
              { system: '财务系统', table: 'financial_transaction', tableCnName: '财务交易表', fields: [
                { name: 'transaction_id', cnName: '交易ID', classification: level, displayAttr: '交易标识', dataOwner: '财务部' },
                { name: 'transaction_amount', cnName: '交易金额', classification: level, displayAttr: '交易金额', dataOwner: '财务部' },
              ]},
            ],
          },
        ],
      },
    ];
  };

  // 为业务视角生成详细数据
  const generateBusinessData = (category: string): CatalogCategory[] => {
    return [
      {
        id: `${category}-main`,
        name: category,
        theme: category,
        level1: '业务数据',
        level2: category,
        items: [
          {
            name: `${category}主表`,
            description: `${category}的核心数据`,
            tableCount: 2,
            fieldCount: 25,
            tables: [
              { system: 'CRM系统', table: `${category}_main`, tableCnName: `${category}主表`, fields: [
                { name: 'id', cnName: 'ID', classification: '核心数据', displayAttr: '标识', dataOwner: '客户管理部' },
                { name: 'name', cnName: '名称', classification: '敏感数据', displayAttr: '名称', dataOwner: '客户管理部' },
              ]},
            ],
          },
          {
            name: `${category}详情表`,
            description: `${category}的详细信息`,
            tableCount: 1,
            fieldCount: 18,
            tables: [
              { system: 'CRM系统', table: `${category}_detail`, tableCnName: `${category}详情表`, fields: [
                { name: 'detail_id', cnName: '详情ID', classification: '重要数据', displayAttr: '详情标识', dataOwner: '客户管理部' },
                { name: 'description', cnName: '描述', classification: '一般数据', displayAttr: '描述', dataOwner: '客户管理部' },
              ]},
            ],
          },
        ],
      },
    ];
  };

  // 为属主视角生成详细数据
  const generateOwnerData = (owner: string): CatalogCategory[] => {
    return [
      {
        id: `${owner}-dept`,
        name: owner,
        theme: '部门数据',
        level1: '组织架构',
        level2: owner,
        items: [
          {
            name: `${owner}管理数据`,
            description: `${owner}负责的数据资产`,
            tableCount: 3,
            fieldCount: 35,
            tables: [
              { system: '管理系统', table: `${owner}_data`, tableCnName: `${owner}管理数据表`, fields: [
                { name: 'dept_id', cnName: '部门ID', classification: '一般数据', displayAttr: '部门标识', dataOwner: '营运部' },
                { name: 'data_item', cnName: '数据项', classification: '重要数据', displayAttr: '数据项', dataOwner: '营运部' },
              ]},
            ],
          },
          {
            name: `${owner}业务数据`,
            description: `${owner}的业务数据资产`,
            tableCount: 2,
            fieldCount: 28,
            tables: [
              { system: '业务系统', table: `${owner}_business`, tableCnName: `${owner}业务数据表`, fields: [
                { name: 'business_id', cnName: '业务ID', classification: '一般数据', displayAttr: '业务标识', dataOwner: '营运部' },
                { name: 'business_type', cnName: '业务类型', classification: '一般数据', displayAttr: '业务类型', dataOwner: '营运部' },
              ]},
            ],
          },
        ],
      },
    ];
  };

  // 全局搜索处理
  const handleGlobalSearch = () => {
    if (!globalSearch.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const searchTermLower = globalSearch.toLowerCase();
    const results = fieldDatabase.filter(field => {
      let matches = false;
      
      // 根据勾选框决定搜索范围
      if (searchByField && !field.isMetric && field.name.toLowerCase().includes(searchTermLower)) {
        matches = true;
      }
      if (searchByTable && !field.isMetric && field.table.toLowerCase().includes(searchTermLower)) {
        matches = true;
      }
      if (searchByMetric && field.isMetric) {
        // 搜索指标的中文名称或英文名称
        if (field.metricCnName?.toLowerCase().includes(searchTermLower) || 
            field.name.toLowerCase().includes(searchTermLower)) {
          matches = true;
        }
      }
      // searchByTag 暂未实现
      
      return matches;
    });
    
    setSearchResults(results);
    setShowSearchResults(true);
  };

  // 处理点击卡片 - 打开第一层弹窗
  const handleCardClick = (type: string, value: string) => {
    let categories: CatalogCategory[] = [];
    
    if (type === 'security') {
      categories = generateSecurityLevelData(value);
    } else if (type === 'business') {
      categories = generateBusinessData(value);
    } else if (type === 'owner') {
      categories = generateOwnerData(value);
    }
    
    setSelectedCategory({ level: value, categories });
  };

  // 处理点击资产项 - 打开第二层弹窗
  const handleAssetItemClick = (item: AssetItem) => {
    setSelectedAssetItem(item);
  };

  // 切换分类展开/收起状态
  const toggleCategoryExpanded = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  // 处理导出
  const handleExport = () => {
    const exportItems = [];
    if (exportSecurityLevel) exportItems.push('数据安全分级');
    if (exportDataCatalog) exportItems.push('数据资产目录');
    if (exportMetrics) exportItems.push('指标数据资产');
    if (exportTags) exportItems.push('标签数据资产');
    
    if (exportItems.length === 0) {
      alert('请至少选择一项导出内容');
      return;
    }
    
    // 模拟导出
    console.log('导出以下内容：', exportItems);
    alert(`正在导出：${exportItems.join('、')}`);
    setShowExportDialog(false);
  };

  // 处理导入
  const handleImport = () => {
    const importItems = [];
    if (importSecurityLevel) importItems.push('数据安全分级');
    if (importDataCatalog) importItems.push('数据资产目录');
    if (importMetrics) importItems.push('指标数据资产');
    if (importTags) importItems.push('标签数据资产');
    
    if (importItems.length === 0) {
      alert('请至少选择一项导入内容');
      return;
    }
    
    if (!selectedFile) {
      alert('请��择要导入的文件');
      return;
    }
    
    // 模拟导入
    console.log('导入以下内容：', importItems);
    console.log('导入文件：', selectedFile.name);
    alert(`正在导入文件：${selectedFile.name}\n导入内容：${importItems.join('、')}`);
    setShowImportDialog(false);
    setSelectedFile(null);
  };

  // 处理文件选择
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  // 下载模板
  const handleDownloadTemplate = (templateType: string) => {
    console.log('下载模板：', templateType);
    alert(`正在下载${templateType}模板...`);
  };

  return (
    <div className="h-full bg-gray-50 p-8 overflow-auto">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">数据分布</h1>
            <p className="text-gray-600 mt-2">查看企业数据资产的分布情况</p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={() => setShowExportDialog(true)}
              className="bg-[#B8123E] hover:bg-[#9a0f32]"
            >
              <Download className="w-4 h-4 mr-2" />
              导出
            </Button>
            <Button 
              onClick={() => setShowImportDialog(true)}
              className="bg-[#B8123E] hover:bg-[#9a0f32]"
            >
              <Upload className="w-4 h-4 mr-2" />
              导入
            </Button>
          </div>
        </div>

        {/* 全局搜索 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                placeholder="搜索表名、字段名、指标或标签..."
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleGlobalSearch();
                  }
                }}
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">支持多个搜索词，用逗号分隔</p>
              {/* 搜索选项勾选框 */}
              <div className="flex items-center gap-4 mt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={searchByTable}
                    onChange={(e) => setSearchByTable(e.target.checked)}
                    className="w-4 h-4 text-[#B8123E] border-gray-300 rounded focus:ring-[#B8123E]"
                  />
                  <span className="text-sm text-gray-700">搜表</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={searchByField}
                    onChange={(e) => setSearchByField(e.target.checked)}
                    className="w-4 h-4 text-[#B8123E] border-gray-300 rounded focus:ring-[#B8123E]"
                  />
                  <span className="text-sm text-gray-700">搜字段</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={searchByMetric}
                    onChange={(e) => setSearchByMetric(e.target.checked)}
                    className="w-4 h-4 text-[#B8123E] border-gray-300 rounded focus:ring-[#B8123E]"
                  />
                  <span className="text-sm text-gray-700">搜指标</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={searchByTag}
                    onChange={(e) => setSearchByTag(e.target.checked)}
                    className="w-4 h-4 text-[#B8123E] border-gray-300 rounded focus:ring-[#B8123E]"
                  />
                  <span className="text-sm text-gray-700">搜标签</span>
                </label>
              </div>
            </div>
            <Button onClick={handleGlobalSearch} className="bg-[#B8123E] hover:bg-[#9a0f32]">
              <Search className="w-4 h-4 mr-2" />
              搜索
            </Button>
          </div>

          {/* 搜索结果 */}
          {showSearchResults && (
            <div className="mt-4">
              {searchResults.length > 0 ? (
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {searchByMetric && !searchByTable && !searchByField && !searchByTag ? (
                          <>
                            <TableHead className="text-center">主题</TableHead>
                            <TableHead className="text-center">二级分类</TableHead>
                            <TableHead className="text-center">指标Owner</TableHead>
                            <TableHead className="text-center">指标中文名称</TableHead>
                            <TableHead className="text-center">业务口径</TableHead>
                            <TableHead className="text-center">计算公式</TableHead>
                          </>
                        ) : (
                          <>
                            <TableHead>字段名</TableHead>
                            <TableHead>表名</TableHead>
                            <TableHead>系统</TableHead>
                            <TableHead>安全级别</TableHead>
                            <TableHead>业务视角</TableHead>
                            <TableHead>属主视角</TableHead>
                          </>
                        )}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {searchByMetric && !searchByTable && !searchByField && !searchByTag ? (
                        searchResults.map((result, index) => (
                          <TableRow key={index}>
                            <TableCell className="text-center whitespace-normal break-words">{result.theme || '业务分析'}</TableCell>
                            <TableCell className="text-center whitespace-normal break-words">{result.secondaryCategory || '客户指标'}</TableCell>
                            <TableCell className="text-center whitespace-normal break-words">{result.metricOwner || '数据管理部'}</TableCell>
                            <TableCell className="font-medium text-[#B8123E] text-center whitespace-normal break-words">{result.metricCnName || result.name}</TableCell>
                            <TableCell className="text-sm text-center whitespace-normal break-words">{result.businessDefinition || '业务定义描述'}</TableCell>
                            <TableCell className="text-sm font-mono bg-gray-50 text-center whitespace-normal break-words">{result.calculationFormula || 'SUM(amount)'}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        searchResults.map((result, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{result.name}</TableCell>
                            <TableCell>{result.table}</TableCell>
                            <TableCell>{result.system}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={
                                result.securityLevel === '核心数据' ? 'bg-red-50 text-red-700 border-red-300' :
                                result.securityLevel === '重要数据' ? 'bg-orange-50 text-orange-700 border-orange-300' :
                                result.securityLevel === '敏感数据' ? 'bg-blue-50 text-blue-700 border-blue-300' :
                                'bg-green-50 text-green-700 border-green-300'
                              }>
                                {result.securityLevel}
                              </Badge>
                            </TableCell>
                            <TableCell>{result.businessCategory}</TableCell>
                            <TableCell>{result.owner}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">未找到匹配的结果</p>
              )}
            </div>
          )}
        </div>

        {/* 视角切换 */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveView('security')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
              activeView === 'security'
                ? 'bg-[#B8123E] text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Shield className="w-5 h-5" />
            安全视角
          </button>
          <button
            onClick={() => setActiveView('business')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
              activeView === 'business'
                ? 'bg-[#B8123E] text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Building2 className="w-5 h-5" />
            业务视角
          </button>
          <button
            onClick={() => setActiveView('owner')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
              activeView === 'owner'
                ? 'bg-[#B8123E] text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Users className="w-5 h-5" />
            属主视角
          </button>
          <button
            onClick={() => setActiveView('catalog')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
              activeView === 'catalog'
                ? 'bg-[#B8123E] text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Database className="w-5 h-5" />
            数据目录
          </button>
        </div>

        {/* 安全视角 */}
        {activeView === 'security' && (
          <div className="space-y-6">
            {/* 上层：核心数据和重要数据 */}
            <div className="grid grid-cols-2 gap-6">
              {securityData.filter(item => item.position === 'top').map((item, index) => (
                <div
                  key={index}
                  onClick={() => handleCardClick('security', item.level)}
                  className="bg-white rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`${item.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                        <Shield className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{item.level}</h3>
                        <p className="text-sm text-gray-500">{item.systems.join('、')}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-6 h-6 text-gray-400" />
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-4xl font-bold text-[#B8123E]">{item.fieldCount}</p>
                      <p className="text-sm text-gray-600 mt-1">字段数量</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-semibold text-gray-700">{item.percentage}%</p>
                      <p className="text-xs text-gray-500">占比</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 下层：其它一般数据和敏感数据 */}
            <div className="grid grid-cols-2 gap-6">
              {securityData.filter(item => item.position === 'bottom').map((item, index) => (
                <div
                  key={index}
                  onClick={() => handleCardClick('security', item.level)}
                  className="bg-white rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`${item.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                        <Shield className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{item.level}</h3>
                        <p className="text-sm text-gray-500">{item.systems.join('、')}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-6 h-6 text-gray-400" />
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-4xl font-bold text-[#B8123E]">{item.fieldCount}</p>
                      <p className="text-sm text-gray-600 mt-1">字段数量</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-semibold text-gray-700">{item.percentage}%</p>
                      <p className="text-xs text-gray-500">占比</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 业务视角 */}
        {activeView === 'business' && (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            {businessData.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  onClick={() => handleCardClick('business', item.category)}
                  className="bg-white rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`${item.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">{item.category}</h3>
                    </div>
                    <ChevronRight className="w-6 h-6 text-gray-400" />
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-4xl font-bold text-[#B8123E]">{item.fieldCount}</p>
                      <p className="text-sm text-gray-600 mt-1">字段数量</p>
                      <p className="text-xs text-gray-500 mt-2">{item.systems.join('、')}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-semibold text-gray-700">{item.percentage}%</p>
                      <p className="text-xs text-gray-500">占比</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 属主视角 */}
        {activeView === 'owner' && (
          <div className="grid grid-cols-2 gap-6">
            {ownerData.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  onClick={() => handleCardClick('owner', item.owner)}
                  className="bg-white rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`${item.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{item.owner}</h3>
                        <p className="text-sm text-gray-500">{item.systems.join('、')}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-6 h-6 text-gray-400" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-3xl font-bold text-[#B8123E]">{item.fieldCount}</p>
                      <p className="text-sm text-gray-600 mt-1">字段数量</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-gray-700">{item.tableCount}</p>
                      <p className="text-sm text-gray-600 mt-1">数据表</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 数据目录视角 */}
        {activeView === 'catalog' && (
          <div className="grid grid-cols-1 gap-6">
            {catalogData.map((catalog, index) => {
              const Icon = catalog.icon;
              return (
                <div key={index} className="bg-white rounded-lg shadow-lg">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className={`${catalog.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-semibold text-gray-900">{catalog.name}</h2>
                        <p className="text-sm text-gray-600 mt-1">{catalog.description}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {catalog.categories.map((category, catIndex) => (
                        <div
                          key={catIndex}
                          onClick={() => {
                            if (catalog.id === 'basic') {
                              // 基础数据资产使用第一层弹窗（与安全视角一致）
                              setSelectedCategory({ level: catalog.name, categories: catalog.categories });
                            } else if (catalog.id === 'metrics') {
                              // 指标数据资产区分业务经营指标和监管报告指标
                              if (category.id === 'metrics-business') {
                                setShowBusinessMetricsDialog(true);
                              } else if (category.id === 'metrics-report') {
                                setShowReportMetricsDialog(true);
                              }
                            } else if (catalog.id === 'tags' && category.id === 'tags-customer') {
                              setShowCustomerTagsDialog(true);
                            } else {
                              setSelectedCategory({ level: catalog.name, categories: catalog.categories });
                            }
                          }}
                          className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-gray-900">{category.name}</h3>
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{category.theme}</p>
                          <div className="flex items-center gap-4">
                            <div>
                              <p className="text-xl font-bold text-[#B8123E]">
                                {category.items.reduce((sum, item) => sum + item.fieldCount, 0)}
                              </p>
                              <p className="text-xs text-gray-500">字段</p>
                            </div>
                            <div>
                              <p className="text-xl font-bold text-gray-700">
                                {category.items.reduce((sum, item) => sum + item.tableCount, 0)}
                              </p>
                              <p className="text-xs text-gray-500">表</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 第一层弹窗：数据资产目录清单 */}
      <Dialog open={!!selectedCategory} onOpenChange={() => setSelectedCategory(null)}>
        <DialogContent className="w-[80vw] !max-w-[80vw] max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedCategory?.level}</DialogTitle>
            <DialogDescription>
              查看数据资产的完整目录清单
            </DialogDescription>
          </DialogHeader>
          {selectedCategory && (
            <div className="mt-4">
              {/* 搜索区域 */}
              <div className="mb-4 flex gap-3">
                <Select value={level2Filter} onValueChange={setLevel2Filter}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="选择二级分类" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部</SelectItem>
                    {Array.from(new Set(selectedCategory.categories.map(cat => cat.level2))).map((level2, index) => (
                      <SelectItem key={index} value={level2}>{level2}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  placeholder="搜索资产项名称..."
                  value={assetNameFilter}
                  onChange={(e) => setAssetNameFilter(e.target.value)}
                  className="flex-1"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      // 触发搜索（当前已经是实时搜索）
                    }
                  }}
                />
                <Button 
                  className="bg-[#B8123E] hover:bg-[#9a0f32]"
                >
                  <Search className="w-4 h-4 mr-2" />
                  搜索
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setLevel2Filter('');
                    setAssetNameFilter('');
                  }}
                >
                  <X className="w-4 h-4 mr-2" />
                  清除
                </Button>
              </div>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[18%]">主题</TableHead>
                      <TableHead className="w-[18%]">一级分类</TableHead>
                      <TableHead className="w-[18%]">二级分类</TableHead>
                      <TableHead className="w-[40%]">资产项名称</TableHead>
                      <TableHead className="w-[6%]">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedCategory.categories
                      .filter(category => !level2Filter || level2Filter === 'all' || category.level2 === level2Filter)
                      .flatMap((category, categoryIndex) => {
                        const filteredItems = category.items.filter(item => !assetNameFilter || item.name.includes(assetNameFilter));
                        const isExpanded = expandedCategories.has(category.id);
                        
                        const rows = [
                          <TableRow key={`category-${categoryIndex}`}>
                            <TableCell className="font-medium">
                              {category.theme}
                            </TableCell>
                            <TableCell className="font-medium">
                              {category.level1}
                            </TableCell>
                            <TableCell className="font-medium">
                              {category.level2}
                            </TableCell>
                            <TableCell className="text-gray-500 italic">
                              {isExpanded ? `共 ${filteredItems.length} 项资产` : `点击"+"查看，共 ${filteredItems.length} 项数据资产`}
                            </TableCell>
                            <TableCell rowSpan={isExpanded ? filteredItems.length + 1 : 1} className="align-top">
                              <button
                                onClick={() => toggleCategoryExpanded(category.id)}
                                className="p-1 hover:bg-gray-100 rounded transition-colors"
                                title={isExpanded ? '收起' : '展开'}
                              >
                                {isExpanded ? (
                                  <Minus className="w-4 h-4 text-[#B8123E]" />
                                ) : (
                                  <Plus className="w-4 h-4 text-[#B8123E]" />
                                )}
                              </button>
                            </TableCell>
                          </TableRow>
                        ];
                        
                        // 如果展开，添加资产项行
                        if (isExpanded) {
                          filteredItems.forEach((item, itemIndex) => {
                            rows.push(
                              <TableRow key={`${categoryIndex}-${itemIndex}`}>
                                <TableCell colSpan={3}></TableCell>
                                <TableCell>
                                  <button
                                    onClick={() => handleAssetItemClick(item)}
                                    className="text-[#B8123E] hover:text-[#9a0f32] font-medium hover:underline text-left"
                                  >
                                    {item.name}
                                  </button>
                                </TableCell>
                              </TableRow>
                            );
                          });
                        }
                        
                        return rows;
                      })}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 第二层弹窗：库表字段 */}
      <Dialog open={!!selectedAssetItem} onOpenChange={() => setSelectedAssetItem(null)}>
        <DialogContent className="w-[95vw] !max-w-[95vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedAssetItem?.name} - 库表字段详情</DialogTitle>
            <DialogDescription>
              {selectedAssetItem?.description}
            </DialogDescription>
          </DialogHeader>
          {selectedAssetItem && (
            <div className="mt-4">
              <div className="mb-4 grid grid-cols-2 lg:grid-cols-3 gap-3">
                <Input
                  placeholder="筛选系统..."
                  value={filterSystem}
                  onChange={(e) => setFilterSystem(e.target.value)}
                />
                <Input
                  placeholder="筛选表名..."
                  value={filterTable}
                  onChange={(e) => setFilterTable(e.target.value)}
                />
                <Input
                  placeholder="筛选字段..."
                  value={filterField}
                  onChange={(e) => setFilterField(e.target.value)}
                />
                <Input
                  placeholder="筛选中文名称..."
                  value={filterCnName}
                  onChange={(e) => setFilterCnName(e.target.value)}
                />
                <Input
                  placeholder="筛选数据所有者..."
                  value={filterOwner}
                  onChange={(e) => setFilterOwner(e.target.value)}
                />
                <div className="flex gap-2">
                  <Button className="bg-[#B8123E] hover:bg-[#9a0f32] flex-1">
                    <Search className="w-4 h-4 mr-2" />
                    搜索
                  </Button>
                  {(filterSystem || filterTable || filterField || filterCnName || filterOwner) && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setFilterSystem('');
                        setFilterTable('');
                        setFilterField('');
                        setFilterCnName('');
                        setFilterOwner('');
                      }}
                    >
                      <X className="w-4 h-4 mr-2" />
                      清除
                    </Button>
                  )}
                </div>
              </div>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>系统名称</TableHead>
                      <TableHead>表名</TableHead>
                      <TableHead>表中文名</TableHead>
                      <TableHead>字段名</TableHead>
                      <TableHead>字段中文名</TableHead>
                      <TableHead>数据分级</TableHead>
                      <TableHead>展示属性</TableHead>
                      <TableHead>数据属主</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedAssetItem.tables
                      .filter(table =>
                        (!filterSystem || table.system.includes(filterSystem)) &&
                        (!filterTable || table.table.includes(filterTable) || table.tableCnName.includes(filterTable))
                      )
                      .map((table, tableIndex) =>
                        table.fields
                          .filter(field => 
                            (!filterField || field.name.includes(filterField)) &&
                            (!filterCnName || field.cnName.includes(filterCnName)) &&
                            (!filterOwner || field.dataOwner.includes(filterOwner))
                          )
                          .map((field, fieldIndex) => (
                            <TableRow key={`${tableIndex}-${fieldIndex}`}>
                              <TableCell>{fieldIndex === 0 ? table.system : ''}</TableCell>
                              <TableCell>{fieldIndex === 0 ? table.table : ''}</TableCell>
                              <TableCell>{fieldIndex === 0 ? table.tableCnName : ''}</TableCell>
                              <TableCell className="font-medium">{field.name}</TableCell>
                              <TableCell>{field.cnName}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className={
                                  field.classification === '核心数据' ? 'bg-red-50 text-red-700 border-red-300' :
                                  field.classification === '重要数据' ? 'bg-orange-50 text-orange-700 border-orange-300' :
                                  field.classification === '敏感数据' ? 'bg-blue-50 text-blue-700 border-blue-300' :
                                  'bg-green-50 text-green-700 border-green-300'
                                }>
                                  {field.classification}
                                </Badge>
                              </TableCell>
                              <TableCell>{field.displayAttr}</TableCell>
                              <TableCell>{field.dataOwner}</TableCell>
                            </TableRow>
                          ))
                      )}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 业务经营指标弹窗 */}
      <Dialog open={showBusinessMetricsDialog} onOpenChange={setShowBusinessMetricsDialog}>
        <DialogContent className="w-[85vw] !max-w-[85vw] max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-2xl">指标数据资产 - 业务经营指��</DialogTitle>
            <DialogDescription>
              查看业务经营指标的详细信息
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex-shrink-0">
            {/* 筛选区域 - 固定不滚动 */}
            <div className="mb-4 flex gap-3">
              <Input
                placeholder="筛选指标名称..."
                value={filterMetricName}
                onChange={(e) => setFilterMetricName(e.target.value)}
                className="flex-1"
              />
              <Input
                placeholder="筛选指标Owner..."
                value={filterMetricOwner}
                onChange={(e) => setFilterMetricOwner(e.target.value)}
                className="flex-1"
              />
              <Button 
                className="bg-[#B8123E] hover:bg-[#9a0f32]"
              >
                <Search className="w-4 h-4 mr-2" />
                搜索
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  setFilterMetricName('');
                  setFilterMetricOwner('');
                }}
              >
                <X className="w-4 h-4 mr-2" />
                清除
              </Button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[12%]">主题</TableHead>
                    <TableHead className="w-[12%]">二级分��</TableHead>
                    <TableHead className="w-[10%]">指标Owner</TableHead>
                    <TableHead className="w-[15%]">指标中文名称</TableHead>
                    <TableHead className="w-[20%]">业务口径</TableHead>
                    <TableHead className="w-[23%]">计算公式</TableHead>
                    <TableHead className="w-[8%]">维度</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {basicMetricsData
                    .filter(item => 
                      (!filterMetricName || item.metricCnName.includes(filterMetricName)) &&
                      (!filterMetricOwner || item.metricOwner.includes(filterMetricOwner))
                    )
                    .map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.theme}</TableCell>
                        <TableCell>{item.secondaryCategory}</TableCell>
                        <TableCell>{item.metricOwner}</TableCell>
                        <TableCell className="font-medium text-[#B8123E]">{item.metricCnName}</TableCell>
                        <TableCell className="text-sm">{item.businessDefinition}</TableCell>
                        <TableCell className="text-sm font-mono bg-gray-50">{item.calculationFormula}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{item.dimension}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 监管报告指标弹窗 */}
      <Dialog open={showReportMetricsDialog} onOpenChange={setShowReportMetricsDialog}>
        <DialogContent className="w-[90vw] !max-w-[90vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">指标数据资产 - 监管报告指标</DialogTitle>
            <DialogDescription>
              查看监管报告指标的详细信息
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            {/* 筛选区域 */}
            <div className="mb-4 grid grid-cols-2 lg:grid-cols-4 gap-3">
              <Input
                placeholder="筛选指标名称..."
                value={filterMetricName}
                onChange={(e) => setFilterMetricName(e.target.value)}
              />
              <Input
                placeholder="筛选报告名称..."
                value={filterReportName}
                onChange={(e) => setFilterReportName(e.target.value)}
              />
              <Input
                placeholder="筛选报告Owner..."
                value={filterReportOwner}
                onChange={(e) => setFilterReportOwner(e.target.value)}
              />
              <div className="flex gap-2">
                <Input
                  placeholder="筛选填报人..."
                  value={filterSubmitter}
                  onChange={(e) => setFilterSubmitter(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  variant="outline"
                  onClick={() => {
                    setFilterMetricName('');
                    setFilterReportName('');
                    setFilterReportOwner('');
                    setFilterSubmitter('');
                  }}
                >
                  <X className="w-4 h-4 mr-2" />
                  清除
                </Button>
              </div>
            </div>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[10%]">报告名称</TableHead>
                    <TableHead className="w-[10%]">报告Owner</TableHead>
                    <TableHead className="w-[12%]">指标中文名</TableHead>
                    <TableHead className="w-[8%]">填报人</TableHead>
                    <TableHead className="w-[18%]">外部口径</TableHead>
                    <TableHead className="w-[15%]">公司业务口径</TableHead>
                    <TableHead className="w-[20%]">计算公式</TableHead>
                    <TableHead className="w-[7%]">维度</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tagMetricsData
                    .filter(item => 
                      (!filterMetricName || item.metricCnName.includes(filterMetricName)) &&
                      (!filterReportName || item.reportName.includes(filterReportName)) &&
                      (!filterReportOwner || item.reportOwner.includes(filterReportOwner)) &&
                      (!filterSubmitter || item.submitter.includes(filterSubmitter))
                    )
                    .map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.reportName}</TableCell>
                        <TableCell>{item.reportOwner}</TableCell>
                        <TableCell className="font-medium text-[#B8123E]">{item.metricCnName}</TableCell>
                        <TableCell>{item.submitter}</TableCell>
                        <TableCell className="text-sm">{item.externalDefinition}</TableCell>
                        <TableCell className="text-sm">{item.companyBusinessDefinition}</TableCell>
                        <TableCell className="text-sm font-mono bg-gray-50">{item.calculationFormula}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{item.dimension}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 客户标签弹窗 */}
      <Dialog open={showCustomerTagsDialog} onOpenChange={setShowCustomerTagsDialog}>
        <DialogContent className="w-[75vw] !max-w-[75vw] max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-2xl">客户标签 - 目录清单</DialogTitle>
            <DialogDescription>
              查看客户标签的分类目录
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex-shrink-0">
            {/* 筛选区域 - 固定不滚动 */}
            <div className="mb-4 flex gap-3">
              <Input
                placeholder="筛选标签名称..."
                value={filterTagName}
                onChange={(e) => setFilterTagName(e.target.value)}
                className="flex-1"
              />
              <Input
                placeholder="筛选二级目录..."
                value={filterLevel2}
                onChange={(e) => setFilterLevel2(e.target.value)}
                className="flex-1"
              />
              <Button 
                className="bg-[#B8123E] hover:bg-[#9a0f32]"
              >
                <Search className="w-4 h-4 mr-2" />
                搜索
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  setFilterTagName('');
                  setFilterLevel2('');
                }}
              >
                <X className="w-4 h-4 mr-2" />
                清除
              </Button>
            </div>
          </div>
          <div 
            className="flex-1 border rounded-lg overflow-auto" 
            style={{ 
              scrollbarColor: 'rgba(156, 163, 175, 0.5) transparent',
              scrollbarWidth: 'thin'
            }}
          >
            <Table className="min-w-full">
              <TableHeader>
                  <TableRow>
                    <TableHead className="w-[10%]">一级目录</TableHead>
                    <TableHead className="w-[10%]">二级目录</TableHead>
                    <TableHead className="w-[10%]">三级目录</TableHead>
                    <TableHead className="w-[10%]">四级目录</TableHead>
                    <TableHead className="w-[12%]">标签名称</TableHead>
                    <TableHead className="w-[20%]">业务规则</TableHead>
                    <TableHead className="w-[8%]">标签属性</TableHead>
                    <TableHead className="w-[12%]">客户范围</TableHead>
                    <TableHead className="w-[8%]">标签属主</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customerTagsData
                    .filter(item => 
                      (!filterTagName || item.tagName.includes(filterTagName)) &&
                      (!filterLevel2 || item.level2.includes(filterLevel2))
                    )
                    .map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.level1}</TableCell>
                        <TableCell className="font-medium">{item.level2}</TableCell>
                        <TableCell className="text-[#B8123E]">{item.level3}</TableCell>
                        <TableCell>{item.level4}</TableCell>
                        <TableCell className="font-medium">{item.tagName}</TableCell>
                        <TableCell className="text-sm">{item.businessRule}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={item.tagAttribute === '静态' ? 'bg-blue-50 text-blue-700 border-blue-300' : 'bg-green-50 text-green-700 border-green-300'}>
                            {item.tagAttribute}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">{item.customerScope}</TableCell>
                        <TableCell>{item.tagOwner}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
          </div>
        </DialogContent>
      </Dialog>

      {/* 导出选项弹窗 */}
      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">选择导出内容</DialogTitle>
            <DialogDescription>
              请勾选需要导出的数据类型
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <input
                type="checkbox"
                checked={exportSecurityLevel}
                onChange={(e) => setExportSecurityLevel(e.target.checked)}
                className="w-5 h-5 text-[#B8123E] border-gray-300 rounded focus:ring-[#B8123E]"
              />
              <div>
                <div className="font-medium text-gray-900">数据安全分级</div>
                <div className="text-sm text-gray-500">导出核心数据、重要数据、敏感数据等分级信息</div>
              </div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <input
                type="checkbox"
                checked={exportDataCatalog}
                onChange={(e) => setExportDataCatalog(e.target.checked)}
                className="w-5 h-5 text-[#B8123E] border-gray-300 rounded focus:ring-[#B8123E]"
              />
              <div>
                <div className="font-medium text-gray-900">数据资产目录</div>
                <div className="text-sm text-gray-500">导出基础数据资产的目录信息</div>
              </div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <input
                type="checkbox"
                checked={exportMetrics}
                onChange={(e) => setExportMetrics(e.target.checked)}
                className="w-5 h-5 text-[#B8123E] border-gray-300 rounded focus:ring-[#B8123E]"
              />
              <div>
                <div className="font-medium text-gray-900">指标数据资产</div>
                <div className="text-sm text-gray-500">导出业务经营指标和监管报告指标数据</div>
              </div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <input
                type="checkbox"
                checked={exportTags}
                onChange={(e) => setExportTags(e.target.checked)}
                className="w-5 h-5 text-[#B8123E] border-gray-300 rounded focus:ring-[#B8123E]"
              />
              <div>
                <div className="font-medium text-gray-900">标签数据资产</div>
                <div className="text-sm text-gray-500">导出客户标签体系数据</div>
              </div>
            </label>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setShowExportDialog(false)}
            >
              取消
            </Button>
            <Button
              onClick={handleExport}
              className="bg-[#B8123E] hover:bg-[#9a0f32]"
            >
              <Download className="w-4 h-4 mr-2" />
              确认导出
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 导入选项弹窗 */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="pb-3">
            <DialogTitle className="text-lg">选择导入内容</DialogTitle>
            <DialogDescription className="text-xs">
              请勾选需要导入的数据类型
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <div className="flex items-center justify-between p-2 rounded hover:bg-gray-50 transition-colors">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={importSecurityLevel}
                  onChange={(e) => setImportSecurityLevel(e.target.checked)}
                  className="w-4 h-4 text-[#B8123E] border-gray-300 rounded focus:ring-[#B8123E]"
                />
                <span className="text-sm font-medium text-gray-900">数据安全分级</span>
              </label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDownloadTemplate('数据安全分级')}
                className="h-7 text-xs text-[#B8123E] hover:text-[#9a0f32] hover:bg-[#B8123E]/10"
              >
                <Download className="w-3 h-3 mr-1" />
                下载模板
              </Button>
            </div>
            <div className="flex items-center justify-between p-2 rounded hover:bg-gray-50 transition-colors">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={importDataCatalog}
                  onChange={(e) => setImportDataCatalog(e.target.checked)}
                  className="w-4 h-4 text-[#B8123E] border-gray-300 rounded focus:ring-[#B8123E]"
                />
                <span className="text-sm font-medium text-gray-900">数据资产目录</span>
              </label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDownloadTemplate('数据资产目录')}
                className="h-7 text-xs text-[#B8123E] hover:text-[#9a0f32] hover:bg-[#B8123E]/10"
              >
                <Download className="w-3 h-3 mr-1" />
                下载模板
              </Button>
            </div>
            <div className="flex items-center justify-between p-2 rounded hover:bg-gray-50 transition-colors">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={importMetrics}
                  onChange={(e) => setImportMetrics(e.target.checked)}
                  className="w-4 h-4 text-[#B8123E] border-gray-300 rounded focus:ring-[#B8123E]"
                />
                <span className="text-sm font-medium text-gray-900">指标数据资产</span>
              </label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDownloadTemplate('指标数据资产')}
                className="h-7 text-xs text-[#B8123E] hover:text-[#9a0f32] hover:bg-[#B8123E]/10"
              >
                <Download className="w-3 h-3 mr-1" />
                下载模板
              </Button>
            </div>
            <div className="flex items-center justify-between p-2 rounded hover:bg-gray-50 transition-colors">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={importTags}
                  onChange={(e) => setImportTags(e.target.checked)}
                  className="w-4 h-4 text-[#B8123E] border-gray-300 rounded focus:ring-[#B8123E]"
                />
                <span className="text-sm font-medium text-gray-900">标签数据资产</span>
              </label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDownloadTemplate('标签数据资产')}
                className="h-7 text-xs text-[#B8123E] hover:text-[#9a0f32] hover:bg-[#B8123E]/10"
              >
                <Download className="w-3 h-3 mr-1" />
                下载模板
              </Button>
            </div>
          </div>
          
          {/* 文件选择区域 */}
          <div className="pt-2 border-t">
            <label className="block mb-1.5 text-sm font-medium text-gray-900">
              选择本地文件
            </label>
            <div className="flex items-center gap-2">
              <input
                type="file"
                onChange={handleFileChange}
                accept=".xlsx,.xls,.csv"
                className="hidden"
                id="import-file-input"
              />
              <label
                htmlFor="import-file-input"
                className="flex-1 flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <Upload className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  {selectedFile ? selectedFile.name : '点击选择文件...'}
                </span>
              </label>
              {selectedFile && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedFile(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              支持格式：Excel (.xlsx, .xls) 或 CSV (.csv)
            </p>
          </div>
          
          <div className="flex justify-end gap-2 pt-3 border-t">
            <Button
              variant="outline"
              onClick={() => {
                setShowImportDialog(false);
                setSelectedFile(null);
              }}
            >
              取消
            </Button>
            <Button
              onClick={handleImport}
              className="bg-[#B8123E] hover:bg-[#9a0f32]"
            >
              <Upload className="w-4 h-4 mr-2" />
              确认导入
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}