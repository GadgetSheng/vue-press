import { defineUserConfig } from 'vuepress';
import type { DefaultThemeOptions } from 'vuepress';
import sidebar from './sidebar';
import navbar from './nav';

export default defineUserConfig<DefaultThemeOptions>({
  base: process.env.VP_BASE || '/vue-press/',
  title: 'BFE.LEARNING',
  description: 'Just learning <BIG.FRONT.END>',
  themeConfig: {
    logo: '/images/logo.png',
    smoothScroll: true,
    navbar,
    sidebar,
    editLink: false,
    contributors: false,
    repo: "https://github.com/steven7sheng/vue-press",
  },
  plugins: [
    ['@vuepress/search', { searchMaxSuggestions: 10 }],
    ['@vuepress/plugin-palette', {
      preset: 'scss',
      userPaletteFile: '.vuepress/styles/palette.scss',
      tempPaletteFile: 'styles/palette.scss',
      userStyleFile: '.vuepress/styles/index.styl',
      tempStyleFile: 'styles/index.styl',
      importCode: (filePath) => `@forward '${filePath}';\n`
    }]
  ]
});