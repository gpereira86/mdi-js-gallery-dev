# mdi-gallery-dev

Galeria de ícones **@mdi/js** para Vue 3 + Vuetify 3, com filtro dinâmico e carregamento em chunk. Pensada para uso em **desenvolvimento** (consultar e copiar nomes de ícones).

<img src="docs/animacao.gif" width="600">

## Instalação (apenas em dev)

No projeto Vue 3 + Vuetify que já usa `@mdi/js`:

```bash
npm install mdi-gallery-dev --save-dev
```

Ou, direto pelo repositório Git:

```bash
npm install git+https://github.com/gpereira86/mdi-js-gallery-dev.git#main:packages/mdi-gallery-dev --save-dev
```

Ou por pasta local:

```bash
npm install ./packages/mdi-gallery-dev --save-dev
```

## Uso

Depois de criar o router, adicione a rota da galeria (por exemplo em `src/router/index.ts` ou `main.ts`),
restringindo o uso a ambiente de desenvolvimento (ou a uma flag explícita), como no exemplo abaixo:

```js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { installMdiGallery } from 'mdi-gallery-dev';

// Habilita a galeria apenas em ambiente dev ou quando a flag estiver ligada
const enableDevRoutes =
  import.meta.env.DEV || import.meta.env.VITE_ENABLE_DEV_ROUTES === 'true';

const app = createApp(App);
app.use(router);

if (enableDevRoutes) {
  // Registrar a galeria (rota /mdi-icons, sem login)
  installMdiGallery(router);
}

app.mount('#app');
```

Ou adicione a rota manualmente com a mesma proteção:

```js
import router from './router';
import { mdiGalleryRoute } from 'mdi-gallery-dev';

const enableDevRoutes =
  import.meta.env.DEV || import.meta.env.VITE_ENABLE_DEV_ROUTES === 'true';

if (enableDevRoutes) {
  router.addRoute(mdiGalleryRoute);
}
```

## Acesso

Com o app rodando, abra: **`http://localhost:PORT/mdi-icons`**

- Filtro por nome do ícone  
- Clique no card para ver o ícone em tamanho maior e o código de uso (import + `<v-icon>`)  
- Renderização em chunk ao rolar a página  

## Dependências do seu projeto

O pacote espera que o projeto já tenha:

- `vue` ^3.4
- `vuetify` ^3.0
- `@mdi/js`

## Remover

1. Desinstale: `npm uninstall mdi-gallery-dev`
2. Remova a chamada `installMdiGallery(router)` (ou `router.addRoute(mdiGalleryRoute)`) do seu código.

