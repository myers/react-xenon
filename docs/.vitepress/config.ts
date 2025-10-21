import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'React Xenon',
  description: 'A WebXR UI library for building interactive user interfaces in virtual reality',
  base: process.env.GITHUB_PAGES ? '/react-xenon/' : '/',
  ignoreDeadLinks: true,

  head: [
    ['link', { rel: 'icon', href: '/logo.svg', type: 'image/svg+xml' }],
  ],

  vite: {
    server: {
      middlewareMode: false,
    },
    plugins: [
      {
        name: 'add-headers',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            // Add your custom headers here
            res.setHeader('X-Custom-Header', 'React Xenon Docs')
            next()
          })
        },
      },
    ],
  },

  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'API', link: '/api/xenon' },
      { text: 'Examples', link: '/examples' },
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Introduction',
          items: [
            { text: 'What is React Xenon?', link: '/guide/what-is-react-xenon' },
            { text: 'Getting Started', link: '/guide/getting-started' },
            { text: 'Installation', link: '/guide/installation' },
          ],
        },
        {
          text: 'Core Concepts',
          items: [
            { text: 'Xenon Component', link: '/guide/xenon-component' },
            { text: 'Event Handling', link: '/guide/event-handling' },
            { text: 'Canvas UI Integration', link: '/guide/canvas-ui' },
          ],
        },
      ],
      '/api/': [
        {
          text: 'API Reference',
          items: [
            { text: 'Xenon', link: '/api/xenon' },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/myers/react-xenon' },
    ],

    footer: {
      message: 'Released under the MIT License.',
    },
  },
})
