<template>
  <div>
    <v-select multiple v-model="showFields" :options="options" />
    <div class="d-flex mt-5">
      <v-select
        class="page-count-select"
        v-model="perPage"
        :options="[25, 50, 100]"
        :clearable="false"
        :searchable="false"
      ></v-select>
      <b-pagination
        class="ml-auto"
        v-model="currentPage"
        :total-rows="clients.length"
        :per-page="perPage"
        aria-controls="search-result-table"
      ></b-pagination>
    </div>
    <div>
      <b-table
        id="search-result-table"
        class="mt-3 cursor-pointer"
        sticky-header
        responsive
        striped
        hover
        bordered
        :items="clients"
        :fields="showFields"
        :per-page="perPage"
        :current-page="currentPage"
        @row-clicked="rowClicked"
      >
      </b-table>
    </div>
  </div>
</template>

<script>
import vSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';
export default {
  name: 'search-result',
  components: {
    vSelect
  },
  data() {
    return {
      currentPage: 1,
      perPage: 25,
      options: [],
      fields: [
        { label: 'Förening', code: 'company' },
        { label: 'Period', code: 'period' },
        { label: 'Förnamn', code: 'firstname' },
        { label: 'Efternamn', code: 'lastname' },
        { label: 'Personnummer', code: 'in_personnr' },
        { label: 'Betalat', code: 'paying' },
        { label: 'LADOK', code: 'ladok' },
        { label: 'Ålder', code: 'age' },
        { label: 'Kön', code: 'sex' },
        { label: 'E-post', code: 'email' },
        { label: 'Telefon', code: 'phone' },
        { label: 'Gata', code: 'address' },
        { label: 'Postnummer', code: 'zipcode' },
        { label: 'Region', code: 'region_code' },
        { label: 'Land', code: 'country' },
        { label: 'Postort', code: 'post' },
        { label: 'Medlemsnummer', code: 'public_id'},
        { label: 'Registreringsdatum', code: 'rdt'}
      ],
      showFields: [
        { key: 'company', label: 'Förening', show: true, sortable: true },
        { key: 'period', label: 'Period', show: true, sortable: true },
        { key: 'firstname', label: 'Förnamn', show: true, sortable: true },
        { key: 'lastname', label: 'Efternamn', show: true, sortable: true },
        { key: 'in_personnr', label: 'Personnummer', show: true, sortable: true },
        { key: 'email', label: 'E-post', show: true, sortable: true },
        { key: 'age', label: 'Ålder', show: true, sortable: true },
        { key: 'sex', label: 'Kön', show: true, sortable: true },
        { key: 'phone', label: 'Telefon', show: true, sortable: true },
        { key: 'address', label: 'Gata', show: true, sortable: true },
        { key: 'zipcode', label: 'Postnummer', show: true, sortable: true },
        { key: 'ladok', label: 'LADOK', show: false, sortable: true },
        { key: 'paying', label: 'Betalat', show: false, sortable: true },
        { key: 'region_code', label: 'Region', show: true, sortable: true},
        { key: 'country', label: 'Land', show: false, sortable: true },
        { key: 'post', label: 'Postort', show: false, sortable: true },
        { key: 'public_id', label: 'Medlemsnummer', show: false, sortable: true},
        { key: 'rdt', label: 'Registreringsdatum', show: false, sortable: true }
      ]
    };
  },
  watch: {
    showFields(newValue, oldvalue) {
      let temp_array = this.fields;
      for (var i = 0; i < newValue.length; ++i) {
        if (newValue[i].hasOwnProperty('code')) {
          newValue[i].key = newValue[i].code;
        }

        if (newValue[i].show || !newValue[i].hasOwnProperty('show')) {
          temp_array = temp_array.filter(function(obj) {
            return obj.label !== newValue[i].label;
          });
        }
      }

      this.showFields = newValue;
      this.options = temp_array;
      this.$emit('showFields', this.getShowFieldsNames(newValue));
    }
  },
  mounted() {
    var that = this;
    setTimeout(function() {
      that.showFields = that.showFields.filter(item => item.show);
    }, 100);
  },
  props: {
    clients: { type: Array, default: [] }
  },
  methods: {
    rowClicked(record, index) {
      this.$emit('clientSelected', record);
    },
    getShowFieldsNames(items) {
      let fields = [];
      items.filter(item => {
        fields.push(item.key);
      });
      return fields;
    }
  }
};
</script>

<style scoped>
.page-count-select {
  min-width: 100px;
}
.b-table-sticky-header{
  overflow-y: hidden;
  max-height: unset;
}
</style>
