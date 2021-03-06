<template>
  <article class="chapter">
    <header
      v-if="chapterTitle !== '-'"
      class="chapter__header">
      <h2 class="chapter__title">
        {{ chapterTitle }}
      </h2>
      <p class="chapter__position">
        {{ chapter.position }}
      </p>
    </header>
    <div
      v-if="imgLink"
      class="chapter__content">
      <img
        :src="imgLink"
        :alt="chapterAlt"
        class="chapter__image">
    </div>
    <footer class="chapter__footer">
      <ul
        v-for="paragraph in chapterText"
        :key="paragraph.text"
        class="paragraph-container">
        <li
          v-if="paragraph"
          class="paragraph">
          <iframe
            v-if="paragraph.iframeSrc"
            :width="dimensions.width"
            :height="dimensions.height"
            :src="paragraph.iframeSrc"
            :title="chapterTitle"
            class="youtube-iframe"
            allow="accelerometer; encrypted-media; gyroscope;"
            allowfullscreen/>
          <p
            v-else-if="paragraph.link"
            class="chapter__footer_text">
            <a
              :href="paragraph.link"
              rel="noreferrer noopener"
              target="_blank">
              {{ paragraph.link }}
            </a>
          </p>
          <h3
            v-else
            class="chapter__footer_text">
            {{ paragraph.text }}
          </h3>
        </li>
      </ul>
    </footer>
  </article>
</template>

<script>
  import translationsService from '../../services/services/translations'
  import {
    generateCleanUrlLink, generateIframeLink, urlTester, youtubeEmbedUrlTester,
  } from './paragraph-link-utils'
  import { iframeDimensions } from '../../services'

  export default {
    name: 'ChapterCard',
    props: { chapter: { type: Object, default: () => {} } },
    data: () => ({ dimensions: iframeDimensions() }),
    computed: {
      imgLink() {
        const { imgLink } = this.chapter
        return !imgLink ? false : imgLink
      },
      styleMissing() {
        return `height: ${this.dimensions.height}px;"`
      },
      chapterTitle() {
        const language = this.$store.state.locale
        return translationsService.getChapterTitle(this.chapter, language)
      },
      chapterAlt() {
        return this.$t('altComplement') + (this.chapterText[0] ? this.chapterText[0].text : '')
      },
      chapterText() {
        const language = this.$store.state.locale
        const chapterText = translationsService.getChapterText(this.chapter, language)

        return chapterText
          .filter(paragraph => !!paragraph)
          .map(this.enhanceParagraph)
      },
    },
    methods: {
      enhanceParagraph(paragraph) {
        return {
          iframeSrc: youtubeEmbedUrlTester(paragraph) ? generateIframeLink(paragraph) : undefined,
          link: urlTester(paragraph) ? generateCleanUrlLink(paragraph) : undefined,
          text: paragraph,
        }
      },
    },
    i18n: {
      messages: {
        fr: {
          altComplement: 'Une image montrant ',
        },
        en: {
          altComplement: 'An image showing ',
        },
      },
    },
  }
</script>

<style lang="scss" scoped>
  .chapter__image {
    color: $card-text;
    max-width: 100%;
    max-height: 40vw;
  }

  @media only screen and (max-width: 640px) {
    .chapter__image {
      max-height: 100%;
    }
  }

  .chapter {
    min-width: 260px;
    background: $card-bg;
    border-radius: 4px;
    border: 1px solid $border;
    display: flex;
    flex-direction: column;
    color: $card-color-weird
  }

  .chapter__header {
    border-bottom: 1px solid $border;
    padding: 15px;
    height: 34px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .chapter__title {
    font-size: 20px;
    font-weight: 500;
    line-height: 17px;
    color: $card-title;
    margin: 0;
    overflow-wrap: break-word;
  }

  .chapter__position {
    display: none;
  }

  .chapter__content {
    font-size: 15px;
    padding: 15px;
    display: block;
    color: $card-placeholder;
    text-align: center;
  }

  .chapter__footer {
    text-align: center;
    padding: 0 15px;
    border-top: 1px solid $border;
  }

  .youtube-iframe {
    margin: 30px 0;
    border: none;
  }

  .chapter__footer_text {
    font-size: 18px;
    word-spacing: 1px;
  }

  .missing-image {
    display: flex;
    justify-content: center;
  }

  .paragraph {
    list-style-type: none;
  }

  .paragraph-container {
    padding: 0;
  }

  @media only screen and (min-width: 640px) {
    .chapter__footer_text {
      font-weight: lighter;
    }
  }
</style>
