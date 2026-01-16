import { resolveComponent, mergeProps, createVNode, resolveDynamicComponent, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderComponent, ssrInterpolate, ssrRenderVNode } from 'vue/server-renderer';
import { _ as _export_sfc, b as useRuntimeConfig } from './server.mjs';
import { p as publicAssetsURL } from '../routes/renderer.mjs';
import axios from 'axios';
import { cacheAdapterEnhancer } from 'axios-extensions';

const _sfc_main$4 = {
  name: "AppButton",
  props: {
    text: { type: String, default: () => "" },
    to: { type: String, default: () => void 0 },
    tag: { type: String, default: () => "button" },
    allowMultipleClick: { type: Boolean, default: () => false },
    hide: { type: Boolean, default: () => false }
  },
  methods: {
    onClick(e) {
      e.preventDefault();
      this.$emit("click");
    }
  }
};
function _sfc_ssrRender$4(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  ssrRenderVNode(_push, createVNode(resolveDynamicComponent($props.tag), mergeProps({
    type: $props.tag === "button" ? "button" : void 0,
    class: $props.hide ? "hidden" : "button",
    to: $props.to,
    onClick: [(e) => $props.allowMultipleClick ? $options.onClick(e) : void 0, (e) => $props.allowMultipleClick ? void 0 : $options.onClick(e)]
  }, _attrs), {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`${ssrInterpolate($props.text)}`);
      } else {
        return [
          createTextVNode(toDisplayString($props.text), 1)
        ];
      }
    }),
    _: 1
  }), _parent);
}
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AppButton/AppButton.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const __nuxt_component_4 = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["ssrRender", _sfc_ssrRender$4], ["__scopeId", "data-v-5bc84ef5"]]);
const env = (key) => {
  {
    try {
      const { public: publicConfig } = useRuntimeConfig();
      if (publicConfig && publicConfig.apiBase) {
        return `${publicConfig.apiBase}/`;
      }
    } catch (e) {
      if (process && process.env && process.env.NUXT_ENV_API_URL) {
        return `${process.env.NUXT_ENV_API_URL}/`;
      }
    }
  }
  return process.env[key];
};
const error = (err) => {
  console.error(err);
};
const logger = {
  error
};
const http = axios.create({
  baseURL: `${env("API_URL")}api/`,
  headers: {
    Accept: "application/json",
    "Cache-Control": `public, max-age=${24 * 3600}`
  },
  adapter: cacheAdapterEnhancer(axios.defaults.adapter)
});
const getAll = async (path) => {
  try {
    const response = await http.get(path);
    return response.data;
  } catch (error2) {
    logger.error(error2.message);
    throw error2;
  }
};
const post = async (path, data) => {
  try {
    const response = await http.post(path, data);
    return response.data;
  } catch (error2) {
    logger.error(error2.message);
    throw error2;
  }
};
const put = async (path, data) => {
  try {
    const response = await http.patch(path, data);
    return response.data;
  } catch (error2) {
    logger.error(error2.message);
    throw error2;
  }
};
const deleteById = async (path) => {
  try {
    const response = await http.delete(path);
    return response.data;
  } catch (error2) {
    logger.error(error2.message);
    throw error2;
  }
};
const apiService = {
  get: getAll,
  post,
  put,
  delete: deleteById
};
const ThemeApi = {
  send(previousTheme, newTheme) {
    return apiService.post("theme", { previousTheme, newTheme });
  }
};
const _sfc_main$3 = {
  name: "DarkModeToggle",
  components: { AppButton: __nuxt_component_4 },
  computed: {
    changeThemeIcon() {
      return this.isDarkMode ? "\u2600\uFE0F" : "\u{1F319}\uFE0F";
    },
    isDarkMode() {
      return this.$store.state.theme === "dark";
    }
  },
  mounted() {
    this.$store.commit("GET_THEME_MODE");
  },
  methods: {
    toggleDarkMode() {
      if (this.isDarkMode) {
        ThemeApi.send(this.$store.state.theme, "light");
        this.$store.commit("SET_THEME_MODE", "light");
      } else {
        ThemeApi.send(this.$store.state.theme, "dark");
        this.$store.commit("SET_THEME_MODE", "dark");
      }
    }
  }
};
function _sfc_ssrRender$3(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_app_button = __nuxt_component_4;
  _push(ssrRenderComponent(_component_app_button, mergeProps({
    class: "dark-button",
    text: $options.changeThemeIcon,
    "allow-multiple-click": true,
    onClick: $options.toggleDarkMode
  }, _attrs), null, _parent));
}
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AppHeader/NavControl/DarkModeToggle/DarkModeToggle.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const DarkModeToggle = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["ssrRender", _sfc_ssrRender$3], ["__scopeId", "data-v-23d894af"]]);
const _sfc_main$2 = {
  name: "NewModeToggle",
  components: { AppButton: __nuxt_component_4 },
  computed: {
    changeThemeIcon() {
      return this.isNewMode ? "\u{1F3A8}" : "\u{1F3A8}";
    },
    isNewMode() {
      return this.$store.state.theme === "new";
    }
  },
  methods: {
    toggleNewMode() {
      if (this.isNewMode) {
        ThemeApi.send(this.$store.state.theme, "light");
        this.$store.commit("SET_THEME_MODE", "light");
      } else {
        ThemeApi.send(this.$store.state.theme, "new");
        this.$store.commit("SET_THEME_MODE", "new");
      }
    }
  }
};
function _sfc_ssrRender$2(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_app_button = __nuxt_component_4;
  _push(ssrRenderComponent(_component_app_button, mergeProps({
    class: "new-button",
    text: $options.changeThemeIcon,
    "allow-multiple-click": true,
    onClick: $options.toggleNewMode
  }, _attrs), null, _parent));
}
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AppHeader/NavControl/NewModeToggle/NewModeToggle.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const NewModeToggle = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["ssrRender", _sfc_ssrRender$2], ["__scopeId", "data-v-1e6909c5"]]);
const _imports_0$1 = publicAssetsURL("/tdm.jpg");
const _sfc_main$1 = {
  name: "NavControl",
  components: { AppButton: __nuxt_component_4, DarkModeToggle, NewModeToggle },
  data: () => ({
    showNavBarButton: false
  }),
  methods: {
    switchLanguage() {
      (void 0).location.href = this.$t("otherUrl") + (void 0).location.pathname;
    },
    displaySubscribeModal() {
    },
    displayFeedbackModal() {
    }
  },
  i18n: {
    silentTranslationWarn: true,
    messages: {
      fr: {
        subscribe: "S\u2019abonner",
        suggestion: "Laisser un message",
        tdm: "Retrouver l\u2019ancien site du tour du monde de Pierre et Beno\xEEt",
        logo: "Logo",
        otherLanguage: "\u{1F1EC}\u{1F1E7}",
        otherUrl: "https://www.recontact.me"
      },
      en: {
        subscribe: "Subscribe",
        suggestion: "Leave a message",
        tdm: "Go to see the former website of the world trip of Pierre and Beno\xEEt",
        logo: "Logo",
        otherLanguage: "\u{1F1EB}\u{1F1F7}",
        otherUrl: "https://fr.recontact.me"
      }
    }
  }
};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_app_button = __nuxt_component_4;
  const _component_new_mode_toggle = resolveComponent("new-mode-toggle");
  const _component_dark_mode_toggle = resolveComponent("dark-mode-toggle");
  _push(`<ul${ssrRenderAttrs(mergeProps({ class: "navigation" }, _attrs))} data-v-9ff91820>`);
  if (_ctx.showNavBarButton) {
    _push(`<li class="link" data-v-9ff91820>`);
    _push(ssrRenderComponent(_component_app_button, {
      class: "subscribe",
      text: _ctx.$t("subscribe"),
      onClick: $options.displaySubscribeModal
    }, null, _parent));
    _push(`</li>`);
  } else {
    _push(`<!---->`);
  }
  if (_ctx.showNavBarButton) {
    _push(`<li class="link" data-v-9ff91820>`);
    _push(ssrRenderComponent(_component_app_button, {
      class: "suggestion",
      text: _ctx.$t("suggestion"),
      onClick: $options.displayFeedbackModal
    }, null, _parent));
    _push(`</li>`);
  } else {
    _push(`<!---->`);
  }
  if (_ctx.showNavBarButton) {
    _push(`<li class="link tdm" data-v-9ff91820><a${ssrRenderAttr("title", _ctx.$t("tdm"))} class="tdm" href="http://worldtour.recontact.me" data-v-9ff91820><img${ssrRenderAttr("alt", _ctx.$t("logo"))} class="tdm__image"${ssrRenderAttr("src", _imports_0$1)} data-v-9ff91820></a></li>`);
  } else {
    _push(`<!---->`);
  }
  _push(`<li data-v-9ff91820>`);
  _push(ssrRenderComponent(_component_app_button, { hide: true }, null, _parent));
  _push(`</li><li class="link new-link" data-v-9ff91820>`);
  _push(ssrRenderComponent(_component_new_mode_toggle, null, null, _parent));
  _push(`</li><li class="link dark-link" data-v-9ff91820>`);
  _push(ssrRenderComponent(_component_dark_mode_toggle, null, null, _parent));
  _push(`</li><li class="link other-language" data-v-9ff91820>`);
  _push(ssrRenderComponent(_component_app_button, {
    class: "other-language",
    text: _ctx.$t("otherLanguage"),
    onClick: $options.switchLanguage
  }, null, _parent));
  _push(`</li></ul>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AppHeader/NavControl/NavControl.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const NavControl = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender$1], ["__scopeId", "data-v-9ff91820"]]);
const _imports_0 = publicAssetsURL("/velo.png");
const _sfc_main = {
  name: "AppHeader",
  components: { NavControl, AppButton: __nuxt_component_4 },
  data: () => ({
    otherUrl: "",
    showNavbar: true,
    lastScrollPosition: 0,
    isArticlePage: false,
    articleId: null,
    previousArticleId: null,
    nextArticleId: null
  }),
  mounted() {
    (void 0).addEventListener("scroll", this.onScroll);
    this.isArticlePage = (void 0).location.pathname.includes("/articles/");
    if (this.isArticlePage) {
      this.articleId = (void 0).location.pathname.split("/articles/")[1].split("/")[0];
      this.previousArticleId = this.articleId !== "1" ? `/articles/${this.articleId - 1}` : null;
      this.nextArticleId = `/articles/${this.articleId - 1 + 2}`;
    }
  },
  beforeDestroy() {
    (void 0).removeEventListener("scroll", this.onScroll);
  },
  methods: {
    onScroll() {
      const currentScrollPosition = (void 0).pageYOffset || (void 0).documentElement.scrollTop;
      if (currentScrollPosition < 0) {
        return;
      }
      if (Math.abs(currentScrollPosition - this.lastScrollPosition) < 60) {
        return;
      }
      this.showNavbar = currentScrollPosition < this.lastScrollPosition;
      this.lastScrollPosition = currentScrollPosition;
    }
  },
  i18n: {
    silentTranslationWarn: true,
    messages: {
      fr: {
        home: "Page d\u2019accueil",
        logo: "Logo",
        previousArticle: "<",
        nextArticle: ">",
        article: "Article"
      },
      en: {
        home: "Home page",
        logo: "Logo",
        previousArticle: "<",
        nextArticle: ">",
        article: "Article"
      }
    }
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_app_button = __nuxt_component_4;
  const _component_nav_control = resolveComponent("nav-control");
  _push(`<header${ssrRenderAttrs(mergeProps({
    class: ["header", { "navbar-hidden": !_ctx.showNavbar }]
  }, _attrs))} data-v-df15dbf1><div class="container" data-v-df15dbf1><a${ssrRenderAttr("title", _ctx.$t("home"))} class="logo" href="/" data-v-df15dbf1><img${ssrRenderAttr("alt", _ctx.$t("logo"))} class="icon" width="38" height="38"${ssrRenderAttr("src", _imports_0)} data-v-df15dbf1><span class="recontact" data-v-df15dbf1>Recontact</span><span class="me" data-v-df15dbf1>Me</span></a>`);
  if (_ctx.isArticlePage) {
    _push(`<nav aria-label="navigation" data-v-df15dbf1><ul class="navigation" data-v-df15dbf1><li class="article" data-v-df15dbf1>`);
    if (_ctx.previousArticleId) {
      _push(ssrRenderComponent(_component_app_button, {
        to: _ctx.previousArticleId,
        tag: "nuxt-link",
        class: "article",
        text: _ctx.$t("previousArticle")
      }, null, _parent));
    } else {
      _push(`<!---->`);
    }
    _push(`</li><li class="article-text" data-v-df15dbf1><p class="id" data-v-df15dbf1> Article ${ssrInterpolate(_ctx.articleId)}</p></li><li class="article" data-v-df15dbf1>`);
    if (_ctx.nextArticleId) {
      _push(ssrRenderComponent(_component_app_button, {
        to: _ctx.nextArticleId,
        tag: "nuxt-link",
        class: "article",
        text: _ctx.$t("nextArticle")
      }, null, _parent));
    } else {
      _push(`<!---->`);
    }
    _push(`</li></ul></nav>`);
  } else {
    _push(`<!---->`);
  }
  _push(`<nav aria-label="navigation" data-v-df15dbf1>`);
  _push(ssrRenderComponent(_component_nav_control, null, null, _parent));
  _push(`</nav></div></header>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AppHeader/AppHeader.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-df15dbf1"]]);
const notificationsService = {
  information(message) {
    console.log(message);
  },
  error(message) {
    console.error(message);
    (void 0).alert(message);
  },
  warn(message) {
    console.warn(message);
  }
};
const ChaptersApi = {
  fetch(id) {
    return apiService.get(`articles/${id}`);
  },
  update(id, position) {
    return apiService.put(`admin/articles/${id}/chapters/${position}`);
  }
};
const translationsService = {
  isFrancophone(language) {
    return language === "fr";
  },
  getTitle(article, language) {
    const title = this.isFrancophone(language) ? article.frTitle : article.enTitle;
    if (!title) {
      return article.dropboxId;
    }
    return title;
  },
  getChapterTitle(chapter, language) {
    return this.isFrancophone(language) ? chapter.frTitle : chapter.enTitle;
  },
  getChapterText(chapter, language) {
    return this.isFrancophone(language) ? chapter.frText : chapter.enText;
  }
};
const screenWidth = () => {
  {
    return "1000";
  }
};
const PHONE_PORTRAIT_TO_LANDSCAPE = 640;
const PHONE_LANDSCAPE_TO_TABLET = 1e3;
const LARGE_DESKTOP_LIMIT = 1240;
const IS_DESKTOP = () => screenWidth() > PHONE_LANDSCAPE_TO_TABLET;
const IS_TABLET = () => screenWidth() > PHONE_PORTRAIT_TO_LANDSCAPE && screenWidth() <= PHONE_LANDSCAPE_TO_TABLET;

export { ChaptersApi as C, IS_DESKTOP as I, LARGE_DESKTOP_LIMIT as L, __nuxt_component_0 as _, __nuxt_component_4 as a, apiService as b, IS_TABLET as c, logger as l, notificationsService as n, screenWidth as s, translationsService as t };
//# sourceMappingURL=responsive-utils-BS0Y8toX.mjs.map
