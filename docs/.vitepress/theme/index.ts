import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import MermaidDiagram from './MermaidDiagram.vue'
import P2PGenerator from './components/P2PGenerator.vue'
import WelcomePage from './components/WelcomePage.vue'
import NuvioSidebar from './components/NuvioSidebar.vue'
import MobileNavigation from './components/MobileNavigation.vue'
import './custom.css'
import './nuvio-shell.css'
import './mobile-shell.css'

export default {
  extends: DefaultTheme,
  Layout: () => h(DefaultTheme.Layout, null, {
    'layout-top': () => [h(NuvioSidebar), h(MobileNavigation)]
  }),
  enhanceApp({ app }) {
    app.component('MermaidDiagram', MermaidDiagram)
    app.component('P2PGenerator', P2PGenerator)
    app.component('WelcomePage', WelcomePage)
  }
}
