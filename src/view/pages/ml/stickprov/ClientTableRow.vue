<template>
  <tr>
    <td>
      <span class="text-dark-75 font-weight-bolder d-block font-size-lg">{{ client.firstname }} {{ client.lastname }}</span>
    </td>
    <td>
        {{ client.email }}
    </td>
    <td>
        {{ client.phone }}
    </td>
    <td>
      <b-button v-if="stickprov.call_only === 1 && status === 'no_answer'" class="mr-2" type="button" variant="primary" @click="confirm">Svara Ja</b-button>
      <b-button v-if="stickprov.call_only === 1 && status === 'no_answer'" type="button" variant="danger" @click="reject">Svara Nej</b-button>
    </td>
    <td>
      <h4>
        <b-badge v-if="status === 'confirmed'" variant="success">Bekräftat</b-badge>
        <b-badge v-if="status === 'rejected'" variant="danger">Ej medlem</b-badge>
        <b-badge v-if="status === 'no_answer'" variant="warning">Ej svar</b-badge>
      </h4>
    </td>
  </tr>
</template>
<style lang="scss" scoped>
.checkbox > span {
  background-color: white;
  border: 1px solid #ddd;
}
</style>
<script>
import axios from 'axios';
import { mapGetters } from 'vuex';

export default {
  name: 'client-table-row',
  props: ['client','stickprov'],
  computed: {
    ...mapGetters(['currentCompanyId'])
  },
  data() {
    return {
      status: ''
    };
  },
  mounted() {
    this.refresh();
  },
  watch: {
    client(newValue, oldValue) {
      this.refresh();
    }
  },
  methods: {
    refresh() {
      console.log('refreshing');

      if (this.client.st_conf === 1) {
        this.status = 'confirmed';
      }
      else if (this.client.st_rej === 1) {
        this.status = 'rejected';
      }
      else {
        this.status = 'no_answer';
      }
    },
    confirm() {
      this.$emit('confirm', this.client.client_id);
      this.status = 'confirmed';
    },
    reject() {
      this.$emit('reject', this.client.client_id);
      this.status = 'rejected';
    },
    selectClientClicked(client_id) {
      this.$emit('selectClientClicked', client_id);
    },
    deleteClientClicked(client_id) {
      this.$emit('deleteClientClicked', client_id);
    },
  }
};
</script>
