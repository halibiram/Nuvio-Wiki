<script setup lang="ts">
import { useData } from 'vitepress'
import { nextTick, onMounted, ref, watch } from 'vue'

const props = defineProps<{
  code: string
}>()

const { isDark } = useData()
const output = ref<HTMLElement | null>(null)
const loading = ref(true)
const failed = ref(false)

let renderCount = 0
const instanceId = Math.random().toString(36).slice(2)

async function renderDiagram() {
  const target = output.value
  if (!target) return

  loading.value = true
  failed.value = false

  try {
    const { default: mermaid } = await import('mermaid')
    const themeVariables = isDark.value
      ? {
          background: '#121b27',
          primaryColor: '#17365c',
          primaryTextColor: '#edf5ff',
          primaryBorderColor: '#58a6ff',
          secondaryColor: '#153f4b',
          secondaryTextColor: '#edf5ff',
          secondaryBorderColor: '#61d7f3',
          tertiaryColor: '#1d2939',
          tertiaryTextColor: '#d9e8f8',
          tertiaryBorderColor: '#536a84',
          lineColor: '#8ca4be',
          edgeLabelBackground: '#121b27',
          clusterBkg: '#101a27',
          clusterBorder: '#30445e',
          noteBkgColor: '#24354b',
          noteTextColor: '#edf5ff',
          noteBorderColor: '#58a6ff',
          titleColor: '#edf5ff'
        }
      : {
          background: '#f8fbff',
          primaryColor: '#e7f1ff',
          primaryTextColor: '#132238',
          primaryBorderColor: '#0877f9',
          secondaryColor: '#e4f8fc',
          secondaryTextColor: '#132238',
          secondaryBorderColor: '#0891b2',
          tertiaryColor: '#eef4fb',
          tertiaryTextColor: '#273b54',
          tertiaryBorderColor: '#91a5ba',
          lineColor: '#647b95',
          edgeLabelBackground: '#f8fbff',
          clusterBkg: '#f3f7fc',
          clusterBorder: '#c6d4e4',
          noteBkgColor: '#fff8d8',
          noteTextColor: '#4d3b00',
          noteBorderColor: '#d5a800',
          titleColor: '#132238'
        }

    mermaid.initialize({
      startOnLoad: false,
      securityLevel: 'strict',
      theme: 'base',
      themeVariables: {
        ...themeVariables,
        fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
        fontSize: '15px'
      },
      flowchart: {
        curve: 'basis',
        htmlLabels: true,
        nodeSpacing: 42,
        rankSpacing: 56,
        padding: 14,
        useMaxWidth: true
      }
    })

    const id = `mermaid-${instanceId}-${renderCount++}`
    const { svg, bindFunctions } = await mermaid.render(id, decodeURIComponent(props.code))
    target.innerHTML = svg
    bindFunctions?.(target)
  } catch (error) {
    target.replaceChildren()
    failed.value = true
    console.error('Unable to render Mermaid diagram:', error)
  } finally {
    loading.value = false
  }
}

onMounted(renderDiagram)
watch(isDark, async () => {
  await nextTick()
  await renderDiagram()
})
</script>

<template>
  <div class="mermaid-diagram">
    <div ref="output" class="mermaid-diagram__output" role="img" aria-label="Diagram" />
    <p v-if="loading" class="mermaid-diagram__status">Rendering diagram...</p>
    <p v-else-if="failed" class="mermaid-diagram__status mermaid-diagram__status--error">
      This diagram could not be rendered.
    </p>
  </div>
</template>
