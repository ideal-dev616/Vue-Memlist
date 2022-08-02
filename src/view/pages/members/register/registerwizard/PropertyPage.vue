<template>
  <div>
    <div v-html="page.html"></div>
    <template v-for="(group, k) in groups">
      <PropertyPageGroup
        v-bind:key="k"
        :groupsource="group"
        @toastr="toastr"
        @isValid="isValid"
        @selected="selected"
        v-if="group.is_registration"
      />
    </template>
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
import PropertyPageGroup from '@/view/pages/members/register/registerwizard/PropertyPageGroup.vue';

export default {
  name: 'property-page',
  props: ['page', 'company_id', 'index'],
  components: {
    PropertyPageGroup
  },
  data() {
    return {
      form: [],
      num_mandatory_groups: 0,
      num_selected_groups: 0,
      selected_membership: null,
      total_price: 0,
      total_vat: 0,
      cart: [],
      groups: [
       /* {
          group_id: 15,
          company_id: 'YbD110326G',
          type: '',
          name: 'Favoritmat',
          descr: 'Ange dina favoriträtter',
          is_registration: 1,
          is_multi: 1,
          is_mandatory: 1,
          props: [ 
            {
              prop_id: 10,
              group_id: 14,
              name: 'Läkarlinjen 10000p',
              descr: 'Detta är läkarlinjen'
            },
            {
              prop_id: 11,
              group_id: 14,
              name: 'Teknikprogrammet 600p',
              descr: 'Detta är teknikprogrammet'
            }
           ]
        },*/
      ]
    };
  },
  mounted() {
    this.$emit('isValid', false, this.page.id);
    this.loadPropertyGroups(this.company_id);
  },
  watch: {
    company_id(newValue, oldValue) {
      if (newValue) {
        this.loadPropertyGroups();
      }
    }
  },
  methods: {
    getData() {
      return this.form;
    },
    // check if all groups are valid
    checkValid() {
      for (var i = 0; i < this.groups.length; ++i) {
        if (!this.groups[i].valid) {
          return false;
        }
      }

      return true;
    },
    selected(group, selected){
      this.form = [{group_id: group.group_id, prop_ids: selected}];
    },
    isValid(group_id, valid) {
      // when we get an isValid signal from our child pages, we make sure to update the group
      // and check to see if all groups are valid
      // lastly we emit an isValid signal to our parent
      for (var i = 0; i < this.groups.length; ++i) {
        if (group_id === this.groups[i].group_id) {
          this.groups[i].valid = valid;
        }
      }

      this.validate();
    },

    validate() {
      let has_mandatory = false;
      let all_mandatory_valid = true;

      for (const g of this.groups) {
        console.log('is mandatory: ' + g.is_mandatory);
        if (g.is_mandatory === 1) {
          has_mandatory = true;

          if (!g.valid) {
            all_mandatory_valid = false;
          }
        }
      }

      let valid = false;

      if (!has_mandatory) {
        valid = true;
      }
      else if (all_mandatory_valid) {
        valid = true;
      }

      console.log('PropertyPage: attribute page validation: ');
      console.log('PropertyPage: has_mandatory: ' + has_mandatory);
      console.log('PropertyPage: all_mandatory_valid: ' + all_mandatory_valid);
      console.log('PropertyPage: valid: ' + valid);

      this.$emit('isValid', valid, this.page.id);
    },

    loadPropertyGroups(company_id) {
      if (!company_id) {
        return;
      }

      axios
        .get(`/property_group/extlist?company_id=${company_id}`)
        .then(res => {
          this.groups = res.data.groups;

          // run a validation in case there are only non mandatory groups
          this.validate();
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte hämta attribut');
        });
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
