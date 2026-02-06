# 项目 UI 设计规范

> 本文档提炼了项目的通用设计规范和 AI 提示词模板，用于保持整个项目 UI 风格的一致性。

## 📋 目录

- [整体设计原则](#整体设计原则)
- [组件库使用规范](#组件库使用规范)
- [颜色规范](#颜色规范)
- [布局规范](#布局规范)
- [样式规范](#样式规范)
- [交互规范](#交互规范)
- [代码规范](#代码规范)
- [AI 提示词模板](#ai-提示词模板)

---

## 整体设计原则

### 1. 设计风格

- **现代简约**：采用卡片式设计，圆角+阴影，营造层次感
- **清新自然**：以绿色为主色调，传递生机与活力
- **用户友好**：大图标、大按钮，适配移动端操作习惯
- **视觉反馈**：所有可点击元素都有明确的按压/选中状态

### 2. 布局原则

- 固定顶部导航栏（cu-custom）
- 中间内容区域使用 `scroll-view` 可滚动
- 固定底部操作按钮（带毛玻璃效果）
- 统一的内容留白：`padding: 32rpx`

### 3. 响应式设计

- 所有尺寸使用 rpx 单位
- 底部按钮区域适配安全区域（`safe-area-inset-bottom`）

---

## 组件库使用规范

### 1. 主要依赖

```javascript
// 组件库：uView2
// 文档：https://uviewui.com/
// 主要使用的组件：
- u-search: 搜索框
- u-input: 输入框
- u-button: 按钮
- u-icon: 图标
- cu-custom: 自定义导航栏（项目封装）
```

### 2. 常用组件配置

#### 搜索框（u-search）

```vue
<u-search
  v-model="searchKeyword"
  placeholder="搜索物料名称或规格"
  :show-action="false"
  :clearabled="true"
  shape="round"
  bg-color="#f5f5f5"
  @search="handleSearch"
  @custom="handleSearch"
></u-search>
```

#### 输入框（u-input）

```vue
<u-input
  v-model="item.quantity"
  type="digit"
  placeholder="请输入"
  input-align="center"
  :border="true"
  :custom-style="{
    width: '180rpx',
    height: '60rpx',
    fontSize: '28rpx',
    border: '1px solid #07c160',
  }"
  @blur="onQuantityBlur"
></u-input>
```

#### 按钮（u-button）

```vue
<u-button
  type="primary"
  text="确定"
  :custom-style="{
    width: '100%',
    backgroundColor: '#07c160',
    borderRadius: '8rpx',
  }"
  @click="handleConfirm"
></u-button>
```

#### 图标（u-icon）

```vue
<!-- 右箭头 -->
<u-icon name="arrow-right" color="#999" size="16"></u-icon>

<!-- 加号 -->
<u-icon name="plus-circle-fill" color="#07c160" size="40"></u-icon>

<!-- 删除 -->
<u-icon name="trash" color="#ff6b6b" size="22"></u-icon>
```

#### 自定义导航栏（cu-custom）

```vue
<cu-custom :bgColor="vuex_themeColor" :isBack="true">
  <block slot="backText">返回</block>
  <block slot="content">页面标题</block>
</cu-custom>
```

---

## 颜色规范

### 1. 主色调

```scss
// 主题色（绿色）
$theme-color: #07c160;
$theme-color-dark: #06ad56;

// 渐变色
$theme-gradient: linear-gradient(135deg, #07c160 0%, #06ad56 100%);
```

### 2. 功能色

```scss
// 文本色
$text-primary: #333; // 主要文字
$text-secondary: #666; // 次要文字
$text-tertiary: #999; // 辅助文字
$text-disabled: #bbb; // 禁用文字
$text-placeholder: #ccc; // 占位文字

// 背景色
$bg-page: #f5f5f5; // 页面背景
$bg-card: #ffffff; // 卡片背景
$bg-hover: #f8f9fa; // 悬停背景

// 状态色
$success-color: #07c160; // 成功/选中
$success-bg: #e8f5e9; // 成功背景
$success-bg-gradient: linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%);

$error-color: #ff6b6b; // 错误/删除
$error-bg: #fff1f0; // 错误背景

$info-color: #2196f3; // 信息
$info-bg: #e3f2fd; // 信息背景

// 边框色
$border-color: #ddd; // 默认边框
$border-color-light: #eee; // 浅色边框
```

### 3. 颜色使用场景

| 颜色      | 使用场景                   | 示例                 |
| --------- | -------------------------- | -------------------- |
| `#07c160` | 主题色、选中状态、确认按钮 | 复选框选中、底部按钮 |
| `#06ad56` | 主题色加深、渐变终点       | 渐变背景、深色主题   |
| `#e8f5e9` | 选中卡片背景               | 已选择的列表项       |
| `#ff6b6b` | 删除、清空操作             | 删除按钮、清空文字   |
| `#2196f3` | 信息标签                   | 类型/状态徽章        |
| `#999`    | 辅助信息                   | 规格、数量、说明文字 |

---

## 布局规范

### 1. 页面结构

```vue
<template>
  <view class="container">
    <!-- 1. 顶部导航栏 -->
    <cu-custom :bgColor="vuex_themeColor" :isBack="true">
      <block slot="backText">返回</block>
      <block slot="content">页面标题</block>
    </cu-custom>

    <!-- 2. 搜索/筛选区域（可选） -->
    <view class="search-container">
      <u-search></u-search>
      <!-- 已选择提示栏 -->
      <view class="stats-bar" v-if="selectedList.length > 0">
        <text class="stats-text">已选择 {{ selectedList.length }} 个</text>
        <text class="clear-text" @click="clearAll">清空</text>
      </view>
    </view>

    <!-- 3. 主内容区域（可滚动） -->
    <scroll-view
      class="content-scroll"
      scroll-y
      :show-scrollbar="true"
      :enhanced="true"
      @scrolltolower="handleScrollToLower"
    >
      <!-- 列表内容 -->
      <view class="list-container">
        <!-- 列表项 -->
      </view>

      <!-- 加载更多提示 -->
      <view class="load-more" v-if="list.length > 0">
        <view v-if="loadingMore" class="loading-text">
          <text>加载中...</text>
        </view>
        <view v-else-if="!hasMore" class="no-more-text">
          <text>没有更多数据了</text>
        </view>
      </view>
    </scroll-view>

    <!-- 4. 底部操作按钮 -->
    <view class="footer">
      <u-button></u-button>
    </view>
  </view>
</template>
```

### 2. 容器样式

```scss
// 页面容器
.container {
  height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 120rpx; // 为底部按钮留空间
}

// 搜索容器
.search-container {
  padding: 24rpx 32rpx;
  background-color: #fff;
}

// 滚动区域
.content-scroll {
  height: calc(100vh - 380rpx); // 减去导航栏和搜索栏高度
  padding: 20rpx 0 140rpx 0;
}

// 列表容器
.list-container {
  padding: 0 32rpx 20rpx;
}

// 底部按钮区域
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.95),
    rgba(255, 255, 255, 1)
  );
  padding: 24rpx 32rpx;
  padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(10rpx); // 毛玻璃效果
}
```

---

## 样式规范

### 1. 卡片样式

```scss
.card-item {
  background: #fff;
  margin-bottom: 24rpx;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;

  // 按压效果
  &:active {
    transform: translateY(-2rpx);
    box-shadow: 0 6rpx 16rpx rgba(0, 0, 0, 0.08);
  }

  // 选中状态
  &.selected {
    background: linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%);
    box-shadow: 0 4rpx 12rpx rgba(7, 193, 96, 0.15);

    &:active {
      background: linear-gradient(135deg, #d7f0d9 0%, #e5f2e0 100%);
    }
  }

  // 内容区域
  .card-content {
    padding: 28rpx;
    display: flex;
    align-items: center;
    border-left: 6rpx solid #07c160; // 左侧装饰条
  }
}
```

### 2. 自定义复选框/单选框

```scss
// 复选框容器
.checkbox-wrapper {
  margin-right: 24rpx;
}

// 复选框/单选框样式
.custom-checkbox {
  width: 44rpx;
  height: 44rpx;
  border: 4rpx solid #ddd;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  background-color: #fff;

  &.is-checked {
    border-color: #07c160;
    animation: checkboxPop 0.3s ease;
  }
}

// 内部圆点
.checkbox-inner {
  width: 24rpx;
  height: 24rpx;
  background: linear-gradient(135deg, #07c160 0%, #06ad56 100%);
  border-radius: 50%;
}

// 弹出动画
@keyframes checkboxPop {
  0% {
    transform: scale(0.8);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}
```

### 3. 列表标题

```scss
.list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 32rpx 16rpx;

  .header-left {
    display: flex;
    align-items: center;
    gap: 12rpx;

    .header-icon {
      width: 6rpx;
      height: 28rpx;
      background: linear-gradient(180deg, #07c160 0%, #06ad56 100%);
      border-radius: 3rpx;

      // 次要标题图标
      &.secondary {
        background: linear-gradient(180deg, #999 0%, #666 100%);
      }
    }

    .header-title {
      font-size: 30rpx;
      color: #333;
      font-weight: 600;
    }
  }

  .header-count {
    font-size: 26rpx;
    color: #999;
  }
}
```

### 4. 徽章/标签

```scss
// 成功状态徽章（绿色系）
.success-badge {
  padding: 4rpx 16rpx;
  background-color: #e8f5e9;
  border-radius: 20rpx;

  .badge-text {
    font-size: 24rpx;
    color: #07c160;
  }
}

// 信息状态徽章（蓝色系）
.info-badge {
  padding: 4rpx 16rpx;
  background-color: #e3f2fd;
  border-radius: 20rpx;

  .badge-text {
    font-size: 24rpx;
    color: #2196f3;
  }
}

// 序号徽章
.item-badge {
  min-width: 40rpx;
  height: 40rpx;
  background: linear-gradient(135deg, #07c160 0%, #06ad56 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  color: #fff;
  font-weight: 600;
}
```

### 5. 空状态

```scss
.empty-state {
  padding: 120rpx 0;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16rpx;

  .empty-text {
    font-size: 30rpx;
    color: #999;
    margin-top: 16rpx;
  }

  .empty-hint {
    font-size: 26rpx;
    color: #ccc;
  }
}
```

### 6. 加载状态

```scss
.load-more {
  padding: 32rpx 0;
  text-align: center;

  .loading-text {
    font-size: 28rpx;
    color: #999;
  }

  .no-more-text {
    font-size: 26rpx;
    color: #ccc;
  }
}
```

### 7. 已选择提示栏

```scss
.stats-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20rpx;
  padding: 16rpx 24rpx;
  background: linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%);
  border-radius: 12rpx;

  .stats-text {
    font-size: 28rpx;
    color: #07c160;
    font-weight: 500;
  }

  .clear-text {
    font-size: 26rpx;
    color: #ff6b6b;
    font-weight: 500;
  }
}
```

---

## 交互规范

### 1. 点击反馈

- **卡片/列表项**：按压时轻微上移（`transform: translateY(-2rpx)`）并加深阴影
- **按钮**：按压时缩小（`transform: scale(0.98)` 或 `scale(0.9)`）
- **图标按钮**：按压时缩小到 90%（`transform: scale(0.9)`）

### 2. 状态反馈

- **选中状态**：
  - 卡片背景变为渐变绿色
  - 复选框/单选框出现绿色圆点
  - 边框变为绿色
- **禁用状态**：
  - 按钮置灰
  - 文字颜色变浅
  - 禁止点击

### 3. 动画效果

```scss
// 所有可交互元素添加过渡
transition: all 0.3s ease;

// 复选框/单选框选中动画
animation: checkboxPop 0.3s ease;

// 毛玻璃效果
backdrop-filter: blur(10rpx);
```

### 4. 搜索防抖

```javascript
// 搜索输入防抖（500ms）
handleSearchDebounce() {
  uni.$u.debounce(this.handleSearch, 500);
}
```

### 5. 滚动加载

```javascript
// 触底加载
handleScrollToLower() {
  if (this.loadingMore || !this.hasMore || this.loading) {
    return;
  }
  this.pageParams.current += 1;
  this.loadMaterialData(true);
}
```

---

## 代码规范

### 1. 数据结构规范

#### 分页参数

```javascript
pageParams: {
  current: 1,    // 当前页码
  size: 10,      // 每页数量
  total: 0,      // 总条数
  pages: 0,      // 总页数
}
```

#### 加载状态

```javascript
loading: false,       // 初始加载状态
loadingMore: false,   // 加载更多状态
hasMore: true,        // 是否还有更多数据
```

### 2. 方法命名规范

```javascript
// 初始化
async init() { }

// 加载数据
async loadData(isLoadMore = false) { }

// 搜索
handleSearch() { }

// 搜索防抖
handleSearchDebounce() { }

// 滚动到底部
handleScrollToLower() { }

// 确认操作
handleConfirm() { }

// 清空选择
clearAll() { }

// 判断是否选中
isChecked(id) { }

// 切换选中状态
toggleSelect(item) { }
```

### 3. Computed 属性规范

```javascript
computed: {
  // 已选择的ID数组
  selectedIds() {
    return this.selectedList.map(item => item.id);
  },

  // 过滤后的列表
  filteredList() {
    return this.list.filter(item => !this.selectedIds.includes(item.id));
  }
}
```

### 4. 路由跳转规范

```javascript
// 跳转并传参
this.iipRouter.to("/path/to/page", {
  selectType: "material",
  selectedList: this.selectedList,
});

// 返回并传参
this.iipRouter.back({
  selectType: "material",
  selectedData: this.selectedData,
});

// 接收参数
onLoad() {
  const selectType = this.iipRouter.get("selectType");
  const selectedList = this.iipRouter.get("selectedList");
}
```

### 5. Toast 提示规范

```javascript
// 成功提示
uni.showToast({
  title: "操作成功",
  icon: "success",
});

// 错误提示
uni.showToast({
  title: "请选择物料",
  icon: "none",
});

// 加载提示
uni.showLoading({ title: "加载中..." });
uni.hideLoading();
```

---

## AI 提示词模板

### 模板 1：列表选择页面

```
请创建一个【XXX选择页面】，参考项目UI设计规范：

**功能需求：**
1. 支持搜索功能（搜索关键词：XXX）
2. 支持【单选/多选】功能
3. 支持分页加载（每页10条）
4. 支持触底加载更多
5. 显示已选择的XXX数量和清空按钮

**UI设计要求：**
1. 使用uView2组件库（u-search, u-button, u-icon）
2. 使用cu-custom自定义导航栏
3. 主题色：#07c160（绿色）
4. 卡片式布局，圆角16rpx，阴影
5. 选中状态：渐变绿色背景
6. 自定义复选框/单选框：白色圆形边框，选中时中间绿色圆点
7. 底部固定按钮，带毛玻璃效果
8. 列表项按压效果：上移2rpx + 阴影加深
9. 空状态提示："暂无XXX数据"
10. 加载更多提示："加载中..." / "没有更多数据了"

**布局结构：**
- 顶部：cu-custom导航栏
- 搜索区域：u-search + 已选择提示栏（绿色渐变背景）
- 主内容区域：scroll-view（可滚动）
  - 已选择列表（如果是多选）
  - 未选择列表
  - 加载更多提示
- 底部：固定按钮（确定按钮）

**数据字段：**
- id: XXX ID
- name: XXX名称
- [其他字段]

**交互逻辑：**
1. 点击列表项切换选中状态
2. 搜索输入防抖500ms
3. 触底自动加载下一页
4. 点击确定按钮返回已选择的数据

请使用 Vue2 + uni-app 语法编写，样式使用 SCSS。
```

### 模板 2：表单编辑页面

```
请创建一个【XXX编辑页面】，参考项目UI设计规范：

**功能需求：**
1. 表单字段：[列出字段]
2. 支持选择器（跳转到选择页面）
3. 支持手动输入（数字、文本）
4. 支持列表编辑（添加、删除、修改数量）
5. 表单验证

**UI设计要求：**
1. 使用uView2组件库（u-input, u-button, u-icon）
2. 使用cu-custom自定义导航栏
3. 主题色：#07c160（绿色）
4. 表单项：白色卡片，圆角16rpx，渐变背景
5. 列表区域：使用scroll-view，带滚动条
6. 列表项：白色卡片，左侧6rpx绿色装饰条
7. 底部固定确认按钮，带毛玻璃效果
8. 输入框：绿色边框，居中对齐
9. 删除按钮：红色图标，淡红色背景
10. 空状态提示

**布局结构：**
- 顶部：cu-custom导航栏
- 表单区域：
  - 表单项（点击跳转选择页面）
  - 列表标题 + 添加按钮
  - scroll-view滚动列表
    - 列表项（序号 + 信息 + 数量输入 + 删除）
    - 空状态
- 底部：固定确认按钮

**数据验证：**
1. XXX不能为空
2. 至少添加一个XXX
3. 数量必须大于0
4. 小数保留2位

**交互逻辑：**
1. 点击表单项跳转到对应的选择页面
2. 点击添加按钮跳转到列表选择页面
3. 输入框失焦时验证并格式化数值
4. 点击删除按钮弹出确认框
5. 点击确认按钮验证并提交数据

请使用 Vue2 + uni-app 语法编写，样式使用 SCSS。
```

### 模板 3：快速复制现有页面风格

```
请参考以下页面的UI风格，创建一个【XXX页面】：
- 参考页面：[指定项目中的现有页面路径]
- 参考文档：项目 UI 设计规范文档（UI_DESIGN_GUIDE.md）
- 保持相同的颜色、布局、交互效果
- 使用相同的组件库（uView2）
- 使用相同的自定义组件（cu-custom、自定义复选框/单选框）

**不同之处：**
[列出与参考页面的差异]

**数据字段：**
[列出数据字段]

**特殊需求：**
[列出特殊功能需求]

**示例参考页面：**
- 列表选择页面：pages/employee/inventory-dispatch/select-material/select-material.vue
- 表单编辑页面：pages/employee/inventory-dispatch/inventory-dispatch.vue
- 单选页面：pages/employee/inventory-dispatch/select-out-warehouse/select-out-warehouse.vue
```

---

## 附录

### A. 常用尺寸规范

| 元素                 | 尺寸                             |
| -------------------- | -------------------------------- |
| 页面左右内边距       | 32rpx                            |
| 卡片圆角             | 16rpx                            |
| 小圆角（按钮、徽章） | 8rpx-12rpx                       |
| 卡片间距             | 24rpx                            |
| 卡片阴影             | 0 4rpx 12rpx rgba(0, 0, 0, 0.05) |
| 卡片左侧装饰条       | 6rpx                             |
| 复选框/单选框        | 44rpx × 44rpx                    |
| 内部圆点             | 24rpx × 24rpx                    |
| 序号徽章             | 40rpx × 40rpx                    |
| 底部按钮区域         | 120rpx                           |

### B. 字体规范

| 用途       | 字号  | 颜色 | 字重 |
| ---------- | ----- | ---- | ---- |
| 导航栏标题 | -     | #fff | -    |
| 列表标题   | 30rpx | #333 | 600  |
| 主要内容   | 32rpx | #333 | 600  |
| 次要内容   | 26rpx | #999 | 400  |
| 辅助信息   | 24rpx | #bbb | 400  |
| 按钮文字   | 30rpx | #fff | 500  |
| 徽章文字   | 24rpx | -    | 400  |
| 提示文字   | 28rpx | #999 | 400  |

### C. 动画时长

| 动画     | 时长  |
| -------- | ----- |
| 通用过渡 | 0.3s  |
| 弹出动画 | 0.3s  |
| 搜索防抖 | 500ms |

---

## 版本历史

- **v1.0.0** (2025-10-23)
  - 初始版本
  - 提炼项目通用 UI 设计规范
  - 包含完整的 AI 提示词模板
  - 支持快速复制现有页面风格

---

## 许可

本文档仅供项目内部使用。
