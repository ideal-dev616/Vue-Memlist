<template>
  <div class="px-5" id="page-periods">
    <h5 class="mb-6 ml-2">Import av medlemmar</h5>
    <b-card title="" class="mb-2" hide-footer>
      <!--begin: Wizard-->
      <div
        class="wizard wizard-3"
        id="kt_wizard_v3"
        data-wizard-state="step-first"
        data-wizard-clickable="false"
      >
        <!--begin: Wizard Nav -->
        <div class="wizard-nav border-bottom mb-1 mb-lg-5">
          <div class="wizard-steps px-8 py-8 px-lg-15 py-lg-3">
            <div class="wizard-step" data-wizard-type="step" data-wizard-state="current">
              <div class="wizard-label">
                <h3 class="wizard-title"><span>1</span> Ladda upp fil</h3>
                <div class="wizard-bar"></div>
              </div>
            </div>
            <div class="wizard-step" data-wizard-type="step">
              <div class="wizard-label">
                <h3 class="wizard-title"><span>2</span> Mappa Databas</h3>
                <div class="wizard-bar"></div>
              </div>
            </div>
            <div class="wizard-step" data-wizard-type="step">
              <div class="wizard-label">
                <h3 class="wizard-title"><span>3</span> Kontrollera</h3>
                <div class="wizard-bar"></div>
              </div>
            </div>
            <div class="wizard-step" data-wizard-type="step">
              <div class="wizard-label">
                <h3 class="wizard-title"><span>4</span> Import</h3>
                <div class="wizard-bar"></div>
              </div>
            </div>
          </div>
        </div>
        <!--end: Wizard Nav -->

        <!--begin: Wizard Body-->
        <div class="row justify-content-center py-12 px-8 py-lg-15 px-lg-10">
          <div class="col-xl-12 col-xxl-7">
            <!--begin: Wizard Form-->
            <form class="form" id="kt_form">
              <!--begin: Wizard Step 1-->
              <div class="pb-5" data-wizard-type="step-content" data-wizard-state="current">
                <h4 class="mb-10 font-weight-bold text-dark">Excel fil över föreningar</h4>

                <div class="mb-8">
                  <p>Hur hanteras landskoder i importen?</p>
                  <b-button type="button" variant="primary" @click="showCountryGuide">Visa landguiden</b-button>
                </div>
                <b-card v-if="displayCountryGuide">
                  <b-alert show variant="secondary"
                    >En kolumn som mappas som "Land" måste följa kodstandarden för landskoder enligt tabellen nedan. Fält där landskod saknas kommer att automatiskt mappa till Sverige.</b-alert
                  >

                  <div class="table-responsive">
                    <table
                      class="table table-head-custom table-vertical-center table-head-bg table-borderless"
                    >
                      <tbody>
                        <tr style="background-color: black; color: white;">
                            <td>Kod</td>
                            <td>Land</td>
                        </tr>
                        <template v-for="(item, i) in countries">
                          <tr v-bind:key="i">
                            <td>{{ item.iso }}</td>
                            <td>{{ item.sv }}</td>
                          </tr>
                        </template>
                      </tbody>
                    </table>
                  </div>
                </b-card>
                <div>
                  <b-alert show variant="secondary"
                    >Ladda upp ett register över föreningar i <strong>XLSX</strong> format. Ifall filen är
                    CSV eller XLS (Excel 97) format så måste filen sparas som XLSX format från
                    Excel.</b-alert
                  >

                  <input hidden type="file" id="file" ref="file" v-on:change="handleFileUpload()" accept=".xlsx" />

                  <b-button type="button" variant="success" @click="selectFile()"
                    >Ladda upp föreningsregister</b-button
                  >
                </div>
                <div v-if="file_error" class="mt-4">
                  <b-alert show variant="danger"
                    >Filen är ogiltig, kontrollera att filen är i XLSX format</b-alert
                  >
                </div>
              </div>
              <!--end: Wizard Step 1-->

              <!--begin: Wizard step 2-->
              <div class="pb-5" data-wizard-type="step-content" data-wizard-state="pending">
                <h4 class="mb-10 font-weight-bold text-dark">Kontrollera importfälten</h4>

                <div class="list-selects">
                  <div class="table-responsive">
                    <table
                      class="table table-head-custom table-vertical-center table-head-bg table-borderless"
                    >
                      <thead>
                        <tr class="text-left">
                          <th style="min-width: 40px">
                            <span class="text-dark-75">Kolumn</span>
                          </th>
                          <th>Excel fält</th>
                          <th>Memlist fält</th>
                        </tr>
                      </thead>
                      <tbody ref="colDefRows">
                        <ImportColDefRow
                          v-for="item in column_def.mapped_columns"
                          ref="importColDefRows"
                          :key="item.id"
                          :mappedColumn="item"
                          :currentCompanyId="currentCompanyId"
                          :dbColumnOptions="dbColumnOptions"
                          @coldefSelected="coldefSelected"
                          @toastr="toastr"
                        />
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <!--end: wizard step 2-->

              <!--begin: wizard step 4-->
              <div class="pb-5" data-wizard-type="step-content" data-wizard-state="pending">
                
                <ImportConfirmPage
                  ref="importConfirmPage"
                  datatype="companies"
                  :file_id="file_id"
                  :mapped_columns="column_def.mapped_columns"
                  :startImport="startImport"
                  :importFailed="importFailed"
                  :importFinalized="importFinalized"
                  @finalizeReady="finalizeReady"
                  @setImportId="setImportId"
                 />
              </div>
              <!--end: wizard step 4-->

              <!--begin: wizard step 5-->
              <div class="pb-5" data-wizard-type="step-content" data-wizard-state="pending">
                <h4 class="mb-10 font-weight-bold text-dark">Importerar</h4>

                <ImportFinalizePage
                  :import_id="import_id"
                  :import_option="import_option"
                  :doFinalize="doFinalize"
                />
              </div>
              <!--end: wizard step 5-->

              <!--begin: Wizard Actions -->
              <div class="d-flex justify-content-between border-top pt-10">
                <div class="mr-2">
                  <button
                    class="btn btn-light-primary font-weight-bold text-uppercase px-9 py-4"
                    data-wizard-type="action-prev"
                    v-if="!lastPage"
                  >
                    Föregående
                  </button>
                </div>
                <div>
                  <button
                    class="btn btn-primary font-weight-bold text-uppercase px-9 py-4"
                    data-wizard-type="action-next"
                    v-on:click="nextPage"
                    ref="btnContinue"
                    v-if="showNext"
                  >
                    Nästa steg
                  </button>
                </div>
              </div>
              <!--end: Wizard Actions -->
            </form>
          </div>
        </div>
      </div>
    </b-card>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/sass/pages/wizard/wizard-3.scss';

.checkbox.checkbox-light-success > span {
  background-color: white;
  border: 1px solid #ddd;
}
</style>

<script>
import axios from 'axios';
import { mapGetters } from 'vuex';
import ImportColDefRow from '@/view/pages/ml/import/ImportColDefRow.vue';
import ImportConfirmPage from '@/view/pages/ml/import/ImportConfirmPage.vue';
import ImportFinalizePage from '@/view/pages/ml/import/ImportFinalizePage.vue';

import KTUtil from '@/assets/js/components/util';
import KTWizard from '@/assets/js/components/wizard';

export default {
  name: 'import',
  components: {
    ImportColDefRow,
    ImportConfirmPage,
    ImportFinalizePage
  },
  computed: {
    ...mapGetters(['currentCompanyId', 'currentPeriodId', 'periods'])
  },
  mounted() {
    this.setPeriodName();

    var that = this;
    this.showNext = true;

    // Initialize form wizard
    this.wizard = new KTWizard('kt_wizard_v3', {
      startStep: 1, // initial active step number
      clickableSteps: true // allow step clicking
    });

    // Validation before going to next page
    this.wizard.on('beforeNext', function (/*wizardObj*/) {
      // validate the form and use below function to stop the wizard's step
      // wizardObj.stop();
    });

    // Change event
    this.wizard.on('change', function (/*wizardObj*/) {
      setTimeout(() => {
        KTUtil.scrollTop();

        that.currentPage = that.wizard.currentStep;

        console.log('page change: ');
        console.log(that.currentPage);

        if (that.currentPage === 2 || that.currentPage === 3) {
          that.showNext = true;
        }
      }, 200);
    });

    this.loadData();

    this.showNext = false;
  },
  data() {
    return {
      lastPage: false,
      displayCountryGuide: false,
      countries: [],
      showNext: true,
      currentPage: 0,
      file_error: false,
      dbColumnOptions: [],
      wizard: null,
      import_option: null,
      column_def: {
        import_id: '',
        file_id: '31',
        mapped_columns: [
          {
            id: 'aa',
            db: {
              col_name: 'rdt',
              lang_text: 'registrering',
              attr: false
            },
            excel: {
              col: 0,
              name: 'Registreringsdatum'
            },
            values: ['2018-01-19 01:30:00']
          },
          {
            id: 'bb',
            db: {
              col_name: 'firstname',
              lang_text: 'Förnamn',
              attr: false
            },
            excel: {
              col: 1,
              name: 'Förnamn'
            },
            values: ['Jakob']
          }
        ]
      },
      type_def: {
        table_name: 'ml_company',
        table_pk_name: 'company_id',
        columns: [
          {
            col_name: 'skip',
            variation_lang_records: [],
            valtype: '',
            special: false,
            func: '',
            max_length: 0,
            variations: [],
            entity: 'company',
            lang_record: {
              deleted: 0,
              lang_record_id: 'CLIENT_SKIP',
              page_name: 'ml_header.html',
              lang_text: [
                {
                  lang: 'sv',
                  text: 'Hoppa över'
                },
                {
                  lang: 'en',
                  text: ''
                }
              ]
            },
            exclude: []
          },
          {
            col_name: 'public_id',
            variation_lang_records: [
              {
                deleted: 0,
                lang_record_id: 'CLIENT_MEDLEMSNUMMER',
                page_name: 'all',
                lang_text: [
                  {
                    lang: 'sv',
                    text: 'Medlemsnummer'
                  },
                  {
                    lang: 'en',
                    text: 'Member number'
                  }
                ]
              },
              {
                deleted: 0,
                lang_record_id: 'CLIENT_KUNDNUMMER',
                page_name: 'all',
                lang_text: [
                  {
                    lang: 'sv',
                    text: 'Kundnummer'
                  },
                  {
                    lang: 'en',
                    text: 'Customer number'
                  }
                ]
              }
            ],
            valtype: 'string',
            special: false,
            func: '',
            max_length: 512,
            variations: ['medlemsnummer', 'kundnummer'],
            entity: 'company',
            lang_record: {
              deleted: 0,
              lang_record_id: 'CLIENT_PUBLIC_ID',
              page_name: 'all',
              lang_text: [
                {
                  lang: 'sv',
                  text: 'Medlemsnummer'
                },
                {
                  lang: 'en',
                  text: ''
                }
              ]
            },
            exclude: ['tfn', 'tel']
          }
        ]
      },
      requirements: {
        personnr: false,
        ssn: false,
        phone: false,
        email: false,
        address: false,
        fullname: false,
        emailorphone: false,
        sex: false,
        age: false
      },
      periodName: '',
      poll: false,
      import_id: '',
      startImport: false,
      file_id: '',
      doFinalize: false
    };
  },
  watch: {
    currentPage(newValue, oldValue) {
      console.log('current page change: ' + newValue);

      if (newValue === 4) {
        this.startImport = true;
        this.showNext = false;
      }
    },
    currentCompanyId(newValue, oldvalue) {
      if (newValue) {
        this.loadData();
      }
    },
    currentPeriodId(newValue, oldValue) {
      if (newValue) {
        this.loadData();
        this.setPeriodName();
      }
    }
  },
  methods: {
    loadCountries() {
      axios
        .get('/location/countries')
        .then(res => {
          this.countries = res.data.countries;
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Fel', 'Kunde inte hämta lista på länder');
        });
    },
    handleFileUpload() {
      this.file = this.$refs.file.files[0];

      this.uploadFile();
    },
    selectFile() {
      console.log('click')
      this.$refs.file.click();
    },
    uploadFile() {
      let formData = new FormData();
      formData.append('file', this.file);

      formData.append('file_source', 'files');
      formData.append('file_type', 'IMPORT_MEMBERS');
      formData.append('company_id', this.currentCompanyId);
      formData.append('period_id', this.currentPeriodId);

      axios
        .post('/fileupload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then(res => {
          //this.toastr('success', 'OK', 'Filen laddades upp');

          this.file_id = res.data.fileobjs[0].file_id;

          this.readColumnDefFromFile(this.file_id);


        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte ladda upp fil');
        });
    },
    setPeriodName() {
      for (var i = 0; i < this.periods.length; ++i) {
        if (this.periods[i].id === this.currentPeriodId) {
          this.periodName = this.periods[i].name;
          return;
        }
      }
    },
    showCountryGuide() {
      this.loadCountries();

      this.displayCountryGuide = !this.displayCountryGuide;
    },
    nextPage(e) {
      e.preventDefault();

      this.wizard.goNext();

      console.log('next page: ');
      console.log(this.wizard.getStep());

      if (this.wizard.getStep() === 3) {
        this.showNext = false;
        this.startImport = true;
      }

      // when we have clicked next to the final page, we need to tell the component to do the finalize import step
      if (this.wizard.getStep() === 4) {
        this.doFinalize = true;
        this.lastPage = true;
      }
    },
    submit() {},
    async loadData() {
      if (!this.currentCompanyId) {
        return;
      }
      if (!this.currentPeriodId) {
        return;
      }

      this.setDbColDefOptions();
    },
    readColumnDefFromFile(file_id) {
      axios
        .get(`/import/read_column_defs?type=companies&file_id=${file_id}`)
        .then(res => {
          if (res.status === 200) {
            //this.requirements = res.data.requirements;
            this.type_def = res.data.type_def;
            this.column_def = res.data.column_def;

            this.wizard.goNext();

            this.setDbColDefOptions();
            this.setMappingRedRows();
          }
          else if (res.status === 409) {
            this.toastr('danger', 'Fel', res.data.message, 10000);
          }
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte tolka filen');
        });
    },
    setMappingRedRows() {
      var dups = false;
      // we set duplicate rows as red
      for (var i = 0; i < this.column_def.mapped_columns.length; ++i) {
        var mc1 = this.column_def.mapped_columns[i];
        mc1.duplicate = false;
      }

      for (var i = 0; i < this.column_def.mapped_columns.length; ++i) {
        var mc1 = this.column_def.mapped_columns[i];

        if (mc1.db.col_name === 'skip') {
          continue;
        }

        for (var j = 0; j < this.column_def.mapped_columns.length; ++j) {
          if (i === j) {
            continue;
          }

          var mc2 = this.column_def.mapped_columns[j];

          if (mc1.db.col_name === mc2.db.col_name) {
            mc1.duplicate = true;
            dups = true;
          }
        }
      }

      this.showNext = !dups;

      this.refreshMappingKeys();
    },
    getLangText(lang_text, lang) {
      for (var i = 0; i < lang_text.length; ++i) {
        if (lang_text[i].lang === lang) {
          return lang_text[i].text;
        }
      }

      return 'Språköversättning saknas';
    },
    setDbColDefOptions() {
      this.dbColumnOptions = [];

      for (var i = 0; i < this.type_def.columns.length; ++i) {
        this.dbColumnOptions.push({
          value: this.type_def.columns[i].col_name,
          text: this.getLangText(this.type_def.columns[i].lang_record.lang_text, 'sv')
        });
      }
    },
    coldefSelected(coldef) {
      this.setMappingRedRows();
    },
    refreshMappingKeys() {
      for (var i = 0; i < this.column_def.mapped_columns.length; ++i) {
        this.column_def.mapped_columns[i].id = this.randomstr(8);
      }

      for (var i = 0; i < this.$refs.importColDefRows.length; ++i) {
        this.$refs.importColDefRows[i].updateComponent();
      }
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
    setImportId(import_id) {
      console.log('import id set: ' + this.import_id);
      this.import_id = import_id;
    },
    finalizeReady(import_option) {
      this.showNext = true;
      this.import_option = import_option;
    },
    importFinalized() {
      this.$refs.btnContinue.click();
    },
    importFailed() {
      this.$refs.btnContinue.click();
    },
    toastr(type, title, message, autohide = 2000) {
      this.$bvToast.toast(message, {
        title: title,
        autoHideDelay: autohide,
        appendToast: true,
        variant: type
      });
    }
  }
};
</script>
