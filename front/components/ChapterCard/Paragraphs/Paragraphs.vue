<template>
  <footer class="chapter__footer">
    <ul
      v-for="paragraph in paragraphs"
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
          :title="title"
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
</template>
<script>
  import { iframeDimensions } from '../../../services'
  import {
    generateCleanUrlLink,
    generateIframeLink,
    urlTester,
    youtubeEmbedUrlTester,
  } from './paragraph-link-utils'

  export default {
    name: 'Paragraphs',
    props: {
      chapterText: { type: Array, default: () => [] },
      title: { type: String, default: () => '' },
    },
    data: () => ({ dimensions: iframeDimensions() }),
    computed: {
      paragraphs() {
        return this.chapterText
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
  }
</script>

<style scoped>
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
