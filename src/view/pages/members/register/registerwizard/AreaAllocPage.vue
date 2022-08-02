<template>
  <div>
    <div v-html="page.html"></div>
    
    <div v-if="registration.option === 'mapped'"> 
      
      <AreaAllocMapByRegion 
        :company_id="company_id"
        :page="page"
        :region_code="region_code"
        :commune_code="commune_code"
        :registration="registration"
        @isValid="isValid"
        @setCompanyIds="setCompanyIds"
      />

    </div>

    <div v-if="registration.option === 'multiple'">
      
      <AreaAllocMultiMembership 
        :company_id="company_id"
        :page="page"
        :region_code="region_code"
        :commune_code="commune_code"
        :registration="registration"
        @isValid="isValid"
        @setCompanyIds="setCompanyIds"
      />
    </div>

    <div v-if="registration.option === 'simple' || registration.option === undefined || registration.option === null || registration.option === ''">
      <p>Denna sida bör inte synas då administratören har valt att medlemmar endast kan registrera sig på denna förening - Ta bort denna sida från registreringsinställningar</p>
    </div>
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

import AreaAllocMapByRegion from '@/view/pages/members/register/registerwizard/area_alloc/AreaAllocMapByRegion.vue';
import AreaAllocMultiMembership from '@/view/pages/members/register/registerwizard/area_alloc/AreaAllocMultiMembership.vue';

export default {
  name: 'arealloc-page',
  props: ['page', 'region_code', 'commune_code', 'company_id', 'registration'],
  components: {
    AreaAllocMultiMembership,
    AreaAllocMapByRegion
  },
  data() {
    return {

      company_ids: []

    };
  },
  mounted() {

  },
  watch: {
    
  },
  methods: {
    getData() {
      return { company_ids: this.company_ids };
    },
    
    validate() {

      this.$emit('isValid', this.company_ids.length > 0, this.page.id);
    },

    isValid(valid, id) {
      this.$emit('isValid', valid, id);
    },

    setCompanyIds(company_ids) {
      this.company_ids = company_ids;
    },

    toastr(type, title, message) {
      this.$bvToast.toast(message, {
        title: title,
        autoHideDelay: 2000,
        appendToast: true,
        variant: type
      });
    }
  }
};
</script>
