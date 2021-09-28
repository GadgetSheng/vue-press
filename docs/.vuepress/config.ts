import { defineUserConfig } from 'vuepress';
import type { DefaultThemeOptions } from 'vuepress';
import sidebar from './config/sidebar';
import navbar from './config/nav';

export default defineUserConfig<DefaultThemeOptions>({
  base: '/vue-press/',
  title: 'BFE.LESSONS',
  description: 'Just play around',
  themeConfig: {
    logo: './assets/logo.png',
    smoothScroll: true,
    navbar,
    sidebar,
    lastUpdated: true,
    repo: "https://github.com/zpfz/vuepress-creator",
  },
  plugins: [
    ['@vuepress/search', { searchMaxSuggestions: 10 }],
    // ['@vuepress/docsearch', { apiKey: '<API_KEY>', indexName: '<INDEX_NAME>' }]
  ]
});