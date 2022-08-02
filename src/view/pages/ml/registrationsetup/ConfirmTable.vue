<template>
  <!--begin::Advance Table Widget 9-->
  <div class="card card-custom card-stretch gutter-b">
    <!--begin::Header-->
    <div class="card-header border-0 py-5">
      <h3 class="card-title align-items-start flex-column">
        <span class="card-label font-weight-bolder text-dark">&nbsp;</span>
      </h3>
      <div class="card-toolbar">
        <a
          href="#"
          class="btn btn-primary font-weight-bolder font-size-sm mb-8"
          @click="createTermClicked"
          v-if="!editing"
          ><i class="menu-icon flaticon2-plus" style="font-size: 1em"></i>Nytt villkor</a
        >
      </div>
    </div>
    <!--end::Header-->
    <!--begin::Body-->
    <div class="card-body pt-0 pb-3">
      <!--begin::Table-->
      <div class="table-responsive">
        <table class="table table-head-custom table-vertical-center table-head-bg table-borderless">
          <thead>
            <tr class="text-left">
              <th>Namn</th>
              <th>Typ</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(item, i) in terms">
              <ConfirmTableRow
                v-bind:key="i"
                :term="item"
                :currentCompanyId="currentCompanyId"
                @selectTermClicked="selectTermClicked"
                @deleteTermClicked="deleteTermClicked"
                @toastr="toastr"
              />
            </template>
          </tbody>
        </table>
      </div>
      <!--end::Table-->
      <div v-if="editing" class="scroll-to-container">
        <b-form-group id="input-group-id" label="ID" label-for="input-id">
          <b-form-input
            id="input-id"
            v-model="form.id"
            type="text"
            required
            disabled
          ></b-form-input>
        </b-form-group>

        <div class="d-flex align-items-center mb-8">
          <label
            class="checkbox checkbox-lg checkbox-outline checkbox-success"
          >
            <input
              type="checkbox"
              name=""
              v-model="form.mandatory"
              @click="form.mandatory = !form.mandatory"
            />
            <span></span>
          </label>
          <span class="ml-3 cursor-pointer"
            >Obligatorisk</span
          >
        </div>

        <b-form-group id="input-group-name" label="Namn" label-for="input-name">
          <b-form-input id="input-name" v-model="form.name" type="text"></b-form-input>
        </b-form-group>

        <b-alert show variant="warning">Denna text kommer att stå bredvid checkboxen. Texten för villkor/policy kommer visas i en popup när man klickar på texten mellan % taggarna. Exempel: Klicka %här% för att visa användarvillkoren.</b-alert>

        <b-form-group id="input-group-descr" label="Checkbox text" label-for="input-descr">
          <b-form-input id="input-descr" v-model="form.descr" type="text"></b-form-input>
        </b-form-group>


        <b-form-group id="html-group" label="Text för villkor/policy" label-for="html">
          <editor
            v-model="form.template"
            api-key="qjaly68mahdluhx0rongdllvelixwgn18730f5z7fdzq6hq2"
            :init="{
              height: 500,
              menubar: false,
              plugins: [
                'advlist autolink lists link image charmap print preview anchor',
                'searchreplace visualblocks code fullscreen',
                'insertdatetime media table paste code help wordcount'
              ],
              toolbar:
                'undo redo | formatselect | bold italic backcolor | \
                  alignleft aligncenter alignright alignjustify | \
                  bullist numlist outdent indent | removeformat'
            }"
          />
        </b-form-group>
        <div class="d-flex justify-content-end">
          <b-button type="button" variant="primary" @click="saveTermClicked">Spara</b-button>
        </div>
      </div>
    </div>
    <!--end::Body-->
  </div>
  <!--end::Advance Table Widget 9-->
</template>
<style lang="scss" scoped>
.checkbox.checkbox-light-success > span {
  background-color: white;
  border: 1px solid #ddd;
}
</style>
<script>
import axios from 'axios';
import ConfirmTableRow from '@/view/pages/ml/registrationsetup/ConfirmTableRow.vue';
import Editor from '@tinymce/tinymce-vue';
import { mapGetters } from 'vuex';

export default {
  name: 'confirm-terms-table',
  props: ['page'],
  components: {
    ConfirmTableRow,
    editor: Editor
  },

  computed: {
    ...mapGetters(['currentCompanyId'])
  },

  watch: {
    show_history(newcheck, oldcheck) {
      this.$emit('showHistoryToggled', newcheck);
    }
  },

  mounted() {
    this.loadTerms();
  },

  methods: {

    loadTerms() {
      axios
        .get(`/company/terms?company_id=${this.currentCompanyId}`)
        .then(res => {
          this.terms = res.data.terms;

          console.log(this.terms);
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Fel', 'Kunde inte hämta alla villkor');
        });
    },

    createTermClicked() {
      this.form = {
        name: 'Nytt villkor',
        descr: 'Fyll i text att stå vid checkbox',
        mandatory: false,
        company_id: this.currentCompanyId
      }

      this.creating = true;
      this.editing = true;

      this.scrollToEdit();
    },

    saveTermClicked() {
      if (this.creating) {
        this.postTerm();
      }
      else {
        this.putTerm();

        for (const t of this.terms) {
          if (t.id === this.form.id) {
            t.name = this.form.name;
            t.mandatory = this.form.mandatory;
            t.descr = this.form.descr;
            t.template = this.form.template;
          }
        }
      }
    },

    selectTermClicked(id) {
      this.editing = true;

      console.log('selected term: ' + id);

      for (const t of this.terms) {
        if (t.id === id) {
          this.form = t;
          this.scrollToEdit();
          return;
        }
      }

    },

    deleteTermClicked(id) {
      console.log('deleted term: ' + id);

      axios 
        .delete(`/company/term?term_id=${id}&company_id=${this.currentCompanyId}`)
        .then(res => {
          this.terms = this.terms.filter(item => item.id !== id);

          this.toastr('success', 'OK', 'Villkoret togs bort');
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Fel', 'Kunde inte radera villkor');
        });
    },

    scrollToEdit() {
      var that = this;
      setTimeout(function () {
        const el = that.$el.getElementsByClassName('scroll-to-container')[0];

        if (el) {
          const yOffset = -70;
          const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;

          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 100);
    },


    postTerm() {
      this.form.company_id = this.currentCompanyId;
      if (this.form.template === undefined) {
        this.form.template = '';
      }
      
      axios 
        .post('/company/term', this.form)
        .then(res => {
          this.creating = false;
          this.terms.push(res.data.term);
          console.log(this.terms);
          this.toastr('success', 'OK', 'Villkor skapat');
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Fel', 'Kunde inte skapa villkor');
        });
    },

    putTerm() {
      this.form.company_id = this.currentCompanyId;

      axios 
        .put('/company/term', this.form)
        .then(res => {
          
          this.toastr('success', 'OK', 'Villkor uppdaterat');
          
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Fel', 'Kunde inte skapa villkor')
        });
    },


    toastr(type, title, message) {
      this.$emit('toastr', type, title, message);
    }
  },

  data() {
    return {
      creating: false,
      editing: false,

      terms: [], // list of all terms

      form: { // the current term we are editing
        id: '',
        tid: '',
        name: '',
        descr: '',
        template: '',
        mandatory: false,
      }
    };
  }
};
</script>
