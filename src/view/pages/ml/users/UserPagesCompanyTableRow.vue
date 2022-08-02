<template>
  <tr>
    <td>
      <span class="d-block font-size-lg">{{ name }}</span>
    </td>
    <td>
      <div class="d-flex align-items-center">
        <label
            class="checkbox checkbox-lg checkbox-outline checkbox-success"
        >
            <input
            type="checkbox"
            name=""
            v-model="pageAccess"
            @click="updatePageAccess"
            />
            <span></span>
        </label>
        <span class="ml-3 cursor-pointer"></span
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
            v-model="adminAccess"
            @click="updateAdminAccess"
            />
            <span></span>
        </label>
        <span class="ml-3 cursor-pointer"></span
        >
        </div>
    </td>
  </tr>
</template>
<style lang="scss" scoped>
.checkbox > span {
  background-color: white;
  border: 1px solid #ddd;
}
</style>
<script>
import axios from 'axios';
import { mapGetters } from 'vuex';

export default {
  name: 'user-pages-company-table-row',
  props: ['company_id', 'user_id', 'a', 'p', 'page'],
  computed: {
    ...mapGetters(['currentCompanyId']),
    name() {
      return this.names[this.page];
    }
  },
  data() {
    return {
      pageAccess: false,
      adminAccess: false,
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
        'ml-todo': 'Betalningar',
        
      },
    
    };
  },
  mounted() {
    this.adminAccess = this.a === 'a';
    this.pageAccess = this.p === 'rw';
  },
  watch: {
    a(newValue, oldValue) {
      this.adminAccess = newValue === 'a';
    },
    p(newValue, oldValue) {
      this.pageAccess = newValue === 'rw';
    }
  },
  methods: {
    updatePageAccess() {
      this.$emit('pageAccessUpdated', this.page, !this.pageAccess ? 'rw' : '-');
    },
      
    updateAdminAccess() {
      this.$emit('adminAccessUpdated', this.page, !this.adminAccess ? 'a' : '-');
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
