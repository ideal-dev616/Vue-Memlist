<template>
  <div>
    <p class="mb-6">
        Ange vilka medlemskrav som ska finnas på varje medlem. Dessa fält kan ändras i efterhand.
    </p>

    <div class="form-group">
      <div class="check-list">
        <template v-for="(req, j) in requirements">
          <div class="d-flex align-items-center mb-4" v-bind:key="j">
            <label
              class="checkbox checkbox-lg checkbox-outline checkbox-success"
            >
              <input
                type="checkbox"
                :name="req.id"
                v-model="selected"
                :value="req.id"
              />
              <span style="margin-right: 12px;"></span>
            </label>
            <span class="ml-3 cursor-pointer">{{ req.name }}</span>
          </div>
        </template>
      </div>
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
import { mapGetters } from 'vuex';
import moment from 'moment';

export default {
  name: 'details-page',
  props: ['page'],
  components: {},
  computed: {
    ...mapGetters(['currentCompanyId', 'currentPeriodId'])
  },
  data() {
    return {
      selected: [],
      requirements: []
    };
  },
  mounted() {
    this.loadRequirements();
    this.$emit('isValid', true, this.page.index);
  },
  watch: {
    selected(newValue, oldValue) {
      this.doValidation();
    }
  },
  methods: {
    doValidation() {
      this.$emit('isValid', true, this.page.index);
    },
    getData() {
      return { requirements: this.selected }
    },
    toastr(type, title, message) {
      this.$bvToast.toast(message, {
        title: title,
        autoHideDelay: 2000,
        appendToast: true,
        variant: type
      });
    },
    get_lang_text(record, lang) {
      for (var i = 0; i < record.lang_text.length; ++i) {
        if (record.lang_text[i].lang == lang) {
          return record.lang_text[i].text;
        }
      }

      return '';
    },
    loadRequirements() {
      axios
        .get('/company/constreq')
        .then(res => {
          var requirements = res.data.requirements;

          for (var i = 0; i < requirements.length; ++i) {
            var r = requirements[i];

            var req = {
              id: r.id,
              name: this.get_lang_text(r.lang_record, 'sv')
            }

            this.requirements.push(req);
          }
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte hämta medlemskrav');
        });
    },
  }
};
</script>
