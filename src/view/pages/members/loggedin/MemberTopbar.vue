<template>
  <!-- begin:: Header Topbar -->
  <div class="topbar">
    <!--begin: Language bar -->
    <div class="topbar-item">
      <b-dropdown
        size="sm"
        variant="link"
        toggle-class="btn btn-icon btn-clean btn-dropdown btn-lg mr-1 text-decoration-none"
        no-caret
        right
        no-flip
      >
        <template v-slot:button-content>
          <img class="h-20px w-20px rounded-sm" :src="languageFlag || getLanguageFlag" alt="" />
        </template>
        <b-dropdown-text tag="div" class="min-w-md-175px">
          <KTDropdownLanguage v-on:language-changed="onLanguageChanged"></KTDropdownLanguage>
        </b-dropdown-text>
      </b-dropdown>
    </div>
    <!--end: Language bar -->

    <!--begin: User Bar -->
    <b-dropdown variant="link" toggle-class="btn btn-clean btn-user-nav" no-caret right no-flip>
      <template v-slot:button-content>
        <span class="user-nav-text">{{ user.email }}</span>
        <img src="/assets/images/user.jpg" class="user-nav-image ml-2" />
      </template>
      <b-dropdown-text tag="div" class="nav-user-dropdown p-8">
        <b-button variant="outline-success" @click="onMyProfile">Min profil</b-button>
        <hr class="w-100" />
        <b-button variant="outline-success" @click="onLogOut">LOGGA UT</b-button>
      </b-dropdown-text>
    </b-dropdown>
    <!-- <KTQuickUser></KTQuickUser> -->
    <!--end: User Bar -->
  </div>
  <!-- end:: Header Topbar -->
</template>

<style lang="scss">
.topbar {
  .dropdown-toggle {
    padding: 0;
    &:hover {
      text-decoration: none;
    }

    &.dropdown-toggle-no-caret {
      &:after {
        content: none;
      }
    }
  }

  .dropdown-menu {
    margin: 0;
    padding: 0;
    outline: none;
    .b-dropdown-text {
      padding: 0;
    }
  }
  .btn-user-nav {
    padding: 0px 10px;
    // border-radius: 50px;
    .user-nav-text {
      font-size: 1.1rem;
      color: #6c7293;
    }
    .user-nav-image {
      align-self: center;
      max-height: 38px;
      max-width: 38px;
      border-radius: 50%;
    }
  }
  .nav-user-dropdown {
    width: 250px;
  }
}
</style>

<script>
import KTDropdownLanguage from '@/view/layout/extras/dropdown/DropdownLanguage.vue';
import i18nService from '@/core/services/i18n.service.js';
import { mapGetters } from 'vuex';
import { CLIENT_LOGIN, CLIENT_LOGOUT } from '@/core/services/store/client.auth.module';

import { LOGOUT } from '@/core/services/store/auth.module';

export default {
  name: 'KTTopbar',
  data() {
    return {
      languageFlag: '',
      languages: i18nService.languages
    };
  },
  props: {
    user: { type: Object, default: {} }
  },
  components: {
    KTDropdownLanguage
  },
  mounted() {
    console.log('MemberTopbar.vue');
  },
  methods: {
    onLanguageChanged() {
      this.languageFlag = this.languages.find(val => {
        return val.lang === i18nService.getActiveLanguage();
      }).flag;
    },
    onMyProfile() {
      this.$router.push({ name: 'profile' });
    },
    onLogOut() {
      let id = '';
      if (this.currentClient && this.currentClient.hasOwnProperty('company_id'))
        id = this.currentClient.company_id;
      this.$store.dispatch(CLIENT_LOGOUT);
      if (this.$route.params.id != undefined)
        this.$router.push('/login/' + this.$route.params.id);
      else
        this.$router.push('/login/' + id);
    }
  },
  computed: {
    ...mapGetters(['currentClient']),
    getLanguageFlag() {
      return this.onLanguageChanged();
    }
  }
};
</script>
