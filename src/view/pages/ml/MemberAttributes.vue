<template>
  <div class="px-5" id="page-property_groups">
    <h5 class="mb-6 ml-2">Kategorier / Medlemsubildningar och Attribut</h5>

    <GroupTable
      :items="groups"
      @createGroupClicked="createGroup"
      @selectGroupClicked="selectGroup"
      @deleteGroupClicked="deleteGroup"
      @toastr="toastr"
    />
    <div class="scroll-to-container"></div>
    <b-card
      title=""
      class="mb-2 edit-property_group-container"
      ref="edit-property_group"
      id="edit-property_group"
      hide-footer
      v-if="creating || editing"
    >
      <div>
        <b-form @submit="updateGroup" class="mt-8">
          <b-form-group id="input-group-group_id" label="ID" label-for="input-group_id">
            <b-form-input
              id="input-group_id"
              v-model="form.group_id"
              type="text"
              disabled
            ></b-form-input>
          </b-form-group>

          <b-form-group id="input-group-name" label="Namn" label-for="input-name">
            <b-form-input id="input-name" v-model="form.name" type="text"></b-form-input>
          </b-form-group>

          <b-form-group id="input-group-descr" label="Beskrivning" label-for="input-descr">
            <b-form-textarea
              id="input-descr"
              size="sm"
              placeholder="Beskrivande text om kategorin..."
              v-model="form.descr"
            ></b-form-textarea>
          </b-form-group>

          <h5 class="mb-8 mt-8">Valalternativ:</h5>
          <b-form-group id="mult-group" label="Kan flera attribut väljas inom denna kategori" label-for="mult">
            <b-form-select id="mult" v-model="form.is_multi" :options="multOptions"></b-form-select>
          </b-form-group>

          <h5 class="mb-8 mt-8">Andra alternativ:</h5>
          <b-form-group>
            <div class="d-flex align-items-center mb-4">
              <label
                class="checkbox checkbox-lg checkbox-outline checkbox-success"
              >
                <input
                  type="checkbox"
                  name=""
                  v-model="form.registration"
                  @click="form.registration = !form.registration"
                />
                <span></span>
              </label>
              <span class="ml-3 cursor-pointer">Visa vid registrering</span>
            </div>
            <div class="d-flex align-items-center">
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
              <span class="ml-3 cursor-pointer">Obligatoriskt val</span>
            </div>
          </b-form-group>

          <GroupAttributesTable :group_id="group_id" @toastr="toastr" />

          <b-button type="submit" variant="primary">Spara</b-button>
        </b-form>


      </div>
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
import 'vue-select/dist/vue-select.css';
import Select2 from 'v-select2-component';

import axios from 'axios';
import { mapGetters } from 'vuex';
import GroupTable from '@/view/content/widgets/advance-table/GroupTable.vue';
import GroupAttributesTable from '@/view/content/widgets/advance-table/GroupAttributesTable.vue';

export default {
  name: 'property_groups',
  components: {
    GroupTable,
    Select2,
    GroupAttributesTable
  },
  computed: {
    ...mapGetters(['currentCompanyId', 'currentPeriodId', 'periods'])
  },
  mounted() {
    this.loadTemplates();
    this.loadGroups();
  },
  data() {
    return {
      templates: [],
      multOptions: [
        { text: 'Enkelval', value: 0 },
        { text: 'Flerval', value: 1 }
      ],
      myValue: '',
      myOptions: [],
      file: {
        name: 'bild0.jpg'
      },
      member_fee: false,
      form: {
        group_id: '',
        company_id: '',
        type: '',
        name: '',
        descr: '',
        is_registration: 0,
        is_multi: 0,
        is_mandatory: 0,
        registration: false,
        multi: false,
        mandatory: false
      },
      creating: false,
      editing: false,
      groups: [],
      group: '',
      group_id: null
    };
  },
  watch: {
    currentCompanyId(newValue, oldvalue) {
      if (newValue) {
        this.loadGroups();
      }
    }
  },
  methods: {
    handleFileUpload() {
      this.file = this.$refs.file.files[0];

      this.uploadFile();
    },
    selectFile() {
      this.$refs.file.click();
    },
    uploadFile() {
      let formData = new FormData();
      formData.append('file', this.file);
      formData.append('group_id', this.form.group_id);
      formData.append('file_source', 'property_groups');
      formData.append('file_type', 'FILE_IMAGE');
      formData.append('form_group_id', this.form.group_id);
      formData.append('company_id', this.currentCompanyId);

      axios
        .post('/fileupload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then(res => {
          this.toastr('success', 'OK', 'Bilden laddades upp');
          console.log(res.data);
          this.form.frontend.img_url = res.data.fileobjs[0].public_path;
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte ladda upp fil');
        });
    },
    async loadTemplates() {
      if (!this.currentCompanyId) {
        return;
      }

      this.templates = [];
      this.templateOptions = [];
      axios
        .get(`/template/list?company_id=${this.currentCompanyId}`)
        .then(res => {
          if (res.status === 200) {
            this.templates = res.data.templates;

            this.templates.forEach(t => {
              this.templateOptions.push({ text: t.name, value: t.template_id });
            });
          }
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte lista grupper');
        });
    },
    tagChanged(ee) {},
    tagSelected(ee) {},
    async loadData() {
      if (!this.currentCompanyId) {
        return;
      }
      if (!this.titles) {
        return;
      }

      this.loadGroups();
    },
    createGroup() {
      this.creating = false;
      this.editing = true;

      this.form = {
        company_id: this.currentCompanyId,
        period_id: this.currentPeriodId,
        type: '',
        name: 'Ny Kategori',
        descr: '',
        is_registration: 0,
        is_multi: 0,
        is_mandatory: 0,
        registration: false,
        multi: false,
        mandatory: false
      };

      this.scrollToEditGroup();

      this.form.company_id = this.currentCompanyId;
      this.form.period_id = this.currentPeriodId;

      axios
        .post('/property_group', this.form)
        .then(res => {
          if (res.status === 201) {
            this.creating = false;
            this.form = res.data.group;
            this.group_id = this.form.group_id;
            this.toastr('success', 'OK', 'Kategorin skapades');
            this.loadGroups();
          }
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte skapa kategorin');
        });
    },
    deleteGroup(group_id) {
      axios
        .delete(`/property_group?group_id=${group_id}&company_id=${this.currentCompanyId}`)
        .then(res => {
          this.groups = this.groups.filter(item => item.group_id !== group_id);

          this.creating = false;
          this.editing = false;

          this.toastr('success', 'OK', 'Kategorin togs bort');
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte ta bort kategorin');
        });
    },
    selectGroup(group_id) {
      axios
        .get(`/property_group?group_id=${group_id}&company_id=${this.currentCompanyId}`)
        .then(res => {
          this.form = res.data.group;
          this.group_id = this.form.group_id;
          this.creating = false;
          this.editing = true;

          this.form.mandatory = res.data.group.is_mandatory === 1;
          this.form.registration = res.data.group.is_registration === 1;

          this.scrollToEditGroup();
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte hämta kategorin');
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
    loadGroups() {
      this.groups = [];
      axios
        .get(`/property_group/list?company_id=${this.currentCompanyId}&period_id=${this.currentPeriodId}`)
        .then(res => {
          if (res.status === 200) {
            this.groups = res.data.groups;
          }
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte lista kategorier');
        });
    },
    updateGroup(e) {
      e.preventDefault();

      if (this.form.meta === undefined || this.form.meta === null) {
        this.form.meta = {};
      }

      this.form.meta.is_member_fee = this.member_fee ? 1 : 0;

      for (var i = 0; i < this.periods.length; ++i) {
        if (this.periods[i].selected) {
          this.form.meta.periods.push(this.periods[i].id);
        }
      }

      this.form.is_mandatory = this.form.mandatory ? 1 : 0;
      this.form.is_registration = this.form.registration ? 1 : 0;

      if (this.creating) {
        axios
          .post('/property_group', this.form)
          .then(res => {
            if (res.status === 201) {
              this.creating = false;
              this.editing = false;
              this.form = res.data.group;

              this.form.mandatory = res.data.group.is_mandatory === 1;
              this.form.registration = res.data.group.is_registration === 1;

              this.toastr('success', 'OK', 'Kategorin skapades');
              this.loadGroups();
            }
          })
          .catch(err => {
            console.error(err);
            this.toastr('danger', 'Server Fel', 'Kunde inte skapa kategorin');
          });
      } else {
        axios
          .put('/property_group', this.form)
          .then(res => {
            if (res.status === 200) {
              this.creating = false;
              this.editing = false;
              this.form = res.data.group;

              for (var i = 0; i < this.groups.length; ++i) {
                if (this.groups[i].group_id === this.form.group_id) {
                  this.groups[i].name = this.form.name;
                }
              }

              this.form.mandatory = res.data.group.is_mandatory === 1;
              this.form.registration = res.data.group.is_registration === 1;

              this.toastr('success', 'OK', 'Kategorin uppdaterades');
              this.loadGroups();
            }
          })
          .catch(err => {
            console.error(err);
            this.toastr('danger', 'Server Fel', 'Kunde inte uppdatera kategorin');
          });
      }
    },
    scrollToEditGroup() {
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
