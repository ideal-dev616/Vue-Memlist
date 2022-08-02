<template>
  
    <!--begin::Table-->
    <div class="table-responsive">
    <table class="table table-head-custom table-vertical-center table-head-bg table-borderless">
        <tr class="tr-black">
            <td style="min-width: 300px; max-width: 300px;">{{ name }}</td>
            <td>
                <div class="d-flex align-items-center">
                <label
                  class="checkbox checkbox-lg checkbox-outline checkbox-success"
                >
                  <input
                    type="checkbox"
                    name=""
                    v-model="checkAllPages"
                    @click="checkAllPagesClicked"
                  />
                  <span></span>
                </label>
                <span class="ml-3 cursor-pointer"
                  >Har tillgång</span
                >
              </div>

            </td>
            <td>
                <div class="d-flex align-items-center">
                <label
                  class="checkbox checkbox-lg checkbox-outline checkbox-success"
                >
                  <input
                    type="checkbox"
                    name=""
                    v-model="checkAllAdmin"
                    @click="checkAllAdminClicked"
                  />
                  <span></span>
                </label>
                <span class="ml-3 cursor-pointer"
                  >Kan tilldela</span
                >
              </div>
            </td>
        </tr>
        <template v-for="(value, i) in sorted_access_list">
            <UserPagesCompanyTableRow
                v-bind:key="i"
                :user_id="user_id"
                :company_id="company_id"
                :a="value.a"
                :p="value.p"
                :page="value.name"
                @pageAccessUpdated="pageAccessUpdated"
                @adminAccessUpdated="adminAccessUpdated"
            />
        </template>
    </table>
    </div>
  <!--end::Advance Table Widget 9-->
</template>
<style lang="scss" scoped>
.checkbox.checkbox-light-success > span {
  background-color: white;
  border: 1px solid #ddd;
}
.tr-black {
  background-color: #4F5264;
  color: white;
}
tr:nth-child(2n+3) {background: #24293908}

</style>
<script>
import axios from 'axios';
import { mapGetters } from 'vuex';
import UserPagesCompanyTableRow from '@/view/pages/ml/users/UserPagesCompanyTableRow.vue';

export default {
  name: 'user-pages-company-table',
  props: ['user_id','company_id','name','access_list'],
  components: {
    UserPagesCompanyTableRow
  },

  computed: {
    ...mapGetters(['currentCompanyId','currentUserId'])
  },

  watch: {
    access_list(newValue, oldValue) {
      this.sortAccessList();
    }
  },

  async mounted() {
    console.log('UserPagesCompanyTable acl:');
    console.log(this.access_list);

    this.sortAccessList();
    
  },

  methods: {
    sortAccessList() {
      this.sorted_access_list = [];

      for (var k in this.access_list) {
        var val = this.access_list[k];

        this.sorted_access_list.push({
            name: k,
            p: val.p,
            a: val.a,
            caption: this.names[k]
        });
      }

      this.sorted_access_list.sort(function(a,b){
        if (a.caption < b.caption) {
          return -1;
        }
        return 1;
      });
    },

    pageAccessUpdated(page, p) {

      console.log('currentUserId: ' + this.currentUserId);
      console.log('user_id: ' + this.user_id);

      if (this.currentUserId === this.user_id) {
        this.toastr('danger', 'Fel', 'Du kan inte ändra rättigheter för dig själv');
        return;
      }

      axios 
        .put('/company_user', {
            company_id: this.company_id,
            user_id: this.user_id,
            page: page,
            p: p
        })
        .then(res => {
          this.toastr('success', 'OK', 'Tillgång uppdaterad');

          this.$emit('updatedAccess');
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Fel', 'Kunde inte ändra tillgång');
        });
    },

    adminAccessUpdated(page, a) {
       if (this.currentUserId === this.user_id) {
         this.toastr('danger', 'Fel', 'Du kan inte ändra rättigheter för dig själv');
         return;
       }

       axios 
        .put('/company_user', {
            company_id: this.company_id,
            user_id: this.user_id,
            page: page,
            a: a
        })
        .then(res => {
          this.toastr('success', 'OK', 'Rättighet uppdaterad');

          this.$emit('updatedAccess');
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Fel', 'Kunde inte ändra rättighet');
        });
    },

    checkAllAdminClicked() {
      if (this.currentUserId === this.user_id) {
        this.toastr('danger', 'Fel', 'Du kan inte ändra rättigheter för dig själv');
        return;
      }

      this.checkAllAdmin = !this.checkAllAdmin;

      axios
        .put('/company_user/all', {
            company_id: this.company_id,
            user_id: this.user_id,
            a: this.checkAllAdmin ? 'a' : '-'
        })
        .then(res => {
          this.toastr('success', 'OK', 'Alla tillgångar i föreningen har uppdaterats för användaren');

          this.$emit('updatedAccess');
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Fel', 'Kunde inte uppdatera alla tillgångar');
        });
    },

    checkAllPagesClicked() {
      if (this.currentUserId === this.user_id) {
        this.toastr('danger', 'Fel', 'Du kan inte ändra rättigheter för dig själv');
        return;
      }

      this.checkAllPages = !this.checkAllPages;

      axios
        .put('/company_user/all', {
            company_id: this.company_id,
            user_id: this.user_id,
            p: this.checkAllPages ? 'rw' : '-'
        })
        .then(res => {
          this.toastr('success', 'OK', 'Alla tillgångar i föreningen har uppdaterats för användaren');

          this.$emit('updatedAccess');
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Fel', 'Kunde inte uppdatera alla tillgångar');
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
  },

  data() {
    return {
      names: {
        'ml-admin': 'Helpdesk',
        'ml-users': 'Användare',
        'ml-advanced-search': 'Avancerat sök',
        'ml-apikeys': 'API Nycklar',
        'ml-book': 'Bokföring',
        'ml-dashboard': 'Dashboard',
        'ml-companies': 'Föreningar',
        'ml-errors': 'Felrapporter',
        'ml-events': 'Evenemang',
        'ml-files': 'Filer',
        'ml-import': 'Import Medlemmar',
        'ml-importcompanies': 'Import Föreningar',
        'ml-billing': 'Kostnader',
        'ml-ladok': 'LADOK',
        'ml-member-manager': 'Medlemshanterare',
        'ml-mucf': 'MUCF',
        'ml-periods': 'Perioder',
        'ml-properties': 'Attribut',
        'ml-quicksearch': 'Snabbsök',
        'ml-language': 'Språk',
        'ml-registersetup': 'Registreringswizard',
        'ml-sendout': 'Utskick',
        'ml-settings': 'Inställningar',
        'ml-shopitem': 'Butik',
        'ml-stickprov': 'Stickprover',
        'ml-subcompany': 'Underföreningar',
        'ml-support': 'Support',
        'ml-system': 'System',
        'ml-templates': 'Mallar',
        'ml-todo': 'Ärendehantering',
        'ml-payments': 'Betalningar',
        
      },
      sorted_access_list: [],
      checkAllPages: false,
      checkAllAdmin: false,
      companies: [],
    };
  }
};
</script>
