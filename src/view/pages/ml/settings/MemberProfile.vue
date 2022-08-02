<template>
  <div class="px-5 mt-8" id="page-basic0">
    <b-row>
      <b-col lg="2"></b-col>
      <b-col lg="8">
        <b-alert show variant="light">Markerade datafält nedan kommer att visas på medlemmens profilsida och kan uppdateras av medlemmen.</b-alert>

        <b-card title="" class="mb-2 mt-8" hide-footer>
          <div>
            <b-form @submit="saveData">
              
              <template v-for="(item, i) in profilearr">
              <ProfileRow
                v-bind:key="i"
                :profilerow="item"
                @toastr="toastr"
              />
            </template>

              <b-button type="submit" variant="primary">Spara</b-button>
            </b-form>
          </div>
        </b-card>
      </b-col>
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
import ProfileRow from '@/view/pages/ml/settings/profile/ProfileRow.vue';

export default {
  name: 'memberprofile-settings',
  components: {
    ProfileRow
  },
  props: ['company'],
  computed: {
    ...mapGetters(['currentCompanyId', 'currentPeriodId'])
  },
  mounted() {
    this.loadData();
  },
  data() {
    return {
      form: {
        company_id: '',
      },
      profilearr: [
        
      ],
      profile: {}
    };
  },
  watch: {
    currentCompanyId(newValue, oldvalue) {
      if (newValue) {
        this.loadData();
      }
    }
  },
  methods: {
    async loadData() {
      if (!this.currentCompanyId) {
        return;
      }

      this.profilearr = [];

      for (const k in this.company.profile) {
        this.profilearr.push({ name: this.getText(k), id: k, checked: this.company.profile[k] === 1 });
      }
    },
    getText(key) {
      switch(key) {
        case 'pn': return 'Personnummer';
        case 'na': return 'Namn';
        case 'em': return 'E-post';
        case 'ph': return 'Telefon';
        case 'st': return 'Gatudress';
        case 'co': return 'C/O';
        case 'zi': return 'Postkod';
        case 'pa': return 'Postort';
        case 'rc': return 'Region';
        case 'cc': return 'Kommun';
      }

      return 'Okänt: ' + key;
    },
    getLangText(lang_text, lang) {
      for (var i = 0; i < lang_text.length; ++i) {
        if (lang_text[i].lang === lang) {
          return lang_text[i].text;
        }
      }

      return 'Språköversättning saknas';
    },
    saveData(e) {
      e.preventDefault();

      var company = { profile: {}, company_id: this.currentCompanyId };

      for (var i = 0; i < this.profilearr.length; ++i) {
          company.profile[this.profilearr[i].id] = this.profilearr[i].checked ? 1 : 0;
      }

      axios
        .put('/company', company)
        .then(res => {
          if (res.status === 204) {
            this.toastr('success', 'OK', 'Inställningar uppdaterad');
          }
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte uppdatera inställningar');
        });
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
