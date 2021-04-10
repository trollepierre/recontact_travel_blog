<template>
  <component
    :is="tag"
    type="button"
    class="button"
    :to="to"
    @click="(e) => allowMultipleClick ? onClick(e) : undefined"
    @click.prevent.once="(e) => allowMultipleClick ? undefined : onClick(e)">
    {{ text }}
  </component>
</template>
<script>
  export default {
    name: 'AppButton',
    props: {
      text: { type: String, default: () => '' },
      isLink: { type: Boolean, default: () => false },
      to: { type: String, default: () => undefined },
      tag: { type: String, default: () => 'button' },
      allowMultipleClick: { type: Boolean, default: () => false },
    },
    methods: {
      onClick(e) {
        e.preventDefault()
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

</style>
