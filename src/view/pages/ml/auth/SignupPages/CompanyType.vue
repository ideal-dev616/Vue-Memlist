<template>
  <div>
    <div v-html="page.html"></div>

    <b-card class="mb-8" v-if="isStandalone">
      <b-row>
        <b-col lg="12">
            <label class="radio radio-outline radio-success mb-4">
              <input type="radio" v-model="selected" value="riks" name="type" />
              <span style="margin-right: 12px;"></span>
              Riksförbund
            </label>
        </b-col>
      </b-row>
      <b-row>
        <b-col lg="12">
          <p>Ett rikförbund med ett antal underföreningar</p>
        </b-col>
      </b-row>
    </b-card>

    <b-card class="mb-8">
      <b-row>
        <b-col lg="12">
            <label class="radio radio-outline radio-success mb-4">
              <input type="radio" v-model="selected" value="default" name="type" />
              <span style="margin-right: 12px;"></span>
              Förening
            </label>
        </b-col>
      </b-row>
      <b-row>
        <b-col lg="12">
          <p>En förening, underförening eller övrig som ej stämmer med andra alterntiv</p>
        </b-col>
      </b-row>
    </b-card>

    <b-card class="mb-8">
      <b-row>
        <b-col lg="12">
            <label class="radio radio-outline radio-success mb-4">
              <input type="radio" v-model="selected" value="student" name="type" />
              <span style="margin-right: 12px;"></span>
              Studentkår
            </label>
        </b-col>
      </b-row>
      <b-row>
        <b-col lg="12">
          <p>Studentkårer, nationer och förbund</p>
        </b-col>
      </b-row>
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
import moment from 'moment';

export default {
  name: 'companytype-page',
  props: ['page','isStandalone'],
  components: {},
  data() {
    return {
      selected: '',
    };
  },
  mounted() {
    this.$emit('isValid', false, this.page.index);
  },
  watch: {
    selected(newValue, oldValue) {
      this.$emit('isValid', true, this.page.index);
    },
  },
  methods: {
    doValidation() {
      this.$emit('isValid', this.selected !== '', this.page.index);
    },
    getData() {
      return { type: this.selected }
    },
    toastr(type, title, message) {
      this.$bvToast.toast(message, {
        title: title,
        autoHideDelay: 2000,
        appendToast: true,
        variant: type
      });
    },
  }
};
</script>
