<template>
  <!-- begin:: Header -->
  <div id="kt_header" ref="kt_header" class="header">
    <div class="container-fluid d-flex align-items-center justify-content-between">
      <!-- begin:: Header Menu -->
      <div class="header-menu-wrapper" ref="kt_header_menu_wrapper">

      </div>
      <!-- end:: Header Menu -->
      <KTMemberTopbar :user="currentClient"></KTMemberTopbar>
    </div>
  </div>
  <!-- end:: Header -->
</template>

<script>
import { mapGetters } from 'vuex';
import KTMemberTopbar from '@/view/pages/members/loggedin/MemberTopbar.vue';
import KTLayoutHeader from '@/assets/js/layout/base/header.js';
import KTLayoutHeaderMenu from '@/assets/js/layout/base/header-menu.js';
import KTMenu from '@/view/layout/header/Menu.vue';

export default {
  name: 'KTHeader',
  components: {
    KTMemberTopbar,
    KTMenu
  },
  mounted() {
    // Init Desktop & Mobile Headers
    KTLayoutHeader.init('kt_header', 'kt_header_mobile');

    // Init Header Menu
    KTLayoutHeaderMenu.init(this.$refs['kt_header_menu'], this.$refs['kt_header_menu_wrapper']);
  },
  computed: {
    ...mapGetters([
      'layoutConfig',
      'getClasses',
      'currentClient'      
    ]),

    /**
     * Check if the header menu is enabled
     * @returns {boolean}
     */
    headerMenuEnabled() {
      return !!this.layoutConfig('header.menu.self.display');
    },

    /**
     * Get extra classes for header based on the options
     * @returns {null|*}
     */
    headerClasses() {
      const classes = this.getClasses('header');
      if (typeof classes !== 'undefined') {
        return classes.join(' ');
      }
      return null;
    },

    /**
     * Get extra classes for header menu based on the options
     * @returns {null|*}
     */
    headerMenuClasses() {
      const classes = this.getClasses('header_menu');
      if (typeof classes !== 'undefined') {
        return classes.join(' ');
      }
      return null;
    }
  }
};
</script>
