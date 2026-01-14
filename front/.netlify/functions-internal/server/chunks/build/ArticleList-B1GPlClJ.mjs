import { I as IS_DESKTOP, t as translationsService, a as __nuxt_component_4, b as apiService, n as notificationsService, C as ChaptersApi } from './responsive-utils-Cna-zfBt.mjs';
import { mergeProps, resolveDirective, resolveComponent, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderList, ssrRenderAttr, ssrGetDirectiveProps, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { _ as _export_sfc } from './server.mjs';

const SyncApi = {
  launch() {
    const url = "sync/";
    return apiService.patch(url);
  }
};
const positionsApi = {
  fetchLast() {
    return apiService.get("positions/last");
  },
  add(position) {
    return apiService.post("positions", position);
  }
};
const _sfc_main$3 = {
  name: "PositionForm",
  data() {
    return {
      placeFr: null,
      placeEn: null,
      timeFr: null,
      timeEn: null
    };
  },
  methods: {
    submit(e) {
      e.preventDefault();
      this.updateLastPosition();
    },
    updateLastPosition() {
      if (this.placeFr === null || this.timeFr === null || this.placeEn === null || this.timeEn === null) {
        this.displayErrorMessage();
      } else {
        const position = {
          place: this.placeFr,
          time: this.timeFr,
          placeEn: this.placeEn,
          timeEn: this.timeEn
        };
        positionsApi.add(position).then(this.updateLastPositionData).then(this.displaySuccessMessage);
      }
    },
    updateLastPositionData() {
      this.$emit("updateLastPositionData", {
        place: this.placeFr,
        time: this.timeFr,
        placeEn: this.placeEn,
        timeEn: this.timeEn
      });
      this.resetPosition();
    },
    resetPosition() {
      this.placeFr = null;
      this.placeEn = null;
      this.timeFr = null;
      this.timeEn = null;
    },
    displayErrorMessage() {
      notificationsService.error(this.$t("positionNotUpdated"));
    },
    displaySuccessMessage() {
      notificationsService.information(this.$t("positionUpdated"));
    }
  },
  i18n: {
    messages: {
      fr: {
        placeFr: "Position:",
        placeEn: "Position:",
        timeFr: "Date:",
        timeEn: "Date:",
        lastPositionFr: "Nouvelle position\xA0FR :",
        lastPositionEn: "New position EN :",
        confirm: "Envoyer",
        positionUpdated: "Position mise-\xE0-jour",
        positionNotUpdated: "Renseigne toutes les informations. La position n'a pas \xE9t\xE9 mise-\xE0-jour"
      },
      en: {
        placeFr: "Position\xA0FR\xA0:",
        placeEn: "Position EN:",
        timeFr: "Date FR :",
        timeEn: "Date EN:",
        lastPositionFr: "Nouvelle position FR:",
        lastPositionEn: "New position EN:",
        confirm: "Confirm",
        positionUpdated: "Position updated",
        positionNotUpdated: "Fill all the informations. Position was not updated"
      }
    }
  }
};
function _sfc_ssrRender$3(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<form${ssrRenderAttrs(mergeProps({ class: "position__form" }, _attrs))} data-v-d04e0ec1><section data-v-d04e0ec1><p data-v-d04e0ec1>${ssrInterpolate(_ctx.$t("lastPositionFr"))}</p><span class="form-group" data-v-d04e0ec1><label for="positionFr-place" data-v-d04e0ec1>${ssrInterpolate(_ctx.$t("placeFr"))}</label><input id="positionFr-place"${ssrRenderAttr("value", $data.placeFr)} class="position__input position__place" placeholder="Paris" data-v-d04e0ec1></span><span class="form-group" data-v-d04e0ec1><label for="positionFr-time" data-v-d04e0ec1>${ssrInterpolate(_ctx.$t("timeFr"))}</label><input id="positionFr-time"${ssrRenderAttr("value", $data.timeFr)} class="position__input position__time" placeholder="le 1er mai 2018" data-v-d04e0ec1></span></section><section data-v-d04e0ec1><p data-v-d04e0ec1>${ssrInterpolate(_ctx.$t("lastPositionEn"))}</p><span class="form-group" data-v-d04e0ec1><label for="positionEn-place" data-v-d04e0ec1>${ssrInterpolate(_ctx.$t("placeEn"))}</label><input id="positionEn-place"${ssrRenderAttr("value", $data.placeEn)} class="position__input position__place" placeholder="London" data-v-d04e0ec1></span><span class="form-group" data-v-d04e0ec1><label for="positionEn-time" data-v-d04e0ec1>${ssrInterpolate(_ctx.$t("timeEn"))}</label><input id="positionEn-time"${ssrRenderAttr("value", $data.timeEn)} class="position__input position__time" placeholder="29th August 2020" data-v-d04e0ec1></span></section><button type="submit" class="position__button position__action--send" data-v-d04e0ec1>${ssrInterpolate(_ctx.$t("confirm"))}</button></form>`);
}
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AdminDashboard/PositionForm/PositionForm.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const PositionForm = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["ssrRender", _sfc_ssrRender$3], ["__scopeId", "data-v-d04e0ec1"]]);
const ArticlesApi = {
  fetchAll(limit) {
    return apiService.get(`articles?limit=${limit}`);
  },
  update(id) {
    return apiService.put(`admin/articles/${id}`);
  },
  delete(id) {
    return apiService.get(`apo/art/del/${id}`);
  },
  updateAll(min, max) {
    const data = { min, max };
    return apiService.put("admin/articles", data);
  },
  deleteAll() {
    return apiService.get("apo/art/del");
  },
  deleteAndSyncAll() {
    return apiService.get("apo/art/delsyn");
  }
};
const _sfc_main$2 = {
  name: "AdminDashboard",
  components: { PositionForm },
  data() {
    return {
      isClickedSync: false,
      min: 1,
      max: 100
    };
  },
  methods: {
    updateLastPositionData(position) {
      this.$emit("updateLastPositionData", position);
    },
    disableButton() {
      this.isClickedSync = true;
    },
    enableButton() {
      this.isClickedSync = false;
    },
    synchronise() {
      this.disableButton();
      notificationsService.information(this.$t("syncLaunched"));
      SyncApi.launch().then(() => {
        notificationsService.information(this.$t("syncDone"));
      }).then(() => this.goToHome()).catch((err) => {
        notificationsService.error(`${this.$t("syncError")} ${err}`);
      });
    },
    updateAll() {
      this.disableButton();
      notificationsService.information(this.$t("syncLaunched"));
      ArticlesApi.updateAll(this.min, this.max).then(() => {
        notificationsService.information(this.$t("syncDone"));
      }).then(() => this.goToHome()).catch((err) => {
        notificationsService.error(`${this.$t("syncError")} ${err}`);
      });
    },
    deleteAll() {
      this.disableButton();
      notificationsService.information(this.$t("syncLaunched"));
      ArticlesApi.deleteAll().then(() => {
        notificationsService.information(this.$t("syncDone"));
      }).then(() => this.goToHome()).catch((err) => {
        notificationsService.error(`${this.$t("syncError")} ${err}`);
      });
    },
    deleteAndSyncAll() {
      this.disableButton();
      notificationsService.information(this.$t("syncLaunched"));
      ArticlesApi.deleteAndSyncAll().then(() => {
        notificationsService.information(this.$t("syncDone"));
      }).then(() => this.goToHome()).catch((err) => {
        notificationsService.error(`${this.$t("syncError")} ${err}`);
      });
    },
    goToSubscriptions() {
      this.$router.push("/subscriptions");
    },
    goToHome() {
      this.enableButton();
      this.$router.push("/");
    }
  },
  i18n: {
    messages: {
      fr: {
        getNewArticles: "R\xE9cup\xE9rer les nouveaux articles",
        deleteAllArticles: "Supprimer tous les articles",
        updateAllArticles: "R\xE9parer tous les articles",
        deleteAndSyncAllArticles: "Supprimer & synchro tous les articles",
        getSubscribers: "R\xE9cup\xE9rer les abonn\xE9s de Recontact.me",
        syncLaunched: "La synchronisation est lanc\xE9e ! Patientez quelques secondes...",
        syncDone: "La synchronisation s\u2019est effectu\xE9e sans probl\xE8me\xA0\xA0!",
        syncError: "Erreur : Probl\xE8me durant la synchronisation\xA0\xA0:"
      },
      en: {
        getNewArticles: "Synchronise the new articles",
        deleteAllArticles: "Delete all articles",
        updateAllArticles: "Repare all articles",
        deleteAndSyncAllArticles: "Delete and synchronise all articles",
        getSubscribers: "Get the subscribers",
        syncLaunched: "The synchronisation is launched! Please wait...",
        syncDone: "The synchronisation succeeds!",
        syncError: "Error during the synchronisation:"
      }
    }
  }
};
function _sfc_ssrRender$2(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_position_form = resolveComponent("position-form");
  _push(`<div${ssrRenderAttrs(_attrs)} data-v-ecadb054><button${ssrIncludeBooleanAttr($data.isClickedSync) ? " disabled" : ""} class="dashboard__buttons" type="button" data-v-ecadb054>${ssrInterpolate(_ctx.$t("getNewArticles"))}</button><section data-v-ecadb054><button${ssrIncludeBooleanAttr($data.isClickedSync) ? " disabled" : ""} class="dashboard__buttons dashboard__sync_hidden" type="button" data-v-ecadb054>${ssrInterpolate(_ctx.$t("updateAllArticles"))}</button><label class="label" for="min" data-v-ecadb054>Min:</label><input id="min"${ssrRenderAttr("value", $data.min)} class="input"${ssrRenderAttr("placeholder", 1)} data-v-ecadb054><label class="label" for="max" data-v-ecadb054>Max:</label><input id="max"${ssrRenderAttr("value", $data.max)} class="input"${ssrRenderAttr("placeholder", 87)} data-v-ecadb054></section><button${ssrIncludeBooleanAttr($data.isClickedSync) ? " disabled" : ""} class="dashboard__buttons dashboard__sync_hidden" type="button" data-v-ecadb054>${ssrInterpolate(_ctx.$t("deleteAllArticles"))}</button><button${ssrIncludeBooleanAttr($data.isClickedSync) ? " disabled" : ""} class="dashboard__buttons dashboard__sync_hidden" type="button" data-v-ecadb054>${ssrInterpolate(_ctx.$t("deleteAndSyncAllArticles"))}</button><br data-v-ecadb054>`);
  _push(ssrRenderComponent(_component_position_form, { onUpdateLastPositionData: $options.updateLastPositionData }, null, _parent));
  _push(`</div>`);
}
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AdminDashboard/AdminDashboard.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["ssrRender", _sfc_ssrRender$2], ["__scopeId", "data-v-ecadb054"]]);
const _sfc_main$1 = {
  name: "ArticleCard",
  components: { AppButton: __nuxt_component_4 },
  props: {
    adminMode: { type: Boolean, default: () => false },
    article: { type: Object, default: () => {
    } },
    lazy: { type: Boolean, default: () => true }
  },
  data() {
    return {
      isUpdateClicked: false,
      isUpdateChapterClicked: false,
      isDeleteClicked: false,
      chapterToRepair: "0"
    };
  },
  computed: {
    articleUrl() {
      return `/articles/${this.article.dropboxId}`;
    },
    articleTitle() {
      const language = this.$store.state.locale;
      return translationsService.getTitle(this.article, language);
    }
  },
  methods: {
    viewArticle() {
      this.goToArticle();
    },
    updateArticle() {
      this.disableUpdateButton();
      notificationsService.information(this.$t("syncLaunched"));
      ArticlesApi.update(this.article.dropboxId).then(() => {
        notificationsService.information(this.$t("syncDone"));
      }).then(() => this.goToArticle()).catch((err) => {
        notificationsService.error(`${this.$t("syncError")} ${err}`);
      });
    },
    updateChapter() {
      const position = parseInt(this.chapterToRepair, 10);
      if (position <= 0 || position > 100 || Number.isNaN(position)) {
        notificationsService.error(`incorrect chapter number: ${this.chapterToRepair}`);
        return;
      }
      this.disableUpdateChapterButton();
      notificationsService.information(this.$t("syncLaunched"));
      ChaptersApi.update(this.article.dropboxId, position).then(() => {
        notificationsService.information(this.$t("syncDone"));
      }).then(() => this.goToArticle()).catch((err) => {
        notificationsService.error(`${this.$t("syncError")} ${err}`);
      });
    },
    disableUpdateButton() {
      this.isUpdateClicked = true;
    },
    disableUpdateChapterButton() {
      this.isUpdateChapterClicked = true;
    },
    deleteArticle() {
      this.disableDeleteButton();
      notificationsService.information(this.$t("deleteLaunched"));
      ArticlesApi.delete(this.article.dropboxId).then(() => {
        notificationsService.information(this.$t("deleteDone"));
      }).catch((err) => {
        notificationsService.error(`${this.$t("deleteError")} ${err}`);
      });
    },
    disableDeleteButton() {
      this.isDeleteClicked = true;
    },
    goToArticle() {
      this.$router.push(this.articleUrl);
    }
  },
  i18n: {
    silentTranslationWarn: true,
    messages: {
      fr: {
        repairArticle: "R\xE9parer l\u2019article",
        repairChapter: "R\xE9parer le chapitre",
        deleteArticle: "Supprimer l\u2019article",
        goToArticle: "Voir l\u2019article",
        viewGallery: "Voir les photos",
        syncLaunched: "La synchronisation est lanc\xE9e ! Patientez quelques secondes...",
        syncDone: "La synchronisation s\u2019est effectu\xE9e sans probl\xE8me\xA0\xA0!",
        syncError: "Erreur : Probl\xE8me durant la synchronisation\xA0\xA0:",
        deleteLaunched: "La suppression est lanc\xE9e ! Patientez quelques secondes...",
        deleteDone: "La suppression s\u2019est effectu\xE9e sans probl\xE8me\xA0\xA0!",
        deleteError: "Erreur : Probl\xE8me durant la suppression\xA0\xA0:"
      },
      en: {
        repairArticle: "Repair the article",
        repairChapter: "Repair the chapter",
        deleteArticle: "Delete the article",
        goToArticle: "Read the article",
        viewGallery: "Discover the pictures",
        syncLaunched: "The synchronisation is launched! Please wait...",
        syncDone: "The synchronisation succeeds!",
        syncError: "Error during the synchronisation:",
        deleteLaunched: "The deletion is launched! Please wait...",
        deleteDone: "The deletion succeeds!",
        deleteError: "Error during the deletion:"
      }
    }
  }
};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  var _a;
  const _component_app_button = __nuxt_component_4;
  const _directive_lazy = resolveDirective("lazy");
  let _temp0;
  _push(`<article${ssrRenderAttrs(mergeProps({ class: "article" }, _attrs))} data-v-1d954d30><a${ssrRenderAttr("href", $options.articleUrl)} class="article__link" data-v-1d954d30><h2 class="article__title" data-v-1d954d30>${ssrInterpolate($options.articleTitle)}</h2></a><div class="article__content" data-v-1d954d30>`);
  if ($props.lazy) {
    _push(`<img${ssrRenderAttrs(_temp0 = mergeProps({
      alt: $options.articleTitle,
      rel: "noreferrer",
      class: "article__image"
    }, ssrGetDirectiveProps(_ctx, _directive_lazy, $props.article.imgLink)))} data-v-1d954d30>${"textContent" in _temp0 ? ssrInterpolate(_temp0.textContent) : (_a = _temp0.innerHTML) != null ? _a : ""}`);
  } else {
    _push(`<img${ssrRenderAttr("src", $props.article.imgLink)}${ssrRenderAttr("alt", $options.articleTitle)} class="article__image important" width="200" data-v-1d954d30>`);
  }
  _push(`</div><footer class="article__footer" data-v-1d954d30>`);
  if ($props.adminMode) {
    _push(`<!--[--><form data-v-1d954d30>`);
    _push(ssrRenderComponent(_component_app_button, {
      disabled: $data.isUpdateChapterClicked,
      class: "app-button chapter-button",
      text: _ctx.$t("repairChapter"),
      onClick: $options.updateChapter
    }, null, _parent));
    _push(`<input${ssrRenderAttr("value", $data.chapterToRepair)} class="chapter-input" data-v-1d954d30></form>`);
    _push(ssrRenderComponent(_component_app_button, {
      disabled: $data.isUpdateClicked,
      class: "app-button",
      text: _ctx.$t("repairArticle"),
      onClick: $options.updateArticle
    }, null, _parent));
    _push(ssrRenderComponent(_component_app_button, {
      disabled: $data.isDeleteClicked,
      class: "app-button light",
      text: _ctx.$t("deleteArticle"),
      onClick: $options.deleteArticle
    }, null, _parent));
    _push(`<!--]-->`);
  } else {
    _push(`<!--[-->`);
    _push(ssrRenderComponent(_component_app_button, {
      class: "app-button",
      text: _ctx.$t("goToArticle"),
      onClick: $options.viewArticle
    }, null, _parent));
    _push(ssrRenderComponent(_component_app_button, {
      class: "app-button link",
      text: _ctx.$t("viewGallery"),
      href: $props.article.galleryLink,
      tag: "a",
      target: "_blank",
      rel: "noreferrer"
    }, null, _parent));
    _push(`<!--]-->`);
  }
  _push(`</footer></article>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ArticleCard/ArticleCard.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_1$1 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender$1], ["__scopeId", "data-v-1d954d30"]]);
const isCecile = () => {
  return false;
};
const getDropboxId = (article) => parseInt(article.dropboxId, 10);
const sortByDropboxId = (articles) => articles.sort(
  (articleA, articleB) => getDropboxId(articleA) < getDropboxId(articleB) ? 1 : -1
);
const _sfc_main = {
  name: "ArticleList",
  components: {
    AdminDashboard: __nuxt_component_0,
    ArticleCard: __nuxt_component_1$1
  },
  props: {
    adminMode: { type: Boolean, default: () => false },
    articlesNumberLimit: { type: Number, default: () => 0 }
  },
  data() {
    return {
      articles: [],
      lastPosition: ""
    };
  },
  computed: {
    hiddenTitle() {
      return this.adminMode ? this.$t("fixWebsite") : this.$t("theArticlesOfTheTrip");
    },
    title() {
      return this.$t("title");
    },
    subtitle() {
      return this.$t("lastKnownPosition");
    },
    isCecile() {
      return isCecile();
    }
  },
  mounted() {
    this.getArticles();
    this.getLastPosition();
  },
  methods: {
    getArticles() {
      ArticlesApi.fetchAll(this.articlesNumberLimit).then((articles) => {
        this.articles = sortByDropboxId(articles);
      });
    },
    updateLastPositionData({
      place,
      time,
      placeEn,
      timeEn
    }) {
      const language = this.$store.state.locale;
      if (translationsService.isFrancophone(language)) {
        this.lastPosition = `${place}, ${time}`;
      } else {
        this.lastPosition = `${placeEn}, ${timeEn}`;
      }
    },
    getLastPosition() {
      positionsApi.fetchLast().then(this.updateLastPositionData);
    },
    isLazyArticle(id) {
      return IS_DESKTOP() ? id < this.articles.length - 7 : id < this.articles.length - 1;
    }
  },
  i18n: {
    silentTranslationWarn: true,
    messages: {
      fr: {
        fixWebsite: "R\xE9parer le site",
        theArticlesOfTheTrip: "Blog de voyage de Pierre et Beno\xEEt apr\xE8s un tour du monde et d\u2019autres aventures",
        lastPosition: "Derni\xE8re position\xA0:",
        title: "Pierre en voyage",
        lastKnownPosition: "Derni\xE8re position connue\xA0:"
      },
      en: {
        fixWebsite: "Fix the website",
        theArticlesOfTheTrip: "Travel blog of Pierre and Beno\xEEt after a world trip and other adventures",
        lastPosition: "Last position:",
        title: "Discover the world with us!",
        lastKnownPosition: "Last known position:"
      }
    }
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_admin_dashboard = __nuxt_component_0;
  const _component_article_card = __nuxt_component_1$1;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "article-list" }, _attrs))} data-v-c4d2b0e8><section class="article-results" data-v-c4d2b0e8><h1 class="article-results__title hidden" data-v-c4d2b0e8>${ssrInterpolate($options.hiddenTitle)}</h1><p class="article-results__title" data-v-c4d2b0e8>${ssrInterpolate($options.title)}</p><p class="article-results__title h2" data-v-c4d2b0e8>${ssrInterpolate($options.subtitle)} `);
  if (!$options.isCecile) {
    _push(`<span class="article-results__title h3" data-v-c4d2b0e8>${ssrInterpolate($data.lastPosition)}</span>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</p>`);
  if ($props.adminMode) {
    _push(ssrRenderComponent(_component_admin_dashboard, { onUpdateLastPositionData: $options.updateLastPositionData }, null, _parent));
  } else {
    _push(`<!---->`);
  }
  _push(`<ul class="article-results__list" data-v-c4d2b0e8><!--[-->`);
  ssrRenderList($data.articles, (article) => {
    _push(`<li class="article-results__item" data-v-c4d2b0e8>`);
    _push(ssrRenderComponent(_component_article_card, {
      article,
      lazy: $options.isLazyArticle(article.dropboxId),
      "admin-mode": $props.adminMode
    }, null, _parent));
    _push(`</li>`);
  });
  _push(`<!--]--></ul></section></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ArticleList/ArticleList.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-c4d2b0e8"]]);

export { __nuxt_component_1 as _ };
//# sourceMappingURL=ArticleList-B1GPlClJ.mjs.map
