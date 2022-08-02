<template>
  <div>
    <div v-html="page.html"></div>

    <b-row v-if="!skipPersonnr">
      <b-col lg="6">
        <b-form-group id="personnr-group" label="Personnummer" label-for="personnr">
          <b-form-input
            id="personnr"
            v-model="personnr"
            placeholder="ÅÅÅÅMMDD1234"
            :state="valid"
          ></b-form-input>
        </b-form-group>
      </b-col>
    </b-row>

    <b-row v-if="skipPersonnr">
      <b-col lg="6">
        <p>Du har valt att hoppa över personnummer</p>
      </b-col>
    </b-row>

    <b-row v-if="!page.settings.is_mandatory">
      <b-col lg="6">
        <b-form-group>
          <div class="d-flex align-items-center mb-4">
            <label class="checkbox checkbox-lg checkbox-outline checkbox-success">
              <input
                type="checkbox"
                name=""
                v-model="skipPersonnr"
                @click="skipPersonnr = !skipPersonnr"
              />
              <span></span>
            </label>
            <span class="ml-3 cursor-pointer">Jag vill ej uppge personnummer</span>
          </div>
        </b-form-group>
      </b-col>
    </b-row>
  </div>
</template>

<style lang="scss" scoped>
.checkbox > span {
  background-color: white;
  border: 1px solid #ddd;
}
</style>
<script>
import { mapGetters } from 'vuex';
import moment from 'moment';

import validate_pers_number from '@/core/services/personnr';

export default {
  name: 'personnr-page',
  props: ['page'],
  components: {},
  data() {
    return {
      form: {},
      personnr: '',
      fmt_personnr: '',
      valid: false,
      skipPersonnr: false,
      hasDoneSparLookup: false
    };
  },
  mounted() {
    this.$emit('isValid', false, this.page.id);

    if (this.page.settings.spar) {
      console.log('when valid, will do SPAR lookup');
    }
  },
  watch: {
    skipPersonnr(newValue, oldValue) {
      if (newValue) {
        this.personnr = '';
        this.emitValue(true);
      } else {
        this.$emit('isValid', true, this.page.id);
      }
    },
    personnr(newValue, oldValue) {
      var formatted = validate_pers_number(newValue);

      this.valid = formatted.valid;

      this.fmt_personnr = formatted.formatted;

      this.emitValue(this.valid);

      this.form.valid = this.valid;
      this.form.formatted = formatted;
      this.form.age = this.getAge();

      console.log('result from personnr validation:');
      console.log(formatted);

      if (formatted.valid) {
        this.personnr = formatted.formatted;

        if (!this.hasDoneSparLookup) {
          this.hasDoneSparLookup = true;
          this.$emit('doSparLookup', this.fmt_personnr);
        }
      }
    }
  },
  methods: {
    emitValue(val) {
      console.log('personnr emit isValid: ' + val);

      this.$emit('isValid', val, this.page.id);
      this.$emit('setData', { personnr: this.personnr, age: this.getAge() }, this.page.id);
    },
    getAge() {
      const formatted = validate_pers_number(this.personnr);

      if (formatted.success) {
        return moment().diff(formatted.year + '-' + formatted.month + '-' + formatted.day, 'years'); 
      }
      
      return 18;
    },
    getData() {
      this.form.age = this.getAge();
      if (this.form.age) this.form.personnr = this.personnr;
      this.form.skip = !this.form.age;
      return this.form;
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
