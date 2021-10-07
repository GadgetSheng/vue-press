const sidebar = [
  {
    text: 'Guide',
    link: '/guide/'
  },
  {
    text: 'Category',
    link: '/category/',
    children: ['/category/article-1', '/category/article-2']
  },
  {
    text: 'packager',
    link: '/packager/',
    children: ['/packager/webpack.md']
  }
];
export default sidebar;
