import { _ as __nuxt_component_0 } from './responsive-utils-BS0Y8toX.mjs';
import { _ as __nuxt_component_1 } from './ArticleList-CVE19LsK.mjs';
import { mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import { _ as _export_sfc } from './server.mjs';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'axios';
import 'axios-extensions';
import 'vue-router';
import 'vue-i18n';

const _sfc_main = {
  name: "AdminPage",
  components: {
    ArticleList: __nuxt_component_1,
    AppHeader: __nuxt_component_0
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_app_header = __nuxt_component_0;
  const _component_article_list = __nuxt_component_1;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "admin-page" }, _attrs))}>`);
  _push(ssrRenderComponent(_component_app_header, null, null, _parent));
  _push(`<main>`);
  _push(ssrRenderComponent(_component_article_list, { "admin-mode": true }, null, _parent));
  _push(`</main></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const admin = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { admin as default };
//# sourceMappingURL=admin-BgKpIeKa.mjs.map
