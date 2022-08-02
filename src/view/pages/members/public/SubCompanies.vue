<template>
  <div>
    <v-select multiple v-model="showFields" :options="options" />
  </div>
</template>

<script>

import vSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';
import axios from 'axios';

export default {
  name: 'sub_company-select',
  props: ['company_id'],
  components: {
    vSelect
  },
  computed: {

  },
  data() {
    return {
      companies: [],
      options: [],
      fields: [],
      showFields: [{ key: 'none', label: 'Ingen', show: true }],
      locked: false
    };
  },
  watch: {
    showFields(newValue, oldValue) {
      let temp_array = this.fields;
      // if (newValue.length == this.fields.length) {
      //   this.showFields = [];
      //   return;
      // }
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
      if (newValue.findIndex(item => item.code == 'none') > -1 && newValue.length > 1) {
        if (oldValue.findIndex(item => item.code == 'none') < 0) {
          newValue = [];
          this.showFields = [];
        }
      }
      this.options = temp_array;
    },
    companies(newValue, oldvalue) {
      this.setLists();
    }
  },
  methods: {
    isNone() {
      if (
        this.showFields.length > 0 &&
        (this.showFields[0].key === 'none' || this.showFields[0].code === 'none')
      ) {
        return true;
      }

      return false;
    },
    getCompanies() {
      if (this.isNone()) {
        return [''];
      }

      var ret = [];

      for (let i = 0; i < this.showFields.length; ++i) {
        if (this.showFields[i].key === 'none' || this.showFields[i].code === 'none') {
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
    },
    getCompany(company_id) {
      for (let i = 0; i < this.companies.length; ++i) {
        if (this.companies[i].id === company_id) {
          return this.companies[i];
        }
      }
      return null;
    },
    setLists() {
      this.fields = [{ code: 'none', label: 'Ingen', show: true }];
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
      this.options = temp_array;
    },

    loadCompanies() {
      axios
        .get(`/company/publiclist?company_id=${this.company_id}`)
        .then(res => {
          this.companies = res.data.companies;
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  mounted() {
    this.loadCompanies();
    this.setLists();
    var that = this;
    setInterval(function () {
      // try to fix the multiselect
      if (that.showFields.length > 1 && that.showFields[0].key === 'none') {
        // prevent 'all' and companies
        that.showFields = that.showFields.filter(item => item.key !== 'none' && item.code !== 'none');
      } else if (that.showFields.length === 0) {
        // prevent empty
        that.showFields = [{ code: 'none', key: 'none', label: 'Ingen', show: true }];
      }
    }, 100);
  },
};
</script>
