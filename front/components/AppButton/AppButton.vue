<template>
  <NuxtLink
    v-if="isNuxtLink"
    :to="to"
    :class="hide ? 'hidden' : 'button'">
    {{ text }}
  </NuxtLink>
  <RouterLink
    v-else-if="isRouterLink"
    :to="to"
    :class="hide ? 'hidden' : 'button'">
    {{ text }}
  </RouterLink>
  <a
    v-else-if="isAnchor"
    :href="href"
    :target="target"
    :rel="rel"
    :class="hide ? 'hidden' : 'button'">
    {{ text }}
  </a>
  <button
    v-else
    type="button"
    :class="hide ? 'hidden' : 'button'"
    @click="handleClick">
    {{ text }}
  </button>
</template>
<script>
  export default {
    name: 'AppButton',
    props: {
      text: { type: String, default: () => '' },
      to: { type: String, default: () => undefined },
      href: { type: String, default: () => undefined },
      target: { type: String, default: () => undefined },
      rel: { type: String, default: () => undefined },
      tag: { type: String, default: () => 'button' },
      allowMultipleClick: { type: Boolean, default: () => false },
      hide: { type: Boolean, default: () => false },
    },
    data: () => ({
      hasClickedOnce: false,
    }),
    computed: {
      isLink() {
        const t = (this.tag || '').toLowerCase()
        return !!this.to && (t === 'nuxtlink' || t === 'nuxt-link' || t === 'routerlink' || t === 'router-link')
      },
      isNuxtLink() {
        const t = (this.tag || '').toLowerCase()
        return !!this.to && (t === 'nuxtlink' || t === 'nuxt-link')
      },
      isRouterLink() {
        const t = (this.tag || '').toLowerCase()
        return !!this.to && (t === 'routerlink' || t === 'router-link')
      },
      isAnchor() {
        const t = (this.tag || '').toLowerCase()
        return !!this.href && t === 'a'
      },
    },
    methods: {
      handleClick(e) {
        // For links (NuxtLink/RouterLink), don't block navigation
        if (this.isLink) { return }
        // Button behaviour: block the second click when allowMultipleClick is false
        if (!this.allowMultipleClick) {
          if (this.hasClickedOnce) {
            e.preventDefault()
            return
          }
          this.hasClickedOnce = true
        }
        this.$emit('click')
      },
    },
  }
</script>

<style lang="scss" scoped>
.button {
  line-height: 28px;
  color: $button-color;
  text-decoration: unset;
  font-size: 11px;
  font-family: serif;
  text-transform: uppercase;
  background: $button-bg;
  border: 1px solid $button-color;
  cursor: pointer;
  padding: 3px 5px;
  border-radius: 4px;
  width: 100%;
  font-weight: 700;
}

.button:hover {
  background: $button-hover;
  color: $button-bg;
}

.hidden {
  display: none;
}

</style>
