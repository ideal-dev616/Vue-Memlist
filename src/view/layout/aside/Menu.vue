<template>
  <ul class="menu-nav">
    <router-link to="/ml-dashboard" v-slot="{ href, navigate, isActive, isExactActive }" v-if="hasAccess('ml-dashboard')">
      <li
        aria-haspopup="true"
        data-menu-toggle="hover"
        class="menu-item"
        :class="[isActive && 'menu-item-active', isExactActive && 'menu-item-active']"
      >
        <a :href="href" class="menu-link" @click="navigate">
          <i class="menu-icon flaticon2-start-up"></i>
          <span class="menu-text">Dashboard</span>
        </a>
      </li>
    </router-link>

    <router-link to="/ml-todo" v-slot="{ href, navigate, isActive, isExactActive }" v-if="hasAccess('ml-todo')">
      <li
        aria-haspopup="true"
        data-menu-toggle="hover"
        class="menu-item"
        :class="[isActive && 'menu-item-active', isExactActive && 'menu-item-active']"
      >
        <a :href="href" class="menu-link" @click="navigate">
          <i class="menu-icon flaticon-list"></i>
          <span class="menu-text">Ärendehantering</span>
        </a>
      </li>
    </router-link>

    <router-link to="/ml-errors" v-slot="{ href, navigate, isActive, isExactActive }" v-if="hasAccess('ml-errors')">
      <li
        aria-haspopup="true"
        data-menu-toggle="hover"
        class="menu-item"
        :class="[isActive && 'menu-item-active', isExactActive && 'menu-item-active']"
      >
        <a :href="href" class="menu-link" @click="navigate">
          <i class="menu-icon flaticon-warning-sign"></i>
          <span class="menu-text">Felrapport</span>
        </a>
      </li>
    </router-link>

    <router-link to="/ml-events" v-slot="{ href, navigate, isActive, isExactActive }" v-if="hasAccess('ml-events')">
      <li
        aria-haspopup="true"
        data-menu-toggle="hover"
        class="menu-item"
        :class="[isActive && 'menu-item-active', isExactActive && 'menu-item-active']"
      >
        <a :href="href" class="menu-link" @click="navigate">
          <i class="menu-icon flaticon-presentation"></i>
          <span class="menu-text">Evenemang</span>
        </a>
      </li>
    </router-link>

    <!--<router-link to="/ml-calendar" v-slot="{ href, navigate, isActive, isExactActive }">
      <li
        aria-haspopup="true"
        data-menu-toggle="hover"
        class="menu-item"
        :class="[isActive && 'menu-item-active', isExactActive && 'menu-item-active']"
      >
        <a :href="href" class="menu-link" @click="navigate">
          <i class="menu-icon flaticon-calendar-3"></i>
          <span class="menu-text">Kalender</span>
        </a>
      </li>
    </router-link>-->

    <li class="menu-section" v-if="section('members')">
      <h4 class="menu-text">MEDLEMMAR</h4>
      <i class="menu-icon flaticon-more-v2"></i>
    </li>

    <router-link to="/ml-quicksearch" v-slot="{ href, navigate, isActive, isExactActive }" v-if="hasAccess('ml-quicksearch')">
      <li
        aria-haspopup="true"
        data-menu-toggle="hover"
        class="menu-item"
        :class="[isActive && 'menu-item-active', isExactActive && 'menu-item-active']"
      >
        <a :href="href" class="menu-link" @click="navigate">
          <i class="menu-icon flaticon2-search"></i>
          <span class="menu-text">Snabbsök</span>
        </a>
      </li>
    </router-link>

    <router-link to="/ml-advanced-search" v-slot="{ href, navigate, isActive, isExactActive }" v-if="hasAccess('ml-advanced-search')">
      <li
        aria-haspopup="true"
        data-menu-toggle="hover"
        class="menu-item"
        :class="[isActive && 'menu-item-active', isExactActive && 'menu-item-active']"
      >
        <a :href="href" class="menu-link" @click="navigate">
          <i class="menu-icon flaticon-signs-1"></i>
          <span class="menu-text">Avancerad sök</span>
        </a>
      </li>
    </router-link>

    <router-link to="/ml-advanced-search-test" v-slot="{ href, navigate, isActive, isExactActive }" v-if="hasAccess('ml-advanced-search')">
      <li
              aria-haspopup="true"
              data-menu-toggle="hover"
              class="menu-item"
              :class="[isActive && 'menu-item-active', isExactActive && 'menu-item-active']"
      >
        <a :href="href" class="menu-link" @click="navigate">
          <i class="menu-icon flaticon-signs-1"></i>
          <span class="menu-text">New avancerad sök</span>
        </a>
      </li>
    </router-link>

    <router-link to="/ml-import" v-slot="{ href, navigate, isActive, isExactActive }" v-if="hasAccess('ml-import')">
      <li
        aria-haspopup="true"
        data-menu-toggle="hover"
        class="menu-item"
        :class="[isActive && 'menu-item-active', isExactActive && 'menu-item-active']"
      >
        <a :href="href" class="menu-link" @click="navigate">
          <i class="menu-icon flaticon-file-1"></i>
          <span class="menu-text">Importera</span>
        </a>
      </li>
    </router-link>

    <router-link to="/ml-stickprov" v-slot="{ href, navigate, isActive, isExactActive }" v-if="hasAccess('ml-stickprov')">
      <li
        aria-haspopup="true"
        data-menu-toggle="hover"
        class="menu-item"
        :class="[isActive && 'menu-item-active', isExactActive && 'menu-item-active']"
      >
        <a :href="href" class="menu-link" @click="navigate">
          <i class="menu-icon flaticon2-phone"></i>
          <span class="menu-text">Stickprover</span>
        </a>
      </li>
    </router-link>

    <router-link to="/ml-ladok" v-slot="{ href, navigate, isActive, isExactActive }" v-if="hasAccess('ml-ladok')">
      <li
        aria-haspopup="true"
        data-menu-toggle="hover"
        class="menu-item"
        :class="[isActive && 'menu-item-active', isExactActive && 'menu-item-active']"
      >
        <a :href="href" class="menu-link" @click="navigate">
          <i class="menu-icon fa fa-book-reader" style="margin-left: -9px;"></i>
          <span class="menu-text" style="margin-left: 10px;">LADOK</span>
        </a>
      </li>
    </router-link>

    <router-link to="/ml-properties" v-slot="{ href, navigate, isActive, isExactActive }" v-if="hasAccess('ml-properties')">
      <li
        aria-haspopup="true"
        data-menu-toggle="hover"
        class="menu-item"
        :class="[isActive && 'menu-item-active', isExactActive && 'menu-item-active']"
      >
        <a :href="href" class="menu-link" @click="navigate">
          <i class="menu-icon fa fa-graduation-cap" style="margin-left: -9px;"></i>
          <span class="menu-text" style="margin-left: 10px;">Attribut</span>
        </a>
      </li>
    </router-link>

    <router-link to="/ml-member-manager" v-slot="{ href, navigate, isActive, isExactActive }" v-if="hasAccess('ml-member-manager')">
      <li
        aria-haspopup="true"
        data-menu-toggle="hover"
        class="menu-item"
        :class="[isActive && 'menu-item-active', isExactActive && 'menu-item-active']"
      >
        <a :href="href" class="menu-link" @click="navigate">
          <i class="menu-icon flaticon2-box-1"></i>
          <span class="menu-text">Medlemshantering</span>
        </a>
      </li>
    </router-link>

    
    <router-link to="/ml-payments" v-slot="{ href, navigate, isActive, isExactActive }" v-if="hasAccess('ml-payments')">
      <li
        aria-haspopup="true"
        data-menu-toggle="hover"
        class="menu-item"
        :class="[isActive && 'menu-item-active', isExactActive && 'menu-item-active']"
      >
        <a :href="href" class="menu-link" @click="navigate">
          <i class="menu-icon flaticon2-box-1"></i>
          <span class="menu-text">Betalningar</span>
        </a>
      </li>
    </router-link>

    <li class="menu-section" v-if="section('association')">
      <h4 class="menu-text">FÖRENING</h4>
      <i class="menu-icon flaticon-more-v2"></i>
    </li>

    <router-link to="/ml-mucf" v-slot="{ href, navigate, isActive, isExactActive }" v-if="hasAccess('ml-mucf')">
      <li
        aria-haspopup="true"
        data-menu-toggle="hover"
        class="menu-item"
        :class="[isActive && 'menu-item-active', isExactActive && 'menu-item-active']"
      >
        <a :href="href" class="menu-link" @click="navigate">
          <i class="menu-icon flaticon-list-3"></i>
          <span class="menu-text">MUCF</span>
        </a>
      </li>
    </router-link>

    <router-link to="/ml-settings" v-slot="{ href, navigate, isActive, isExactActive }" v-if="hasAccess('ml-settings')">
      <li
        aria-haspopup="true"
        data-menu-toggle="hover"
        class="menu-item"
        :class="[isActive && 'menu-item-active', isExactActive && 'menu-item-active']"
      >
        <a :href="href" class="menu-link" @click="navigate">
          <i class="menu-icon flaticon2-gear"></i>
          <span class="menu-text">Inställningar</span>
        </a>
      </li>
    </router-link>

    <router-link to="/ml-registersetup" v-slot="{ href, navigate, isActive, isExactActive }" v-if="hasAccess('ml-registersetup')">
      <li
        aria-haspopup="true"
        data-menu-toggle="hover"
        class="menu-item"
        :class="[isActive && 'menu-item-active', isExactActive && 'menu-item-active']"
      >
        <a :href="href" class="menu-link" @click="navigate">
          <i class="menu-icon flaticon-app"></i>
          <span class="menu-text">Registreringswizard</span>
        </a>
      </li>
    </router-link>

    <router-link to="/ml-periods" v-slot="{ href, navigate, isActive, isExactActive }" v-if="hasAccess('ml-periods')">
      <li
        aria-haspopup="true"
        data-menu-toggle="hover"
        class="menu-item"
        :class="[isActive && 'menu-item-active', isExactActive && 'menu-item-active']"
      >
        <a :href="href" class="menu-link" @click="navigate">
          <i class="menu-icon flaticon-clock-2"></i>
          <span class="menu-text">Perioder</span>
        </a>
      </li>
    </router-link>

    <router-link to="/ml-users" v-slot="{ href, navigate, isActive, isExactActive }" v-if="hasAccess('ml-users')">
      <li
        aria-haspopup="true"
        data-menu-toggle="hover"
        class="menu-item"
        :class="[isActive && 'menu-item-active', isExactActive && 'menu-item-active']"
      >
        <a :href="href" class="menu-link" @click="navigate">
          <i class="menu-icon flaticon2-safe"></i>
          <span class="menu-text">Användare</span>
        </a>
      </li>
    </router-link>

    <router-link to="/ml-subcompany" v-slot="{ href, navigate, isActive, isExactActive }" v-if="hasAccess('ml-subcompany')">
      <li
        aria-haspopup="true"
        data-menu-toggle="hover"
        class="menu-item"
        :class="[isActive && 'menu-item-active', isExactActive && 'menu-item-active']"
      >
        <a :href="href" class="menu-link" @click="navigate">
          <i class="menu-icon flaticon-map"></i>
          <span class="menu-text">Underföreningar</span>
        </a>
      </li>
    </router-link>

    <router-link to="/ml-importcompanies" v-slot="{ href, navigate, isActive, isExactActive }" v-if="hasAccess('ml-importcompanies')">
      <li
        aria-haspopup="true"
        data-menu-toggle="hover"
        class="menu-item"
        :class="[isActive && 'menu-item-active', isExactActive && 'menu-item-active']"
      >
        <a :href="href" class="menu-link" @click="navigate">
          <i class="menu-icon flaticon-map"></i>
          <span class="menu-text">Importera föreningar</span>
        </a>
      </li>
    </router-link>

    <router-link to="/ml-files" v-slot="{ href, navigate, isActive, isExactActive }" v-if="hasAccess('ml-files')">
      <li
        aria-haspopup="true"
        data-menu-toggle="hover"
        class="menu-item"
        :class="[isActive && 'menu-item-active', isExactActive && 'menu-item-active']"
      >
        <a :href="href" class="menu-link" @click="navigate">
          <i class="menu-icon flaticon-folder-1"></i>
          <span class="menu-text">Filer</span>
        </a>
      </li>
    </router-link>

    <router-link to="/ml-shopitem" v-slot="{ href, navigate, isActive, isExactActive }" v-if="hasAccess('ml-shopitem')">
      <li
        aria-haspopup="true"
        data-menu-toggle="hover"
        class="menu-item"
        :class="[isActive && 'menu-item-active', isExactActive && 'menu-item-active']"
      >
        <a :href="href" class="menu-link" @click="navigate">
          <i class="menu-icon flaticon-price-tag"></i>
          <span class="menu-text">Butik</span>
        </a>
      </li>
    </router-link>

    <router-link to="/ml-book" v-slot="{ href, navigate, isActive, isExactActive }" v-if="hasAccess('ml-book')">
      <li
        aria-haspopup="true"
        data-menu-toggle="hover"
        class="menu-item"
        :class="[isActive && 'menu-item-active', isExactActive && 'menu-item-active']"
      >
        <a :href="href" class="menu-link" @click="navigate">
          <i class="menu-icon flaticon2-sheet"></i>
          <span class="menu-text">Bokföring</span>
        </a>
      </li>
    </router-link>

    <li class="menu-section" v-if="section('communication')">
      <h4 class="menu-text">KOMMUNIKATION</h4>
      <i class="menu-icon flaticon-more-v2"></i>
    </li>

    <router-link to="/ml-sendout" v-slot="{ href, navigate, isActive, isExactActive }" v-if="hasAccess('ml-sendout')">
      <li
        aria-haspopup="true"
        data-menu-toggle="hover"
        class="menu-item"
        :class="[isActive && 'menu-item-active', isExactActive && 'menu-item-active']"
      >
        <a :href="href" class="menu-link" @click="navigate">
          <i class="menu-icon flaticon2-mail-1"></i>
          <span class="menu-text">Utskick</span>
        </a>
      </li>
    </router-link>

    <router-link to="/ml-templates" v-slot="{ href, navigate, isActive, isExactActive }" v-if="hasAccess('ml-templates')">
      <li
        aria-haspopup="true"
        data-menu-toggle="hover"
        class="menu-item"
        :class="[isActive && 'menu-item-active', isExactActive && 'menu-item-active']"
      >
        <a :href="href" class="menu-link" @click="navigate">
          <i class="menu-icon flaticon-interface-11"></i>
          <span class="menu-text">Mallar</span>
        </a>
      </li>
    </router-link>

    <li class="menu-section" v-if="section('admin')">
      <h4 class="menu-text">Administration</h4>
      <i class="menu-icon flaticon-more-v2"></i>
    </li>

    <router-link to="/ml-support" v-slot="{ href, navigate, isActive, isExactActive }" v-if="hasAccess('ml-support')">
      <li
        aria-haspopup="true"
        data-menu-toggle="hover"
        class="menu-item"
        :class="[isActive && 'menu-item-active', isExactActive && 'menu-item-active']"
      >
        <a :href="href" class="menu-link" @click="navigate">
          <i class="menu-icon flaticon-support"></i>
          <span class="menu-text">Support</span>
        </a>
      </li>
    </router-link>

    <router-link to="/ml-billing" v-slot="{ href, navigate, isActive, isExactActive }" v-if="hasAccess('ml-billing')">
      <li
        aria-haspopup="true"
        data-menu-toggle="hover"
        class="menu-item"
        :class="[isActive && 'menu-item-active', isExactActive && 'menu-item-active']"
      >
        <a :href="href" class="menu-link" @click="navigate">
          <i class="menu-icon flaticon-interface-9"></i>
          <span class="menu-text">Kostnader</span>
        </a>
      </li>
    </router-link>

    <li class="menu-section" v-if="isTalongAdmin">
      <h4 class="menu-text">Super Admin</h4>
      <i class="menu-icon flaticon-more-v2"></i>
    </li>

    <router-link to="/ml-companies" v-slot="{ href, navigate, isActive, isExactActive }" v-if="hasAccess('ml-companies')" >
      <li
        aria-haspopup="true"
        data-menu-toggle="hover"
        class="menu-item"
        :class="[isActive && 'menu-item-active', isExactActive && 'menu-item-active']"
      >
        <a :href="href" class="menu-link" @click="navigate">
          <i class="menu-icon flaticon-open-box"></i>
          <span class="menu-text">Föreningslista</span>
        </a>
      </li>
    </router-link>

    <router-link to="/ml-language" v-slot="{ href, navigate, isActive, isExactActive }" v-if="hasAccess('ml-language')" >
      <li
        aria-haspopup="true"
        data-menu-toggle="hover"
        class="menu-item"
        :class="[isActive && 'menu-item-active', isExactActive && 'menu-item-active']"
      >
        <a :href="href" class="menu-link" @click="navigate">
          <i class="menu-icon flaticon-home"></i>
          <span class="menu-text">Språk</span>
        </a>
      </li>
    </router-link>

    <router-link to="/ml-system" v-slot="{ href, navigate, isActive, isExactActive }" v-if="hasAccess('ml-system')" >
      <li
        aria-haspopup="true"
        data-menu-toggle="hover"
        class="menu-item"
        :class="[isActive && 'menu-item-active', isExactActive && 'menu-item-active']"
      >
        <a :href="href" class="menu-link" @click="navigate">
          <i class="menu-icon flaticon-cogwheel"></i>
          <span class="menu-text">System</span>
        </a>
      </li>
    </router-link>


    <router-link to="/ml-apikeys" v-slot="{ href, navigate, isActive, isExactActive }" v-if="hasAccess('ml-apikeys')" >
      <li
        aria-haspopup="true"
        data-menu-toggle="hover"
        class="menu-item"
        :class="[isActive && 'menu-item-active', isExactActive && 'menu-item-active']"
      >
        <a :href="href" class="menu-link" @click="navigate">
          <span class="menu-icon svg-icon">
            <inline-svg src="/assets/svg/key.svg" style='width: 17px; height: 17px;'></inline-svg>
          </span>
          <span class="menu-text">API Nycklar</span>
        </a>
      </li>
    </router-link>

  </ul>
</template>
<style lang="scss" scoped>
li:hover > a > span > svg,
.menu-item-active > a > span > svg {
  fill: #3699FF;
}
</style>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'KTMenu',
  computed: {
    ...mapGetters(['isTalongAdmin','currentAccess'])
  },
  data() {
    return {
      access: {}
    }
  },
  mounted() {

  },
  watch: {
    currentAccess(newValue, oldVal) {
      console.log('currentaccess updated');
    },
  },
  methods: {
    hasAccess(page) {
      if (this.isTalongAdmin) { return true; }

      if (this.currentAccess === null || this.currentAccess === undefined) {
        return false;
      }

      if (!(page in this.currentAccess)) {
        return false;
      }

      if (this.currentAccess[page].su) {
        return false;
      }

      return this.currentAccess[page].p !== '-';
    },
    hasActiveChildren(match) {
      return this.$route['path'].indexOf(match) !== -1;
    },
    section(name){
      let list = [];
      switch (name) {
        case 'members':
          list = ['ml-quicksearch', 'ml-advanced-search', 'ml-import', 'ml-stickprov', 'ml-ladok', 'ml-properties', 'ml-member-manager', 'ml-payments'];
          break;
        case 'association':
          list = ['ml-mucf', 'ml-settings', 'ml-registersetup', 'ml-periods', 'ml-users', 'ml-subcompany', 'ml-files', 'ml-shopitem', 'ml-book', 'ml-importcompanies'];
          break;
        case 'communication':
          list = ['ml-sendout', 'ml-templates'];
          break;
        case 'admin':
          list = ['ml-support', 'ml-billing'];
          break;
        default :
          break;
      }

      for (let i = 0; i < list.length; i++){
        if (this.hasAccess(list[i]))
          return true
      }
      return false;
    },
  }
};
</script>
