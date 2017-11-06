<template>
  <div class="article-card">
    <article class="article">
      <header class="article__header">
        <a :href="articleUrl" @click.prevent.once="viewArticle">
          <h2 class="article__title">{{ article.dropboxId }}</h2> <!--todo title should come from article-->
        </a>
      </header>
      <div class="article__content">
        <img class="article__image" :src="article.imgLink" width="200"/>
      </div>
      <footer class="article__footer">
        <template v-if="adminMode">
          <button class="article__delete-button" :disabled="isDeleteClicked"
                  @click.prevent.once="deleteArticle(article.dropboxId)">
            Supprimer l'article
          </button>
        </template>
        <template v-else>
          <button class="article__view-button"
                  @click.prevent.once="viewArticle">
            Voir l'article
          </button>
          <a :href="article.galleryLink" target="_blank" class="article__dropbox">
            <button class="article__dropbox-button">
              Voir les photos
            </button>
          </a>
        </template>
      </footer>
    </article>
  </div>
</template>

<script>
  import deleteArticleApi from '@/api/deleteArticle';
  import notificationService from '@/services/notification';

  export default {
    name: 'ArticleCard',
    props: ['article', 'adminMode'],
    data() {
      return {
        isDeleteClicked: false,
      };
    },
    computed: {
      articleUrl() {
        return `/articles/${this.article.dropboxId}`;
      },
    },
    methods: {
      viewArticle() {
        this.goToArticle();
      },

      deleteArticle(articleId) {
        this.disableDeleteButton();
        deleteArticleApi.deleteArticle(articleId)
          .then(() => {
            const message = 'La suppression s\'est effectuée sans problème !';
            notificationService.success(this, message);
          })
          .catch((err) => {
            const message = `Erreur : Problème durant la suppression : ${err.message}`;
            notificationService.error(this, message);
          });
      },

      disableDeleteButton() {
        this.isDeleteClicked = true;
      },

      goToArticle() {
        this.$router.push(this.articleUrl);
      },
    },
  };
</script>

<style scoped>
  h2 {
    font-weight: normal;
  }

  img {
    max-width: 100%;
    max-height: 100%;
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    border: 0;
    display: block;
  }

  .article {
    min-width: 260px;
    max-width: 260px;
    background: #ffffff;
    border-radius: 4px !important;
    box-shadow: 0 1px 1px rgba(0, 0, 0, .15);
    border: 1px solid rgba(0, 0, 0, .09);
    display: flex;
    flex-direction: column;
    color: #535a60;
  }

  .article__header {
    border-bottom: 1px solid #e6e6e6;
    padding: 15px;
    display: flex;
    justify-content: space-between;
  }

  .article__title {
    font-size: 16px;
    font-weight: 700;
    line-height: 17px;
    color: #07c;
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 200px;
  }

  .article__content {
    font-size: 15px;
    padding: 15px;
    height: 150px;
    color: #000;
    text-align: center;
    display: flex;
    align-content: center;
    justify-content: center;
  }

  .article__content > p {
    margin-top: 0;
  }

  .article__footer {
    text-align: center;
    padding: 15px;
    border-top: 1px solid #e6e6e6;
  }

  .article__footer button {
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

  .article__footer button:hover {
    background: #d14800;
    color: #ffffff;
  }

  .article__footer button:disabled,
  .article__footer button:active {

    background: #BDBDBD;
    border-color: #616161;
    color: #FAFAFA;
    cursor: auto;
  }

</style>
