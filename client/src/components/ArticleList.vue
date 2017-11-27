<template>
  <!--todo refaire l'arborescence (job ? + page ?)-->
  <div class="page">
    <main class="page__body">
      <div class="page__container">
        <section class="article-results">
          <h1 class="article-results__title">{{ title }}</h1>
          <template v-if="adminMode">
            <a href="http://recontact.me/apo/sub">
              <button class="article-results__sync" type="button">{{ $t("getSubscribers") }}
              </button>
            </a>
            <button class="article-results__sync" type="button" :disabled="isClickedSync"
                    @click.prevent="synchronise">{{ $t("getNewArticles") }}</button>
            <button class="article-results__sync" type="button" :disabled="isClickedSync"
                    @click.prevent="deleteAll">{{ $t("deleteAllArticles") }}
            </button>
            <button class="article-results__sync" type="button" :disabled="isClickedSync"
                    @click.prevent="deleteAndSyncAll">{{ $t("deleteAndSyncAllArticles") }}
            </button>
          </template>
          <ul class="article-results__list">
            <li v-for="article in articles" class="article-results__item">
              <article-card :article="article" :adminMode="adminMode"></article-card>
            </li>
          </ul>
        </section>
      </div>
    </main>
  </div>
</template>

<script>
  import ArticleCard from '@/components/ArticleCard';
  import articlesApi from '@/api/articles';
  import syncApi from '@/api/sync';
  import notificationsService from '@/services/notifications';
  import articlesSorter from '@/services/articlesSorter';

  export default {
    name: 'ArticleList',
    components: {
      'article-card': ArticleCard,
    },
    props: ['adminMode'],
    data() {
      return {
        articles: [],
        isClickedSync: false,
      };
    },
    mounted() {
      this.getArticles();
    },
    computed: {
      title() {
        return (this.adminMode) ? this.$t('fixWebsite') : this.$t('theArticlesOfTheTrip');
      },
    },
    methods: {
      getArticles() {
        articlesApi.fetchAll()
          .then((articles) => {
            this.articles = articlesSorter.sortByDropboxId(articles);
          });
      },

      disableButton() {
        this.isClickedSync = true;
      },

      enableButton() {
        this.isClickedSync = false;
      },

      synchronise() {
        this.disableButton();
        notificationsService.information(this, this.$t('syncLaunched'));
        syncApi.launch()
          .then(() => {
            notificationsService.removeInformation(this);
            notificationsService.success(this, this.$t('syncDone'));
          })
          .then(() => this.goToHome())
          .catch((err) => {
            notificationsService.removeInformation(this);
            notificationsService.error(this, `${this.$t('syncError')} ${err}`);
          });
      },

      deleteAll() {
        this.disableButton();
        notificationsService.information(this, this.$t('syncLaunched'));
        articlesApi.deleteAll()
          .then(() => {
            notificationsService.removeInformation(this);
            notificationsService.success(this, this.$t('syncDone'));
          })
          .then(() => this.goToHome())
          .catch((err) => {
            notificationsService.removeInformation(this);
            notificationsService.error(this, `${this.$t('syncError')} ${err}`);
          });
      },

      deleteAndSyncAll() {
        this.disableButton();
        notificationsService.information(this, this.$t('syncLaunched'));
        articlesApi.deleteAndSyncAll()
          .then(() => {
            notificationsService.removeInformation(this);
            notificationsService.success(this, this.$t('syncDone'));
          })
          .then(() => this.goToHome())
          .catch((err) => {
            notificationsService.removeInformation(this);
            notificationsService.error(this, `${this.$t('syncError')} ${err}`);
          });
      },

      goToHome() {
        this.enableButton();
        this.$router.push('/');
      },
    },

    i18n: {
      messages: {
        fr: {
          getNewArticles: 'Récupérer les nouveaux articles',
          deleteAllArticles: 'Supprimer tous les articles',
          deleteAndSyncAllArticles: 'Supprimer & synchro tous les articles',
          getSubscribers: 'Récupérer les abonnés de Recontact.me',
          fixWebsite: 'Réparer le site',
          theArticlesOfTheTrip: 'Voyageons avec Pierre',
          syncLaunched: 'La synchronisation est lancée ! Patientez quelques secondes...',
          syncDone: 'La synchronisation s‘est effectuée sans problème !',
          syncError: 'Erreur : Problème durant la synchronisation :',
        },
        en: {
          getNewArticles: 'Synchronise the new articles',
          deleteAllArticles: 'Delete all articles',
          deleteAndSyncAllArticles: 'Delete and synchronise all articles',
          getSubscribers: 'Get the subscribers',
          fixWebsite: 'Fix the website',
          theArticlesOfTheTrip: 'Travelling with Pierre',
          syncLaunched: 'The synchronisation is launched! Please wait...',
          syncDone: 'The synchronisation succeeds!',
          syncError: 'Error during the synchronisation:',
        },
      },
    },
  }
  ;
</script>

<style scoped>
  .page__body {
    display: flex;
    width: 100%;
    padding: 20px 0;
    justify-content: center;
  }

  .article-results {
    margin-bottom: 60px;
  }

  .article-results__title {
    font-weight: 300;
    font-size: 24px;
    margin: 0 0 15px;
  }

  .article-results__list {
    padding: 0;
    display: flex;
    flex-direction: column;
  }

  .article-results__item {
    list-style-type: none;
    padding: 0;
    margin: 5px;
  }

  @media only screen and (min-width: 640px) {
    .article-results__list {
      flex-direction: row;
      flex-wrap: wrap;
    }
  }

  .article-results__sync {
    text-transform: uppercase;
    color: #f76252;
    background: #ffffff;
    border: 1px solid #d14800;
    cursor: pointer;
    padding: 15px 30px;
    border-radius: 4px;
    width: 230px;
    margin-bottom: 10px;
    font-weight: 700;
  }

  .article-results__sync:hover {
    background: #d14800;
    color: #ffffff;
  }

  .article-results__sync:disabled,
  .article__footer button:active {

    background: #BDBDBD;
    border-color: #616161;
    color: #FAFAFA;
    cursor: auto;
  }


</style>
