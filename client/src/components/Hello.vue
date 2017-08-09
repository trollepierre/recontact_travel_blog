<template>
  <div class="hello">
    {{ getImg }}
    <img :src="getImg"/>
  </div>
</template>

<script>
  import axios from 'axios';

  export default {
    name: 'hello',
    data() {
      return {
        url: 'http://localhost:3000/articles',
        imgLink: 'not defined',
      };
    },
    computed: {
      getImg() {
        const options = { headers: { 'Content-Type': 'application/json' } };
        axios.get(this.url, options)
          .then((response) => {
            this.imgLink = response.data[0].imgLink;
          });
        return this.imgLink;
      },
    },
  }
  ;
</script>

<style scoped>
  h1, h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }
</style>
