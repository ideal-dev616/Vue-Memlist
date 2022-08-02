<template>
  <div class="px-5 mt-8" id="page-titles">
    <b-row>
      <b-col lg="2"></b-col>
      <b-col lg="8">
        <TitleTable
          :titles="titles"
          @setIncludeTitle="setIncludeTitle"
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
import TitleTable from '@/view/pages/ml/settings/titles/TitleTable.vue';

export default {
  name: 'titles-settings',
  components: {
    TitleTable
  },
  props: ['settings'],
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
      titles: []
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
    setIncludeTitle(id, include) {
      axios
        .put('/company/settingtitle', { company_id: this.currentCompanyId, id: id, include: include })
        .then(res => {
          for (const t of this.titles) {
            if (t.id === id) {
              t.include = include;
              break;
            }
          }

          this.toastr('success', 'OK', 'Titel uppdaterad');
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Fel', 'Kunde inte sätta titel');
        });
    },
    async loadData() {
      if (!this.currentCompanyId) {
        return;
      }
      if (!this.settings) {
        return;
      }

      axios 
        .get(`/system/titles`)
        .then(res => {

          var titles = res.data.titles;
          var ctitles = this.settings.titles;

          for (const t of titles) { // go through each system title
            t.include = false;

            for (const tt of ctitles) { // check each company title
              if (tt === t.id) { // if found, we mark it as included
                t.include = true;
                break;
              }
            }
          }

          this.titles = titles;
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Fel', 'Kunde inte lista titlar');
        });
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
      this.titles = this.titles.filter(item => item.id !== title.id);

      this.$emit('updateSettings', this.titles);
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
        this.form.id = this.randomstr(8);

        if (this.titles === null || this.titles === undefined) {
          this.titles = [];
        }

        this.titles.push(this.form);
        this.creating = false;
      } else {
        for (var i = 0; i < this.titles.length; ++i) {
          if (this.titles[i].id === this.form.id) {
            this.titles[i] = this.form;
            break;
          }
        }

        this.editing = false;
      }

      this.$emit('updateSettings', this.titles);
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
