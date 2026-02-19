/**
 * mdi-gallery-dev — Galeria de ícones @mdi/js para Vue 3 + Vuetify 3.
 * Uso recomendado: instalar como devDependency e registrar a rota em desenvolvimento.
 */

/**
 * Configuração da rota da galeria (path: /mdi-icons, sem auth).
 * @type {import('vue-router').RouteRecordRaw}
 */
export const mdiGalleryRoute = {
  name: "MdiIconsGallery",
  path: "/mdi-icons",
  component: () => import("./MdiIconsGallery.vue"),
  meta: { requiresAuth: false },
};

/**
 * Adiciona a rota da galeria ao router.
 * @param {import('vue-router').Router} router - instância do Vue Router
 */
export function installMdiGallery(router) {
  if (router && typeof router.addRoute === "function") {
    router.addRoute(mdiGalleryRoute);
  }
}

export { default as MdiIconsGallery } from "./MdiIconsGallery.vue";
