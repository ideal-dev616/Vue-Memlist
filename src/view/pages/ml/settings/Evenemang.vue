<template>
  <div class="px-5 mt-8" id="page-bank">
    <b-row>
      <b-col lg="2"></b-col>
      <b-col lg="8">
        <b-card title="" class="mb-2 mt-8" hide-footer>
          <b-form class="mt-8" @submit.prevent="saveData">
            <label class="checkbox checkbox-lg checkbox-outline checkbox-success mb-7">
              <input
                type="checkbox"
                name=""
                v-model="subcompany_public"
                @click="subcompany_public = !subcompany_public"
              />
              <span class='mr-3'></span>
              Lägg till underföreningarnas evenemang i vår publika evenemangslistan
            </label>

            <b-button type="submit" variant="primary">Spara</b-button>
          </b-form>
        </b-card></b-col
      >
    </b-row>
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

export default {
  name: 'api-evenemang-settings',
  props: ['settings'],
  computed: {
    ...mapGetters(['currentCompanyId'])
  },
  data() {
    return {
      subcompany_public: false,
    };
  },
  created(){
    if (this.settings){
      this.subcompany_public = this.settings.subevents;
    }
  },
  methods: {
    saveData() {
      const settings = {
        subevents: this.subcompany_public
      };
      axios.put('/company', {
        company_id: this.currentCompanyId,
        settings
      }).then(res => {
        if (res.status === 204){
          this.toastr('success', 'OK', 'updated');
        } else {
          this.toastr('danger', 'Fel', 'failed');
        }
      }).catch(err => {
        console.error(err);
        this.toastr('danger', 'Fel', 'failed');
      })
    },
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
