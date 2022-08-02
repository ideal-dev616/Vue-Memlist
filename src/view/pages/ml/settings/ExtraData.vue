<template>
  <div class="px-5 mt-8" id="page-titles">
    <b-row>
      <b-col lg="2"></b-col>
      <b-col lg="8">
        <ExtraDataTable
          :extras="extras"
          @deleteExtra="deleteExtra"
          @selectExtra="selectExtra"
          @createExtra="createExtra"
        />
      </b-col>
    </b-row>
    <b-row>
      <b-col lg="2"></b-col>
      <b-col lg="8">
        <b-card v-if="creating || editing" title="Editera extradata" class="mb-2 mt-8 edit-extradata" hide-footer>
          <div>
            <b-form class="mt-8" @submit="saveData">
              <b-form-group id="input-group-name" label="Namn" label-for="input-name">
                <b-form-input
                  id="input-name"
                  v-model="form.name"
                  type="text"
                  required
                ></b-form-input>
              </b-form-group>

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
import ExtraDataTable from '@/view/pages/ml/settings/extradata/ExtraDataTable.vue';

export default {
  name: 'extra-settings',
  components: {
    ExtraDataTable
  },
  computed: {
    ...mapGetters(['currentCompanyId', 'currentPeriodId'])
  },
  mounted() {
    this.loadData();
  },
  data() {
    return {
      form: null,
      creating: false,
      editing: false,
      extras: []
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
        .get(`/company?company_id=${this.currentCompanyId}`)
        .then(res => {

          this.extras = res.data.extras;
          
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Fel', 'Kunde inte lista extradata');
        });
    },
    createExtra() {
      this.creating = true;
      this.form = {
        name: ''
      };
      this.scrollToEditExtra();
    },
    selectExtra(id) {
      this.form = this.extras.find(item => item.id === id);

      this.editing = true;
      this.scrollToEditExtra();
    },
    deleteExtra(id) {
      axios
        .delete(`/extra_data?id=${id}&company_id=${this.currentCompanyId}`)
        .then(res => {
          this.extras = this.extras.filter(item => item.id !== id);
        })
        .catch(err => {
          this.toastr('danger', 'Fel', 'Kunde inte ta bort extradata');
        });
    },
    saveData(e) {
      e.preventDefault();

      if (this.creating) {
        this.creating = false;
        this.form.company_id = this.currentCompanyId;

        axios 
          .post('/extra_data', this.form)
          .then(res => {
            this.toastr('success', 'OK', 'Extradata har skapats');

            this.extras.push(res.data.extra);
          })
          .catch(err => {
            console.error(err);
            this.toastr('danger', 'Fel', 'Kunde inte skapa extradata');
          });
      } else {
        
        this.form.company_id = this.currentCompanyId;

        axios 
          .put('/extra_data', this.form)
          .then(res => {
            this.toastr('success', 'OK', 'Extradata har uppdaterats');
          })
          .catch(err => {
            console.error(err);
            this.toastr('danger', 'Fel', 'Kunde inte uppdatera extradata');
          });
      }
    },
    scrollToEditExtra() {
      var that = this;
      setTimeout(function () {
        const el = that.$el.getElementsByClassName('edit-title')[0];

        if (el) {
          const yOffset = -70;
          const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;

          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 100);
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
