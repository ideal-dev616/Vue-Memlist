<template>
  <!--begin::Advance Table Widget 9-->
  <div>
    <div class="card card-custom card-stretch gutter-b">
      <!--begin::Header-->
      <div class="card-header border-0 py-5">
        <h3 class="card-title align-items-start flex-column pl-2">
          <!-- <span class="card-label font-weight-bolder text-dark">Alla Användare</span>
          <span class="text-muted mt-3 font-weight-bold font-size-sm">Nedanstående användare har tillgång till denna förening</span> -->
        </h3>
        <div class="card-toolbar">
          <a href="#" class="btn btn-primary font-weight-bolder font-size-sm mr-2 my-2" @click="inviteUserClicked"
            ><i class="menu-icon flaticon2-plus" style="font-size: 1.0em;"></i>Bjud in</a
          >
          <a href="#" class="btn btn-primary font-weight-bolder font-size-sm" @click="createUserClicked"
            ><i class="menu-icon flaticon2-plus" style="font-size: 1.0em;"></i>Ny Användare</a
          >
        </div>
      </div>
    <!--end::Header-->
    <!--begin::Body-->
      <div class="card-body pt-0 table-responsive">
        <b-table
          id="template-table"
          :fields="headers"
          :items="items"
          head-variant="light"
          sticky-header
          class='mh-100'
        >
          <template #cell(director)='row')>
            <div class="d-flex align-items-center">
              <label class="checkbox checkbox-lg checkbox-outline checkbox-success">
                <input
                  type="checkbox"
                  name=""
                  v-model="row.item.director"
                  @change="clickedDirector(row.item)"
                />
                <span></span>
              </label>
              <span class="ml-3 cursor-pointer"></span>
            </div>
          </template>
          <template #cell(accountant)='row')>
            <div class="d-flex align-items-center">
              <label class="checkbox checkbox-lg checkbox-outline checkbox-success">
                <input
                  type="checkbox"
                  name=""
                  v-model="row.item.accountant"
                  @change="clickedAccountant(row.item)"
                />
                <span></span>
              </label>
              <span class="ml-3 cursor-pointer"></span>
            </div>
          </template>
          <template #cell(id)="row">
            <div class='justify-content-end d-flex'>
              <a
                href="#"
                class="btn btn-icon btn-light btn-sm mx-3"
                @click="selectUserClicked(row.item.user_id)"
              >
                <span class="svg-icon svg-icon-md svg-icon-primary">
                  <!--begin::Svg Icon-->
                  <inline-svg src="/assets/svg/Write.svg"></inline-svg>
                  <!--end::Svg Icon-->
                </span>
              </a>
              <a href="#" class="btn btn-icon btn-light btn-sm mr-3" @click="deleteUserClicked(row.item.user_id)">
                <span class="svg-icon svg-icon-md svg-icon-primary">
                  <!--begin::Svg Icon-->
                  <inline-svg src="/assets/svg/Trash.svg"></inline-svg>
                  <!--end::Svg Icon-->
                </span>
              </a>
              <a v-if="isTalongAdmin" :href="getLoginLink(row.item)" class="btn btn-icon btn-light btn-sm mr-3" @click="loginUserClicked(row.item.user_id)">
                <span class="svg-icon svg-icon-md svg-icon-primary">
                  <i class='fas fa-sign-in-alt' style='font-size:48px;color:#3699FF'></i>
                </span>
              </a>
            </div>
          </template>
        </b-table>
      </div>
    </div>
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
import { mapGetters } from 'vuex';
import UserTableRow from "@/view/pages/ml/users/UserTableRow.vue";

export default {
  name: "users-table",
  props: ["items", "titles"],
  components: {
    UserTableRow,
  },
  computed: {
    ...mapGetters(['currentCompanyId','isTalongAdmin'])
  },
  methods: {
    inviteUserClicked() {
      this.$emit('inviteUserClicked');
    },
    createUserClicked() {
      this.$emit('createUserClicked');
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
    changeUserAccess(user_id, is_director, is_accountant) {
      this.$emit('changeUserAccess', user_id, is_director, is_accountant);
    },
    clickedDirector(user) {
      axios
        .put('/company/director', {
          company_id: this.currentCompanyId,
          user_id: user.user_id,
          is_director: user.director ? 1 : 0
        })
        .then(res => {
          if (res.status === 204) {
            this.$emit('toastr', 'success', 'OK', 'Styrelse ändrad');
            this.changeUserAccess(user.user_id, user.director, user.accountant);
          }
        })
        .catch(err => {
          this.$emit('toastr', 'danger', 'Server Fel', 'Kunde inte ändra styrelse');
          user.director = !user.director;
        });
    },
    clickedAccountant(user) {
      console.log("User");
      axios
        .put('/company/accountant', {
          company_id: this.currentCompanyId,
          user_id: user.user_id,
          is_accountant: user.is_accountant ? 1 : 0
        })
        .then(res => {
          if (res.status === 204) {
            this.$emit('toastr', 'success', 'OK', 'Revisor ändrad');
            this.changeUserAccess(user.user_id, user.director, user.accountant);
          }
          else {
            this.$emit('toastr', 'danger', 'Server Fel', 'Kunde inte ändra revisor');
            user.accountant = !user.accountant;
          }
        })
        .catch(err => {
          this.$emit('toastr', 'danger', 'Fel', 'Kunde inte ändra revisor');
          user.accountant = !user.accountant;
        });
    },
    getLoginLink(user) {
      const routeData = this.$router.resolve({path: `/ml-tokenlogin/${user.auth_token}/ml-dashboard`})
      // window.open(routeData.href, '_blank')
      return routeData.href;
    },
    toastr(type, title, message) {
      this.$emit('toastr', type, title, message);
    },
    getTitle(title_id) {
      this.titles.forEach(t => {

        if (t.id == title_id) {
          return t.name;
        }
      });

      return "";
    },
  },
  data() {
    return {
      headers: [
        {
          key: 'name',
          label: 'Namn',
          sortable: true,
          thClass: 'pl-7',
          tdClass: 'pl-7 vertical-center'
        },
        {
          key: 'email',
          label: 'E-post',
          thClass: 'w-200px',
          tdClass: 'w-200px vertical-center',
          sortable: true
        },
        {
          key: 'title',
          label: 'Titel',
          thClass: 'w-200px',
          tdClass: 'w-200px vertical-center',
          sortable: true
        },
        {
          key: 'director',
          label: 'Styrelse',
          thClass: 'w-85px',
          tdClass: 'w-85px vertical-center',
          sortable: true
        },
        {
          key: 'accountant',
          label: 'Revisor',
          thClass: 'w-85px',
          tdClass: 'w-85px vertical-center',
          sortable: true
        },
        {
          key: 'id',
          label: '',
          thClass: 'w-110px text-right vertical-center',
        },
      ],
      list: [

      ]
    };
  }
};
</script>
