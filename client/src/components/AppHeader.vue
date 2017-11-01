<template>
  <div class="app-header">
    <header class="page__header">
      <div class="page__container page__header--container">
        <a class="logo-link" href="/">
          <span class="logo-link__job">Recontact</span>
          <span class="logo-link__board">Me</span>
        </a>
        <nav class="app-header__navigation navigation" role="navigation" aria-label="site navigation">
          <ol class="navigation__links">
            <li class="navigation__link">
              <button class="navbar-action navbar-action__sync" type="button" :disabled="isClicked" @click.prevent.once="synchronise">Synchroniser</button>
            </li>
          </ol>
        </nav>
      </div>
    </header>
  </div>
</template>
<script>
  import syncApi from '@/api/sync';
  import notificationService from '@/services/notification';

  export default {
    name: 'AppHeader',
    data() {
      return {
        isClicked: false,
      };
    },
    methods: {
      disableButton() {
        this.isClicked = true;
      },

      synchronise() {
        this.disableButton();
        syncApi.launch()
          .then((response) => {
            const message = 'La synchronisation s\'est effectuée sans problème !';
            notificationService.success(this, message);
            console.log(response);
          })
          .catch((err) => {
            const message = `Erreur : Problème durant la synchronisation : ${err.message}`;
            notificationService.error(this, message);
            console.log(err);
          });
      },
    },
  };
</script>

<style scoped>
  .page__header {
    height: 60px;
    background: #ffffff;
    border-bottom: 1px solid #e6e6e6;
    width: 100%;
    padding-left: 0;
    position: fixed;
    top: 0;
  }

  .page__header--container {
    display: flex;
    justify-content: space-between;
  }

  .logo-link {
    text-decoration: none;
    font-size: 26px;
    font-weight: 900;
    display: inline-block;
    padding: 15px 0;
  }

  .logo-link__job {
    color: #07c;
  }

  .logo-link__board {
    color: #F48024;
  }

  .logout-link {
    color: #9199a1;
    display: inline-block;
    padding: 17px 0;
    line-height: 28px;
    text-decoration: none;
  }

  .logout-link:hover {
    text-decoration: underline;
  }

  .page__header {
    height: 60px;
    background: #ffffff;
    border-bottom: 1px solid #e6e6e6;
    width: 100%;
    position: fixed;
    top: 0;
  }

  .page__header--container {
    display: flex;
    justify-content: center;
  }

  .logo-link {
    text-decoration: none;
    font-size: 26px;
    display: inline-block;
    padding: 15px 0;
  }

  .logo-link__job {
    color: #07c;
  }

  .logo-link__board {
    color: #d14800;
    font-weight: 900;
  }

  .navbar-action {
    cursor: pointer;
    background: transparent;
    font-size: 16px;
    border: none;
    padding: 16px 0;
    line-height: 28px;
    color: #333333;
    display: inline-block;
  }

  .navbar-action:hover {
    text-decoration: underline;
  }

  .navigation {
    display: none;
  }

  .navigation__links {
    list-style: none;
    margin: 0;
    display: inline-flex;
  }

  .navigation__link {
    margin-left: 25px;
  }

  .page__container {
    margin: 0 auto;
  }

  @media only screen and (min-width: 640px) {
    .page__header--container {
      justify-content: space-between;
    }

    .app-header__navigation {
      display: inline-block;
    }
  }
</style>
