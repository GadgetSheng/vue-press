import { defineUserConfig } from 'vuepress';
import type { DefaultThemeOptions } from 'vuepress';
import sidebar from './config/sidebar';
import navbar from './config/nav';

console.log(`%c> PROJECT_PATH = ${process.env.PROJECT_PATH}`, 'color:yellow;background:#333;');

export default defineUserConfig<DefaultThemeOptions>({
  base: process.env.PROJECT_PATH || '/vue-press/',
  title: 'BFE.LEARNING',
  description: 'Just learning <BIG.FRONT.END>',
  themeConfig: {
    logo: '/images/logo.png',
    smoothScroll: true,
    navbar,
    sidebar,
    // lastUpdated: true,
    // repo: "https://github.com/zpfz/vuepress-creator",
  },
  plugins: [
    ['@vuepress/search', { searchMaxSuggestions: 10 }]
  ]
});