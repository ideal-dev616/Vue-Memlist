<template>
  <div>
    <div v-html="page.html"></div>

    <b-row>
        <b-col lg="12">
        <b-card
            title="Lägg till administratör"
            tag="article"
            class="mb-2"
            >
            <b-card-text>
                Lägg till en ny användare genom att ange e-postadressen till personen nedan.
            </b-card-text>
            <b-form>
                <b-form-input
                id="invite-email"
                v-model="invite_email"
                placeholder="E-post"
                :state="validEmail"

                ></b-form-input>
            </b-form>
            <b-button :disabled='!validEmail' type="button" href="#" variant="primary" class="mt-2" @click="inviteEmail($event)">Lägg till</b-button>
        </b-card>
        </b-col>
    </b-row>

    <!--begin: table -->
    <div class="card card-custom card-stretch gutter-b">
      <!--begin::Header-->
      <div class="card-header border-0 py-5">

      </div>
      <!--end::Header-->
      <!--begin::Body-->
      <div class="card-body pt-0 pb-3">
        <!--begin::Table-->
        <div class="table-responsive">
            <table class="table table-head-custom table-vertical-center table-head-bg table-borderless">
            <thead>
                <tr class="text-left">
                <th style="min-width: 110px">E-post</th>
                <th style="min-width: 110px">Nivå</th>
                <th></th>
                </tr>
            </thead>
            <tbody>
                <template v-for="(item, i) in users">
                <UserAccountTableRow
                    v-bind:key="i"
                    :user="item"
                    :currentCompanyId="currentCompanyId"
                    @deleteUserClicked="deleteUserClicked"
                    @toastr="toastr"
                />
                </template>
            </tbody>
            </table>
        </div>

      </div>
    </div>
    <!--end::Table-->

  </div>
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
import moment from 'moment';
import UserAccountTableRow from '@/view/pages/ml/auth/SignupPages/UserAccountTableRow.vue';

export default {
  name: 'useraccount-page',
  props: ['page'],
  components: {
    UserAccountTableRow
  },
  computed: {
    ...mapGetters(['currentCompanyId', 'currentPeriodId'])
  },
  data() {
    return {
      invite_email: '',
      users: [],
      validEmail: false
    };
  },
  mounted() {
    this.$emit('isValid', false, this.page.index);
  },
  watch: {
    invite_email(newValue, oldValue) {
      if (newValue) {
        this.validEmail = this.validate_email(newValue);
      }
    }
  },
  methods: {
    deleteUserClicked(user_id) {
      for (var i = 0; i < this.users.length; ++i) {
        if (this.users[i].user_id === user_id) {
          this.users.splice(i, 1);

          this.doValidation();
          return;
        }
      }
    },
    validate_email(email) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    },
    randomstr(length) {
      let result = '';
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      const charactersLength = characters.length;

      for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }

      return result;
    },
    inviteEmail(e) {
      // e.preventDefault();
      this.users.push({ user_id: this.randomstr(8), name: '', email: this.invite_email });

      this.invite_email = '';

      this.doValidation();
    },
    doValidation() {
      this.$emit('isValid', this.users.length > 0, this.page.index);
    },
    getData() {
      return this.users
    },
    toastr(type, title, message) {
      this.$bvToast.toast(message, {
        title: title,
        autoHideDelay: 2000,
        appendToast: true,
        variant: type
      });
    },
  }
};
</script>
