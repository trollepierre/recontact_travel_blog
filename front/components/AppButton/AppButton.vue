<template>
  <button
    type="button"
    class="button"
    @click.prevent.once="onClick">
    {{ text }}
  </button>
</template>
<script>
  export default {
    name: 'AppButton',
    props: {
      text: { type: String, default: () => '' },
    },
    methods: {
      onClick() {
        this.$emit('click')
      },
    },
  }
</script>

<style scoped>
.button {
  line-height: 28px;
  color: #F48024;
  text-decoration: unset;
  font-size: 11px;
  font-family: serif;
  text-transform: uppercase;
  background: #FFFFFF;
  border: 1px solid #F48024;
  cursor: pointer;
  padding: 3px 5px;
  border-radius: 4px;
  width: 100%;
  font-weight: 700;
}

.button:hover {
  background: #D14800;
  color: #FFFFFF;
}

</style>
