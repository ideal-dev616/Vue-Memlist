<template>
<div>
  <b-card :header="group.name" class="mb-8">
    <p>{{ group.descr }}</p>
    <p v-if="isMandatory" class="mt-6 mb-6"><strong>Obligatoriskt!</strong></p>

    <div v-if="isMulti">
      <PropertyPageGroupCheckboxProperties 
        :group="group"
        @selected="selected"
      />
    </div>

    <div v-if="!isMulti">
      <PropertyPageGroupRadioProperties 
        :group="group"
        @selected="selected"
      />
    </div>
  </b-card>
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
import PropertyPageGroupRadioProperties from '@/view/pages/members/register/registerwizard/PropertyPageGroupRadioProperties.vue';
import PropertyPageGroupCheckboxProperties from '@/view/pages/members/register/registerwizard/PropertyPageGroupCheckboxProperties.vue';


export default {
  name: 'property-page-group',
  props: ['groupsource'],
  components: {
    PropertyPageGroupRadioProperties,
    PropertyPageGroupCheckboxProperties
  },
  data() {
    return {
      isMandatory: false,
      isValid: false,
      isMulti: false,
      group: {
        is_multi: 0,
        props: [ 
          {
            prop_id: 0,
            selected: false
          } 
        ]
      }
    };
  },
  mounted() {
    this.group = this.groupsource;

    this.isMandatory = this.group.mandatory || this.group.is_mandatory === 1;
    this.isMulti = this.group.is_multi === 1;

    if (!this.isMandatory) {
      // if its not mandatory, make sure we tell our parent that we are valid
      this.$emit('isValid', this.group.group_id, true);
    }
  },
  watch: {},
  methods: {
    selected(group, selected) {
      if (this.isMulti) {
        if (this.isMandatory) {
          this.isValid = this.selected !== null && this.selected.length > 0;
        }
        else {
          this.isValid = true;
        }
      }
      else {
        this.isValid = true;
      }

      for (var i = 0; i < this.group.props.length; ++i) { 
        this.group.props[i].selected = false;
      }

      // set the property
      for (var i = 0; i < this.group.props.length; ++i) {
        if (this.isMulti) {
          for (var j = 0; j < selected.length; ++j) {
            if (this.group.props[i].prop_id === selected[j]) {
              this.group.props[i].selected = true;
            }
          }
        }
        else {
          if (this.group.props[i].prop_id === selected) {
            this.group.props[i].selected = true;
          }
        }
      }

      this.$emit('isValid', group.group_id, this.isValid);
      this.$emit('selected', group, selected);
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
