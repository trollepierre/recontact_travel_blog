import { a as __nuxt_component_4, _ as __nuxt_component_0$1, C as ChaptersApi, t as translationsService, l as logger, b as apiService, I as IS_DESKTOP, s as screenWidth, c as IS_TABLET, n as notificationsService } from './responsive-utils-BS0Y8toX.mjs';
import { resolveDirective, mergeProps, resolveComponent, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrGetDirectiveProps, ssrRenderAttr } from 'vue/server-renderer';
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

const isEmptyPlus = (data) => data ? data.length === 0 : true;
const YOUTUBE_IFRAME_HEIGHT = 315;
const YOUTUBE_IFRAME_WIDTH = 560;
const DESKTOP_IFRAME_RATIO = 50 / 100;
const TABLET_IFRAME_RATIO = 60 / 100;
const PHONE_IFRAME_RATIO = 90 / 100;
const iframeWidth = () => {
  if (IS_DESKTOP()) {
    return screenWidth() * DESKTOP_IFRAME_RATIO;
  }
  if (IS_TABLET()) {
    return screenWidth() * TABLET_IFRAME_RATIO;
  }
  return screenWidth() * PHONE_IFRAME_RATIO;
};
const iframeHeight = () => iframeWidth() * YOUTUBE_IFRAME_HEIGHT / YOUTUBE_IFRAME_WIDTH;
const iframeDimensions = () => ({
  width: iframeWidth(),
  height: iframeHeight()
});
const urlTester = (link) => /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?/.test(link);
const youtubeEmbedUrlTester = (link) => urlTester(link) && (/youtu.be/.test(link) || /youtube.com/.test(link)) && /embed/.test(link);
const youtubePlaylistEmbedUrlTester = (link) => /videoseries\?list=/.test(link);
const generateIframeLink = (link) => youtubePlaylistEmbedUrlTester(link) ? link : `${link}?rel=0&modestbranding=1`;
const generateCleanUrlLink = (link) => link.includes("https://") ? link : `https://${link}`;
const _sfc_main$7 = {
  name: "ChapterCard",
  props: { chapter: { type: Object, default: () => {
  } } },
  data: () => ({ dimensions: iframeDimensions() }),
  computed: {
    imgLink() {
      const { imgLink } = this.chapter;
      return !imgLink ? false : imgLink;
    },
    styleMissing() {
      return `height: ${this.dimensions.height}px;"`;
    },
    chapterTitle() {
      const language = this.$store.state.locale;
      return translationsService.getChapterTitle(this.chapter, language);
    },
    chapterAlt() {
      return this.$t("altComplement") + (this.chapterText[0] ? this.chapterText[0].text : "");
    },
    chapterText() {
      const language = this.$store.state.locale;
      const chapterText = translationsService.getChapterText(this.chapter, language);
      return chapterText.filter((paragraph) => !!paragraph).map(this.enhanceParagraph);
    }
  },
  methods: {
    enhanceParagraph(paragraph) {
      return {
        iframeSrc: youtubeEmbedUrlTester(paragraph) ? generateIframeLink(paragraph) : void 0,
        link: urlTester(paragraph) ? generateCleanUrlLink(paragraph) : void 0,
        text: paragraph
      };
    }
  },
  i18n: {
    messages: {
      fr: {
        altComplement: "Une image montrant "
      },
      en: {
        altComplement: "An image showing "
      }
    }
  }
};
function _sfc_ssrRender$7(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<article${ssrRenderAttrs(mergeProps({ class: "chapter" }, _attrs))} data-v-2126b374>`);
  if ($options.chapterTitle !== "-") {
    _push(`<header class="chapter__header" data-v-2126b374><h2 class="chapter__title" data-v-2126b374>${ssrInterpolate($options.chapterTitle)}</h2><p class="chapter__position" data-v-2126b374>${ssrInterpolate($props.chapter.position)}</p></header>`);
  } else {
    _push(`<!---->`);
  }
  if ($options.imgLink) {
    _push(`<div class="chapter__content" data-v-2126b374><img${ssrRenderAttr("src", $options.imgLink)}${ssrRenderAttr("alt", $options.chapterAlt)} class="chapter__image" data-v-2126b374></div>`);
  } else {
    _push(`<!---->`);
  }
  _push(`<footer class="chapter__footer" data-v-2126b374><!--[-->`);
  ssrRenderList($options.chapterText, (paragraph) => {
    _push(`<ul class="paragraph-container" data-v-2126b374>`);
    if (paragraph) {
      _push(`<li class="paragraph" data-v-2126b374>`);
      if (paragraph.iframeSrc) {
        _push(`<iframe${ssrRenderAttr("width", _ctx.dimensions.width)}${ssrRenderAttr("height", _ctx.dimensions.height)}${ssrRenderAttr("src", paragraph.iframeSrc)}${ssrRenderAttr("title", $options.chapterTitle)} class="youtube-iframe" allow="accelerometer; encrypted-media; gyroscope;" allowfullscreen data-v-2126b374></iframe>`);
      } else if (paragraph.link) {
        _push(`<p class="chapter__footer_text" data-v-2126b374><a${ssrRenderAttr("href", paragraph.link)} rel="noreferrer noopener" target="_blank" data-v-2126b374>${ssrInterpolate(paragraph.link)}</a></p>`);
      } else {
        _push(`<h3 class="chapter__footer_text" data-v-2126b374>${ssrInterpolate(paragraph.text)}</h3>`);
      }
      _push(`</li>`);
    } else {
      _push(`<!---->`);
    }
    _push(`</ul>`);
  });
  _push(`<!--]--></footer></article>`);
}
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ChapterCard/ChapterCard.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["ssrRender", _sfc_ssrRender$7], ["__scopeId", "data-v-2126b374"]]);
const CommentsApi = {
  fetch(id) {
    return apiService.get(`articles/${id}/comments`);
  },
  send(id, comment) {
    return apiService.post(`articles/${id}/comments`, comment);
  }
};
const _sfc_main$6 = {
  name: "CommentForm",
  components: { AppButton: __nuxt_component_4 },
  data() {
    return {
      newComment: "",
      newAuthor: "",
      errorComment: "",
      anonymous: this.$t("yourName"),
      textPlaceholder: this.$t("textPlaceholder"),
      dropboxId: parseInt(this.$route.params.id, 10)
    };
  },
  methods: {
    submitComment() {
      if (this.newComment !== "") {
        const comment = {
          text: this.newComment,
          author: this.newAuthor
        };
        return CommentsApi.send(this.dropboxId, comment).then(this.resetNewComment).then(this.reloadComments).then(this.displaySuccessNotification).catch(this.displayErrorNotification);
      }
      return true;
    },
    reloadComments() {
      this.$emit("reload");
    },
    resetNewComment() {
      this.newComment = "";
    },
    displaySuccessNotification() {
      notificationsService.information(this.$t("commentSuccess"));
    },
    displayErrorNotification() {
      notificationsService.error(this.$t("commentError"));
    },
    isEmpty: isEmptyPlus
  },
  i18n: {
    messages: {
      fr: {
        addComment: "Ajouter un commentaire",
        name: "De la part de",
        yourName: "Ton nom",
        commentError: "Erreur lors de la prise en compte de ton commentaire.",
        commentSuccess: "Ton commentaire a \xE9t\xE9 pris en compte.",
        anonymous: "Anonyme",
        textPlaceholder: "N'h\xE9sitez pas \xE0 ajouter des commentaires\xA0!",
        send: "Envoyer",
        text: "Votre message"
      },
      en: {
        addComment: "Add a comment",
        name: "From",
        yourName: "Your name",
        commentError: "Error when adding the comment.",
        commentSuccess: "Your comment has been taken into consideration.",
        anonymous: "Anonymous",
        textPlaceholder: "Add your comment here!",
        send: "Send",
        text: "Your message"
      }
    }
  }
};
function _sfc_ssrRender$6(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_app_button = __nuxt_component_4;
  _push(`<div${ssrRenderAttrs(_attrs)} data-v-a92bafd5><h2 class="form__title" data-v-a92bafd5>${ssrInterpolate(_ctx.$t("addComment"))}</h2><form class="form" data-v-a92bafd5><header class="form__header" data-v-a92bafd5><div class="input-group author" data-v-a92bafd5><label class="form__label author" for="author" data-v-a92bafd5>${ssrInterpolate(_ctx.$t("name"))}</label><input id="author"${ssrRenderAttr("value", $data.newAuthor)}${ssrRenderAttr("placeholder", $data.anonymous)} autocomplete="off" spellcheck="false" class="forum__comment-box author" data-v-a92bafd5></div></header><div class="form__content" data-v-a92bafd5><div class="input-group comment" data-v-a92bafd5><label class="form__label comment" for="comment" data-v-a92bafd5>${ssrInterpolate(_ctx.$t("text"))}</label><textarea id="comment"${ssrRenderAttr("placeholder", $data.textPlaceholder)} class="forum__comment-box text" data-v-a92bafd5>${ssrInterpolate($data.newComment)}</textarea></div></div><footer class="form__footer" data-v-a92bafd5>`);
  _push(ssrRenderComponent(_component_app_button, {
    type: "submit",
    class: "form-button",
    text: _ctx.$t("send"),
    onClick: $options.submitComment
  }, null, _parent));
  _push(`</footer></form></div>`);
}
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/comments/CommentForm.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const CommentForm = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["ssrRender", _sfc_ssrRender$6], ["__scopeId", "data-v-a92bafd5"]]);
const _sfc_main$5 = {
  name: "CommentCard",
  props: { comment: { type: Object, default: () => {
  } } },
  computed: {
    commentAuthor() {
      const date = this.comment.createdAt;
      const language = this.$store.state.locale;
      if (translationsService.isFrancophone(language)) {
        return `De ${this.comment.author} - ${date}`;
      }
      return `From ${this.comment.author} - ${date}`;
    }
  }
};
function _sfc_ssrRender$5(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)} data-v-9140e6db><article class="comment" data-v-9140e6db><header class="comment__header" data-v-9140e6db><p class="comment__author" data-v-9140e6db>${ssrInterpolate($options.commentAuthor)}</p></header><footer class="comment__footer" data-v-9140e6db><p data-v-9140e6db>${ssrInterpolate($props.comment.text)}</p></footer></article></div>`);
}
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/common/CommentCard.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const CommentCard = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["ssrRender", _sfc_ssrRender$5], ["__scopeId", "data-v-9140e6db"]]);
const _sfc_main$4 = {
  name: "CommentList",
  components: { CommentCard },
  props: {
    toReload: { type: Boolean, default: () => false }
  },
  data() {
    return {
      comments: [],
      dropboxId: parseInt(this.$route.params.id, 10)
    };
  },
  watch: {
    async toReload() {
      await CommentsApi.fetch(this.dropboxId).then((comments) => {
        this.comments = comments;
      }).then(this.reloaded);
    }
  },
  mounted() {
    CommentsApi.fetch(this.dropboxId).then((comments) => {
      this.comments = comments;
    });
  },
  methods: {
    isEmpty: isEmptyPlus,
    reloaded() {
      this.$emit("reloaded");
    }
  },
  i18n: {
    silentTranslationWarn: true,
    messages: {
      fr: {
        hereTheComments: "Voici les commentaires de l'article\xA0\xA0!"
      },
      en: {
        hereTheComments: "Here the comments of the article!"
      }
    }
  }
};
function _sfc_ssrRender$4(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_comment_card = resolveComponent("comment-card");
  if (!$options.isEmpty($data.comments)) {
    _push(`<div${ssrRenderAttrs(_attrs)} data-v-5d973cf6><h2 data-v-5d973cf6>${ssrInterpolate(_ctx.$t("hereTheComments"))}</h2><ul class="forum__comment-list" data-v-5d973cf6><!--[-->`);
    ssrRenderList($data.comments, (comment) => {
      _push(`<li class="comment__item" data-v-5d973cf6>`);
      _push(ssrRenderComponent(_component_comment_card, { comment }, null, _parent));
      _push(`</li>`);
    });
    _push(`<!--]--></ul></div>`);
  } else {
    _push(`<!---->`);
  }
}
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/comments/CommentList.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const CommentList = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["ssrRender", _sfc_ssrRender$4], ["__scopeId", "data-v-5d973cf6"]]);
const _sfc_main$3 = {
  name: "CommentsContainer",
  components: { CommentForm, CommentList },
  data() {
    return {
      toReload: false
    };
  },
  methods: {
    reloadTo() {
      this.toReload = true;
    },
    reloadOff() {
      this.toReload = false;
    }
  }
};
function _sfc_ssrRender$3(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_comment_list = resolveComponent("comment-list");
  const _component_comment_form = resolveComponent("comment-form");
  _push(`<section${ssrRenderAttrs(_attrs)}>`);
  _push(ssrRenderComponent(_component_comment_list, {
    "to-reload": $data.toReload,
    onReloaded: $options.reloadOff
  }, null, _parent));
  _push(ssrRenderComponent(_component_comment_form, { onReload: $options.reloadTo }, null, _parent));
  _push(`</section>`);
}
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/comments/Comments.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const __nuxt_component_2 = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["ssrRender", _sfc_ssrRender$3]]);
const _sfc_main$2 = {
  name: "PhotoCard",
  props: {
    photo: {
      type: Object,
      default: () => {
      }
    }
  },
  computed: {
    imgLink() {
      const { imgLink } = this.photo;
      return !imgLink ? false : imgLink;
    },
    image() {
      return this.$t("alt");
    }
  },
  mounted() {
    this.$Lazyload.lazyLoadHandler();
  },
  i18n: {
    messages: {
      fr: {
        alt: "Une image"
      },
      en: {
        alt: "An image"
      }
    }
  }
};
function _sfc_ssrRender$2(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  var _a, _b;
  const _directive_lazy = resolveDirective("lazy");
  let _temp0, _temp1;
  _push(`<article${ssrRenderAttrs(mergeProps({ class: "photo" }, _attrs))} data-v-e6b86778><div class="photo__content" data-v-e6b86778><img${ssrRenderAttrs(_temp0 = mergeProps({
    class: "img",
    rel: "noreferrer",
    alt: $options.image
  }, ssrGetDirectiveProps(_ctx, _directive_lazy, $options.imgLink)))} data-v-e6b86778>${"textContent" in _temp0 ? ssrInterpolate(_temp0.textContent) : (_a = _temp0.innerHTML) != null ? _a : ""}<div${ssrRenderAttrs(_temp1 = ssrGetDirectiveProps(_ctx, _directive_lazy, $options.imgLink, "background-image"))} data-v-e6b86778>${"textContent" in _temp1 ? ssrInterpolate(_temp1.textContent) : (_b = _temp1.innerHTML) != null ? _b : ""}</div></div></article>`);
}
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/PhotoCard/PhotoCard.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_3 = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["ssrRender", _sfc_ssrRender$2], ["__scopeId", "data-v-e6b86778"]]);
const PhotosApi = {
  fetch(id) {
    return apiService.get(`articles/${id}/photos`);
  }
};
const _sfc_main$1 = {
  name: "ArticlePage",
  components: {
    ChapterCard: __nuxt_component_1,
    Comments: __nuxt_component_2,
    PhotoCard: __nuxt_component_3,
    AppHeader: __nuxt_component_0$1,
    AppButton: __nuxt_component_4
  },
  data() {
    return {
      chapters: [{
        position: 1,
        frTitle: "Article en cours de chargement",
        enTitle: "Loading article",
        imgLink: false,
        frText: ["Veuillez patienter quelques secondes"],
        enText: ["Please wait just a second"]
      }],
      photos: [],
      title: "",
      dropboxId: parseInt(this.$route.params.id, 10)
    };
  },
  watch: {
    $route(to) {
      (void 0).scrollTo(0, 0);
      this.dropboxId = parseInt(to.params.id, 10);
      this.fetchArticle();
    }
  },
  mounted() {
    this.fetchArticle();
  },
  methods: {
    fetchArticle() {
      this.getChapters();
      this.getPhotos();
    },
    getChapters() {
      ChaptersApi.fetch(this.dropboxId).then((article) => {
        this.chapters = article.chapters;
        const language = this.$store.state.locale;
        this.title = translationsService.getTitle(article, language);
      }).catch((error) => {
        logger.error(error.message);
      });
    },
    getPhotos() {
      PhotosApi.fetch(this.dropboxId).then((photos) => {
        this.photos = photos;
      });
    },
    viewPreviousArticle() {
      if (this.dropboxId !== 1) {
        this.goToArticle(this.dropboxId - 1);
      }
    },
    viewNextArticle() {
      this.goToArticle(this.dropboxId - 1 + 2);
    },
    goToHomePage() {
      this.$router.push("/");
    },
    goToArticle(idArticle) {
      this.$router.push(`/articles/${idArticle}`);
    },
    isEmpty: isEmptyPlus
  },
  i18n: {
    silentTranslationWarn: true,
    messages: {
      fr: {
        hereTheGallery: "Voici la galerie photo de cet article\xA0\xA0!",
        goToPreviousArticle: "Voir l\u2019article pr\xE9c\xE9dent",
        goToNextArticle: "Voir l\u2019article suivant",
        goToHomePage: "Retour \xE0 la page d\u2019accueil",
        title: "Titre de l\u2019article"
      },
      en: {
        hereTheGallery: "Here is the photo gallery of this article",
        goToPreviousArticle: "Read the previous article",
        goToNextArticle: "Read the next article",
        goToHomePage: "Go to Home Page",
        title: "Title of the article"
      }
    }
  }
};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_app_header = __nuxt_component_0$1;
  const _component_chapter_card = __nuxt_component_1;
  const _component_comments = __nuxt_component_2;
  const _component_photo_card = __nuxt_component_3;
  const _component_app_button = __nuxt_component_4;
  _push(`<main${ssrRenderAttrs(_attrs)} data-v-14c76a6b>`);
  _push(ssrRenderComponent(_component_app_header, null, null, _parent));
  _push(`<div class="page" data-v-14c76a6b><section class="article-page" data-v-14c76a6b><h1 class="article-page__title" data-v-14c76a6b>${ssrInterpolate($data.title || _ctx.$t("title"))}</h1><ul class="chapter__list" data-v-14c76a6b><!--[-->`);
  ssrRenderList($data.chapters, (chapter, index) => {
    _push(`<li class="chapter__item" data-v-14c76a6b>`);
    _push(ssrRenderComponent(_component_chapter_card, { chapter }, null, _parent));
    _push(`</li>`);
  });
  _push(`<!--]--></ul></section>`);
  _push(ssrRenderComponent(_component_comments, null, null, _parent));
  if (!$options.isEmpty($data.photos)) {
    _push(`<section data-v-14c76a6b><h2 data-v-14c76a6b>${ssrInterpolate(_ctx.$t("hereTheGallery"))}</h2><ul class="photo-gallery__list" data-v-14c76a6b><!--[-->`);
    ssrRenderList($data.photos, (photo, index) => {
      _push(`<li class="photo__item" data-v-14c76a6b>`);
      _push(ssrRenderComponent(_component_photo_card, { photo }, null, _parent));
      _push(`</li>`);
    });
    _push(`<!--]--></ul></section>`);
  } else {
    _push(`<!---->`);
  }
  _push(`<footer class="footer-article" data-v-14c76a6b>`);
  _push(ssrRenderComponent(_component_app_button, {
    class: "app-button",
    text: _ctx.$t("goToHomePage"),
    onClick: $options.goToHomePage
  }, null, _parent));
  _push(ssrRenderComponent(_component_app_button, {
    class: "app-button",
    text: _ctx.$t("goToPreviousArticle"),
    onClick: $options.viewPreviousArticle
  }, null, _parent));
  _push(ssrRenderComponent(_component_app_button, {
    class: "app-button",
    text: _ctx.$t("goToNextArticle"),
    onClick: $options.viewNextArticle
  }, null, _parent));
  _push(`</footer></div></main>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ArticlePage/ArticlePage.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender$1], ["__scopeId", "data-v-14c76a6b"]]);
const _sfc_main = {
  name: "ArticleIdPage",
  components: {
    ArticlePage: __nuxt_component_0
  },
  validate({ params }) {
    return /^\d+$/.test(params.id);
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_article_page = __nuxt_component_0;
  _push(ssrRenderComponent(_component_article_page, _attrs, null, _parent));
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/articles/_id.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _id = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { _id as default };
//# sourceMappingURL=_id-DMmx_9px.mjs.map
