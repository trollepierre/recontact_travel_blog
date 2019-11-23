<template>
  <div class="chapter-card">
    <article class="chapter">
      <header class="chapter__header">
        <h2 class="chapter__title">
          {{ chapterTitle }}
        </h2>
        <p class="chapter__position">
          {{ chapter.position }}
        </p>
      </header>
      <div class="chapter__content">
        <img
          v-if="imgLink"
          :src="imgLink"
          :alt="chapterAlt"
          class="chapter__image">
        <span v-else>
          {{ $t("missingImage") }}
        </span>
      </div>
      <footer class="chapter__footer">
        <div
          v-for="paragraph in chapterText"
          :key="paragraph.text"
          class="chapter__footer_text">
          <template v-if="paragraph">
            <a
              v-if="paragraph.isLink"
              :href="paragraph.text"
              target="_blank">
              {{ paragraph.text }}
            </a>
            <p v-else>
              {{ paragraph.text }}
            </p>
          </template>
        </div>
      </footer>
    </article>
  </div>
</template>

<script>
  import translationsService from '../../services/services/translations'

  export default {
    name: 'ChapterCard',
    props: {
      chapter: { type: Object, default: () => {} },
    },
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
        return this.$t('altComplement') + this.chapterText[0].text
      },
      chapterText() {
        const language = this.$store.state.locale
        const chapterText = translationsService.getChapterText(this.chapter, language)

        return chapterText
          .filter(paragraph => !!paragraph)
          .map(paragraph => {
            let isLink = false
            /* eslint-disable no-useless-escape */
            const urlRegExp = new RegExp('^(https?:\/\/)([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?')
            if (urlRegExp.test(paragraph)) {
              isLink = true
            }
            return { isLink, text: paragraph }
          })
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
  h2 {
    font-weight: normal;
  }

  img.chapter__image {
    max-width: 100%;
    max-height: 40vw;
  }

  @media only screen and (max-width: 640px) {
    img.chapter__image {
      max-height: 100%;
    }
  }

  .chapter {
    min-width: 260px;
    /*max-width: 260px;*/
    background: #ffffff;
    border-radius: 4px !important;
    box-shadow: 0 1px 1px rgba(0, 0, 0, .15);
    border: 1px solid rgba(0, 0, 0, .09);
    display: flex;
    flex-direction: column;
    color: #535a60;
  }

  .chapter__header {
    border-bottom: 1px solid #e6e6e6;
    padding: 15px;
    height: 34px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .chapter__title {
    font-size: 16px;
    font-weight: 700;
    line-height: 17px;
    color: #07c;
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
    padding: 15px;
    border-top: 1px solid #e6e6e6;
  }

  .chapter__footer button {
    text-transform: uppercase;
    color: #d14800;
    background: #ffffff;
    border: 1px solid #d14800;
    cursor: pointer;
    padding: 15px 30px;
    border-radius: 4px;
    width: 100%;
    margin-bottom: 10px;
    font-weight: 700;
  }

  .chapter__footer button:hover {
    background: #d14800;
    color: #ffffff;
  }

  .chapter__footer button:disabled,
  .chapter__footer button:active {
    background: #BDBDBD;
    border-color: #616161;
    color: #FAFAFA;
    cursor: auto;
  }

</style>
