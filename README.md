# mdi-gallery-dev

Galeria de ícones **@mdi/js** para Vue 3 + Vuetify 3, com filtro dinâmico e carregamento em chunk. Pensada para uso em **desenvolvimento** (consultar e copiar nomes de ícones).

## Instalação (apenas em dev)

No projeto Vue 3 + Vuetify que já usa `@mdi/js`:

```bash
npm install mdi-gallery-dev --save-dev
```

Ou, se o pacote estiver em um repositório Git:

```bash
npm install git+https://github.com/SEU-USUARIO/SEU-REPO.git#main:packages/mdi-gallery-dev --save-dev
```

Ou por pasta local (para testar antes de publicar):

```bash
npm install ./packages/mdi-gallery-dev --save-dev
```

## Uso

Depois de criar o router, adicione a rota da galeria (por exemplo em `src/router/index.ts` ou `main.ts`):

```js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { installMdiGallery } from 'mdi-gallery-dev';

const app = createApp(App);
app.use(router);

// Registrar a galeria (rota /mdi-icons, sem login)
installMdiGallery(router);

app.mount('#app');
```

Ou adicione a rota manualmente:

```js
import { mdiGalleryRoute } from 'mdi-gallery-dev';

router.addRoute(mdiGalleryRoute);
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

## Compartilhar com amigos

1. **Publicar no npm** (se tiver conta): na pasta `packages/mdi-gallery-dev`, rode `npm publish --access public`.  
2. **GitHub**: suba o repositório e use o comando `npm install git+https://...` acima.  
3. **Zip**: compacte a pasta `packages/mdi-gallery-dev` e envie; o amigo descompacta e usa `npm install ./caminho/mdi-gallery-dev --save-dev`.

## Remover

1. Desinstale: `npm uninstall mdi-gallery-dev`
2. Remova a chamada `installMdiGallery(router)` (ou `router.addRoute(mdiGalleryRoute)`) do seu código.

