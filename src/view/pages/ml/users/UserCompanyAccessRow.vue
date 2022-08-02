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
            v-model="access"
            @click="updateAccess"
            />
            <span></span>
        </label>
        <span class="ml-3 cursor-pointer"
            ></span
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
  name: 'user-access-row',
  props: ['name', 'has_access', 'company_id', 'user_id'],
  computed: {
    ...mapGetters(['currentCompanyId'])
  },
  data() {
    return {
      access: false,
    
    };
  },
  mounted() {
    
    this.access = this.has_access;
    
  },
  watch: {
    has_access(newValue, oldValue) {
      
      this.access = newValue;
      
    },
    access(newValue, oldValue) {
      
    }
  },
  methods: {
    updateAccess() {
      this.access = !this.access;

      this.setCompanyAccess(this.user_id, this.company_id, this.access)
    },
    setCompanyAccess(user_id, company_id, access) {
      
      axios
        .put('/user/setcompanyaccess', {
            user_id: user_id,
            company_id: company_id,
            access: access,
            silent: true
        })
        .then(res => {
          this.toastr('success', 'OK', 'Uppdaterat');
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Fel', 'Kunde inte uppdatera');
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
