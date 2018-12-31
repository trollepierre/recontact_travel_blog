<template>
  <div class="subscription">
    <table class="subscription__table">
      <thead>
        <tr class="subscription__row">
          <th class="subscription__email">email</th>
          <th class="subscription__lang">lang</th>
          <th class="subscription__unsubscribe">Unsubscribe</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="subscription in subscriptions"
          :key="subscription.email"
          class="subscription__row">
          <td class="subscription__email">{{ subscription.email }}</td>
          <td class="subscription__lang">{{ subscription.lang }}</td>
          <td class="subscription__unsubscribe">
            <button @click.prevent="unsubscribe(subscription.id)">Unsubscribe</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  import subscriptionsApi from '../api/subscriptions'

  export default {
    name: 'SubscriberList',
    data() {
      return {
        subscriptions: [],
      }
    },
    mounted() {
      this.getSubscriptions()
    },
    methods: {
      async getSubscriptions() {
        this.subscriptions = await subscriptionsApi.fetchAll()
      },

      unsubscribe(id) {
        subscriptionsApi.delete(id)
      },
    },
  }
</script>

<style scoped>
  .subscription {
    display: flex;
    align-content: center;
    margin-left: auto;
    margin-right: auto;
    text-align: center;
    width: 50%;
  }

  .table, th, td {
    border: 1px solid black;
  }

  .subscription__row {
    width: 100%;
  }

  .subscription__email {
    width: 300px
  }

  .subscription__lang {
    width: 100px;
  }

  .subscription__unsubscribe button {
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

  .subscription__unsubscribe button:hover {
    background: #d14800;
    color: #ffffff;
  }
</style>
