<template>
  <div class="px-5 mt-8" id="page-basic0">
    <b-row>
      <b-col lg="2"></b-col>
      <b-col lg="8">
        <b-card title="" class="mb-2 mt-8" hide-footer>
          <div>
            <b-form @submit="saveData">
              
              <template v-for="(item, i) in requirements">
              <RequirementRow
                v-bind:key="i"
                :requirement="item"
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
import RequirementRow from '@/view/pages/ml/settings/requirements/RequirementRow.vue';

export default {
  name: 'requirements-settings',
  components: {
    RequirementRow
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
        constreq: []  
      },
      requirements: [
        
      ]
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

      axios
        .get('/company/constreq')
        .then(res => {
          var reqs = res.data.requirements;

          this.requirements = [];

          console.log(reqs);

          for (var i = 0; i < reqs.length; ++i) {
            var r = {
              checked: false,
              lang_text: reqs[i].lang_record_descr.lang_text,
              id: reqs[i].id
            }

            // check if we have it
            for (var j = 0; j < this.company.constreq.length; ++j) {
              if (this.company.constreq[j] === r.id) {
                r.checked = true;
              }
            }

            this.requirements.push(r);
          }
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte hämta medlemskrav');
        });
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

      this.form.company_id = this.currentCompanyId;
      this.form.constreq = [];

      for (var i = 0; i < this.requirements.length; ++i) {
        if (this.requirements[i].checked) {
          this.form.constreq.push(this.requirements[i].id);
        }
      }

      axios
        .put('/company', this.form)
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
