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
- [附录](#附录)

---

## 整体设计原则

### 1. 设计风格

- **现代简约**：采用卡片式设计，圆角+阴影，营造层次感
- **清新自然**：以绿色为主色调，传递生机与活力
- **用户友好**：大图标、大按钮，适配移动端操作习惯
- **视觉反馈**：所有可点击元素都有明确的按压/选中状态

### 2. 布局原则

- **优先使用 `iip-page-layout`** 作为页面容器，自动处理导航栏、内容区高度计算
- 中间内容区域 `scroll-view` 设置 `height: 100%`，由组件自动填满
- 固定底部操作按钮使用 `#footer` 插槽（带毛玻璃效果）
- 统一的内容留白：`padding: 32rpx`

### 3. 响应式设计

- 所有尺寸使用 rpx 单位
- 底部按钮区域适配安全区域（`safe-area-inset-bottom`）

---

## 组件库使用规范

### 1. 主要依赖

```javascript
// UI组件库：uView2（https://uviewui.com/）
// 页面容器：iip-page-layout（项目封装，优先使用）
// 导航栏：cu-custom（ColorUI，iip-page-layout内部封装）
// 请求管理：createRequestManager（@bingwu/iip-ui-utils）
```

### 2. iip-page-layout（页面容器，优先使用）

`iip-page-layout` 是项目封装的标准页面容器，自动处理导航栏渲染和内容区高度自适应，**所有新页面优先使用**。

**Props：**

| 属性            | 类型    | 默认值          | 说明             |
| --------------- | ------- | --------------- | ---------------- |
| `title`         | String  | '页面标题'      | 导航栏标题       |
| `isBack`        | Boolean | true            | 是否显示返回按钮 |
| `backText`      | String  | '返回'          | 返回按钮文字     |
| `navBarBgColor` | String  | vuex_themeColor | 导航栏背景色     |

**Slots：**

| 插槽名     | 说明                                    |
| ---------- | --------------------------------------- |
| `#header`  | 顶部操作区（Tab、搜索栏等），高度自适应 |
| `#content` | 主内容区，高度自动填满剩余空间          |
| `#footer`  | 底部固定操作区，position: fixed         |

```vue
<iip-page-layout title="页面标题">
  <!-- Tab 切换 / 搜索栏 -->
  <template #header>
    <view class="tab-container">...</view>
  </template>

  <!-- 主内容：scroll-view 必须设置 height: 100% -->
  <template #content>
    <scroll-view class="content-scroll" scroll-y :enhanced="true"
      @scrolltolower="handleScrollToLower">
      ...
    </scroll-view>
  </template>

  <!-- 底部按钮（可选） -->
  <template #footer>
    <view class="footer-btn">
      <u-button type="primary" text="确定" @click="handleConfirm"></u-button>
    </view>
  </template>
</iip-page-layout>
```

### 3. cu-custom（导航栏，iip-page-layout 不满足时使用）

`cu-custom` 支持 `slot="right"` 插槽，可在导航栏右侧放置操作按钮。`iip-page-layout` 内部封装了 `cu-custom`，但未暴露 right 插槽，需要右侧操作按钮时直接使用 `cu-custom`。

```vue
<cu-custom :bgColor="vuex_themeColor" :isBack="true">
  <block slot="backText">返回</block>
  <block slot="content">页面标题</block>
  <block slot="right">
    <!-- 右侧操作区 -->
  </block>
</cu-custom>
```

### 4. 常用 uView2 组件配置

#### 搜索框（u-search）

```vue
<u-search
  v-model="searchKeyword"
  placeholder="搜索关键词"
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
<u-icon name="arrow-right" color="#999" size="16"></u-icon>
<u-icon name="plus-circle-fill" color="#07c160" size="40"></u-icon>
<u-icon name="trash" color="#ff6b6b" size="22"></u-icon>
```

---

## 颜色规范

### 1. 主色调

```scss
$theme-color: #07c160; // 主题色（绿色）
$theme-color-dark: #06ad56; // 主题色加深
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
$success-color: #07c160; // 进行中/成功
$success-bg: #e8f5e9; // 成功浅色背景

$info-color: #2196f3; // 已完成/信息
$info-bg: #e3f2fd; // 信息浅色背景

$error-color: #ff6b6b; // 错误/删除
$error-bg: #fff1f0; // 错误浅色背景

// 边框色
$border-color: #eee; // 默认边框
$border-color-light: #f5f5f5; // 浅色边框（分割线）
```

### 3. 颜色使用场景

| 颜色      | 使用场景                              |
| --------- | ------------------------------------- |
| `#07c160` | 主题色、Tab激活、确认按钮、进行中徽章 |
| `#e8f5e9` | 进行中/成功浅色背景、选中卡片背景     |
| `#2196f3` | 已完成/信息类徽章文字                 |
| `#e3f2fd` | 已完成/信息类徽章背景                 |
| `#ff6b6b` | 删除、清空、错误操作                  |
| `#999`    | 辅助文字、标签文字、日期              |

### 4. 状态徽章颜色规范（统一使用浅底+对应文字）

```scss
// 进行中
.status-progress {
  background-color: #e8f5e9;
  .status-text {
    color: #07c160;
  }
}
// 已完成
.status-done {
  background-color: #e3f2fd;
  .status-text {
    color: #2196f3;
  }
}
// 异常/驳回
.status-error {
  background-color: #fff1f0;
  .status-text {
    color: #ff6b6b;
  }
}
```

> ⚠️ 禁止同一页面内混用实心填充和镂空两种徽章风格，统一使用浅底色+对应文字色。

---

## 布局规范

### 1. Tab 列表页面（标准结构）

带 Tab 切换和新建按钮的列表页，参考：`pages/employee/msgReport/logErrorList/logErrorList.vue`

```vue
<template>
  <iip-page-layout title="XXX管理">
    <!-- Tab + 右侧操作按钮 -->
    <template #header>
      <view class="header-bar">
        <view class="tab-container">
          <view
            class="tab-item"
            :class="{ active: activeTab === 0 }"
            @click="switchTab(0)"
          >
            <text class="tab-text">进行中</text>
          </view>
          <view
            class="tab-item"
            :class="{ active: activeTab === 1 }"
            @click="switchTab(1)"
          >
            <text class="tab-text">已完成</text>
          </view>
        </view>
        <view class="new-btn" @click="toCreate">
          <text class="new-btn-text">新建</text>
        </view>
      </view>
    </template>

    <!-- 列表 -->
    <template #content>
      <scroll-view
        class="content-scroll"
        scroll-y
        :enhanced="true"
        @scrolltolower="handleScrollToLower"
      >
        <view class="list-container">
          <view
            class="list-item"
            v-for="(item, index) in list"
            :key="index"
            @click="toDetail(item)"
          >
            <!-- 列表项内容 -->
          </view>
          <view class="empty-state" v-if="!loading && list.length === 0">
            <u-empty mode="list" text="暂无数据"></u-empty>
          </view>
          <view class="load-more" v-if="list.length > 0">
            <view v-if="loadingMore"
              ><text class="loading-text">加载中...</text></view
            >
            <view v-else-if="!hasMore"
              ><text class="no-more-text">没有更多数据了</text></view
            >
          </view>
        </view>
      </scroll-view>
    </template>
  </iip-page-layout>
</template>
```

### 2. 详情页面（标准结构）

分区块展示的详情页，参考：`pages/employee/msgReport/logErrorDetail/logErrorDetail.vue`

```vue
<template>
  <iip-page-layout title="XXX详情">
    <template #content>
      <scroll-view class="content-scroll" scroll-y :enhanced="true">
        <view class="content-container">
          <!-- 信息区块卡片 -->
          <view class="section-card">
            <!-- 区块标题行（可带状态徽章） -->
            <view class="section-header">
              <view class="header-left">
                <view class="header-icon"></view>
                <text class="section-title">基础信息</text>
              </view>
              <view class="status-badge status-progress">
                <text class="status-text">进行中</text>
              </view>
            </view>
            <!-- 字段行 -->
            <view class="field-row">
              <text class="field-label">字段名：</text>
              <text class="field-value">{{ detail.field }}</text>
            </view>
            <view class="field-row align-start">
              <!-- 多行文本用 align-start -->
              <text class="field-label">描述：</text>
              <text class="field-value">{{ detail.remark }}</text>
            </view>
            <view class="field-row no-border">
              <!-- 最后一行去掉下边框 -->
              <text class="field-label">创建时间：</text>
              <text class="field-value highlight">{{ detail.createTime }}</text>
            </view>
          </view>
        </view>
      </scroll-view>
    </template>
  </iip-page-layout>
</template>
```

### 3. 带底部按钮的表单页面

```vue
<template>
  <iip-page-layout title="XXX编辑">
    <template #content>
      <scroll-view class="content-scroll" scroll-y :enhanced="true">
        <!-- 表单内容 -->
      </scroll-view>
    </template>
    <template #footer>
      <view class="footer-btn">
        <u-button
          type="primary"
          text="确定"
          :custom-style="{ backgroundColor: '#07c160', borderRadius: '8rpx' }"
          @click="handleConfirm"
        >
        </u-button>
      </view>
    </template>
  </iip-page-layout>
</template>
```

---

## 样式规范

### 1. Tab 栏（带下划线指示器）

```scss
.header-bar {
  display: flex;
  align-items: center;
  background-color: #fff;
  border-bottom: 1rpx solid #eee;
  padding-right: 32rpx;
}

.tab-container {
  flex: 1;
  display: flex;
}

.tab-item {
  flex: 0 0 auto;
  height: 88rpx;
  padding: 0 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: all 0.3s ease;

  .tab-text {
    font-size: 30rpx;
    color: #666;
  }

  &.active {
    .tab-text {
      color: #07c160;
      font-weight: 600;
    }

    &::after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 60rpx;
      height: 6rpx;
      background: linear-gradient(135deg, #07c160 0%, #06ad56 100%);
      border-radius: 3rpx;
    }
  }
}

// Tab 右侧新建按钮
.new-btn {
  background-color: #07c160;
  border-radius: 8rpx;
  padding: 14rpx 28rpx;
  transition: all 0.3s ease;
  &:active {
    background-color: #06ad56;
    transform: scale(0.96);
  }
  .new-btn-text {
    font-size: 28rpx;
    color: #fff;
    font-weight: 500;
  }
}
```

### 2. 列表项（行样式，非卡片）

适用于信息密度较高的列表，背景色与分割线区分层次。

```scss
.content-scroll {
  height: 100%;
}

.list-container {
  padding-top: 20rpx;
}

.list-item {
  background-color: #fff;
  padding: 24rpx 32rpx;
  margin-bottom: 20rpx;
  transition: all 0.2s ease;
  &:active {
    background-color: #f8f9fa;
  }
}

.item-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14rpx;
  &:last-child {
    margin-bottom: 0;
  }
}

.label-text {
  font-size: 28rpx;
  color: #333;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 20rpx;
}

.date-text {
  font-size: 26rpx;
  color: #999;
  white-space: nowrap;
  flex-shrink: 0;
}
.person-text {
  font-size: 26rpx;
  color: #666;
  white-space: nowrap;
  flex-shrink: 0;
}
```

### 3. 卡片样式（圆角+阴影）

```scss
.card-item {
  background: #fff;
  margin-bottom: 24rpx;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;

  &:active {
    transform: translateY(-2rpx);
    box-shadow: 0 6rpx 16rpx rgba(0, 0, 0, 0.08);
  }

  .card-content {
    padding: 28rpx;
    display: flex;
    align-items: center;
    border-left: 6rpx solid #07c160; // 左侧绿色装饰条
  }
}
```

### 4. 详情页区块卡片

```scss
.content-container {
  padding: 24rpx 32rpx 40rpx;
}

.section-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 0 28rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 0 20rpx;
  border-bottom: 1rpx solid #f0f0f0;
  margin-bottom: 4rpx;

  .header-left {
    display: flex;
    align-items: center;
    gap: 12rpx;

    .header-icon {
      width: 6rpx;
      height: 28rpx;
      background: linear-gradient(180deg, #07c160 0%, #06ad56 100%);
      border-radius: 3rpx;
    }

    .section-title {
      font-size: 30rpx;
      color: #333;
      font-weight: 600;
    }
  }
}

.field-row {
  display: flex;
  align-items: center;
  padding: 22rpx 0;
  border-bottom: 1rpx solid #f5f5f5;

  &.align-start {
    align-items: flex-start;
  }
  &.no-border {
    border-bottom: none;
  }

  .field-label {
    font-size: 28rpx;
    color: #999;
    min-width: 160rpx;
    flex-shrink: 0;
  }

  .field-value {
    flex: 1;
    font-size: 28rpx;
    color: #333;
    word-break: break-all;
    line-height: 1.6;

    &.highlight {
      color: #07c160;
    }
  }
}
```

### 5. 状态徽章

```scss
.status-badge {
  padding: 6rpx 20rpx;
  border-radius: 8rpx;
  white-space: nowrap;
  flex-shrink: 0;

  .status-text {
    font-size: 24rpx;
    font-weight: 500;
  }

  &.status-progress {
    background-color: #e8f5e9;
    .status-text {
      color: #07c160;
    }
  }
  &.status-done {
    background-color: #e3f2fd;
    .status-text {
      color: #2196f3;
    }
  }
  &.status-error {
    background-color: #fff1f0;
    .status-text {
      color: #ff6b6b;
    }
  }
}
```

### 6. 区块标题（带左侧装饰条）

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

### 7. 底部固定按钮区

```scss
.footer-btn {
  padding: 24rpx 32rpx;
  padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.95),
    rgba(255, 255, 255, 1)
  );
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(10rpx);
}
```

### 8. 空状态与加载更多

```scss
.empty-state {
  padding: 120rpx 0;
  text-align: center;
}

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

### 9. 自定义复选框/单选框

```scss
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

.checkbox-inner {
  width: 24rpx;
  height: 24rpx;
  background: linear-gradient(135deg, #07c160 0%, #06ad56 100%);
  border-radius: 50%;
}

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

### 10. 已选择提示栏

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

- **卡片**：按压时轻微上移（`transform: translateY(-2rpx)`）并加深阴影
- **列表行**：按压时背景变为 `#f8f9fa`
- **按钮**：按压时缩小（`transform: scale(0.96)`）
- **图标按钮**：按压时缩小到 90%

### 2. 状态反馈

- **选中状态**：卡片背景变为渐变绿色，复选框出现绿色圆点
- **禁用状态**：按钮置灰，文字颜色变浅，禁止点击

### 3. 动画时长

```scss
transition: all 0.3s ease; // 通用过渡
backdrop-filter: blur(10rpx); // 毛玻璃效果
```

### 4. 搜索防抖

```javascript
import { debounce } from "@bingwu/iip-ui-utils";

// 防抖 500ms
handleSearchDebounce: debounce(function() {
  this.handleSearch();
}, 500),
```

### 5. 滚动触底加载

```javascript
handleScrollToLower() {
  if (this.loadingMore || !this.hasMore || this.loading) return;
  this.pageParams.current += 1;
  this.loadData(true);
},
```

---

## 代码规范

### 1. 数据结构

```javascript
data() {
  return {
    // 请求管理器（Tab切换防竞态，必须）
    requestManager: createRequestManager(),

    // 列表与分页
    list: [],
    pageParams: {
      current: 1,
      size: 10,
      total: 0,
      pages: 0,
    },

    // 加载状态
    loading: false,       // 首屏加载
    loadingMore: false,   // 加载更多
    hasMore: true,        // 是否还有更多

    // Tab（数字类型，与接口 status 字段对应）
    activeTab: 0,
  };
},
```

### 2. requestManager 防竞态（Tab 切换标准模式）

导入并在 `loadData` 中包裹请求，`onSuccess`/`onError` 只对最新请求触发，`onFinally` 始终执行。

```javascript
import { createRequestManager } from "@bingwu/iip-ui-utils";
import { getPage } from "@/api/xxx";

// data 中声明
requestManager: createRequestManager(),

// 切换 Tab
switchTab(tab) {
  if (this.activeTab === tab) return;
  this.activeTab = tab;
  this.pageParams.current = 1;
  this.hasMore = true;
  this.list = [];
  this.loadData();
},

// 加载数据
async loadData(isLoadMore = false) {
  if (this.loading || (isLoadMore && this.loadingMore)) return;
  isLoadMore ? (this.loadingMore = true) : (this.loading = true);

  await this.requestManager.request(
    async () => {
      return await getPage({
        current: this.pageParams.current,
        size: this.pageParams.size,
        status: this.activeTab,
      });
    },
    {
      onSuccess: (res) => {
        if (res.code === 200 && res.data) {
          const records = res.data.records || [];
          this.list = isLoadMore ? [...this.list, ...records] : records;
          this.pageParams.total = res.data.total || 0;
          this.pageParams.pages = res.data.pages || 0;
          this.hasMore = this.pageParams.current < this.pageParams.pages;
        }
      },
      onError: () => {
        uni.showToast({ title: "加载失败", icon: "none" });
      },
      onFinally: () => {
        this.loading = false;
        this.loadingMore = false;
      },
    },
  );
},
```

### 3. 详情页加载

```javascript
import { getDetail } from "@/api/xxx";

data() {
  return { id: "", detail: {} };
},
onLoad(options) {
  this.id = options.id || "";
  this.loadDetail();
},
methods: {
  async loadDetail() {
    try {
      uni.showLoading({ title: "加载中...", mask: true });
      const res = await getDetail({ id: this.id });
      if (res.code === 200 && res.data) {
        this.detail = res.data;
      }
    } catch (e) {
      uni.showToast({ title: "加载失败", icon: "none" });
    } finally {
      uni.hideLoading();
    }
  },
},
```

### 4. 生命周期规范

```javascript
// 列表页：onShow 刷新（每次返回都能看到最新数据）
onShow() {
  this.pageParams.current = 1;
  this.hasMore = true;
  this.list = [];
  this.loadData();
},
onPullDownRefresh() {
  this.pageParams.current = 1;
  this.hasMore = true;
  this.loadData();
  uni.stopPullDownRefresh();
},

// 详情页：onLoad 加载一次
onLoad(options) {
  this.id = options.id;
  this.loadDetail();
},
```

### 5. API 文件规范

```javascript
import http from "@/http/api.js";

export function getPage(params) {
  return http.request({ url: "/xxx/page", method: "GET", params });
}

export function getDetail(params) {
  return http.request({ url: "/xxx/detail", method: "GET", params });
}

export function save(data) {
  return http.request({ url: "/xxx/save", method: "POST", data });
}
```

### 6. 方法命名规范

```javascript
switchTab(tab)           // 切换 Tab
async loadData(isLoadMore = false) // 加载列表数据
async loadDetail()       // 加载详情数据
handleScrollToLower()    // 触底加载更多
handleSearch()           // 执行搜索
handleSearchDebounce()   // 搜索防抖
handleConfirm()          // 确认提交
toCreate()               // 跳转新建页
toDetail(item)           // 跳转详情页
formatDate(val)          // 格式化日期
formatType(val)          // 格式化类型枚举
getStatusLabel(status)   // 获取状态文字
getStatusClass(status)   // 获取状态样式类
```

### 7. 路由跳转规范

```javascript
// 跳转并传参
uni.navigateTo({ url: `/pages/xxx/xxx?id=${item.id}` });

// 返回
uni.navigateBack();

// 接收参数
onLoad(options) {
  this.id = options.id;
}
```

### 8. Toast / Loading 规范

```javascript
uni.showToast({ title: "操作成功", icon: "success" });
uni.showToast({ title: "请选择工单", icon: "none" });
uni.showLoading({ title: "加载中...", mask: true });
uni.hideLoading();
```

---

## AI 提示词模板

### 模板 1：Tab 列表管理页

```
请创建一个【XXX管理页面】，参考项目 UI 设计规范（MINIPROGRAM_VUE2_UI_GUIDE.md）：

**功能需求：**
1. Tab 切换：[Tab1名称]（status=0）/ [Tab2名称]（status=1）
2. 右上角新建按钮，点击跳转新建页
3. 分页加载（每页10条），触底自动加载更多
4. 点击列表项跳转详情页

**接口字段（ExampleVO）：**
- id: number
- [字段1]: string（说明）
- [字段2]: string（说明）
- status: number（0=XXX, 1=XXX）
- createTime: string
- createByName: string

**列表项展示（每项3行）：**
- 第一行：[字段A] 左，createTime 右
- 第二行：[字段B] 左，状态徽章 右
- 第三行：[字段C] 左，createByName 右

**UI 要求：**
- 使用 iip-page-layout 作为页面容器
- Tab 切换使用 requestManager 防竞态（来自 @bingwu/iip-ui-utils）
- 状态徽章统一使用浅底色+对应文字色风格（不混用实心）
- 列表行样式（非卡片）：白色背景，按压变 #f8f9fa

**参考页面：**
pages/employee/msgReport/logErrorList/logErrorList.vue

请使用 Vue2 + uni-app 语法，样式使用 SCSS。
```

### 模板 2：详情页

```
请创建一个【XXX详情页面】，参考项目 UI 设计规范（MINIPROGRAM_VUE2_UI_GUIDE.md）：

**功能需求：**
1. 显示两个信息区块：[区块1名称] 和 [区块2名称]
2. [区块1] 右侧显示状态徽章（进行中/已完成）
3. 以下字段有数据时才显示：[条件字段1]、[条件字段2]

**接口字段（ExampleVO）：**
- id: number
- status: number（0=进行中, 1=已完成）
- [区块1字段列表...]
- [区块2字段列表...]

**字段高亮说明：**
- 以下字段值显示为绿色（#07c160）：[字段A]、[字段B]
- 以下字段值为多行文本（align-start）：[字段C]

**UI 要求：**
- 使用 iip-page-layout title="XXX详情"
- 每个区块使用 section-card 样式（白色圆角卡片+左侧绿色装饰条标题）
- field-row 字段行，最后一行加 no-border 类
- onLoad 时调用详情接口，显示 loading 遮罩

**参考页面：**
pages/employee/msgReport/logErrorDetail/logErrorDetail.vue

请使用 Vue2 + uni-app 语法，样式使用 SCSS。
```

### 模板 3：表单新建/编辑页

```
请创建一个【XXX编辑页面】，参考项目 UI 设计规范（MINIPROGRAM_VUE2_UI_GUIDE.md）：

**功能需求：**
1. 表单字段：[列出字段和类型]
2. 选择器字段（点击跳转选择页面）：[字段名]
3. 列表编辑（添加、删除行）：[列表字段]
4. 表单验证后提交

**验证规则：**
1. [字段A] 不能为空
2. 至少添加一条 [列表项]
3. [数量字段] 必须大于0

**UI 要求：**
- 使用 iip-page-layout，底部固定确认按钮（#footer 插槽）
- 表单项：白色卡片，圆角16rpx
- 列表项：白色卡片，左侧6rpx绿色装饰条
- 删除按钮：红色图标（#ff6b6b）
- 底部按钮带毛玻璃效果

**参考页面：**
pages/employee/inventory-dispatch/inventory-dispatch.vue

请使用 Vue2 + uni-app 语法，样式使用 SCSS。
```

### 模板 4：快速参考现有页面

```
请参考以下页面的 UI 风格，创建【XXX页面】：

参考页面：[完整页面路径]
规范文档：MINIPROGRAM_VUE2_UI_GUIDE.md

保持：颜色、布局、交互效果、组件库（uView2）、iip-page-layout 容器

差异点：
- [列出与参考页面的不同之处]

数据字段：
- [字段定义]

特殊需求：
- [其他需求]
```

---

## 附录

### A. 常用尺寸规范

| 元素           | 尺寸                             |
| -------------- | -------------------------------- |
| 页面左右内边距 | 32rpx                            |
| 卡片圆角       | 16rpx                            |
| 按钮/徽章圆角  | 8rpx                             |
| 卡片间距       | 24rpx (卡片) / 20rpx (列表行)    |
| 卡片阴影       | 0 4rpx 12rpx rgba(0, 0, 0, 0.05) |
| 左侧装饰条     | 宽6rpx，高28rpx                  |
| 复选框/单选框  | 44rpx × 44rpx                    |
| 内部圆点       | 24rpx × 24rpx                    |
| Tab 栏高度     | 88rpx                            |
| Tab 激活下划线 | 宽60rpx，高6rpx                  |

### B. 字体规范

| 用途          | 字号  | 颜色         | 字重    |
| ------------- | ----- | ------------ | ------- |
| 区块标题      | 30rpx | #333         | 600     |
| 列表主要信息  | 28rpx | #333         | 400     |
| 辅助/标签文字 | 26rpx | #999         | 400     |
| 徽章/时间文字 | 24rpx | -            | 400     |
| 按钮文字      | 28rpx | #fff         | 500     |
| Tab 文字      | 30rpx | #666/#07c160 | 400/600 |

### C. 参考页面索引

| 页面类型                | 路径                                                                    |
| ----------------------- | ----------------------------------------------------------------------- |
| Tab 列表管理页          | `pages/employee/msgReport/logErrorList/logErrorList.vue`                |
| 详情页                  | `pages/employee/msgReport/logErrorDetail/logErrorDetail.vue`            |
| 审批管理列表            | `pages/employee/approval-management/approval-management.vue`            |
| 表单编辑页              | `pages/employee/inventory-dispatch/inventory-dispatch.vue`              |
| 列表选择页              | `pages/employee/inventory-dispatch/select-material/select-material.vue` |
| requestManager 使用示例 | `pages/home/workbench.vue`                                              |

---

## 版本历史

- **v2.0.0** (2026-03-10)
  - 新增 `iip-page-layout` 标准页面容器规范（取代直接使用 cu-custom）
  - 新增 `requestManager` 防竞态请求管理规范
  - 新增 Tab 列表页、详情页完整布局模板与样式
  - 统一状态徽章风格（浅底色+对应文字色）
  - 更新 AI 提示词模板，与实际项目页面对齐
  - 补充参考页面索引表

- **v1.0.0** (2025-10-23)
  - 初始版本，提炼项目通用 UI 设计规范

---

## 许可

本文档仅供项目内部使用。
