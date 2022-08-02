<template>
  <div class="px-5" id="page-books">
    <h5 class="mb-6 ml-2">Verifikat</h5>

    <b-card
      title=""
      class="mb-2"
      hide-footer
    >

        <v-tabs
            background-color="white"
            color="dark"
            right
        >
            <v-tab>Bokförda</v-tab>
            <v-tab>Ej bokförda</v-tab>

            <v-tab-item>
                <BookDoneView />
            </v-tab-item>

            <v-tab-item>
                <BookWaitView />
            </v-tab-item>
        </v-tabs>
    </b-card>

  </div>
</template>

<style lang="scss" scoped>
.checkbox.checkbox-light-success > span {
  background-color: white;
  border: 1px solid #ddd;
}
</style>

<script>
import axios from 'axios';
import { mapGetters } from 'vuex';
import BookDoneView from '@/view/pages/ml/book/BookDoneView.vue';
import BookWaitView from '@/view/pages/ml/book/BookWaitView.vue';

export default {
  name: 'periods',
  components: {
    BookDoneView, BookWaitView,
  },
  computed: {
    ...mapGetters(['currentCompanyId', 'currentPeriodId'])
  },
  mounted() {

  },
  data() {
    return {

    };
  },
  watch: {
    currentCompanyId(newValue, oldvalue) {
      if (newValue) {

      }
    },
    currentPeriodId(newValue, oldValue){

    }
  },
  methods: {
    toastr(type, title, message) {
      this.$bvToast.toast(message, {
        title: title,
        autoHideDelay: 2000,
        appendToast: true,
        variant: type
      });
    }
  }
};
</script>
