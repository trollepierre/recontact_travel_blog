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
        rel="noreferrer"
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
              rel="noreferrer"
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
    props: {
      chapter: {
        type: Object,
        default: () => {},
      },
    },
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
          missingImage: 'Image manquante',
          altComplement: 'Une image montrant ',
        },
        en: {
          missingImage: 'Missing image',
          altComplement: 'An image showing ',
        },
      },
    },
  }
</script>

<style scoped>
  .chapter__image {
    color: darkgrey;
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
    background: #FFFFFF;
    border-radius: 4px !important;
    box-shadow: 0 1px 1px rgba(0, 0, 0, .15);
    border: 1px solid rgba(0, 0, 0, .09);
    display: flex;
    flex-direction: column;
    color: #535a60;
  }

  .chapter__header {
    border-bottom: 1px solid #E6E6E6;
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
    color: #07C;
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
    color: #000;
    text-align: center;
  }

  .chapter__footer {
    text-align: center;
    padding: 0 15px;
    border-top: 1px solid #E6E6E6;
  }

  .chapter__footer button {
    text-transform: uppercase;
    color: #D14800;
    background: #FFFFFF;
    border: 1px solid #D14800;
    cursor: pointer;
    padding: 15px 30px;
    border-radius: 4px;
    width: 100%;
    margin-bottom: 10px;
    font-weight: 700;
  }

  .chapter__footer button:hover {
    background: #D14800;
    color: #FFFFFF;
  }

  .chapter__footer button:disabled,
  .chapter__footer button:active {
    background: #BDBDBD;
    border-color: #616161;
    color: #FAFAFA;
    cursor: auto;
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
