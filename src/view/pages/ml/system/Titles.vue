<template>
  <div class="px-5 mt-8" id="page-titles">
    <b-row>
      <b-col lg="2"></b-col>
      <b-col lg="8">
        <TitleTable
          :titles="titles"
          @createTitleClicked="createTitle"
          @selectTitleClicked="selectTitle"
          @deleteTitleClicked="deleteTitle"
        />
      </b-col>
    </b-row>
    <b-row>
      <b-col lg="2"></b-col>
      <b-col lg="8">
        <b-card v-if="creating || editing" title="Editera titel" class="mb-2 mt-8 edit-title" hide-footer>
          <div>
            <b-form class="mt-8" @submit="saveData">
              <b-form-group id="input-group-name" label="Namn" label-for="input-name">
                <b-form-input
                  id="input-name"
                  v-model="form.name"
                  type="text"
                  required
                ></b-form-input>
              </b-form-group>

              <b-form-group id="input-group-level" label="Nivå" label-for="input-level">
                <b-form-select
                  id="level"
                  v-model="form.level"
                  :options="levelOptions"
                ></b-form-select>
              </b-form-group>

              <b-button type="submit" variant="primary">Spara</b-button>

            </b-form>
          </div>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<style lang="scss" scoped>
.checkbox.checkbox-light-success > span {
  background-color: white;
  border: 1px solid #ddd;
}
</style>

<script>
import axios from 'axios';
import { mapGetters } from 'vuex';
import TitleTable from '@/view/pages/ml/system/TitleTable.vue';

export default {
  name: 'titles-settings',
  components: {
    TitleTable
  },
  props: ['titles'],
  computed: {
    ...mapGetters(['currentCompanyId', 'currentPeriodId'])
  },
  mounted() {
    this.loadData();
  },
  data() {
    return {
      levelOptions: [
        { value: 0, text: '0 - Lägsta rangordning' },
        { value: 1, text: '1' },
        { value: 2, text: '2' },
        { value: 3, text: '3' },
        { value: 4, text: '4' },
        { value: 5, text: '5' },
        { value: 6, text: '6' },
        { value: 7, text: '7' },
        { value: 8, text: '8' },
        { value: 9, text: '9' },
        { value: 10, text: '10 - Högsta rangordning' }
      ],
      form: {
        name: '',
        level: 0
      },
      editing: false,
      creating: false,
    };
  },
  watch: {
    currentCompanyId(newValue, oldvalue) {
      if (newValue) {
        this.loadData();
      }
    },
    settings(newValue, oldValue) {
      if (newValue) {
        this.titles = newValue.titles;
      }
    }
  },
  methods: {
    async loadData() {
     
    },
    getLangText(lang_text, lang) {
      for (var i = 0; i < lang_text.length; ++i) {
        if (lang_text[i].lang === lang) {
          return lang_text[i].text;
        }
      }

      return 'Språköversättning saknas';
    },
    createTitle() {
      this.creating = true;
      this.form.name = "";
      this.form.level = 0;
      this.scrollToEditTitle();
    },
    selectTitle(title) {
      this.form = title;

      this.editing = true;
      this.scrollToEditTitle();
    },
    deleteTitle(title) {
      //this.titles = this.titles.filter(item => item.id !== title.id);

      this.$emit('deleteTitle', title.id);
    },
    randomstr(length) {
      let result = '';
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      const charactersLength = characters.length;

      for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }

      return result;
    },
    saveData(e) {
      e.preventDefault();

      if (this.creating) {
        this.$emit('createTitle', this.form.name, this.form.level);
      } else {
        this.$emit('updateTitle', this.form.id, this.form.name, this.form.level);

        this.editing = false;
      }
    },
    scrollToEditTitle() {
      var that = this;
      setTimeout(function () {
        const el = that.$el.getElementsByClassName('edit-title')[0];

        if (el) {
          const yOffset = -70;
          const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;

          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 100);
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
