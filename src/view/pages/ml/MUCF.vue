<template>
  <div class="px-5" id="page-periods">
    <h5 class="mb-6 ml-2">MUCF</h5>
    <AlertBox
      title="Perioder ej hittade"
      message="Några av dina underföreningar saknar vald period. Gå till varje underförening och kontrollera att perioden du försöker köra ifrån finns uppsatt korrekt"
      ref="alertBox"
    />

    <b-card title="" class="mb-2" hide-footer>
      <!--begin: Wizard-->
      <div
        class="wizard wizard-3"
        id="kt_wizard_v3"
        data-wizard-state="step-first"
        data-wizard-clickable="true"
      >
        <!--begin: Wizard Nav -->
        <div class="wizard-nav border-bottom mb-1 mb-lg-5">
          <div class="wizard-steps px-8 py-8 px-lg-15 py-lg-3">
            <div class="wizard-step" data-wizard-type="step" data-wizard-state="current">
              <div class="wizard-label">
                <h3 class="wizard-title"><span>1</span> Introduktion</h3>
                <div class="wizard-bar"></div>
              </div>
            </div>
            <div class="wizard-step" data-wizard-type="step">
              <div class="wizard-label">
                <h3 class="wizard-title"><span>2</span> Sida 3</h3>
                <div class="wizard-bar"></div>
              </div>
            </div>
            <div class="wizard-step" data-wizard-type="step">
              <div class="wizard-label">
                <h3 class="wizard-title"><span>3</span> Sida 4</h3>
                <div class="wizard-bar"></div>
              </div>
            </div>
            <div class="wizard-step" data-wizard-type="step">
              <div class="wizard-label">
                <h3 class="wizard-title"><span>4</span> Sida 5-6</h3>
                <div class="wizard-bar"></div>
              </div>
            </div>
            <div class="wizard-step" data-wizard-type="step">
              <div class="wizard-label">
                <h3 class="wizard-title"><span>5</span> Avslut</h3>
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
                <h4 class="mb-10 font-weight-bold text-dark">Introduktion</h4>
                <!--<div v-if="files_missing">
                  <b-alert show variant="danger"
                    >Det fattas ett antal filer som måste laddas upp innan du kan påbörja MUCF
                    guiden. Se till att följande filer laddas upp under "Att göra"</b-alert
                  >

                  <v-list>
                    <v-list-item v-for="file in files" :key="file.id">
                      <v-list-item-avatar>
                        <v-icon> mdi-minus-circle </v-icon>
                      </v-list-item-avatar>

                      <v-list-item-content>
                        <v-list-item-title v-text="file.name"></v-list-item-title>

                        <v-list-item-subtitle v-text="file.descr"></v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </div>-->
                <b-alert show variant="secondary">Gå till <a href="https://www3.mucf.se/uas/Start.do">https://www3.mucf.se/uas/Start.do</a> och fyll i informationen som visas på sidorna i denna wizard</b-alert>

                <!--<div v-if="!files_missing">
                    <b-alert show variant="success"
                    >Alla filer finns tillgängliga, du kan fortsätta med MUCF guiden</b-alert
                  >
                </div>-->
              </div>
              <!--end: Wizard Step 1-->

              <!--begin: Wizard step 2-->
              <div class="pb-5" data-wizard-type="step-content" data-wizard-state="pending">
                <h4 class="mb-10 font-weight-bold text-dark">
                  Kopiera uppgifterna nedan till MUCF
                </h4>
                <b-form-group id="input-group-bankgiro" label="Bankgiro" label-for="input-bankgiro">
                  <b-form-input
                    id="input-bankgiro"
                    v-model="form.bankgiro"
                    type="text"
                    disabled
                  ></b-form-input>
                </b-form-group>

                <b-form-group id="input-group-plusgiro" label="Plusgiro" label-for="input-plusgiro">
                  <b-form-input
                    id="input-plusgiro"
                    v-model="form.plusgiro"
                    type="text"
                    disabled
                  ></b-form-input>
                </b-form-group>

                <b-form-group
                  id="input-group-grundlaggande"
                  label="Grundläggande villkor"
                  label-for="input-grundlaggande"
                >
                  <b-form-textarea
                    id="input-grundlaggande"
                    v-model="texts.grundlaggande"
                    type="text"
                    disabled
                    rows="5"
                  ></b-form-textarea>
                </b-form-group>

                <b-form-group
                  id="input-group-demokrati"
                  label="Demokrati"
                  label-for="input-demokrati"
                >
                  <b-form-input
                    id="input-demokrati"
                    v-model="texts.demokrati"
                    type="text"
                    disabled
                  ></b-form-input>
                </b-form-group>

                <!--<b-form-group id="input-group-stadgar" label="Stadgar" label-for="input-stadgar">
                  <b-button type="button" variant="success" @click="downloadFile('FILE_STADGAR')"
                    >Ladda ned fil</b-button
                  >
                </b-form-group>-->

                <!--<b-form-group
                  id="input-group-protokoll"
                  label="Protokoll från Årsmötet (Justerat)"
                  label-for="input-protokoll"
                >
                  <b-button
                    type="button"
                    variant="success"
                    @click="downloadFile('FILE_ARSMOTESPROTOKOLL')"
                    >Ladda ned fil</b-button
                  >
                </b-form-group>-->

                <MucfDemographicsTable title="Styrelse" :rows="mucf.directors" />
              </div>
              <!--end: wizard step 2-->

              <!--begin: wizard step 3-->
              <div class="pb-5" data-wizard-type="step-content" data-wizard-state="pending">
                <h4 class="mb-10 font-weight-bold text-dark">
                  Kopiera uppgifterna nedan till MUCF
                </h4>

                <!--<b-form-group
                  id="input-group-revisor1"
                  label="Revisorsgranskning"
                  label-for="input-revisor1"
                >
                  <b-button type="button" variant="success" @click="downloadFile('FILE_REV_REPORT')"
                    >Ladda ned fil</b-button
                  >
                </b-form-group>-->

                <!--<b-form-group
                  id="input-group-revisor2"
                  label="Protokoll med revisor (Medlemsgranskning)"
                  label-for="input-revisor2"
                >
                  <b-button
                    type="button"
                    variant="success"
                    @click="downloadFile('FILE_REV_PROT_MEDLEM')"
                    >Ladda ned fil</b-button
                  >
                </b-form-group>-->

                <b-form-group
                  id="input-group-subcompanies"
                  label="Förteckning över medlemsföreningar"
                  label-for="input-subcompanies"
                >
                  <b-button type="button" variant="success" @click="downloadSubcompanies()"
                    >Generera Fil</b-button
                  >
                </b-form-group>

                <b-form-group
                  id="input-group-num_subcompany"
                  label="Antal bidragsgrundande medlemsföreningar"
                  label-for="input-num_subcompany"
                >
                  <b-form-input
                    id="input-num_subcompany"
                    v-model="form.num_subcompany"
                    type="text"
                    disabled
                    rows="6"
                  ></b-form-input>
                </b-form-group>

                <b-form-group
                  id="input-group-geo"
                  label="Geografisk spridning"
                  label-for="input-geo"
                >
                  <b-form-input
                    id="input-geo"
                    v-model="form.geo"
                    type="text"
                    disabled
                  ></b-form-input>
                </b-form-group>

                <b-list-group class="mb-10">
                  <template v-for="(item, i) in regions">
                    <b-list-group-item v-bind:key="i">{{ item.name }}</b-list-group-item>
                  </template>
                </b-list-group>

                <h6 class="mb-6">Antal medlemmar</h6>

                <b-form-group id="input-group-num6_25" label="6-25 år" label-for="input-num6_25">
                  <b-form-input
                    id="input-num6_25"
                    v-model="form.num6_25"
                    type="text"
                    disabled
                  ></b-form-input>
                </b-form-group>

                <b-form-group id="input-group-numtotal" label="Totalt" label-for="input-numtotal">
                  <b-form-input
                    id="input-numtotal"
                    v-model="form.numtotal"
                    type="text"
                    disabled
                  ></b-form-input>
                </b-form-group>

                <b-form-group id="input-group-numpct" label="Andel" label-for="input-numpct">
                  <b-form-input
                    id="input-numpct"
                    v-model="form.numpct"
                    type="text"
                    disabled
                  ></b-form-input>
                </b-form-group>

                <MucfDemographicsTable title="Medlemmar" :rows="mucf.members" />

                <b-form-group
                  id="input-group-andel"
                  label="Andel medlemmar"
                  label-for="input-andel"
                >
                  <b-form-input
                    id="input-andel"
                    v-model="texts.andel"
                    type="text"
                    disabled
                  ></b-form-input>
                </b-form-group>

                <b-form-group
                  id="input-group-special"
                  label="Särskilda skäl"
                  label-for="input-special"
                >
                  <b-form-textarea
                    id="input-special"
                    v-model="texts.special"
                    type="text"
                    disabled
                    rows="4"
                  ></b-form-textarea>
                </b-form-group>
              </div>
              <!--end: wizard step 3-->

              <!--begin: wizard step 4-->
              <div class="pb-5" data-wizard-type="step-content" data-wizard-state="pending">
                <h4 class="mb-10 font-weight-bold text-dark">
                  Kopiera uppgifterna nedan till MUCF
                </h4>

                <!--<b-form-group
                  id="input-group-verksam1"
                  label="Verksamhetsberättelse"
                  label-for="input-verksam1"
                >
                  <b-button type="button" variant="success" @click="downloadFile('FILE_VERKSAMHET')"
                    >Ladda ned fil</b-button
                  >
                </b-form-group>-->

                <!--<b-form-group
                  id="input-group-ekonomisk"
                  label="Ekonomisk redovisning (Årsredovisning)"
                  label-for="input-ekonomisk"
                >
                  <b-button
                    type="button"
                    variant="success"
                    @click="downloadFile('FILE_EKONOMISKREDOVISNING')"
                    >Ladda ned fil</b-button
                  >
                </b-form-group>-->

                <!--<b-form-group
                  id="input-group-revisor3"
                  label="Protokoll med revisor (Ekonomi)"
                  label-for="input-revisor3"
                >
                  <b-button
                    type="button"
                    variant="success"
                    @click="downloadFile('FILE_REV_PROT_EKONOMI')"
                    >Generera Fil</b-button
                  >
                </b-form-group>-->

                <b-form-group
                  id="input-group-prevyear"
                  label="Redovisning av organisationsbidraget föregående år"
                  label-for="input-prevyear"
                >
                  <b-form-textarea
                    id="input-prevyear"
                    v-model="texts.prevyear"
                    type="text"
                    disabled
                    rows="8"
                  ></b-form-textarea>
                </b-form-group>

                <b-form-group
                  id="input-group-betydelse"
                  label="Beskrivning av bidragets betydelse och effekter"
                  label-for="input-betydelse"
                >
                  <b-form-textarea
                    id="input-betydelse"
                    v-model="texts.betydelse"
                    type="text"
                    disabled
                    rows="5"
                  ></b-form-textarea>
                </b-form-group>

                <b-form-group
                  id="input-group-ovrigt"
                  label="Övriga uppgifter"
                  label-for="input-ovrigt"
                >
                  <b-form-textarea
                    id="input-ovrigt"
                    v-model="texts.ovrigt"
                    type="text"
                    disabled
                    rows="8"
                  ></b-form-textarea>
                </b-form-group>
              </div>
              <!--end: wizard step 4-->

              <!--begin: wizard step 5-->
              <div class="pb-5" data-wizard-type="step-content" data-wizard-state="pending">
                <b-alert show variant="success"
                  ><strong>Klart!</strong><br />Nu kan du lämna in ansökan</b-alert
                >
              </div>
              <!--end: wizard step 5-->

              <!--begin: Wizard Actions -->
              <div class="d-flex justify-content-between border-top pt-10">
                <div class="mr-2">
                  <button
                    class="btn btn-light-primary font-weight-bold text-uppercase px-9 py-4"
                    data-wizard-type="action-prev"
                  >
                    Föregående
                  </button>
                </div>
                <div>
                  <button
                    v-on:click="submit"
                    class="btn btn-success font-weight-bold text-uppercase px-9 py-4"
                    data-wizard-type="action-submit"
                  >
                    Klart!
                  </button>
                  <button
                    class="btn btn-primary font-weight-bold text-uppercase px-9 py-4"
                    data-wizard-type="action-next"
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
import MucfDemographicsTable from '@/view/pages/ml/mucf/MucfDemographicsTable.vue';
import KTUtil from '@/assets/js/components/util';
import KTWizard from '@/assets/js/components/wizard';

import AlertBox from '@/view/components/AlertBox.vue';

export default {
  name: 'mucf',
  components: {
    MucfDemographicsTable,
    AlertBox
  },
  computed: {
    ...mapGetters(['currentCompanyId', 'currentPeriodId'])
  },
  mounted() {
    // Initialize form wizard
    const wizard = new KTWizard('kt_wizard_v3', {
      startStep: 1, // initial active step number
      clickableSteps: true // allow step clicking
    });

    // Validation before going to next page
    wizard.on('beforeNext', function (/*wizardObj*/) {
      // validate the form and use below function to stop the wizard's step
      // wizardObj.stop();
    });

    // Change event
    wizard.on('change', function (/*wizardObj*/) {
      setTimeout(() => {
        KTUtil.scrollTop();
      }, 500);
    });

    this.loadData();
  },
  data() {
    return {
      regions: [
        { id: 0, name: 'Stockholm' },
        { id: 1, name: 'Västra götaland' }
      ],
      texts: {
        grundlaggande:
          'För att föreningen ska kunna bli godkänd för organisationsstöd behöver ni uppfylla alla grundläggande villkor i enlighet med MUCF. \n\nMarkera alla radioboxar med "Stämmer"',
        demokrati: 'Lämna detta fält blankt',
        andel: 'Markera Ja',
        special:
          'I sällsynta fall kan myndigheten göra undantag från vissa bidragskrav som rör minsta antal medlemmar och geografisk spridning.',
        prevyear:
          'Det här blocket behöver du bara fylla i om din organisation fick ett organisationsbidrag från myndigheten förra året.\n\nBidraget ska spenderas det år det är avsett för. Har ni pengar över ska de betalas tillbaka. Vi kan dock godkänna att ni använt en del av förra årets bidrag i januari i år för att betala till exempel hyra och löner, innan årets bidrag kom.',
        betydelse:
          'Era svar på de här frågorna hjälper oss beskriva bidragets betydelse och effekter för regeringen och i andra sammanhang.',
        ovrigt:
          'Organisationsbidraget fördelas i två former. En del av bidraget går till barn- och ungdomsorganisationer och en till stöd för barn- och ungdomsorganisationernas medlemsföreningar. Den senare ska komma organisationens medlemsföreningars ordinarie och långsiktiga lokala verksamhet till del.\n\nAnsöker ni om bidragsdelen till stöd för era medlemsföreningar, har ni särskilt resurskrävande verksamhet eller får annat statligt bidrag. Svara då på myndighetens frågor.'
      },
      form: {
        bankgiro: '211-1111',
        plusgiro: '111-1111',

        num_subcompany: 0,
        geo: 0,

        numpct: 0,
        numtotal: 0,
        num6_25: 0
      },
      files_missing: true,
      files: [
        { id: 0, name: 'Årsredovisning 2019' },
        { id: 1, name: 'Stadgar 2019' }
      ],
      mucf: {},
      companies: {
        id: {
          directors: { '6-12': {} },
          members: { '6-12': {} }
        }
      }
    };
  },
  watch: {
    currentCompanyId(newValue, oldvalue) {
      if (newValue) {
        this.loadData();
      }
    },
    currentPeriodId(newValue, oldValue) {
      if (newValue) {
        this.loadData();
      }
    }
  },
  methods: {
    submit() {},
    loadFiles() {
      this.files = [];

      axios
        .get(`/file/mucf?period_id=${this.currentPeriodId}&company_id=${this.currentCompanyId}`)
        .then(res => {
          this.files = [];

          this.files_missing = false;

          for (var i = 0; i < this.files.length; ++i) {
            if (this.files[i].missing) {
              this.files_missing = true;
              this.files.push(res.data.files[i]);
            }
          }
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte hämta MUCF filer');
        });
    },
    downloadFile(filename) {},
    downloadSubcompanies() {
      axios
        .get(
          `/company/mucf_report?period_id=${this.currentPeriodId}&company_id=${this.currentCompanyId}`
        )
        .then(res => {
          location.href = res.data.file.public_path;
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte generera fil');
        });
    },
    async loadData() {
      if (!this.currentCompanyId) {
        return;
      }
      if (!this.currentPeriodId) {
        return;
      }

      this.loadFiles();
      this.loadMucf();
      this.loadGeo();
      this.loadDirectors();
    },
    loadGeo() {
      axios
        .get(`/company/mucf_geo?company_id=${this.currentCompanyId}`)
        .then(res => {
          if (res.status === 200) {
            this.regions = res.data.regions;
            this.form.geo = this.regions.length;
          }
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte hämta geografisk spridning');
        });
    },
    loadDirectors() {
      axios
        .get(`/company/top_mucf_directors?company_id=${this.currentCompanyId}`)
        .then(res => {
          if (res.status === 200) {
            var mucf = { companies: {} };
            mucf.companies[this.currentCompanyId] = { directors: res.data.mucf.directors };

            this.setMucfData(mucf, 'directors');
          }
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte hämta MUCF data');
        });
    },
    loadMucf() {
      axios
        .get(`/company/mucf?company_id=${this.currentCompanyId}&period_id=${this.currentPeriodId}`)
        .then(res => {
          if (res.status === 200) {
            this.setMucfData(res.data.mucf, 'members');
          }
          else if (res.status === 404) {
            this.$refs['alertBox'].show();
          }
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte hämta MUCF data');
        });
    },
    setMucfData(mucf, type) {
      
      
      if (type === 'members') {
        this.form.numpct = 0;
        this.form.numtotal = 0;
        this.form.num6_25 = 0;
      }

      var fl = {
        '6-12': 0,
        '13-18': 1,
        '19-25': 2,
        unknown_max_25: 3,
        sum_6_25: 4,
        pct_6_25: 5,
        '>25': 6,
        sum_all: 7,
        pct_all: 8
      };

      this.mucf[type] = [];

      this.mucf[type].push({
        id: '6-12',
        titlename: '6-12 år',
        num_male: 0,
        num_female: 0,
        num_other: 0,
        num_missing_info: 0,
        num_total: 0
      });
      this.mucf[type].push({
        id: '13-18',
        titlename: '13-18 år',
        num_male: 0,
        num_female: 0,
        num_other: 0,
        num_missing_info: 0,
        num_total: 0
      });
      this.mucf[type].push({
        id: '19-25',
        titlename: '19-25 år',
        num_male: 0,
        num_female: 0,
        num_other: 0,
        num_missing_info: 0,
        num_total: 0
      });
      this.mucf[type].push({
        id: 'unknown_max_25',
        titlename: 'Okänd ålder (Max 25 år)',
        num_male: 0,
        num_female: 0,
        num_other: 0,
        num_missing_info: 0,
        num_total: 0
      });
      this.mucf[type].push({
        id: 'sum_6_25',
        titlename: 'Summa 6-25 år antal',
        num_male: 0,
        num_female: 0,
        num_other: 0,
        num_missing_info: 0,
        num_total: 0
      });
      this.mucf[type].push({
        id: 'pct_6_25',
        titlename: 'Summa 6-25 år, andel %',
        num_male: 0,
        num_female: 0,
        num_other: 0,
        num_missing_info: 0,
        num_total: 0
      });
      this.mucf[type].push({
        id: '>25',
        titlename: 'Övriga åldrar',
        num_male: 0,
        num_female: 0,
        num_other: 0,
        num_missing_info: 0,
        num_total: 0
      });
      this.mucf[type].push({
        id: 'sum_all',
        titlename: 'Summa samtliga, antal',
        num_male: 0,
        num_female: 0,
        num_other: 0,
        num_missing_info: 0,
        num_total: 0
      });
      this.mucf[type].push({
        id: 'pct_all',
        titlename: 'Summa samtliga, andel (%)',
        num_male: 0,
        num_female: 0,
        num_other: 0,
        num_missing_info: 0,
        num_total: 0
      });


      for (var k in mucf.companies) {
        var comp = mucf.companies[k];

        // sum all the companies together
        for (var r in comp[type]) {
          this.mucf[type][fl[r]].num_male += comp[type][r].num_male;
          this.mucf[type][fl[r]].num_female += comp[type][r].num_female;
          this.mucf[type][fl[r]].num_other += comp[type][r].num_other;
          this.mucf[type][fl[r]].num_missing_info += comp[type][r].num_missing_info;
          this.mucf[type][fl[r]].num_total += comp[type][r].num_total;

          if (type === 'members') {
            this.form.numtotal += comp[type][r].num_total;
          }
        }
      }

      var fll2 = { '6-12': 0, '13-18': 1, '19-25': 2, unknown_max_25: 3 };

      // calculate the sums

      for (var l in fll2) {
        this.mucf[type][fl['sum_6_25']].num_male += this.mucf[type][fll2[l]].num_male;
        this.mucf[type][fl['sum_6_25']].num_female += this.mucf[type][fll2[l]].num_female;
        this.mucf[type][fl['sum_6_25']].num_other += this.mucf[type][fll2[l]].num_other;
        this.mucf[type][fl['sum_6_25']].num_missing_info += this.mucf[type][fll2[l]].num_missing_info;
        this.mucf[type][fl['sum_6_25']].num_total += this.mucf[type][fll2[l]].num_total;

        if (type === 'members') {
          this.form.num6_25 += this.mucf[type][fll2[l]].num_total;
        }

        this.mucf[type][fl['sum_all']].num_male += this.mucf[type][fll2[l]].num_male;
        this.mucf[type][fl['sum_all']].num_female += this.mucf[type][fll2[l]].num_female;
        this.mucf[type][fl['sum_all']].num_other += this.mucf[type][fll2[l]].num_other;
        this.mucf[type][fl['sum_all']].num_missing_info += this.mucf[type][
          fll2[l]
        ].num_missing_info;
        this.mucf[type][fl['sum_all']].num_total += this.mucf[type][fll2[l]].num_total;
      }

      this.mucf[type][fl['sum_all']].num_male += this.mucf[type][fl['>25']].num_male;
      this.mucf[type][fl['sum_all']].num_female += this.mucf[type][fl['>25']].num_female;
      this.mucf[type][fl['sum_all']].num_other += this.mucf[type][fl['>25']].num_other;
      this.mucf[type][fl['sum_all']].num_missing_info += this.mucf[type][
        fl['>25']
      ].num_missing_info;
      this.mucf[type][fl['sum_all']].num_total += this.mucf[type][fl['>25']].num_total;

      // calculate the percentages

      if (this.mucf[type][fl['sum_6_25']].num_total === 0) {
        this.mucf[type][fl['pct_6_25']].num_male = 0;
        this.mucf[type][fl['pct_6_25']].num_female = 0;
        this.mucf[type][fl['pct_6_25']].num_other = 0;
        this.mucf[type][fl['pct_6_25']].num_missing_info = 0;
        this.mucf[type][fl['pct_6_25']].num_total = 0;
      } else {
        this.mucf[type][fl['pct_6_25']].num_male = Math.round(
          (this.mucf[type][fl['sum_6_25']].num_male /
            this.mucf[type][fl['sum_6_25']].num_total) *
            100
        );
        this.mucf[type][fl['pct_6_25']].num_female = Math.round(
          (this.mucf[type][fl['sum_6_25']].num_female /
            this.mucf[type][fl['sum_6_25']].num_total) *
            100
        );
        this.mucf[type][fl['pct_6_25']].num_other = Math.round(
          (this.mucf[type][fl['sum_6_25']].num_other /
            this.mucf[type][fl['sum_6_25']].num_total) *
            100
        );
        this.mucf[type][fl['pct_6_25']].num_missing_info = Math.round(
          (this.mucf[type][fl['sum_6_25']].num_missing_info /
            this.mucf[type][fl['sum_6_25']].num_total) *
            100
        );
        this.mucf[type][fl['pct_6_25']].num_total = Math.round(
          (this.mucf[type][fl['sum_6_25']].num_total /
            this.mucf[type][fl['sum_6_25']].num_total) *
            100
        );
      }


      if (this.mucf[type][fl['sum_all']].num_total === 0) {
        this.mucf[type][fl['pct_all']].num_male = 0;
        this.mucf[type][fl['pct_all']].num_female = 0;
        this.mucf[type][fl['pct_all']].num_other = 0;
        this.mucf[type][fl['pct_all']].num_missing_info = 0;
        this.mucf[type][fl['pct_all']].num_total = 0;
      } else {
        this.mucf[type][fl['pct_all']].num_male = Math.round(
          (this.mucf[type][fl['sum_all']].num_male /
            this.mucf[type][fl['sum_all']].num_total) *
            100
        );
        this.mucf[type][fl['pct_all']].num_female = Math.round(
          (this.mucf[type][fl['sum_all']].num_female /
            this.mucf[type][fl['sum_all']].num_total) *
            100
        );
        this.mucf[type][fl['pct_all']].num_other = Math.round(
          (this.mucf[type][fl['sum_all']].num_other /
            this.mucf[type][fl['sum_all']].num_total) *
            100
        );
        this.mucf[type][fl['pct_all']].num_missing_info = Math.round(
          (this.mucf[type][fl['sum_all']].num_missing_info /
            this.mucf[type][fl['sum_all']].num_total) *
            100
        );
        this.mucf[type][fl['pct_all']].num_total = Math.round(
          (this.mucf[type][fl['sum_all']].num_total /
            this.mucf[type][fl['sum_all']].num_total) *
            100
        );
      }

      if (type === 'members') {
        if (this.form.numtotal > 0) {
          this.form.numpct = (
            
            Math.round( ( (this.form.num6_25 / this.form.numtotal) * 10000) ) 
            
            / 100 ) + ' %';
        }
        else {
          this.form.numpct = '0 %';
        }
      }

      console.log(this.mucf);
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
