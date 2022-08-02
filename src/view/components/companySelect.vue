<template>
  <div>
    <v-select multiple v-model="showFields" :options="options" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import vSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';

export default {
  name: 'company-select',
  components: {
    vSelect
  },
  props: {
    ids: {
      type: Array,
      default: []
    },
    removeCurrentId: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters(['companies', 'currentCompanyId'])
  },
  data() {
    return {
      options: [],
      fields: [],
      showFields: [{ key: 'all', label: 'Alla', show: true }],
      locked: false
    };
  },
  watch: {
    showFields(newValue, oldvalue) {
      let temp_array = this.fields;
      if (newValue.length == this.fields.length) {
        this.showFields = [];
        return;
      }
      for (let i = 0; i < newValue.length; ++i) {
        if (newValue[i].hasOwnProperty('code')) {
          newValue[i].key = newValue[i].code;
        }

        if (newValue[i].show || !newValue[i].hasOwnProperty('show')) {
          temp_array = temp_array.filter(function (obj) {
            return obj.label !== newValue[i].label;
          });
        }
      }
      this.removeCurrentCompany(temp_array);
      this.$emit('selectedCompanies', newValue);
    },
    companies(newValue, oldvalue) {
      this.setLists();
    },
    ids(newVal, oldVal){
      this.options.filter(option=>{
        if (newVal.includes(option.code))
          this.showFields.push(option);
      })
    },
  },
  methods: {
    isAll() {
      if (
        this.showFields.length > 0 &&
        (this.showFields[0].key === 'all' || this.showFields[0].code === 'all')
      ) {
        return true;
      }

      return false;
    },
    getCompanies() {
      if (this.isAll()) {
        return ['all'];
      }

      var ret = [];

      for (let i = 0; i < this.showFields.length; ++i) {
        if (this.showFields[i].key === 'all' || this.showFields[i].code === 'all') {
          continue;
        }

        ret.push(this.showFields[i].code);
      }

      return ret;
    },
    setCompanies(company_ids) {
      this.showFields = [];

      for (let i = 0; i < company_ids.length; ++i) {
        var company = this.getCompany(company_ids[i]);

        if (company === null || company === undefined) {
          continue;
        }

        this.showFields.push({
          code: company_ids[i],
          key: company_ids[i],
          label: company.name,
          show: true
        });
      }
      console.log(this.showFields, 'SetComapnies');
    },
    getCompany(company_id) {
      for (let i = 0; i < this.companies.length; ++i) {
        if (this.companies[i].id === company_id) {
          return this.companies[i];
        }
      }
      console.log(this.showFields, 'SetComapnies');
      return null;
    },
    setLists() {
      this.fields = [];
      for (let i = 0; i < this.companies.length; ++i) {
        this.fields.push({ code: this.companies[i].id, label: this.companies[i].name });
      }
      let temp_array = this.fields;
      let that = this;
      for (let i = 0; i < that.showFields.length; ++i) {
        if (that.showFields[i].show || !that.showFields[i].hasOwnProperty('show')) {
          temp_array = temp_array.filter(function (obj) {
              return obj.label !== that.showFields[i].label;
          });
        }
      }
      this.removeCurrentCompany(temp_array);
    },
    reset(){
      this.showFields = [{ key: 'all', label: 'Alla', show: true }];
    },
    removeCurrentCompany(temp_array){
      if (this.removeCurrentId){
        this.options = temp_array.filter(item=>item.code !== this.currentCompanyId);
      } else
        this.options = temp_array;
    }
  },
  mounted() {

    this.setLists();
    var that = this;
    setInterval(function () {
      // try to fix the multiselect
      if (that.showFields.length > 1 && that.showFields[0].key === 'all') {
        // prevent 'all' and companies
        that.showFields = that.showFields.filter(item => item.key !== 'all' && item.code !== 'all');
      } else if (that.showFields.length === 0) {
        // prevent empty
        that.showFields = [{ code: 'all', key: 'all', label: 'Alla', show: true }];
      }
    }, 100);
  }
};
</script>
