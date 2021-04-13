<template>
  <app-button
    class="dark-button"
    :text="changeThemeIcon"
    :allow-multiple-click="true"
    @click="toggleDarkMode()"/>
</template>
<script>
  import { mapMutations } from 'vuex'
  import AppButton from '@/components/AppButton/AppButton'
  import ThemeApi from '@/services/api/theme'

  export default {
    name: 'DarkModeToggle',
    components: { AppButton },
    computed: {
      changeThemeIcon() {
        return this.isDarkMode ? '☀️' : '🌙️'
      },
      isDarkMode() {
        return this.$store.state.theme === 'dark'
      },
    },
    mounted() {
      this.GET_THEME_MODE()
    },
    methods: {
      toggleDarkMode() {
        if (this.isDarkMode) {
          ThemeApi.send(this.$store.state.theme, 'light')
          this.SET_THEME_MODE('light')
        } else {
          ThemeApi.send(this.$store.state.theme, 'dark')
          this.SET_THEME_MODE('dark')
        }
      },
      ...mapMutations({
        SET_THEME_MODE: 'SET_THEME_MODE',
        GET_THEME_MODE: 'GET_THEME_MODE',
      }),
    },
  }
</script>
<style lang="scss" scoped>
.button {
  background-color: $header-bg;
}

.button:hover {
  background-color: $button-hover;
}

.dark-button { // side effect
  font-size: 24px;
  margin-top: 0;
  padding: 8px 6px 0 6px;
}

.dark-button:hover {
  background-color: $button-hover;
}

.dark-button {
  display: flex;
  align-items: center;
  justify-content: center;
}

@media only screen and (max-width: 340px) {
  .dark-button {
    font-size: 10px;
  }
}

@media only screen and (min-width: 640px) {
  .dark-button {
    padding: 5px 8px 0;
  }
}
</style>
