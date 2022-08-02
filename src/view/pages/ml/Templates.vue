<template>
  <div class="px-5" id="page-templates">
    <h5 class="mb-6 ml-2">Mallar</h5>
    <!-- <CompanySelect :ids='[]'/> -->
    <TemplatesTable
      :items="templates"
      :currentCompanyId="currentCompanyId"
      @createTemplateClicked="createTemplate"
      @copyTemplateClicked="copyTemplate"
      @selectTemplateClicked="selectTemplate"
      @deleteTemplateClicked="deleteTemplate"
      @changeSystem="changeSystem"
      @toastr="toastr"
    />
    <div class="scroll-to-container"></div>
    <b-card
      title=""
      class="mb-2 edit-template-container"
      ref="edit-template"
      id="edit-template"
      hide-footer
      v-if="creating || editing"
    >
      <div>
        <b-form class="mt-8" @submit.prevent="saveTemplate">
          <b-form-group id="input-group-template_id" label="ID" label-for="input-template_id">
            <b-form-input
              id="input-template_id"
              v-model="form.template_id"
              type="text"
              required
              disabled
            ></b-form-input>
          </b-form-group>

          <b-form-group id="input-group-1" label="Mallnamn" label-for="input-1">
            <b-form-input
              id="input-1"
              v-model="form.name"
              type="text"
              required
              placeholder="Mallnamn"
            ></b-form-input>
          </b-form-group>

          <b-form-group id="reply_to-group" label="Reply-to" label-for="reply_to">
            <b-form-input
              id="reply_to"
              v-model="form.reply_to"
              required
              placeholder="test@memlist.se"
            ></b-form-input>
          </b-form-group>

          <b-form-group id="from_name-group" label="Från Namn" label-for="from_name">
            <b-form-input
              id="from_name"
              v-model="form.from_name"
              required
              placeholder="Föreningsnamn"
            ></b-form-input>
          </b-form-group>

          <b-form-group id="subject-group" label="Ärende" label-for="subject">
            <b-form-input
              id="subject"
              v-model="form.subject"
              placeholder="Endast för e-post"
            ></b-form-input>
          </b-form-group>


          <b-row v-if="!creating">
            <b-col lg="8">
              <CompanySelect ref='companies_selected' :ids='[]' class='mb-4'/>
            </b-col>
            <b-col lg="4">
              <b-button variant="outline-success" class="ml-2" @click="moveToCompanies">Kopiera till</b-button>
            </b-col>
          </b-row>

          <b-form-group>
            <div v-if='isTalongAdmin' class="d-flex align-items-center mb-6 mt-4">
              <label
                class="checkbox checkbox-lg checkbox-outline checkbox-success"
              >
                <input
                  type="checkbox"
                  name=""
                  :checked="form.is_system"
                  @click="form.is_system=!form.is_system"
                />
                <span></span>
              </label>
              <span class="ml-3 cursor-pointer">Systemet</span>
            </div>

            <div class="d-flex align-items-center mb-6 mt-4">
              <label
                class="checkbox checkbox-lg checkbox-outline checkbox-success"
              >
                <input type="checkbox" name="" :checked="sms" @click="sms = !sms" />
                <span></span>
              </label>
              <span class="ml-3 cursor-pointer">Är SMS</span>
            </div>

            <div class="d-flex align-items-center">
              <label
                class="checkbox checkbox-lg checkbox-outline checkbox-success"
              >
                <input
                  type="checkbox"
                  name=""
                  :checked="stickprov"
                  @click="stickprov = !stickprov"
                />
                <span></span>
              </label>
              <span class="ml-3 cursor-pointer">Är E-post</span>
            </div>
          </b-form-group>

          <b-textarea v-if="isSMS" rows="8" v-model="sms_content" class="mb-2">
          </b-textarea>
          <b-button type="submit" variant="primary">Spara</b-button>
          <b-button v-show="!isSMS" variant="outline-success" class="ml-2" @click="toggleFullscreen">Editera mall</b-button>
          <b-button v-if="sendout_id !== null" variant="success" class="ml-2" @click="backToSendout">Tillbaka</b-button>
        </b-form>
      </div>
    </b-card>
    <b-modal body-class="dark-modal-body" header-class="dark-modal" size="xl" v-model="fullscreen" hide-footer >
      <EmailTemplateEditor @saveDesign="saveDesign" :design="templateDesign" />
    </b-modal>
  </div>
</template>


<style lang="css" scoped>

::v-deep .dark-modal {
  color: white;
  background-color: #293039;
  border-bottom: 1px solid #444c56;
}

::v-deep .dark-modal-body {
  color: white;
  background-color: #293039;
}



.checkbox.checkbox-light-success > span {
  background-color: white;
  border: 1px solid #ddd;
}
</style>

<script>
import Editor from '@tinymce/tinymce-vue';
import EmailTemplateEditor from '@/view/components/EmailTemplateEditor.vue';

import axios from 'axios';
import { mapGetters } from 'vuex';
import CompanySelect from '@/view/components/companySelect.vue';
import TemplatesTable from '@/view/pages/ml/templates/TemplatesTable.vue';

export default {
  name: 'templates',
  components: {
    TemplatesTable,
    editor: Editor,
    CompanySelect,
    EmailTemplateEditor
  },
  computed: {
    ...mapGetters(['currentCompanyId', 'currentPeriodId', 'periods', 'isTalongAdmin']),
    fullscreen_visible(){
      const display = this.fullscreen ? 'block' : 'none';
      return `display:${display}`
    },
    templateDesign(){
      return this.form.edit_html
    },
    isSMS(){
      return this.sms
    }
  },
  mounted() {
    this.loadTemplates();
  },
  data() {
    return {
      form: {
        template_id: '',
        reply_to: '',
        name: '',
        subject: '',
        type: [],
        content: '',
        template: '',
        stickprov: false,
        is_system: false,
      },
      stickprov: false,
      sms: false,
      sms_content:'',
      creating: false,
      editing: false,
      moving: false,
      templates: [],
      fullscreen: false,
      sendout_id: null
    };
  },
  watch: {
    currentCompanyId(newValue, oldvalue) {
      if (newValue) {
        this.loadTemplates();
      }
    },
  },
  methods: {
    async loadData() {
      if (!this.currentCompanyId) {
        return;
      }
      if (!this.titles) {
        return;
      }

      this.loadTemplates();
    },
    createTemplate() {
      this.creating = true;
      this.editing = false;
      this.moving = false;
      this.resetForm();

      this.scrollToEditTemplate();
    },
    copyTemplateToCompany(template_id, company_id) {
      axios
        .post(`/template/copy`, { template_id: template_id, company_id: company_id })
        .then(res => {

        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte kopiera mallen');
        })
    },

    copyTemplate(template, movable = false) {
      if (!movable || template.company_id == this.currentCompanyId) {
        axios
          .post(`/template/copy`, { template_id: template.template_id })
          .then(res => {
            this.templates.push(res.data.template);
            this.toastr('success', 'OK', 'Mallen kopierades');
          })
          .catch(err => {
            console.error(err);
            this.toastr('danger', 'Server Fel', 'Kunde inte kopiera mallen');
          })
      } else {
      axios
        .get(`/template?template_id=${template.template_id}&company_id=${this.currentCompanyId}`)
        .then(res => {
          this.form = res.data.template;
          this.moving = true;
          this.creating = true;
          this.editing = true;

          this.stickprov = res.data.template.is_email_stickprov === 1;
          this.sms = res.data.template.is_sms_stickprov === 1;
          this.scrollToEditTemplate();
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte hämta mallar');
        });
      }
    },
    deleteTemplate(template_id) {
      axios
        .delete(`/template?template_id=${template_id}&company_id=${this.currentCompanyId}`)
        .then(res => {
          this.templates = this.templates.filter(item => item.template_id !== template_id);

          this.creating = false;
          this.editing = false;

          this.toastr('success', 'OK', 'Mallen togs bort');
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte ta bort mallar');
        });
    },
    changeSystem(template) {
      axios
        .put(`/template`, template)
        .then(res => {
          this.toastr('success', 'OK', 'Mallen uppdaterades');
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte uppdatera mall');
        });
    },

    selectTemplate(template_id) {
      axios
        .get(`/template?template_id=${template_id}&company_id=${this.currentCompanyId}`)
        .then(res => {
          this.form = res.data.template;
          this.creating = false;
          this.editing = true;

          this.stickprov = res.data.template.is_email_stickprov === 1;
          this.sms = res.data.template.is_sms_stickprov === 1;
          this.sms_content = this.sms ? res.data.template.template : '';
          this.scrollToEditTemplate();
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte hämta mallar');
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
    loadTemplates() {
      this.templates = [];
      const loader = this.$loading.show();
      axios
        .get(`/template/list?company_id=${this.currentCompanyId}`)
        .then(res => {
          if (res.status === 200) {
            this.templates = res.data.templates;

            if (!this.isTalongAdmin) {
              this.templates = this.templates.filter(item => item.is_system !== 1)
            }

            loader.hide();
            this.setTemplateProps();
          }
        })
        .catch(err => {
          console.error(err);
          loader.hide();
          this.toastr('danger', 'Server Fel', 'Kunde inte lista mallar');
        });
    },
    scrollToEditTemplate() {
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
    saveTemplate() {
      this.form.company_id = this.currentCompanyId;

      this.form.is_email_stickprov = this.stickprov ? 1 : 0;
      this.form.is_sms_stickprov = this.sms ? 1 : 0;

      if (this.creating) {
        if (this.sms) {
          this.form.template = this.sms_content;
          this.form.edit_html = '';
        }
        axios
          .post('/template', this.form)
          .then(res => {
            if (res.status === 200) {
              this.toastr('success', 'OK', 'Mallen skapades');
              this.creating = false;
              this.editing = false;
              this.templates.push(res.data.template);
            }
          })
          .catch(err => {
            console.error(err);
            this.toastr('danger', 'Server Fel', 'Kunde inte skapa mallen');
          });
      } else if (this.editing) {
        axios
          .put('/template', this.form)
          .then(res => {
            if (res.status === 204) {
              this.toastr('success', 'OK', 'Mallen uppdaterad');
              this.creating = false;
              //this.editing = false;
              const {company_id, created_at, is_sms, name, template_id, updated_at} = this.form;
              this.templates.filter((item, index) => {
                if (item.template_id === template_id){
                  this.templates.splice(index, 1);
                  this.templates.push({company_id, created_at, is_sms, name, template_id, updated_at})
                }
              })
            }
          })
          .catch(err => {
            console.error(err);
            this.toastr('danger', 'Server Fel', 'Kunde inte uppdatera mallen');
          });
      }
    },
    toggleFullscreen(){
      this.fullscreen = !this.fullscreen;
    },
    saveDesign(design, html){
      this.form.template = html;
      this.form.edit_html = design;
      this.saveTemplate();
      this.toggleFullscreen();
    },
    backToSendout(){
      this.$router.push(`/ml-sendout/${this.sendout_id}`);
    },
    setTemplateProps(){
      const sendout_id = parseInt(this.$route.params.sendout_id);
      const id = this.$route.params.template_id;
      const editing = Boolean(parseInt(this.$route.params.is_edit));

      if (!isNaN(sendout_id)){
        this.form.template_id = editing ? id : '';
        this.sendout_id = sendout_id
        this.editing = editing;
        this.creating = !editing;
        editing ? this.selectTemplate(id) : this.createTemplate();
      }
    },
    resetForm(){
      const form = {
          template_id: '',
          reply_to: '',
          name: '',
          subject: '',
          type: [],
          content: '',
          template: '',
          edit_html: '',
          stickprov: false,
       };
      this.form = form;
      this.sms = false;
      this.stickprov = false;
    },
    moveToCompanies() {
      const company_ids = this.$refs['companies_selected'].getCompanies();

      for (const cid of company_ids) {
        this.copyTemplateToCompany(this.form.template_id, cid);
      }

      this.toastr('success', 'OK', 'Mallen kopierad till föreningarna');
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
<style>
  .modal-xl{
    max-width: 100% !important;
    padding-right: 17px;
  }
</style>
