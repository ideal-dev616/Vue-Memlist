<template>
  <div class="px-5" id="page-users">

    <h5 class="mb-6 ml-2">Användare</h5>

    <UsersTable
        :items="users"
        :titles="titles"
        @inviteUserClicked="inviteUser"
        @createUserClicked="createUser"
        @selectUserClicked="selectUser"
        @deleteUserClicked="deleteUser"
        @changeUserAccess="changeUserAccess"
        @toastr="toastr"
    />
    <b-card
      title="Bjud in användare"
      tag="article"
      style="max-width: 40rem;"
      class="mb-2"
      v-if="inviting"
    >
        <b-card-text>
          Lägg till en ny användare genom att ange e-postadressen till personen nedan.
        </b-card-text>
        <b-form
          @submit.prevent="inviteEmail"
        >
          <b-form-input
            id="invite-email"
            v-model="invite_email"
            required
            placeholder="E-post"

          ></b-form-input>
          <b-button type="button" variant="primary" class="mt-2 mr-2" @click="hideInvite">Avbryt</b-button>
          <b-button type="submit" variant="primary" class="mt-2">Bjud in</b-button>
        </b-form>

    </b-card>

    <div class="scroll-to-container"></div>
    <b-card
      title=""
      class="mb-2 edit-user-container"
      ref="edit-user"
      id="edit-user"
      hide-footer
      v-if="creating || editing"
    >

      <v-tabs
        background-color="white"
        color="accent-4"
        right
      >
        <v-tab>Användardata</v-tab>
        <v-tab v-if="editing">Tillgång</v-tab>
        <v-tab v-if="editing">Notifikationer</v-tab>
        <v-tab v-if="editing && isTalongAdmin">Föreningar</v-tab>

        <v-tab-item>
          <UserEdit
            :creating="creating"
            :user_id="user_id"
            :companyTitles="companyTitles"
            @saveUser="saveUser"
            @accessLoaded="accessLoaded"
            @userCreated="userCreated"
          />
        </v-tab-item>
        <v-tab-item v-if="editing">
          <b-alert show variant="light" class="mt-8">
            Användaren kommer att få tillgång till angivna sidor för respektive förening. Ifall "Kan tilldela" är i checkad så kan användaren ge den tillgången till andra användare.
          </b-alert>

          <UserPagesAccess
            :user_id="user_id"
            :access_list="accessList"
            @updatedAccess="loadAllAccess"
          />

        </v-tab-item>
        <v-tab-item v-if="editing">
          <b-alert show variant="light" class="mt-8">
            Följande notifikationer kommer användaren att ta del av per förening. Observera att avgift tillkommer på skickade SMS.
          </b-alert>
          <UserNotifications
            class="mt-8"
            :company_access="companyAccess"
          />
        </v-tab-item>
        <v-tab-item v-if="editing && isTalongAdmin">
          <b-alert show variant="light" class="mt-8">
            Ange vilka föreningar som användaren ska ha tillgång till
          </b-alert>

          <UserCompanyAccess
            class="mt-8"
            :user_id="user_id"
            :company_access="companyAccess"
            :companies = 'companies'
          />
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
import validatePersonnr from '@/core/services/personnr';
import axios from 'axios';
import { mapGetters } from 'vuex';
import UsersTable from "@/view/pages/ml/users/UsersTable.vue";
import UserNotifications from '@/view/pages/ml/users/UserNotifications.vue';
import UserCompanyAccess from '@/view/pages/ml/users/UserCompanyAccess.vue';
import UserPagesAccess from '@/view/pages/ml/users/UserPagesAccess.vue';
import UserEdit from '@/view/pages/ml/users/UserEdit.vue';


export default {
  name: 'users',
  components: {
    UsersTable, UserNotifications, UserEdit, UserCompanyAccess, UserPagesAccess
  },
  computed: {
    ...mapGetters(['currentCompanyId', 'currentPeriodId', 'periods', 'isTalongAdmin']),
  },
  async mounted() {
    await this.loadData();

    this.user_id = this.$route.params.id;

    if (this.user_id === '' || this.user_id === null || this.user_id === undefined) {
      this.editing = false;
      this.creating = false;
    }
    else {
      this.editing = true;
      this.selectUser(this.user_id)
    }
  },
  data() {
    return {
      user_id: null,
      system_pages_translate: {
        'ml-dashboard': 'Dashboard',
        'ml-todo': 'Ärendehantering',
        'ml-errors': 'Felrapporter',
        'ml-events': 'Evenemang',
        'ml-quicksearch': 'Snabbsök',
        'ml-advanced-search': 'Avancerat sök',
        'ml-import': 'Import',
        'ml-stickprov': 'Stickprov',
        'ml-ladok': 'LADOK',
        'ml-properties': 'Attribut',
        'ml-member-manager': 'Medlemshanterare',
        'ml-mucf': 'MUCF',
        'ml-settings': 'Inställningar',
        'ml-registersetup': 'Registreringswizard',
        'ml-periods': 'Perioder',
        'ml-users': 'Användare',
        'ml-subcompany': 'Underföreningar',
        'ml-files': 'Filer',
        'ml-shopitem': 'Butik',
        'ml-book': 'Bokföring',
        'ml-sendout': 'Utskick',
        'ml-templates': 'Mallar',
        'ml-support': 'Support',
        'ml-billing': 'Kostnader',
        'ml-admin': 'Administration',
        'ml-companies': 'Föreningslista',
        'ml-language': 'Språk',
        'ml-system': 'System'
      },
        titles: [],
        company: {},
      companies:[],
      accessList: [],
        companyAccess:[],
        form: {
            user_id: '',
            email: '',
            firstname: '',
            lastname: '',
            is_accountant: false,
            is_director: false,
            title_id: '',
            public_sex: 'U',
            sex: 'U'
        },
        invite_email: '',
        genders: [
          { value: 'M', text: 'Man' },
          { value: 'F', text: 'Kvinna' },
          { value: 'O', text: 'Annat' },
          { value: 'U', text: 'Okänt' }
        ],
        companyTitles: [],
        creating: false,
        editing: false,
        inviting: false,
        users: [],
        access: [],
        tmpAccess: [],
        tmpAccessAdmin: [],
        checkedAccess: [],
        checkedAccessAdmin: [],
      checkedAll:false,
      checkedAllAdmin:false
    };
  },
  watch: {
    currentCompanyId(newValue, oldvalue) {
      if (newValue) {
        this.loadUsers();
      }
    },
    checkedAll(newVal, oldVal){
      this.checkAllPerm(newVal ? 1 : 0);
    },
    checkedAllAdmin(newVal, oldVal){
      this.checkAllAdminPerm(newVal ? 1 : 0);
    },
    checkedAccess(newValue, oldValue) {
      // this whole function is stupid because we need to listen to each checkbox change
      // and when a checkbox has changed, we grant or revoke access to the page

      ////---- workaround for when we initially populate the access list, so we dont PUT all the access rules again ---- ///
      if (newValue.length === this.tmpAccess.length) {
        var diff = false;

        for (var i = 0; i < this.tmpAccess.length; ++i) {
          if (this.tmpAccess[i] !== newValue[i]) {
            diff = true;
            break;
          }
        }

        if (!diff) {
          return;
        }
      }
      //// ------- end workaround ------ ///

      // if oldValue length is smaller, it means we added something, so we need to add a new access
      if (oldValue.length < newValue.length) {
        var newAccess = '';

        for (var i = 0; i < newValue.length; ++i) {
          var found = false;

          for (var j = 0; j < oldValue.length; ++j) {
            if (newValue[i] === oldValue[j]) {
              found = true;
              break;
            }
          }

          if (!found) {
            newAccess = newValue[i];
            break;
          }
        }

        axios
          .put('/company/set_page_perm', { company_id: this.currentCompanyId, user_id: this.user_id, page_name: newAccess, perm: 1 })
          .then(res => {
            if (res.status === 204) {

              this.toastr('success', 'OK', 'Rättighet tilldelad');
            }
          })
          .catch(err => {
            console.error(err);
            this.toastr('danger', 'Server Fel', 'Kunde inte tilldela rättighet');
          });

      } // oldvalue is bigger, so we removed something, so we need to remove access
      else {
        var revokedAccess = '';

        for (var i = 0; i < oldValue.length; ++i) {
          var found = false;

          for (var j = 0; j < newValue.length; ++j) {
            if (newValue[j] === oldValue[i]) {
              found = true;
              break;
            }
          }

          if (!found) {
            revokedAccess = oldValue[i];
            break;
          }
        }

        axios
          .put('/company/set_page_perm', { company_id: this.currentCompanyId, user_id: this.user_id, page_name: revokedAccess, perm: 0 })
          .then(res => {
            if (res.status === 204) {

              this.toastr('success', 'OK', 'Rättighet uppdaterad');
            }
          })
          .catch(err => {
            console.error(err);
            this.toastr('danger', 'Server Fel', 'Kunde inte uppdatera rättighet');
          });
      }
    },


    checkedAccessAdmin(newValue, oldValue) {
      // this whole function is stupid because we need to listen to each checkbox change
      // and when a checkbox has changed, we grant or revoke access to the page

      ////---- workaround for when we initially populate the access list, so we dont PUT all the access rules again ---- ///
      if (newValue.length === this.tmpAccessAdmin.length) {
        console.log('inside workaround');
        var diff = false;

        for (var i = 0; i < this.tmpAccessAdmin.length; ++i) {
          if (this.tmpAccessAdmin[i] !== newValue[i]) {
            diff = true;
            break;
          }
        }

        if (!diff) {
          return;
        }
      }
      //// ------- end workaround ------ ///

      console.log('proceeding');

      // if oldValue length is smaller, it means we added something, so we need to add a new access
      if (oldValue.length < newValue.length) {
        var newAccess = '';

        for (var i = 0; i < newValue.length; ++i) {
          var found = false;

          for (var j = 0; j < oldValue.length; ++j) {
            if (newValue[i] === oldValue[j]) {
              found = true;
              break;
            }
          }

          if (!found) {
            newAccess = newValue[i];
            break;
          }
        }

        axios
          .put('/company/set_page_adm', { company_id: this.currentCompanyId, user_id: this.user_id, page_name: newAccess, adm: 1 })
          .then(res => {
            if (res.status === 204) {

              this.toastr('success', 'OK', 'Rättighet tilldelad');
            }
          })
          .catch(err => {
            console.error(err);
            this.toastr('danger', 'Server Fel', 'Kunde inte tilldela rättighet');
          });

      } // oldvalue is bigger, so we removed something, so we need to remove access
      else {
        var revokedAccess = '';

        for (var i = 0; i < oldValue.length; ++i) {
          var found = false;

          for (var j = 0; j < newValue.length; ++j) {
            if (newValue[j] === oldValue[i]) {
              found = true;
              break;
            }
          }

          if (!found) {
            revokedAccess = oldValue[i];
            break;
          }
        }

        axios
          .put('/company/set_page_admin', { company_id: this.currentCompanyId, user_id: this.user_id, page_name: revokedAccess, adm: 0 })
          .then(res => {
            if (res.status === 204) {

              this.toastr('success', 'OK', 'Rättighet uppdaterad');
            }
          })
          .catch(err => {
            console.error(err);
            this.toastr('danger', 'Server Fel', 'Kunde inte uppdatera rättighet');
          });
      }

      console.log(this.checkedAccessAdmin);
    },
    async user_id(newVal, oldVal){
      if (newVal){
        await this.loadAllAccess();
        await this.loadUserAccess();
        await this.loadCompanies();
      }
    },

  },
  methods: {
    async loadData() {
      this.loadUsers();
    },
    inviteUser() {
      this.inviting = true;
    },
    setCompany() {

      axios
        .get(`/company?company_id=${this.currentCompanyId}`)
        .then(res => {

          axios
            .get('/system/titles')
            .then(sres => {
              let stitles = sres.data.titles;

              let titles = res.data.company.settings.titles;

              if (titles === null || titles === undefined) {
                titles = [];
              }

              this.titles = [];

              for (const t of titles) {
                for (const tt of stitles) {
                  if (t === tt.id) {
                    this.titles.push(tt);
                    break;
                  }
                }
              }

              this.companyTitles = [];

              for (var i = 0; i < this.titles.length; ++i) {
                this.companyTitles.push({ text: this.titles[i].name, value: this.titles[i].id });
              }
            })
            .catch(err => {
              console.error(err);
              this.toastr('danger', 'Fel', 'Kunde inte hämta systemtitlar');
            });
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Fel', 'Kunde inte hämta inställningar');
        });
    },
    createUser() {
      this.creating = true;
      this.editing = false;
      this.user_id = null;
      this.form = {};
      this.scrollToEditUser();

    },
    deleteUser(user_id) {

      axios
        .delete(`/user/remove_from_company?user_id=${user_id}&company_id=${this.currentCompanyId}`)
        .then(res => {

          this.users = this.users.filter(item => item.user_id !== user_id)

          this.creating = false;
          this.editing = false;

          this.toastr('success', 'OK', 'Användaren togs bort');
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte ta bort användare');
        })
    },
    accessLoaded(accessData) {
      this.loadAccess(accessData, this.currentCompanyId);
    },
    selectUser(user_id) {
      this.user_id = user_id;

      this.editing = true;

      this.scrollToEditUser();
    },
    changeUserAccess(user_id, is_director, is_accountant) {
      if (this.user_id == user_id)
        this.selectUser(user_id);
    },
    loadAccess(access, company_id) {
      this.access = [];
      this.tmpAccessAdmin = [];
      this.tmpAccess = [];

      var aa = [];
      var adm = [];

      if (access !== undefined)
        for (var i = 0; i < access.length; ++i) {
          var pp = access[i];

          if (!pp.su) {
            this.access.push({ pag: pp.pag, adm: pp.adm, per: pp.per, text: this.getLangText(pp.pag, 'sv') });

            if (pp.per === 'rw' || pp.per === 'r') {
              aa.push(pp.pag);
              this.tmpAccess.push(pp.pag);
            }

            if (pp.adm === 'a') {
              adm.push('a');
              this.tmpAccessAdmin.push('a');
            }
          }
        }

      this.checkedAccess = aa;
      this.checkedAccessAdmin = adm;
    },
    loadAllAccess(){
      const loader = this.$loading.show();

      console.log('loading access for ' + this.user_id);

      axios.get(`/company_user/admin?user_id=${this.user_id}&company_id=${this.currentCompanyId}`)
        .then(res => {
          this.accessList = res.data;
          loader.hide();
        }).catch(err => {
          console.error(err);
          loader.hide();

          this.toastr('danger', 'Fel', 'Kunde inte hämta alla rättigheter');
        });
    },
    loadUserAccess() {
      const loader = this.$loading.show();
      axios
        .get(`/user/allaccess?user_id=${this.user_id}`)
        .then(res => {
          this.companyAccess = res.data.company_access;
          loader.hide();
        })
        .catch(err => {
          console.error(err);
          loader.hide();
          this.toastr('danger', 'Fel', 'Kunde inte hämta alla rättigheter');
        });
    },
    loadCompanies() {
      const loader = this.$loading.show();
      axios
              .get(`/company/list`)
              .then(res => {
                this.companies = res.data.companies;
                this.companies.sort(function(a,b) {
                  if (a.company.name < b.company.name) {
                    return -1;
                  }
                  return 1;
                });
                loader.hide();
              })
              .catch(err => {
                console.error(err);
                loader.hide();
                this.toastr('danger', 'Fel', 'Kunde inte lista alla föreningar');
              });
    },

    getLangText(lang_text, lang) {
      return this.system_pages_translate[lang_text];
    },
    loadUsers() {

      this.setCompany();

      this.users = [];
      axios
        .get(`/company/listusers?company_id=${this.currentCompanyId}`)
        .then(res => {

          if (res.status === 200) {
            this.users = res.data.users;
          }
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte lista användare');
        });
    },
    personnrChanged(evt) {
      var result = validatePersonnr(this.form.in_personnr);
      this.form.fmt_personnr = result.formatted;
      this.form.sex = result.sex;
    },
    scrollToClassName(classname) {
      var that = this;
      setTimeout(function(){

        const el = that.$el.getElementsByClassName(classname)[0];

        if (el) {
          const yOffset = -70;
          const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;

          window.scrollTo({top: y, behavior: 'smooth'});
        }
      }, 100);
    },
    scrollToEditUser() {
      var that = this;
      setTimeout(function(){

        const el = that.$el.getElementsByClassName('scroll-to-container')[0];

        if (el) {
          const yOffset = -70;
          const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;

          window.scrollTo({top: y, behavior: 'smooth'});
        }
      }, 100);
    },
    userCreated(form) {
      this.form = form;
      this.creating = false;
    },
    saveUser(form) {

      this.form = form;

      if (this.creating) {
        axios
          .post('/user/create', this.form)
          .then(res => {
            switch (res.status) {
              case 201:
                const el = {
                  access: true,
                  accountant: this.form.is_accountant,
                  director: this.form.is_director,
                  email: this.form.email,
                  name: `${this.form.firstname} ${this.form.lastname}`,
                  title: this.form.title_id,
                  user_id: res.data.user.user_id,
                }
                this.users.splice(0,0, el)
                this.loadAccess(res.data.access, this.currentCompanyId);
                this.creating = false;
                this.editing = false;
                this.scrollToClassName('table-responsive');
                this.toastr('success', 'OK', 'Användare skapad');
                break
              case 409:
                this.toastr('danger', 'Ogiltig e-postadress', 'Den angivna e-postadressen finns redan.');
                break
            }
          })
          .catch(err => {
            this.toastr('danger', 'Server Fel', 'Kunde inte skapa användare');
          });
      } else {

        axios
          .put('/user', this.form)
          .then(res => {
            switch (res.status) {
              case 200:
              case 204:

                let title = { value: '', text: '' };

                for (const t of this.companyTitles) {
                  if (t.value === this.form.title_id) {
                    title = t;
                    break;
                  }
                }

                const el = {
                  access: true,
                  accountant: this.form.is_accountant,
                  director: this.form.is_director,
                  email: this.form.email,
                  name: `${this.form.firstname} ${this.form.lastname}`,
                  title: title.text,
                  title_id: this.form.title_id,
                  user_id: this.form.user_id,
                };
                let index = this.users.findIndex(function(item){
                  return item.user_id == el.user_id;
                });
                if (index > -1)
                  this.users.splice(index, 1, el);

                this.loadAccess(res.data.access, this.currentCompanyId);
                this.scrollToClassName('table-responsive');
                this.toastr('success', 'OK', 'Användare uppdaterad');
                break
              case 409:
                this.toastr('danger', 'Ogiltig e-postadress', 'Den angivna e-postadressen finns redan.');
                break
            }
          })
          .catch(err => {
            console.error(err, "err");
            this.toastr('danger', 'Server Fel', 'Kunde inte uppdatera användare');
          });
      }
    },
    hideInvite () {
      this.inviting = false;
    },
    inviteEmail(e) {
      e.preventDefault();

      axios
        .post('/company/invite', { email: this.invite_email, company_id: this.currentCompanyId })
        .then(res => {
          if (res.status === 201) {
            this.users.push({ user_id: res.data.user.user_id, email: res.data.user.email, firstname: res.data.user.firstname, lastname: res.data.user.lastname });
            this.inviting = false;
            this.toastr('success', 'OK', 'E-post inbjudan skickad till användaren');
          }
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte bjuda in via e-post');
        });
      this.invite_email = '';
    },


    async checkAllAdminPerm(val){
      const payload = { adm: val, user_id:this.user_id, company_id: this.currentCompanyId };
      const res = await axios.put('/company/set_all_adm', payload)

      if (res.status === 204) {
        this.toastr('success', 'OK', 'Rättighet uppdaterad');

        this.checkedAccessAdmin = [];

        for (const a of this.access) {
          a.adm = val === 1 ? 'a' : '-';

          if (val === 1) {
            this.checkedAccessAdmin.push(a.adm);
          }
        }

      }
      else {
        this.toastr('danger', 'Server Fel', 'Kunde inte uppdatera rättighet');
      }

      await this.selectUser(this.user_id);
    },

    async checkAllPerm(val){
      const payload = { perm: val, user_id:this.user_id, company_id: this.currentCompanyId };
      const res = await axios.put('/company/set_all_perm', payload)

      if (res.status === 204) {
        this.toastr('success', 'OK', 'Rättighet uppdaterad');

        this.checkedAccess = [];

        for (const a of this.access) {
          a.per = val === 1 ? 'rw' : '-';

          if (val === 1) {
            this.checkedAccess.push(a.pag);
          }
        }

      }
      else {
        this.toastr('danger', 'Server Fel', 'Kunde inte uppdatera rättighet');
      }

      await this.selectUser(this.user_id);
    },
    toastr(type, title, message) {
      this.$bvToast.toast(message, {
        title: title,
        autoHideDelay: 2000,
        appendToast: true,
        variant: type,
      })
    }
  }
};
</script>
