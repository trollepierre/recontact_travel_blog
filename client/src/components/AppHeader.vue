<template>
  <div class="app-header">
    <header class="page__header">
      <div class="page__container page__header--container">
        <a class="logo-link" href="/">
          <span class="logo-link__recontact">Recontact</span>
          <span class="logo-link__me">Me</span>
        </a>
        <nav class="app-header__navigation navigation" role="navigation" aria-label="site navigation">
          <ol class="navigation__links">
            <li class="navigation__link">
              <button class="navbar-action navbar-action__subscribe" type="button"
                      @click.prevent="displaySubscribeModal">S'abonner
              </button>
            </li>
            <li class="navigation__link">
              <button class="navbar-action navbar-action__suggestion" type="button"
                      @click.prevent="displayFeedbackModal">Laisser un message
              </button>
            </li>
            <li class="navigation__link">
              <button class="navbar-action navbar-action__problem" type="button"
                      @click.prevent="goToAdmin">Signaler un problème
              </button>
            </li>
          </ol>
        </nav>
      </div>
    </header>
  </div>
</template>
<script>
  export default {
    name: 'AppHeader',
    methods: {
      displaySubscribeModal() {
        this.$modal.show('subscribe-modal');
      },

      displayFeedbackModal() {
        this.$modal.show('feedback-modal');
      },

      goToAdmin() {
        this.$router.push('/admin');
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
    border-bottom: 1px solid #e6e6e6;
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

  .logo-link__recontact {
    color: #07c;
  }

  .logo-link__me {
    color: #F48024;
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
