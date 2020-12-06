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
    <paragraphs
      :chapter-text="chapterText"
      :title="chapterTitle"/>
  </article>
</template>

<script>
  import translationsService from '../../services/services/translations'
  import Paragraphs from './Paragraphs/Paragraphs'

  export default {
    name: 'ChapterCard',
    components: { Paragraphs },
    props: { chapter: { type: Object, default: () => {} } },
    computed: {
      imgLink() {
        const { imgLink } = this.chapter
        return !imgLink ? false : imgLink
      },
      chapterTitle() {
        const language = this.$store.state.locale
        return translationsService.getChapterTitle(this.chapter, language)
      },
      chapterAlt() {
        return this.$t('altComplement') + (this.chapterText[0] ? this.chapterText[0] : '')
      },
      chapterText() {
        const language = this.$store.state.locale
        return translationsService.getChapterText(this.chapter, language)
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
</style>
