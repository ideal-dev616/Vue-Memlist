<template>
  <div class="" id="page-task-edit">
    <div class="scroll-to-container"></div>
    <b-card
      title=""
      class="mb-2 edit-task-container"
      ref="edit-task"
      id="edit-task"
      hide-footer
    >
      <div>
        <b-form class="mt-8" @submit="submitTask($event)">
          <b-form-group id="input-group-todo_task_id" label="ID" label-for="input-todo_task_id">
            <b-form-input
              id="input-todo_task_id"
              v-model="form.todo_task_id"
              type="text"
              required
              disabled
            ></b-form-input>
          </b-form-group>

          <b-form-group id="input-group-6" label="Typ av åtgärd" label-for="input-6">
            <div class="radio-list mt-4">
              <template v-for="(type, j) in types">
                <label class="radio radio-outline radio-success mb-4" v-bind:key="j">
                  <input type="radio" v-model="form.type" :value="type.id" name="type" />
                  <span></span>
                  {{ type.name }}
                </label>
              </template>
            </div>
          </b-form-group>

          <div v-if="form.type === 'FILE_WIZARD'">
            <b-form-group id="input-group-7" label="Tillåtna filtyper" class="mb-4 mt-8">
              <div class="check-list mt-4">
                <template v-for="(type, j) in filetypes_options">
                  <div class="d-flex align-items-center mb-4" v-bind:key="j">
                    <label
                      class="checkbox checkbox-lg checkbox-outline checkbox-success"
                    >
                      <input
                        type="checkbox"
                        name="filetypes"
                        v-model="filetypes_options[j].value"
                      />
                      <span></span>
                    </label>
                    <span class="ml-3 cursor-pointer">{{ type.text }}</span>
                  </div>
                </template>
              </div>
            </b-form-group>
          </div>

          <!--<div v-if="form.type === 'FILE_WIZARD'">
            <b-form-group label="Filkategori" label-for="filecategory" class="mt-8">
              <b-form-select
                id="new-search-period"
                v-model="form.category"
                :options="categoryOptions"
                text-field="name"
                value-field="id"
              >
              </b-form-select>
            </b-form-group>
          </div>-->

          <b-form-group id="input-group-1" label="Namn på åtgärden" label-for="input-1">
            <b-form-input id="input-1" v-model="form.name" type="text"></b-form-input>
          </b-form-group>

          <b-form-group id="input-group-4" description="Var tydlig så att era underföreningar inte missförstår" label="Beskrivning av åtgärd" label-for="input-4">
            <b-textarea id="input-4" v-model="form.descr" class="mb-2"> </b-textarea>
          </b-form-group>

          <b-button type="submit" variant="primary">Spara Åtgärd</b-button>
          <b-button type="button" class="ml-4" variant="secondary" @click="closeTask">Stäng</b-button>
        </b-form>

      </div>
    </b-card>
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

export default {
  name: 'live-task-edit',
  props: ['task'],
  components: {},
  computed: {
    ...mapGetters(['currentCompanyId'])
  },
  mounted() {
    this.selectValidFiletypes();
  },
  data() {
    return {
      types: [
        { id: 'FILE_WIZARD', name: 'Ladda upp fil' },
        /*{ id: 'IMPORT_MEMBERS', name: 'Importera medlemmar' },*/
        { id: 'QUESTION', name: 'Ställ fråga' }
      ],
      filetypes: [],
      filetypes_options: [
        { id: 'pdf', text: 'PDF', value: false },
        { id: 'doc', text: 'Word', value: false },
        { id: 'xlsx', text: 'Excel', value: false },
        { id: 'zip', text: 'Zip', value: false },
        { id: 'jpg', text: 'JPG', value: false },
        { id: 'png', text: 'PNG', value: false },
      ],
      CATEGORIES: {
        FILE_EKONOMISKREDOVISNING: 'Ekonomisk redovisning',
        FILE_STADGAR: 'Stadgar',
        FILE_VERKSAMHET: 'Verksamhetsberättelse',
        FILE_ARSMOTESPROTOKOLL: 'Årsmötesprotokoll',
        FILE_REV_PROT_MEDLEM: 'Revisorsprotokoll över medlemmar',
        FILE_REV_PROT_EKONOMI: 'Revisorsprotokoll över ekonomi',
        FILE_REV_REPORT: 'Revisorsrapport',
        FILE_OTHER: 'Övriga filer'
      },
      categoryOptions: [
        { id: 'FILE_EKONOMISKREDOVISNING', name: 'Ekonomisk redovisning' },
        { id: 'FILE_STADGAR', name: 'Stadgar' },
        { id: 'FILE_VERKSAMHET', name: 'Verksamhetsberättelse' },
        { id: 'FILE_ARSMOTESPROTOKOLL', name: 'Årsmötesprotokoll' },
        { id: 'FILE_REV_PROT_MEDLEM', name: 'Revisorsprotokoll över medlemmar' },
        { id: 'FILE_REV_PROT_EKONOMI', name: 'Revisorsprotokoll över ekonomi' },
        { id: 'FILE_REV_REPORT', name: 'Revisorsrapport' },
        { id: 'FILE_OTHER', name: 'Övriga filer' }
      ],
      TODO_STATUS: {
        WAITING:    'WAIT',
        DRAFT:      'DRAFT',
        NOT_DONE:   'NOT',
        DONE:       'DONE',
        CONFIRMED:  'CN',
        DELETED:    'DEL',
        ACCEPTED:   'ACC',
        REJECTED:   'REJ',
        BACKLOG:    'BAC',
        FUTURE:     'FUT',
        INVALID:    'INVALID',
        CLOSE:      'CLOSE'
      },
      form: {
        todo_task_id: '',
        todo_id: '',
        name: '',
        descr: '',
        is_file: 0,
        status: 'DRAFT',
        type: '',
        category: '',
        files: [],
        valid_filetypes: [],
        valid_filtypes: [],
        comments: []
      },
      loaded: false,
      creating: false,
      editing: false,
      send_email: false
    };
  },
  watch: {
    currentCompanyId(newValue, oldvalue) {
      if (newValue) {

      }
    }
  },
  methods: {
    init() {
      this.form = this.task;
      this.selectValidFiletypes();
      this.scrollToEditTask();

      console.log('task', this.form);
    },
    closeTask() {
      this.$emit('closeEditLiveTask');
      this.editing = false;
    },
    async loadData() {
      if (!this.currentCompanyId) {
        return;
      }

    },
    submitTask(e) {
      e.preventDefault();

      this.updateTask();
    },
    updateTask() {
      this.form.valid_filetypes = this.filetypes_options.filter(item => item.value).map(item => item.id);
      
      axios
        .put('/todo_task', this.form)
        .then(res => {
          if (res.status === 200) {
            this.form = res.data.task;
            this.toastr('success', 'OK', 'Ärendet uppdaterades');

            this.$emit('taskUpdated', this.form.todo_task_id);
          }
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte uppdatera ärendet');
        });
      
    },
    selectValidFiletypes() {
      this.filetypes_options.filter((item, index) => {
        const valid = this.form.valid_filtypes.includes(item.id);
        this.filetypes_options[index].value = valid;
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
    scrollToEditTask() {
      var that = this;
      setTimeout(function () {
        const el = that.$el.getElementsByClassName('scroll-to-container')[0];

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
