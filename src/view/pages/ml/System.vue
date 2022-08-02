<template>
  <div class="px-5" id="page-support">
    <h5 class="mb-6 ml-2">Systeminställningar</h5>
    
      <div class="card card-custom card-stretch gutter-b">
        <!--begin::Header-->
        <div class="card-header border-0 py-5">
          <h3 class="card-title align-items-start flex-column">
            <span class="card-label font-weight-bolder text-dark"></span>
          </h3>
          <div class="card-toolbar">

          </div>
        </div>
        <!--end::Header-->
        <!--begin::Body-->
        <div class="card-body pt-0 pb-3">

          <b-card>
            <b-button type="button" variant="primary" @click="runClientDateFix">Fixa medlemsdatum</b-button>
          </b-card>

          <!--begin::Table-->
          <div class="table-responsive">
            <table
              class="table table-head-custom table-vertical-center table-head-bg table-borderless"
            >
              <tbody>
                <tr style="background-color: black; color: white;">
                    <td>Föreningar</td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                  <td>Systemförening</td>
                  <td>
                      <b-form-select
                        v-model="system_company_id"
                        :options="parent_companies"
                      ></b-form-select>
                  </td>
                  <td></td>
                </tr>
                <tr>
                  <td>Riksförbund mall</td>
                  <td>
                      <b-form-select
                        v-model="riks_company_id"
                        :options="parent_companies"
                      ></b-form-select>
                  </td>
                  <td></td>
                </tr>
                <tr>
                  <td>Studentkår mall</td>
                  <td>
                      <b-form-select
                        v-model="student_company_id"
                        :options="parent_companies"
                      ></b-form-select>
                  </td>
                  <td></td>
                </tr>
                <tr>
                  <td>Förening mall</td>
                  <td>
                      <b-form-select
                        v-model="default_company_id"
                        :options="parent_companies"
                      ></b-form-select>
                  </td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
          <!--end::Table-->
        </div>
        <!--end::Body-->
      </div>
      

    <h4 class="mb-8">Systemmallar</h4>
    <SystemTable 
        title="Användarmallar"
        :items="userTemplates"
        :templateOptions="templateOptions"
        @templateUpdated="templateUpdated"
    />

    <SystemTable 
        title="Medlemsmallar"
        :items="memberTemplates"
        :templateOptions="templateOptions"
        @templateUpdated="templateUpdated"
    />

    <SystemTable 
        title="Ärendemallar"
        :items="todoTemplates"
        :templateOptions="templateOptions"
        @templateUpdated="templateUpdated"
    />

    <Titles v-if="system"
      :titles="system.titles"
      @updateTitle="updateTitle"
      @createTitle="createTitle"
      @deleteTitle="deleteTitle"
    />


    <b-button type="button" variant="primary" @click="saveSystem">Spara</b-button>

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
import SystemTable from '@/view/pages/ml/system/SystemTable.vue';
import Titles from '@/view/pages/ml/system/Titles.vue';

export default {
  name: 'system',
  components: {
    SystemTable,
    Titles,
  },
  computed: {
    ...mapGetters(['currentCompanyId', 'currentPeriodId'])
  },
  mounted() {
    this.getTopCompanies();
    this.loadData();
    this.loadTemplates();
  },
  data() {
    return {
      system_company_id: null,
      riks_company_id: null,
      default_company_id: null,
      student_company_id: null,
      parent_companies: [],
      system: null,
      templateOptions: [],
      templates: [],
      userTemplates: [
          
      ],
      memberTemplates: [
          
      ],
      todoTemplates: [
          
      ]
    };
  },
  watch: {
    currentCompanyId(newValue, oldvalue) {
      if (newValue) {
        this.loadTemplates();
      }
    }
  },
  methods: {
    getTopCompanies() {
      axios
        .get('/company/listtop')
        .then(res => {
          const parents = res.data.companies;

          parents.sort(function(a, b) {
            if (a.name < b.name) {
              return -1;
            }

            return 1;
          });

          this.parent_companies = [];

          for (const p of parents) {
            this.parent_companies.push({ value: p.id, text: p.name });
          }
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Fel', 'Kunde inte lista föreningar');
        });
    },
    deleteTitle(id) {
      
      axios
        .delete(`/system/title?id=${id}`)
        .then(res => {
          this.system.titles = this.system.titles.filter(item => item.id !== id);

          this.toastr('success', 'OK', 'Systemtiteln togs bort');
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Fel', 'Kunde inte ta bort titel');
        });
    },
    updateTitle(id, name, level) {
      axios 
        .put('/system/title', { id: id, name: name, level: level })
        .then(res => {

          for (const t of this.system.titles) {
            if (t.id === id) {
              t.name = name;
              t.level = level;
              break;
            }
          }

          this.toastr('success', 'OK', 'Titel uppdaterad');
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Fel', 'Kunde inte uppdatera titel');
        });

    },
    createTitle(name, level) {
      axios 
        .post('/system/title', { name: name, level: level })
        .then(res => {
          
          this.system.titles.push(res.data.title);

          this.toastr('success', 'OK', 'Titel skapad');
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Fel', 'Kunde inte skapa titel');
        });

    },
    templateUpdated(id, template_id) {
      console.log('template updated: ' + id + ' ' + template_id);

      for (var i = 0; i < this.memberTemplates.length; ++i) {
        if (this.memberTemplates[i].id === id) {
          this.memberTemplates[i].template_id = template_id;
        }
      }
      for (var i = 0; i < this.userTemplates.length; ++i) {
        if (this.userTemplates[i].id === id) {
          this.userTemplates[i].template_id = template_id;
        }
      }
      for (var i = 0; i < this.todoTemplates.length; ++i) {
        if (this.todoTemplates[i].id === id) {
          this.todoTemplates[i].template_id = template_id;
        }
      }
    },
    saveSystem() {

      var data = {
        system_company_id: this.system_company_id,
        riks_company_id: this.riks_company_id,
        default_company_id: this.default_company_id,
        student_company_id: this.student_company_id,
      };

      for (var i = 0; i < this.memberTemplates.length; ++i) {
        data[this.memberTemplates[i].id] = this.memberTemplates[i].template_id;
      }
      for (var i = 0; i < this.userTemplates.length; ++i) {
        data[this.userTemplates[i].id] = this.userTemplates[i].template_id;
      }
      for (var i = 0; i < this.todoTemplates.length; ++i) {
        data[this.todoTemplates[i].id] = this.todoTemplates[i].template_id;
      }

      axios 
        .put('/system', data)
        .then(res => {
          this.toastr('success', 'OK', 'Systemet uppdaterades');
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Fel', 'Kunde inte uppdatera system');
        })

    },
    loadData() {
      axios
        .get(`/system`)
        .then(res => {
          var sys = res.data.system;

          this.system = res.data.system;
          this.system_company_id = this.system.system_company_id;
          this.default_company_id = this.system.default_company_id;
          this.riks_company_id = this.system.riks_company_id;
          this.student_company_id = this.system.student_company_id;

          if (this.system.titles === null || this.system.titles === undefined) {
            this.system.titles = [];
          }

          console.log('loaddata');

          this.userTemplates = [ { id: 'forget_password_template_id', descr: 'Glömt lösenord', template_id: '' },
            { id: 'invite_by_email_template_id', descr: 'Inbjudan till system', template_id: '' },
            { id: 'confirm_admin_email_template_id', descr: 'Bekräfta admin e-post', template_id: '' },
            { id: 'contact_form_template_id', descr: 'Kontaktformulär', template_id: '' },
            { id: 'stickprov_sms_template_id', descr: 'Stickprov SMS', template_id: '' },
            { id: 'stickprov_email_template_id', descr: 'Stickprov E-post', template_id: '' },
            { id: 'subcompany_request_template_id', descr: 'Underförening ansökan om anslutande', template_id: '' },
            { id: 'subcompany_accept_template_id', descr: 'Underförening ansökan godkänd', template_id: '' },
            { id: 'subcompany_reject_template_id', descr: 'Underförening ansökan nekad', template_id: '' },
            { id: 'parent_company_request_template_id', descr: 'Moderförening ansökan från underförening', template_id: '' }, ]

          this.memberTemplates = [
            { id: 'stickprov_sms_template_id', descr: 'Stickprov SMS', template_id: '' },
            { id: 'stickprov_email_template_id', descr: 'Stickprov E-post', template_id: '' },
            { id: 'forget_password_members_template_id', descr: 'Glömt lösenord medlemmar', template_id: '' },
            { id: 'ticket_template_id', descr: 'Biljettmall', template_id: '' },
            { id: 'member_joined_template_id', descr: 'Medlem skapad', template_id: '' },
            { id: 'member_renew_period_sms_template_id', descr: 'Medlem förnyelse SMS', template_id: '' },
            { id: 'member_renew_period_email_template_id', descr: 'Medlem förnyelse E-post', template_id: '' },
          ]

          this.todoTemplates = [
            { id: 'todo_new_template_id', descr: 'Nytt ärende', template_id: '' },
            { id: 'todo_remind_template_id', descr: 'Påminnelse om ärende', template_id: '' },
            { id: 'todo_creator_update_template_id', descr: 'Ärende uppdaterat (Ägare)', template_id: '' },
            { id: 'todo_company_update_template_id', descr: 'Ärende uppdaterat (Förening)', template_id: '' },
            { id: 'helpdesk_creator_template_id', descr: 'Helpdesk ärende uppdaterat (Till Skapare)', template_id: '' },
            { id: 'helpdesk_system_template_id', descr: 'Helpdesk ärende uppdaterat (Till ThinkingHat)', template_id: '' },
          ]

          for (var i = 0; i < this.userTemplates.length; ++i) {
            this.userTemplates[i].template_id = sys[this.userTemplates[i].id];
          }
          for (var i = 0; i < this.memberTemplates.length; ++i) {
            this.memberTemplates[i].template_id = sys[this.memberTemplates[i].id];
          }
          for (var i = 0; i < this.todoTemplates.length; ++i) {
            this.todoTemplates[i].template_id = sys[this.todoTemplates[i].id];
          }
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte hämta systeminställningar');
        });
    },

    runClientDateFix() {
      axios
        .post('/system/fixclientdate')
        .then(res => {
          this.toastr('success', 'OK', 'Medlemsdatum har korrigerats');
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Fel', 'Kunde inte fixa');
        });
    },

    loadTemplates() {
      this.templates = [];
      
      axios
        .get(`/template/list?company_id=${this.currentCompanyId}`)
        .then(res => {
          if (res.status === 200) {
            this.templates = res.data.templates;

            for (var i = 0; i < this.templates.length; ++i) {
              this.templateOptions.push({ value: this.templates[i].template_id, text: this.templates[i].name });
            }
          }
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte lista mallar');
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


