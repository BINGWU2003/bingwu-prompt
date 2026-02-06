# VXE-Table 开发提示词文档

本文档是基于 vxe-table v4.x 和 Element Plus 的通用开发规范和模板，适用于各种列表页面、主从表格、表单弹窗等场景的快速开发。

## 核心原则

### 1. 组件选择规范

- 表格组件: 使用 `vxe-grid` (高性能 Vue 表格组件)
- 消息提示: 使用 Element Plus (`ElMessage`, `ElMessageBox`)，不要使用 VXETable 的消息方法(已弃用)
- 表单组件: Element Plus (el-form, el-input, el-select, el-date-picker 等)
- 按钮图标: Element Plus Icons (`@element-plus/icons-vue`)

### 2. 事件处理规范

- 正确做法: 在模板中使用事件绑定 `@event-name`
  ```vue
  <vxe-grid @form-submit="handleSearch" @form-reset="handleReset" @cell-click="handleCellClick" />
  ```
- 错误做法: 在 gridOptions 对象中配置事件处理器(会导致事件不触发)

### 3. 数据类型配置

- 数字输入: 对于最小值、最大值等数字字段，必须配置 `type: 'number'`
  ```javascript
  editRender: { name: 'input', props: { type: 'number' } }
  ```

### 4. API 集成准备

- 所有数据请求位置添加 TODO 注释
- 保留模拟数据并标注"正式环境请删除"
- API 导入语句添加注释便于启用

---

## 页面结构模板

### 基础父子表格架构

```vue
<template>
  <basic-container>
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-title">
        <h2>页面标题</h2>
        <p class="header-desc">页面描述</p>
      </div>
      <div class="header-actions">
        <el-button type="primary" :icon="Plus" @click="handleAdd">新增</el-button>
        <el-button type="success" :icon="Upload" @click="handleBatch">批量操作</el-button>
      </div>
    </div>

    <!-- 主表格 -->
    <vxe-grid
      ref="gridRef"
      v-bind="gridOptions"
      @form-submit="handleSearch"
      @form-reset="handleReset"
      @cell-click="handleCellClick"
    >
      <template #operation="{ row }">
        <vxe-button type="text" status="primary" @click="handleEdit(row)">编辑</vxe-button>
        <vxe-button type="text" status="danger" @click="handleDelete(row)">删除</vxe-button>
      </template>
    </vxe-grid>

    <!-- 子表格(点击主表格行时显示) -->
    <div v-if="selectedRow" class="detail-section">
      <div class="detail-header">
        <h3>明细信息</h3>
        <div class="detail-actions">
          <el-button type="danger" @click="handleCloseDetail">取消</el-button>
          <el-button type="primary" :icon="Plus" @click="handleAddDetail">新增明细</el-button>
          <el-button type="primary" @click="handleSaveDetail">保存</el-button>
        </div>
      </div>
      <vxe-grid ref="detailGridRef" v-bind="detailGridOptions">
        <template #operation="{ row }">
          <vxe-button type="text" status="danger" @click="handleDeleteDetail(row)">删除</vxe-button>
        </template>
      </vxe-grid>
    </div>

    <!-- 新增/编辑弹窗 -->
    <add-dialog ref="dialogRef" @success="handleDialogSuccess" />
  </basic-container>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Upload } from '@element-plus/icons-vue'
import basicContainer from '@/components/basic-container/main.vue'
import addDialog from './components/add-dialog.vue'
// TODO: 取消注释以启用API调用
// import * as api from '@/api/xxx/xxx';

const gridRef = ref()
const detailGridRef = ref()
const selectedRow = ref(null)
const dialogRef = ref()
</script>
```

---

## GridOptions 配置详解

### 完整配置示例

```javascript
const gridOptions = reactive({
  border: true,
  height: '400px', // 或固定数字如 400

  // 行配置
  rowConfig: {
    keyField: 'id',
    isHover: true,
    isCurrent: true // 启用点击高亮
  },

  // 列配置
  columnConfig: {
    resizable: true // 允许调整列宽
  },

  // 工具栏(可选)
  toolbarConfig: {},

  // 分页配置
  pagerConfig: {
    currentPage: 1,
    pageSize: 10,
    pageSizes: [10, 20, 50, 100],
    layouts: ['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total'],
    total: 0
  },

  // 数据代理配置(推荐)
  proxyConfig: {
    ajax: {
      query: async ({ page, form }) => {
        // TODO: 启用API调用
        // const res = await api.getPage(page.currentPage, page.pageSize, form);
        // return {
        //   page: { total: res.data.total },
        //   result: res.data.records
        // };

        // 模拟数据 - 正式环境请删除
        return Promise.resolve({
          page: { total: mockData.length },
          result: mockData
        })
      }
    }
  },

  // 搜索表单配置
  formConfig: {
    titleWidth: 80,
    titleAlign: 'right',
    data: {},
    items: [
      {
        field: 'keyword',
        title: '关键字',
        span: 6,
        itemRender: {
          name: 'VxeInput',
          props: { placeholder: '请输入关键字', clearable: true }
        }
      },
      {
        field: 'status',
        title: '状态',
        span: 6,
        itemRender: {
          name: 'VxeSelect',
          props: {
            placeholder: '全部状态',
            clearable: true,
            options: [
              { label: '全部', value: '' },
              { label: '启用', value: '1' },
              { label: '禁用', value: '0' }
            ]
          }
        }
      },
      {
        span: 12,
        align: 'center',
        itemRender: {
          name: '$buttons', // 固定写法
          children: [
            { props: { type: 'submit', content: '查询', status: 'primary' } },
            { props: { type: 'reset', content: '重置' } }
          ]
        }
      }
    ]
  },

  // 列定义
  columns: [
    { type: 'checkbox', width: 60, fixed: 'left' },
    { field: 'name', title: '名称', minWidth: 180 },
    { field: 'code', title: '编码', width: 120 },
    { field: 'status', title: '状态', width: 100 },
    { field: 'createTime', title: '创建时间', width: 150 },
    {
      title: '操作',
      width: 200,
      fixed: 'right',
      slots: { default: 'operation' } // 自定义插槽
    }
  ]
})
```

### 子表格配置(可编辑表格)

```javascript
const detailGridOptions = reactive({
  border: true,
  height: 300,
  columns: [
    { field: 'code', title: '编码', width: 150 },
    {
      field: 'name',
      title: '名称',
      minWidth: 150,
      editRender: { name: 'input', props: { placeholder: '请输入名称' } }
    },
    {
      field: 'minValue',
      title: '最小值',
      width: 120,
      align: 'right',
      editRender: { name: 'input', props: { type: 'number', placeholder: '可选' } }
    },
    {
      field: 'maxValue',
      title: '最大值',
      width: 120,
      align: 'right',
      editRender: { name: 'input', props: { type: 'number', placeholder: '可选' } }
    },
    {
      title: '操作',
      width: 100,
      slots: { default: 'operation' }
    }
  ],
  data: [], // 子表格数据
  editConfig: {
    trigger: 'click', // 点击单元格编辑
    mode: 'cell' // 单元格编辑模式
  }
})
```

---

## 常用事件处理

### 1. 点击行显示子表格

```javascript
async function handleCellClick({ row, column }) {
  // 排除操作列
  if (column.property !== 'operation') {
    selectedRow.value = row
    gridRef.value?.setCurrentRow(row) // 高亮当前行
    await loadDetailData(row.id)
  }
}

function handleCloseDetail() {
  selectedRow.value = null
  gridRef.value?.clearCurrentRow() // 清除高亮
}
```

### 2. 加载子表格数据

```javascript
async function loadDetailData(parentId) {
  try {
    // TODO: 启用API调用
    // const res = await api.getDetails(parentId);
    // detailGridOptions.data = res.data || [];

    // 模拟数据
    const parent = mockData.find(item => item.id === parentId)
    detailGridOptions.data = parent?.details || []
  } catch (error) {
    console.error('加载明细失败:', error)
    detailGridOptions.data = []
  }
}
```

### 3. 保存子表格数据

```javascript
async function handleSaveDetail() {
  try {
    // TODO: 启用API调用
    // await api.saveDetails(selectedRow.value.id, detailGridOptions.data);

    // 模拟保存
    if (selectedRow.value) {
      selectedRow.value.details = [...detailGridOptions.data]
    }

    ElMessage.success('保存成功')
    handleCloseDetail()
  } catch (error) {
    console.error('保存失败:', error)
  }
}
```

### 4. 搜索和重置

```javascript
function handleSearch({ data }) {
  console.log('搜索条件:', data)
  gridRef.value?.commitProxy('query') // 触发代理查询
}

function handleReset() {
  gridRef.value?.commitProxy('query')
}
```

### 5. 删除操作

```javascript
async function handleDelete(row) {
  try {
    await ElMessageBox.confirm('确定要删除吗?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    // TODO: 启用API调用
    // await api.remove(row.id);

    // 模拟删除
    const index = mockData.findIndex(item => item.id === row.id)
    if (index > -1) {
      mockData.splice(index, 1)
    }

    ElMessage.success('删除成功')
    gridRef.value?.commitProxy('query')
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
    }
  }
}
```

---

## 弹窗组件模板 (add-dialog.vue)

### 完整弹窗结构

```vue
<template>
  <el-dialog
    v-model="dialogVisible"
    title="新增/编辑"
    width="800px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <!-- 表单区域 -->
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="100px">
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="字段1" prop="field1">
            <el-input v-model="formData.field1" placeholder="请输入" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="字段2" prop="field2">
            <el-select v-model="formData.field2" placeholder="请选择" style="width: 100%">
              <el-option label="选项1" value="1" />
              <el-option label="选项2" value="2" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="排序" prop="sequence">
            <el-input-number v-model="formData.sequence" :min="1" style="width: 100%" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="日期" prop="date">
            <el-date-picker
              v-model="formData.date"
              type="date"
              placeholder="年/月/日"
              value-format="YYYY-MM-DD"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="备注" prop="remarks">
            <el-input
              v-model="formData.remarks"
              type="textarea"
              :rows="3"
              placeholder="请输入备注"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <!-- 子表格区域(如果需要) -->
    <div class="section-title">
      <span>明细信息</span>
      <el-button type="primary" :icon="Plus" @click="handleAddRow">新增行</el-button>
    </div>
    <vxe-grid ref="gridRef" v-bind="gridOptions">
      <template #operation="{ row }">
        <vxe-button type="text" status="danger" @click="handleDeleteRow(row)">删除</vxe-button>
      </template>
    </vxe-grid>
    <div class="tip-text">提示: 最小值和最大值至少填一项</div>

    <!-- 底部按钮 -->
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

const emit = defineEmits(['success'])

const dialogVisible = ref(false)
const formRef = ref()
const gridRef = ref()

const formData = reactive({
  field1: '',
  field2: '',
  sequence: 1,
  date: '',
  remarks: ''
})

const rules = {
  field1: [{ required: true, message: '请输入字段1', trigger: 'blur' }],
  field2: [{ required: true, message: '请选择字段2', trigger: 'change' }]
}

const tableData = ref([])

const gridOptions = reactive({
  border: true,
  height: 250,
  columns: [
    {
      field: 'code',
      title: '编码',
      width: 150,
      editRender: { name: 'input', props: { placeholder: '请输入' } }
    },
    {
      field: 'name',
      title: '名称',
      minWidth: 150,
      editRender: { name: 'input', props: { placeholder: '请输入' } }
    },
    {
      field: 'minValue',
      title: '最小值',
      width: 120,
      align: 'right',
      editRender: { name: 'input', props: { type: 'number', placeholder: '' } }
    },
    {
      field: 'maxValue',
      title: '最大值',
      width: 120,
      align: 'right',
      editRender: { name: 'input', props: { type: 'number', placeholder: '' } }
    },
    {
      title: '操作',
      width: 100,
      slots: { default: 'operation' }
    }
  ],
  data: tableData,
  editConfig: {
    trigger: 'click',
    mode: 'cell'
  }
})

// 打开弹窗
const open = (row = null) => {
  dialogVisible.value = true
  if (row) {
    // 编辑模式
    Object.assign(formData, row)
    tableData.value = row.details ? [...row.details] : []
  } else {
    // 新增模式
    resetForm()
  }
}

// 重置表单
const resetForm = () => {
  formData.field1 = ''
  formData.field2 = ''
  formData.sequence = 1
  formData.date = ''
  formData.remarks = ''
  tableData.value = []
  formRef.value?.clearValidate()
}

// 关闭弹窗
const handleClose = () => {
  dialogVisible.value = false
  resetForm()
}

// 保存
const handleSave = async () => {
  try {
    await formRef.value?.validate()

    // 自定义验证
    if (tableData.value.length === 0) {
      ElMessage.warning('请至少添加一条明细')
      return
    }

    // TODO: API 调用
    // await api.save({ ...formData, details: tableData.value });

    ElMessage.success('保存成功')
    emit('success')
    handleClose()
  } catch (error) {
    if (error !== false) {
      console.error('保存失败:', error)
    }
  }
}

defineExpose({ open })
</script>

<style lang="scss" scoped>
.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.tip-text {
  margin-top: 8px;
  font-size: 12px;
  color: #909399;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

:deep(.el-dialog__body) {
  padding: 20px;
}
</style>
```

---

## API 文件模板

### 创建 API 文件 (src/api/xxx/xxx.js)

```javascript
import request from '@/axios'
import { server as path } from '@/config/env'

// 分页查询
export const getPage = (current, size, params) => {
  return request({
    url: `/api/${path}/xxx/page`,
    method: 'get',
    params: { ...params, current, size }
  })
}

// 获取详情
export const getDetail = id => {
  return request({
    url: `/api/${path}/xxx/detail`,
    method: 'get',
    params: { id }
  })
}

// 新增
export const create = data => {
  return request({
    url: `/api/${path}/xxx/create`,
    method: 'post',
    data
  })
}

// 更新
export const update = data => {
  return request({
    url: `/api/${path}/xxx/update`,
    method: 'post',
    data
  })
}

// 删除
export const remove = ids => {
  return request({
    url: `/api/${path}/xxx/remove`,
    method: 'post',
    params: { ids }
  })
}

// 获取子表数据
export const getDetails = parentId => {
  return request({
    url: `/api/${path}/xxx/details`,
    method: 'get',
    params: { parentId }
  })
}

// 保存子表数据
export const saveDetails = (parentId, details) => {
  return request({
    url: `/api/${path}/xxx/details/save`,
    method: 'post',
    data: { parentId, details }
  })
}
```

---

## 常见问题和解决方案

### 1. 事件不触发

错误: 在 gridOptions 中配置事件

```javascript
gridOptions: {
  toolbarButtonClickEvent: () => {} // 错误
}
```

正确: 在模板中绑定事件

```vue
<vxe-grid @toolbar-button-click="handleClick" />
```

### 2. 消息弹窗报错

错误: 使用 VXETable.modal

```javascript
import { VXETable } from 'vxe-table'
VXETable.modal.message({ content: '提示' }) // VXETable 已弃用
```

正确: 使用 Element Plus

```javascript
import { ElMessage, ElMessageBox } from 'element-plus'
ElMessage.success('操作成功')
ElMessageBox.confirm('确定删除吗?', '提示')
```

### 3. 数字输入框显示文本

错误: 未指定 type

```javascript
editRender: {
  name: 'input'
}
```

正确: 指定 type="number"

```javascript
editRender: { name: 'input', props: { type: 'number' } }
```

### 4. 输入框宽度不对

错误: 只使用 class

```vue
<el-input-number class="full-width" />
```

正确: 使用内联样式

```vue
<el-input-number style="width: 100%" />
<el-date-picker style="width: 100%" />
```

### 5. 刷新按钮报错

如果点击刷新按钮报错 `proxy-config.ajax.query 不存在`，需要在 proxyConfig 中添加 query 方法:

```javascript
proxyConfig: {
  ajax: {
    query: async ({ page, form }) => {
      // 返回数据
      return { page: { total: 0 }, result: [] };
    },
  },
},
```

---

## 快速开发检查清单

### 开发前

- [ ] 确认使用 vxe-grid 组件
- [ ] 确认使用 Element Plus 消息组件
- [ ] 准备好 API 接口文档

### 开发中

- [ ] 主表格配置: border, height, rowConfig, columns
- [ ] 分页配置: pagerConfig
- [ ] 搜索表单: formConfig, 使用 `$buttons` 渲染查询按钮
- [ ] 数据代理: proxyConfig.ajax.query
- [ ] 事件绑定: 在模板中使用 @event-name
- [ ] 操作列: 使用插槽 `<template #operation>`
- [ ] 行高亮: rowConfig.isCurrent + setCurrentRow()
- [ ] 子表格: editConfig 配置单元格编辑
- [ ] 数字字段: editRender 添加 `type: 'number'`
- [ ] 弹窗表单: validateRules + 表单验证
- [ ] 弹窗表格: vxe-grid 配置
- [ ] 宽度适配: 输入框、日期选择器添加 `style="width: 100%"`

### API 集成

- [ ] 创建 API 文件 `src/api/xxx/xxx.js`
- [ ] 在组件中注释导入 API: `// import * as api from '@/api/xxx/xxx'`
- [ ] 所有 API 调用位置添加 TODO 注释
- [ ] 保留模拟数据并标注"正式环境请删除"
- [ ] 测试通过后启用 API 调用

### 样式优化

- [ ] 页面头部样式
- [ ] 子表格明细区域样式
- [ ] 弹窗内容样式
- [ ] 响应式布局测试

---

## 使用场景示例

### 场景1: 简单列表页 (只有主表格)

- 使用 vxe-grid 主表格 + 搜索表单 + 分页
- 操作: 新增、编辑、删除
- 弹窗: 独立的新增/编辑表单组件

### 场景2: 主从表格页面

- 点击主表格行, 下方显示子表格(详情/明细)
- 子表格支持可编辑(单元格编辑模式)
- 操作: 主表 CRUD + 子表 CRUD

### 场景3: 复杂表单弹窗

- 表单区域: 基础信息输入
- 表格区域: 可编辑的明细列表
- 验证: 表单验证 + 表格数据验证

### 场景4: 树形表格

- 使用 treeConfig 配置
- 支持展开/折叠、懒加载
- 适用于: 组织架构、分类管理等

---

## 扩展配置参考

### 1. 树形表格配置

```javascript
treeConfig: {
  lazy: true,
  children: 'children',
  hasChild: 'hasChildren',
  loadMethod: async ({ row }) => {
    const res = await api.getChildren(row.id);
    return res.data;
  }
}
```

### 2. 单元格样式配置

```javascript
columns: [
  {
    field: 'status',
    title: '状态',
    cellRender: {
      name: 'VxeSwitch',
      props: { openLabel: '启用', closeLabel: '禁用' }
    }
  }
]
```

### 3. 合并单元格

```javascript
mergeCells: [
  { row: 0, col: 0, rowspan: 2, colspan: 1 }
],
// 或使用 span-method
spanMethod: ({ row, column, rowIndex, columnIndex }) => {
  // 返回 { rowspan, colspan }
}
```

### 4. 导出配置

```javascript
exportConfig: {
  type: 'xlsx',
  types: ['xlsx', 'csv', 'html'],
  modes: ['current', 'selected', 'all']
}
```

### 5. 虚拟滚动(大数据)

```javascript
scrollY: {
  enabled: true,
  gt: 100 // 超过100条启用虚拟滚动
}
```

---

## 常用列类型参考

### 基础列类型

- `type: 'seq'` - 序号列
- `type: 'checkbox'` - 多选列
- `type: 'radio'` - 单选列
- `type: 'expand'` - 展开列

### 编辑渲染器

- `editRender: { name: 'input' }` - 输入框
- `editRender: { name: 'textarea' }` - 文本域
- `editRender: { name: 'VxeSelect' }` - 下拉选择
- `editRender: { name: 'VxeSwitch' }` - 开关
- `editRender: { name: 'VxeDatePicker' }` - 日期选择

### 单元格渲染器

- `cellRender: { name: 'VxeButton' }` - 按钮
- `cellRender: { name: 'VxeSwitch' }` - 开关显示
- `cellRender: { name: 'VxeImage' }` - 图片显示

---

## 性能优化建议

1. **大数据量**: 启用虚拟滚动 `scrollY.enabled: true`
2. **懒加载**: 树形表格使用 `lazy: true` + `loadMethod`
3. **按需加载**: 分页加载, 避免一次性加载全部数据
4. **避免深度监听**: 使用 `data` 而非 `data.value` 传递给 reactive 对象
5. **列宽优化**: 固定列使用 `width`, 可变列使用 `minWidth`
6. **事件优化**: 避免在 gridOptions 中定义函数, 使用模板事件绑定

---

## 调试技巧

### 1. 打印表格数据

```javascript
const gridRef = ref()
console.log(gridRef.value?.getTableData()) // 获取表格完整数据
```

### 2. 获取选中行

```javascript
const selectRows = gridRef.value?.getCheckboxRecords() // 多选
const currentRow = gridRef.value?.getCurrentRecord() // 当前行
```

### 3. 刷新表格

```javascript
gridRef.value?.commitProxy('query') // 触发代理查询
gridRef.value?.reloadData(newData) // 重新加载数据
```

### 4. 表单数据

```javascript
const formData = gridRef.value?.getFormItems() // 获取表单项配置
const formValues = gridRef.value?.getFormData() // 获取表单数据
```

---

## 参考资源

- **VXE-Table 官方文档**: https://vxetable.cn/
- **Element Plus 官方文档**: https://element-plus.org/
- **Grid API 文档**: https://vxetable.cn/#/grid/api
- **VXE-Table 示例**: https://vxetable.cn/#/table/start/install
- **GitHub 仓库**: https://github.com/x-extends/vxe-table

---

## 最佳实践总结

### 技术规范

1. **统一技术栈**: vxe-grid + Element Plus, 不混用其他 UI 库
2. **事件绑定**: 始终在模板中使用 `@event-name`, 不在配置对象中定义
3. **消息提示**: 使用 Element Plus (ElMessage/ElMessageBox), VXETable.modal 已弃用

### 数据处理

4. **数据类型**: 数字字段必须配置 `props: { type: 'number' }`
5. **响应式数据**: 使用 `reactive()` 包装配置对象, `ref()` 包装数组数据
6. **数据刷新**: 使用 `commitProxy('query')` 触发代理查询

### 交互优化

7. **行高亮**: 配置 `rowConfig.isCurrent: true` + `setCurrentRow()`
8. **删除确认**: 使用 `ElMessageBox.confirm()` 二次确认
9. **操作反馈**: 操作成功使用 `ElMessage.success()`, 失败时记录错误日志

### 代码组织

10. **宽度适配**: 表单控件使用 `style="width: 100%"` 而非 class
11. **组件复用**: 弹窗提取为独立组件, 使用 `defineExpose` 暴露方法
12. **API 准备**: 添加 TODO 注释 + 保留模拟数据 + 注释导入语句

### 性能优化

13. **虚拟滚动**: 大数据量(>100条)启用 `scrollY.enabled`
14. **按需加载**: 使用分页或树形懒加载, 避免一次性加载全部数据
15. **避免重复渲染**: 表格配置使用 `reactive()`, 避免频繁创建新对象

---

## AI 提示词使用建议

### 快速开发指令示例

**简单列表页**:

```
基于 @VXE_TABLE_PROMPT.md 创建一个用户管理列表页面
需要: 搜索表单(用户名、状态), 主表格(姓名、手机、邮箱、状态、创建时间), 分页, 新增/编辑/删除操作
```

**主从表格页**:

```
基于 @VXE_TABLE_PROMPT.md 创建订单管理页面
主表: 订单列表(订单号、客户、金额、状态、时间)
子表: 点击订单显示商品明细(商品名、数量、单价、小计), 可编辑
```

**复杂表单弹窗**:

```
基于 @VXE_TABLE_PROMPT.md 创建产品新增弹窗
表单区: 产品名称、分类、价格、库存、描述
表格区: 产品规格列表(规格名、规格值), 可编辑, 支持新增删除行
```

### 注意事项

- 明确说明业务场景和字段名称
- 指定需要哪些功能(搜索、分页、导出等)
- 说明是否需要 API 集成准备
- 指明特殊需求(树形、合并单元格、虚拟滚动等)

---

**提示**: 将此文档作为 AI 对话的上下文, 可快速生成符合项目规范的 VXE-Table 代码, 减少重复性工作和常见错误。
