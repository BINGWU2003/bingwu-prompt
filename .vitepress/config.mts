import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "bingwu-prompt",
  description: "精选 AI 提示词库 - 个人收集整理的高质量 AI 提示词，涵盖编程、写作、设计等多个领域，助力提升 AI 使用效率",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '使用指南', link: '/markdown-examples' },
      { text: '提示词分类', link: '/api-examples' },
      {
        text: '小程序开发',
        items: [
          { text: 'Vue2 UI 设计指南', link: '/docs/miniprogram/MINIPROGRAM_VUE2_UI_GUIDE' }
        ]
      },
      {
        text: 'PC 端开发',
        items: [
          { text: 'VXE Table 使用', link: '/docs/pc/VXE_TABLE_PROMPT' }
        ]
      }
    ],

    sidebar: {
      '/docs/miniprogram/': [
        {
          text: '小程序开发',
          items: [
            { text: 'Vue2 UI 设计指南', link: '/docs/miniprogram/MINIPROGRAM_VUE2_UI_GUIDE' }
          ]
        }
      ],
      '/docs/pc/': [
        {
          text: 'PC 端开发',
          items: [
            { text: 'VXE Table 使用', link: '/docs/pc/VXE_TABLE_PROMPT' }
          ]
        }
      ],
      '/': [
        {
          text: '指南',
          items: [
            { text: '使用指南', link: '/markdown-examples' },
            { text: '提示词分类', link: '/api-examples' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
