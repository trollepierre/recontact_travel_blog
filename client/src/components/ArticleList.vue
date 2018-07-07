<template>
  <!--todo refaire l'arborescence (job ? + page ?)-->
  <div class="page">
    <main class="page__body">
      <div class="page__container">
        <section class="article-results">
          <h1 class="article-results__title hidden">{{ title }}</h1>
          <p class="article-results__title h1">{{ $t("subtitle") }}</p>
          <p class="article-results__title h2">{{ $t("lastKnownPosition") }}
            <span class="article-results__title h3">{{ lastPosition }}</span></p>
          <template v-if="adminMode">
            <a href="http://recontact.me/apo/sub">
              <button class="article-results__buttons article-results__sync_hidden" type="button"
                      @click.prevent="goToSubscriptions">{{ $t("getSubscribers") }}
              </button>
            </a>
            <button class="article-results__buttons" type="button" :disabled="isClickedSync"
                    @click.prevent="synchronise">{{ $t("getNewArticles") }}</button>
            <button class="article-results__buttons article-results__sync_hidden" type="button" :disabled="isClickedSync"
                    @click.prevent="deleteAll">{{ $t("deleteAllArticles") }}
            </button>
            <button class="article-results__buttons article-results__sync_hidden" type="button" :disabled="isClickedSync"
                    @click.prevent="deleteAndSyncAll">{{ $t("deleteAndSyncAllArticles") }}
            </button>
            <br>

            <form class="article-results__form">
              <p class="article-results__text">
                {{ $t("lastPosition") }}
              </p>
              <label class="article-results__label" for="position-place">{{ $t("place") }}</label>
              <input class="article-results__input article-results__place" id="position-place" placeholder="Paris" v-model="place"/>
              <label class="article-results__label" for="position-time">{{ $t("time") }}</label>
              <input class="article-results__input article-results__time" id="position-time" placeholder="le 1er mai 2018" v-model="time"/>
              <button class="article-results__buttons article-results__action--send" @click="updateLastPosition">{{ $t("confirm") }}</button>
            </form>

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
  import ArticleCard from './ArticleCard';
  import articlesApi from '@/api/articles';
  import positionsApi from '@/api/positions';
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
        lastPosition: '',
        place: null,
        time: null,
      };
    },
    mounted() {
      this.getArticles();
      this.getLastPosition();
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

      updateLastPositionData({ place, time }) {
        this.lastPosition = `${place}, ${time}`;
      },

      getLastPosition() {
        positionsApi.fetchLast()
          .then(this.updateLastPositionData);
      },

      submit(e) {
        e.preventDefault();
        this.updateLastPosition();
      },

      updateLastPosition() {
        const position = {
          place: this.place,
          time: this.time,
        };
        positionsApi.add(position)
          .then(this.updateLastPositionData);
      },

      disableButton() {
        this.isClickedSync = true;
      },

      enableButton() {
        this.isClickedSync = false;
      },

      synchronise() {
        this.trackEvent();
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
      goToSubscriptions() {
        this.$router.push('/subscriptions');
      },
      trackEvent() {
        this.$ga.event({
          eventCategory: 'Article List',
          eventAction: 'synchronise',
          eventLabel: 'All articles have been synchronised',
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
          theArticlesOfTheTrip: 'Blog de voyage de Pierre Trollé et Benoît Lefebvre après un tour du monde et d’autres aventures',
          syncLaunched: 'La synchronisation est lancée ! Patientez quelques secondes...',
          syncDone: 'La synchronisation s’est effectuée sans problème !',
          syncError: 'Erreur : Problème durant la synchronisation :',
          place: 'Position :',
          time: 'Date :',
          confirm: 'Envoyer',
          lastPosition: 'Dernière position :',
          subtitle: 'Pierre en voyage',
          lastKnownPosition: 'Dernière position connue :',
        },
        en: {
          getNewArticles: 'Synchronise the new articles',
          deleteAllArticles: 'Delete all articles',
          deleteAndSyncAllArticles: 'Delete and synchronise all articles',
          getSubscribers: 'Get the subscribers',
          fixWebsite: 'Fix the website',
          theArticlesOfTheTrip: 'Travel blog of Pierre Trollé and Benoît Lefebvre after a world trip and other adventures',
          syncLaunched: 'The synchronisation is launched! Please wait...',
          syncDone: 'The synchronisation succeeds!',
          syncError: 'Error during the synchronisation:',
          place: 'Position:',
          time: 'Date:',
          confirm: 'Confirm',
          lastPosition: 'Last position:',
          subtitle: 'Traveling Pierre',
          lastKnownPosition: 'Last known position:',
        },
      },
    },
  };

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

  .hidden {
    display: none;
  }

  .h2 {
    font-size: 16px;
  }

  .h3 {
    font-size: 16px;
    font-weight: 600;
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

  .article-results__input {
    background: #ffffff;
    border: 1px solid cadetblue;
    padding: 15px 10px;
    border-radius: 4px;
    width: 230px;
    margin-bottom: 10px;
    font-weight: 700;
  }

  .article-results__buttons {
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

  .article-results__sync_hidden {
    color: #f7b5a9;
  }

  .article-results__buttons:hover {
    background: #d14800;
    color: #ffffff;
  }

  .article-results__buttons:disabled,
  .article__footer button:active {

    background: #BDBDBD;
    border-color: #616161;
    color: #FAFAFA;
    cursor: auto;
  }


</style>
