<template>
  <div>
    <div v-if="!skipOrgnumber">
        <div v-html="page.html"></div>
        <b-form-group
            class="col-6"
            id="org_number-group"
            label="Organisationnummer"
            label-for="org_number"
        >
            <b-form-input
            id="org_number"
            v-model="org_number"
            placeholder="AABBCC-DDEE"
            :state="valid"
            ></b-form-input>
        </b-form-group>
    </div>
    <div v-if="skipOrgnumber">
        <p>Du har valt att hoppa över organisationnummer</p>
    </div>

    <b-form-group>
        <div class="d-flex align-items-center mb-4">
            <label class="checkbox checkbox-lg checkbox-outline checkbox-success">
            <input
                type="checkbox"
                name=""
                v-model="skipOrgnumber"
                @click="skipOrgnumber = !skipOrgnumber"
            />
            <span></span>
            </label>
            <span class="ml-3 cursor-pointer">Föreningen har inget organisationnummer</span>
        </div>
    </b-form-group>
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
  name: 'org_number-page',
  props: ['page'],
  components: {

  },
  computed: {
    ...mapGetters(['currentCompanyId', 'currentPeriodId'])
  },
  data() {
    return {
      form: {},
      org_number: '',
      fmt_org_number: '',
      valid: false,
      skipOrgnumber: false
    };
  },
  mounted() {
    this.$emit('isValid', false, this.page.index)
  },
  watch: {
    skipOrgnumber(newValue, oldValue) {
      if (newValue) {
        console.log('emitting true');
        this.$emit('isValid', true, this.page.index);
      }
      else {
        console.log('emitting valid: ' + this.valid);
        this.$emit('isValid', this.valid, this.page.index);
      }
    },
    org_number(newValue, oldValue) {
      var formatted = this.validate_org_number(newValue);

      this.valid = formatted.valid;

      this.fmt_org_number = formatted.formatted;

      this.$emit('isValid', this.valid, this.page.index);
      this.$emit('setData', { org_number: this.org_number }, this.page.index);

      this.form.valid = this.valid;
      this.form.formatted = formatted;
      this.form.fmt_org_number = this.fmt_org_number;

      this.org_number = formatted.formatted;
    }
  },
  methods: {
    getData() {
      return this.form;
    },
    toastr(type, title, message) {
      this.$bvToast.toast(message, {
        title: title,
        autoHideDelay: 1000,
        appendToast: true,
        variant: type
      });
    },
    validate_org_number(org_number) {
        var val = org_number;

        if (val.length == 7 && val.substr(6,1) == '-') {

        }
        else {
            val = val.replace(/[^0-9.]/g, "");

            if (val.length > 6) {
                val = val.substr(0,6) + '-' + val.substr(6, val.length - 6);
            }
        }

        var valid = false;

        if (val.length === 11) {
          valid = true;
        }

        return {
          valid: valid,
          formatted: val
        }
    },
  }
};
</script>
