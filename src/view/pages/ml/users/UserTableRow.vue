<template>
  <tr>
    <td>
      <span class="text-dark-75 font-weight-bolder d-block font-size-lg pl-4"
        >{{ user.name }}</span
      >
    </td>
    <td>
      <span class="text-dark-75 font-weight-bolder d-block font-size-lg">{{ user.email }}</span>
    </td>
    <td>
      <span class="text-dark-75 font-weight-bolder d-block font-size-lg">{{ user.title }}</span>
    </td>
    <td>
      <div class="d-flex align-items-center">
        <label class="checkbox checkbox-lg checkbox-outline checkbox-success">
          <input
            type="checkbox"
            name=""
            v-model="is_director"
            @change="clickedDirector()"
          />
          <span></span>
        </label>
        <span class="ml-3 cursor-pointer"></span>
      </div>
    </td>
    <td>
      <div class="d-flex align-items-center">
        <label class="checkbox checkbox-lg checkbox-outline checkbox-success">
          <input
            type="checkbox"
            name=""
            v-model="is_accountant"
            @change="clickedAccountant()"
          />
          <span></span>
        </label>
        <span class="ml-3 cursor-pointer"></span>
      </div>
    </td>
    <!--<td>
      <a href="#" class="btn btn-light-success font-weight-bolder font-size-sm">Ge tillgång</a>
    </td>-->

    <td class="text-right pr-0">
      <div class='d-flex justify-content-end'>
        <a
          href="#"
          class="btn btn-icon btn-light btn-sm mx-3"
          @click="selectUserClicked(user.user_id)"
        >
          <span class="svg-icon svg-icon-md svg-icon-primary">
            <!--begin::Svg Icon-->
            <inline-svg src="/assets/svg/Write.svg"></inline-svg>
            <!--end::Svg Icon-->
          </span>
        </a>
        <a href="#" class="btn btn-icon btn-light btn-sm mr-3" @click="deleteUserClicked(user.user_id)">
          <span class="svg-icon svg-icon-md svg-icon-primary">
            <!--begin::Svg Icon-->
            <inline-svg src="/assets/svg/Trash.svg"></inline-svg>
            <!--end::Svg Icon-->
          </span>
        </a>
        <!--<a :href="getLoginLink()" class="btn btn-icon btn-light btn-sm mr-7" @click="loginUserClicked(user.user_id)">
          <span class="svg-icon svg-icon-md svg-icon-primary">
            <i class='fas fa-sign-in-alt' style='font-size:48px;color:#3699FF'></i>
          </span>
        </a>-->
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
  name: 'users-table-row',
  props: ['user'],
  computed: {
    ...mapGetters(['currentCompanyId', 'titles'])
  },
  data() {
    return {
      is_director: false,
      is_accountant: false
    };
  },
  mounted() {
    this.is_director = this.user.director;
    this.is_accountant = this.user.accountant;
  },
  watch: {
    user(newValue, oldValue) {
      this.is_director = this.user.director;
      this.is_accountant = this.user.accountant;
    },
    is_director(newValue, oldvalue) {

    },
    is_accountant(newValue, oldValue) {

    }
  },
  methods: {
    clickedDirector() {
        axios
        .put('/company/director', {
          company_id: this.currentCompanyId,
          user_id: this.user.user_id,
          is_director: this.is_director ? 1 : 0
        })
        .then(res => {
          if (res.status === 204) {
            this.$emit('toastr', 'success', 'OK', 'Styrelse ändrad');
            this.$emit('changeUserAccess', this.user.user_id, this.is_director, this.is_accountant);
          }
        })
        .catch(err => {
          this.$emit('toastr', 'danger', 'Server Fel', 'Kunde inte ändra styrelse');
          this.is_director = !this.is_director;
        });
    },
    clickedAccountant() {
         axios
        .put('/company/accountant', {
          company_id: this.currentCompanyId,
          user_id: this.user.user_id,
          is_accountant: this.is_accountant ? 1 : 0
        })
        .then(res => {
          if (res.status === 204) {
            this.$emit('toastr', 'success', 'OK', 'Revisor ändrad');
            this.$emit('changeUserAccess', this.user.user_id, this.is_director, this.is_accountant);
          }
          else {
            this.$emit('toastr', 'danger', 'Server Fel', 'Kunde inte ändra revisor');
            this.is_accountant = !this.is_accountant;
          }
        })
        .catch(err => {
          this.$emit('toastr', 'danger', 'Fel', 'Kunde inte ändra revisor');
          this.is_accountant = !this.is_accountant;
        });
    },
    selectUserClicked(user_id) {
      this.$emit('selectUserClicked', user_id);
    },
    deleteUserClicked(user_id) {
      this.$emit('deleteUserClicked', user_id);
    },
    loginUserClicked(user_id) {
      this.$emit('loginUserClicked', user_id);
    },
    getLoginLink() {
      const routeData = this.$router.resolve({path: `/ml-tokenlogin/${this.user.auth_token}/ml-dashboard`})
      // window.open(routeData.href, '_blank')
      return routeData.href;
    },
    getTitle(title_id) {
      this.titles.forEach(t => {
        if (t.id == title_id) {
          return t.name;
        }
      });

      return '';
    }
  }
};
</script>
