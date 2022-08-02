<template>
  <tr>
    <td>
      <span class="d-block font-size-lg">{{ company_user.company.name }}</span>
    </td>
    <td>
      <div class="d-flex align-items-center">
        <label
            class="checkbox checkbox-lg checkbox-outline checkbox-success"
        >
            <input
            type="checkbox"
            name=""
            v-model="email"
            @click="email = !email"
            />
            <span></span>
        </label>
        <span class="ml-3 cursor-pointer"
            ></span
        >
        </div>
    </td>
    <td class="text-right pr-0">
      <div class="d-flex align-items-center">
        <label
            class="checkbox checkbox-lg checkbox-outline checkbox-success"
        >
            <input
            type="checkbox"
            name=""
            v-model="sms"
            @click="sms = !sms"
            />
            <span></span>
        </label>
        <span class="ml-3 cursor-pointer"
            ></span
        >
        </div>
    </td>
    <td></td>
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
  name: 'user-notification-row',
  props: ['company_user'],
  computed: {
    ...mapGetters(['currentCompanyId'])
  },
  data() {
    return {
      sms: false,
      email: false,
      notifications: { sms: false, email: false },
      locked: true
    };
  },
  mounted() {
    if (this.company_user.notifications === null || this.company_user.notifications === undefined) {
      return;
    }

    this.locked = true;

    this.sms = this.company_user.notifications.sms;
    this.email = this.company_user.notifications.email;

    this.notifications.sms = this.sms;
    this.notifications.email = this.email;

    this.locked = false;
  },
  watch: {
    sms(newValue, oldValue) {
      this.notifications.sms = newValue;

      if (!this.locked) {
        this.updateNotifications(this.company_user.user.id, this.company_user.company.id, this.notifications)
      }
    },
    email(newValue, oldValue) {
      this.notifications.email = newValue;

      if (!this.locked) {
        this.updateNotifications(this.company_user.user.id, this.company_user.company.id, this.notifications)
      }
    }
  },
  methods: {
    updateNotifications(user_id, company_id, notifications) {
      axios
        .put('/user/notifications', {
            user_id: user_id,
            company_id: company_id, 
            notifications: notifications
        })
        .then(res => {
          //this.toastr('success', 'OK', 'Uppdaterat');
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
