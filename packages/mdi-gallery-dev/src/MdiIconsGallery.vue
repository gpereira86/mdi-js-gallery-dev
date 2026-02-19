<script setup lang="ts">
/**
 * Galeria @mdi/js — filtro dinâmico, carregamento e renderização em chunk.
 */
import { computed, onMounted, onUnmounted, ref, watch } from "vue";

const CHUNK_SIZE = 80;
const SCROLL_MARGIN = 300;

type MdiModule = typeof import("@mdi/js");
const mdiModule = ref<MdiModule | null>(null);
const loading = ref(true);

const allIcons = computed(() => {
  const m = mdiModule.value;
  if (!m) return [];
  return Object.entries(m)
    .filter(([name]) => typeof name === "string" && name.startsWith("mdi"))
    .map(([name, path]) => ({ name, path: path as string }))
    .sort((a, b) => a.name.localeCompare(b.name));
});

const filter = ref("");
const icons = computed(() => {
  const list = allIcons.value;
  const q = filter.value.trim().toLowerCase();
  if (!q) return list;
  return list.filter((item) => item.name.toLowerCase().includes(q));
});

const visibleCount = ref(CHUNK_SIZE);
const iconsToRender = computed(() => icons.value.slice(0, visibleCount.value));
const hasMore = computed(() => iconsToRender.value.length < icons.value.length);

function loadMore() {
  if (loading.value || !hasMore.value) return;
  visibleCount.value = Math.min(visibleCount.value + CHUNK_SIZE, icons.value.length);
}

watch(icons, () => {
  visibleCount.value = CHUNK_SIZE;
}, { flush: "sync" });

function onScroll() {
  const scrollBottom = window.innerHeight + window.scrollY;
  const docHeight = document.documentElement.scrollHeight;
  if (scrollBottom >= docHeight - SCROLL_MARGIN) {
    loadMore();
  }
}

onMounted(() => {
  import("@mdi/js").then((m) => {
    mdiModule.value = m;
    loading.value = false;
  });

  window.addEventListener("scroll", onScroll, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener("scroll", onScroll);
});

const selectedIcon = ref<{ name: string; path: string } | null>(null);
const showModal = computed({
  get: () => selectedIcon.value !== null,
  set: (v) => { if (!v) selectedIcon.value = null; },
});

function openModal(item: { name: string; path: string }) {
  selectedIcon.value = item;
}

const importSnippet = computed(() =>
  selectedIcon.value ? `import { ${selectedIcon.value.name} } from "@mdi/js";` : ""
);
const usageSnippet = computed(() =>
  selectedIcon.value ? `<v-icon :icon="${selectedIcon.value.name}" />` : ""
);

function copyCode(text: string) {
  navigator.clipboard.writeText(text);
}
</script>

<template>
  <div class="mdi-gallery">
    <v-card class="gallery-header" variant="tonal" color="primary">
      <v-card-text class="pa-4 pa-sm-5">
        <div class="d-flex align-center gap-2 mb-3">
          <div class="header-icon-wrap">
            <v-icon v-if="mdiModule" :icon="mdiModule.mdiShape" size="28" />
            <span v-else class="header-icon-placeholder" />
          </div>
          <h1 class="gallery-title text-h4">MDI Icons</h1>
          <v-chip size="small" variant="flat" color="primary" class="ms-2">
            @mdi/js
          </v-chip>
        </div>
        <p class="text-body-2 mb-4 gallery-stats">
          <template v-if="loading">Carregando ícones...</template>
          <template v-else>
            {{ filter ? `${icons.length} de ${allIcons.length} ícones` : `Total: ${allIcons.length} ícones` }}
            <template v-if="!loading && hasMore"> · {{ iconsToRender.length }} exibidos (role para mais)</template>
          </template>
        </p>
        <div class="filter-row">
          <v-text-field
            v-model="filter"
            label="Filtrar por nome"
            placeholder="Ex: mdiAccount, arrow..."
            clearable
            density="compact"
            hide-details
            class="filter-field"
            :disabled="loading"
            variant="outlined"
            bg-color="surface"
            rounded="lg"
          />
          <v-btn
            class="filter-clear-btn"
            color="primary"
            variant="outlined"
            size="small"
            rounded="lg"
            :disabled="loading || !filter.trim()"
            @click="filter = ''"
          >
            <v-icon v-if="mdiModule" :icon="mdiModule.mdiFilterOffOutline" size="18" class="me-1" />
            Limpar filtros
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
    <div class="gallery-body pa-4">
    <div v-if="loading" class="loading-wrap">
      <v-progress-circular indeterminate color="primary" size="48" />
      <span class="ml-3">Carregando ícones em chunk...</span>
    </div>
    <div v-else class="icon-grid-wrap">
      <div class="icon-grid">
        <v-card
          v-for="item in iconsToRender"
          :key="item.name"
          variant="outlined"
          class="icon-card"
          role="button"
          tabindex="0"
          @click="openModal(item)"
          @keydown.enter="openModal(item)"
        >
          <div class="icon-cell">
            <v-icon :icon="item.path" size="28" class="icon-preview" />
            <span class="icon-name">{{ item.name }}</span>
          </div>
        </v-card>
      </div>
      <p v-if="hasMore" class="text-caption text-center mt-2 text-medium-emphasis">
        {{ iconsToRender.length }} de {{ icons.length }} exibidos — role para carregar mais
      </p>
    </div>
    </div>

    <v-dialog
      v-model="showModal"
      max-width="480"
      persistent
      transition="dialog-transition"
    >
      <v-card v-if="selectedIcon" class="modal-card">
        <v-card-title class="d-flex align-center justify-space-between">
          <span class="text-subtitle-1 font-mono">{{ selectedIcon.name }}</span>
          <v-btn icon variant="text" size="small" @click="showModal = false">
            <v-icon v-if="mdiModule" :icon="mdiModule.mdiClose" />
            <span v-else class="modal-close-fallback">×</span>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <div class="modal-icon-wrap mb-4">
            <v-icon :icon="selectedIcon.path" size="80" />
          </div>
          <p class="text-caption text-medium-emphasis mb-2">Como usar</p>
          <div class="code-block mb-2">
            <code>{{ importSnippet }}</code>
            <v-btn
              size="x-small"
              variant="text"
              class="copy-btn"
              @click="copyCode(importSnippet)"
            >
              Copiar
            </v-btn>
          </div>
          <div class="code-block">
            <code>{{ usageSnippet }}</code>
            <v-btn
              size="x-small"
              variant="text"
              class="copy-btn"
              @click="copyCode(usageSnippet)"
            >
              Copiar
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
.mdi-gallery {
  min-height: 100vh;
  background: rgb(var(--v-theme-surface));
}
.gallery-header {
  position: sticky;
  top: 0;
  z-index: 10;
  border-radius: 0 0 12px 12px !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  overflow: hidden;
}
.gallery-header::before {
  content: "";
  position: absolute;
  inset: 0;
  background: rgb(var(--v-theme-surface));
  z-index: -1;
}
.gallery-body {
  margin-top: 16px;
}
.header-icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: rgba(var(--v-theme-primary), 0.2);
}
.header-icon-placeholder {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  background: rgba(var(--v-theme-primary), 0.3);
}
.gallery-title {
  font-weight: 700;
  letter-spacing: -0.02em;
}
.gallery-stats {
  opacity: 0.9;
}
.loading-wrap {
  display: flex;
  align-items: center;
  padding: 32px 0;
}
.filter-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}
.filter-field {
  flex: 1;
  min-width: 200px;
  max-width: 320px;
}
.filter-clear-btn {
  flex-shrink: 0;
  min-height: 40px;
}
.icon-grid-wrap {
  position: relative;
}
.icon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 12px;
}
.icon-card {
  border-width: 1px;
}
.icon-cell {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  font-family: monospace;
  font-size: 0.8rem;
  word-break: break-all;
}
.icon-card:hover {
  background: rgba(var(--v-theme-primary), 0.06);
}
.icon-preview {
  flex-shrink: 0;
}
.icon-name {
  min-width: 0;
}

.modal-icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: rgba(var(--v-theme-surface-variant), 0.3);
  border-radius: 8px;
}
.code-block {
  position: relative;
  padding: 10px 12px;
  padding-right: 64px;
  background: rgba(0, 0, 0, 0.06);
  border-radius: 6px;
  font-family: monospace;
  font-size: 0.8rem;
  word-break: break-all;
}
.code-block .copy-btn {
  position: absolute;
  top: 4px;
  right: 4px;
}
.modal-close-fallback {
  font-size: 1.5rem;
  line-height: 1;
  opacity: 0.7;
}
</style>
