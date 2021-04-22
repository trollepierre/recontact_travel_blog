<template>
  <app-button
    class="new-button"
    :text="changeThemeIcon"
    :allow-multiple-click="true"
    @click="toggleNewMode"/>
</template>
<script>
  import { mapMutations } from 'vuex'
  import AppButton from '@/components/AppButton/AppButton'
  import ThemeApi from '@/services/api/theme'

  export default {
    name: 'NewModeToggle',
    components: { AppButton },
    computed: {
      changeThemeIcon() {
        return this.isNewMode ? '🎨' : '🎨'
      },
      isNewMode() {
        return this.$store.state.theme === 'new'
      },
    },
    methods: {
      toggleNewMode() {
        if (this.isNewMode) {
          ThemeApi.send(this.$store.state.theme, 'light')
          this.SET_THEME_MODE('light')
        } else {
          ThemeApi.send(this.$store.state.theme, 'new')
          this.SET_THEME_MODE('new')
        }
      },
      ...mapMutations({
        SET_THEME_MODE: 'SET_THEME_MODE',
      }),
    },
  }
</script>
<style lang="scss" scoped>
.new-button {
  background-color: $header-bg;
  font-size: 24px;
  margin-top: 0;
  padding: 8px 6px 0 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.new-button:hover {
  background-color: $button-hover;
}

@media only screen and (max-width: 340px) {
  .new-button {
    font-size: 10px;
  }
}

@media only screen and (min-width: 640px) {
  .new-button {
    padding: 5px 8px 0;
  }
}
</style>
