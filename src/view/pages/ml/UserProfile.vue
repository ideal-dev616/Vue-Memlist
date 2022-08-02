<template>
  <div class="px-5" id="page-profile-users">

    <b-card>
      <v-tabs
        background-color="white"
        color="deep-purple accent-4"
        right
      >
        <v-tab>Mina uppgifter</v-tab>
        <v-tab>Notifikationer</v-tab>

        <v-tab-item>
          <UserEdit 
            :user_id="user_id"
            :companyTitles="companyTitles"
            @saveUser="saveUser"
          />
        </v-tab-item>
         <v-tab-item>
          <UserNotifications 
            class="mt-8"
            :user_id="user_id"
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
import UserEdit from "@/view/pages/ml/users/UserEdit.vue";
import UserNotifications from '@/view/pages/ml/users/UserNotifications.vue';


export default {
  name: 'user-profile',
  components: {
    UserEdit, UserNotifications
  },
  computed: {
    ...mapGetters(['currentCompanyId', 'currentPeriodId', 'currentUserId', 'periods', 'companies']),
  },
  async mounted() {
    await this.loadData();
  },
  data() {
    return {
        user_id: null,
        titles: [],
        company: {},
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
        checkedAccess: [],
        checkedAll:false
    };
  },
  watch: {
    currentCompanyId(newValue, oldvalue) {
      if (newValue) {
      
      }
    },
  },
  methods: {
    async loadData() {
        
        console.log('selectUser: ' + this.currentUserId);
        this.user_id = this.currentUserId;

        this.setCompany();
        //this.selectUser(this.user_id)
      
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

              console.log('titles loaded: ');
              

              this.companyTitles = [];

              for (var i = 0; i < this.titles.length; ++i) {
                this.companyTitles.push({ text: this.titles[i].name, value: this.titles[i].id });
              }

              console.log(this.titles)
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
    saveUser(form) {
      
      this.form = form;

      axios
        .put('/user', form)
        .then(res => {
        console.log(res, "res");
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

            this.toastr('success', 'OK', 'Användare uppdaterad');
            break
            case 409:
            this.toastr('danger', 'Ogiltig e-postadress', 'Den angivna e-postadressen finns redan.');
            break
        }
        })
        .catch(err => {
        console.log(err, "err");
        this.toastr('danger', 'Server Fel', 'Kunde inte uppdatera användare');
        });
    
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
