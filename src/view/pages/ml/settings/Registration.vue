<template>
  <div class="px-5 mt-8" id="page-registration">
    <b-row>
      <b-col lg="2"></b-col>
      <b-col lg="8">
        <b-form class="mt-8" @submit="saveData">

          <b-card class="mb-8">
              <h4 class="mb-8">Registreringsregler</h4>

              <div class="radio-list">
                <label class="radio radio-outline radio-success mr-5">
                  <input type="radio" v-model="selectedRegistrationOption" value="mapped" name="selectedRegistrationOption">
                  <span class='mr-2'></span>Områdestilldela relevant förening
                </label>
                
                <label class="radio radio-outline radio-success mr-5">
                  <input type="radio" v-model="selectedRegistrationOption" value="multiple" name="selectedRegistrationOption">
                  <span class='mr-2'></span>Flerstegsregistreringsfunktion
                </label>
                
                <label class="radio radio-outline radio-success mr-5">
                  <input type="radio" v-model="selectedRegistrationOption" value="simple" name="selectedRegistrationOption" checked="checked">
                  <span class='mr-2'></span>Medlemmar kan endast registrera sig i denna förening
                </label>
                
              </div>

           </b-card>

          <b-card title="" class="mb-2 mx-auto mt-8" hide-footer>
            <h4 class="mb-8">Målsman och familjemedlemmar</h4>
            <b-alert show variant="light">
              Enligt huvudregel, 9 kap. 1 § Föräldrabalken skall föreningar som ställer ekonomiska
              krav på en medlem (t.ex. medlemsavgift), kräva målsmans godkännande ifall person är
              över {{ registration.age_max_parent }} år.
            </b-alert>

            <div class="d-flex align-items-center mb-6">
              <b-input-group class="mb-2">
                <b-input-group-prepend is-text
                >Max ålder med krav på målsman</b-input-group-prepend
                >
                <b-form-input
                        type="number"
                        min="1"
                        max="200"
                        v-model="registration.age_max_parent"
                        required
                ></b-form-input>
              </b-input-group>
            </div>

            <div class="d-flex align-items-center mb-6">
              <b-input-group class="mb-2">
                <b-input-group-prepend is-text>

                <div class="d-flex align-items-center">
                <label
                        class="checkbox checkbox-lg checkbox-outline checkbox-success"
                >
                  <input
                    type="checkbox"
                    v-model="check_join[0]"
                  />
                  <span></span>
                </label>

                <span class="ml-3 cursor-pointer"></span>
              </div>


                </b-input-group-prepend>
                <b-input-group-prepend is-text
                >Person måste vara minst ålder</b-input-group-prepend
                >
                <b-form-input
                    style="min-height: 50px;"
                        type="number"
                        max="200"
                        v-model="registration.age_req_all[0]"
                        :disabled="!check_join[0]"
                ></b-form-input>
              </b-input-group>
            </div>

            <div class="d-flex align-items-center mb-6">
              <b-input-group class="mb-2">
                <b-input-group-prepend is-text>
                   <div class="d-flex align-items-center">
                <label
                        class="checkbox checkbox-lg checkbox-outline checkbox-success"
                >
                  <input
                    type="checkbox"
                    v-model="check_join[1]"
                  />
                  <span></span>
                </label>

                <span class="ml-3 cursor-pointer"></span>
              </div>

                </b-input-group-prepend>
                <b-input-group-prepend is-text
                >Person måste vara högst ålder</b-input-group-prepend
                >
                <b-form-input
                        style="min-height: 50px;"
                        type="number"
                        min="18"
                        max="200"
                        v-model="registration.age_req_all[1]"
                        :disabled="!check_join[1]"
                ></b-form-input>
              </b-input-group>
            </div>

            <div class="d-flex align-items-center mb-6">
              <label
                      class="checkbox checkbox-lg checkbox-outline checkbox-success"
              >
                <input
                        type="checkbox"
                        name=""
                        v-model="registration.family"
                        @click="
                    registration.family = !registration.family
                  "
                />
                <span></span>
              </label>
              <span class="ml-3 cursor-pointer">Tillåt familjeregistrering</span>
            </div>

            <b-alert show variant="light"
            >Vad ska hända med målsmandata vid registrering? Ifall nedanstående checkbox är
              förkryssad så kommer målsman som fylls i vid registrering att skapas och läggas till
              som äkta medlemmar, med egna konton. Ifall checkboxen EJ är förkryssad så kommer
              målsman endast att ligga sparade på medlemmen och ej vara sökbara.</b-alert
            >

            <div class="d-flex align-items-center mb-6">
              <label
                      class="checkbox checkbox-lg checkbox-outline checkbox-success"
              >
                <input
                        type="checkbox"
                        name=""
                        v-model="registration.create_parent_members"
                        @click="
                    registration.create_parent_members = !registration.create_parent_members
                  "
                />
                <span></span>
              </label>
              <span class="ml-3 cursor-pointer">Skapa äkta medlemmar av målsman och familjemedlemmar</span>
            </div>
          </b-card>

          <b-card class="mb-8">
              <h4 class="mb-8">Valbar vid medlemsregistrering</h4>

            <b-alert show variant="light">
              När en medlem registrerar sig på registreringssidan så kommer denna förening att listas som alternativ ifall checkboxen är markerad. Observera att åldersintervallet också bestämmer ifall man kan registrera sig i denna förening.
            </b-alert>

            <div class="d-flex align-items-center mb-6">
              <label
                      class="checkbox checkbox-lg checkbox-outline checkbox-success"
              >
                <input
                        type="checkbox"
                        name=""
                        v-model="registration.allow_reg"
                        @click="registration.allow_reg = !registration.allow_reg"
                />
                <span></span>
              </label>

              <span class="ml-3 cursor-pointer">Visa som val vid registrering</span>
            </div>

          </b-card>

           

            <b-card class="mb-8">
              <h4 class="mb-8">Flerstegsregistreringsfunktionen</h4>
              
              <b-alert show variant="light">
                Flerstegsmedlemskap innebär att man kan bli medlem i regionsföreningen och sedan visas lokalföreningarna som alternativ vid registrering, samt att det finns en lista på kompletterande föreningar att bli medlem i vid sidan av.
              </b-alert>

              <!--<div class="d-flex align-items-center mb-6">
                <label
                  class="checkbox checkbox-lg checkbox-outline checkbox-success"
                >
                  <input
                    type="checkbox"
                    name=""
                    v-model="allow_multiple"
                    @click="allow_multiple = !allow_multiple"
                  />
                  <span></span>
                </label>

                <span class="ml-3 cursor-pointer">Aktivera flerstegsmedlemskap</span>
              </div>-->

            
              <b-alert show variant="light">
                När en medlem registrerar sig på registreringssidan och moderföreningen har valts att medlemmen vill registrera sig i, då kommer denna förening att visas som valbar att kunna registrera sig i tillsammans med moderföreningen.
              </b-alert>

              <div class="d-flex align-items-center mb-6">
                <label
                  class="checkbox checkbox-lg checkbox-outline checkbox-success"
                >
                  <input
                    type="checkbox"
                    name=""
                    v-model="if_pcomp_reg_allow_reg"
                    @click="if_pcomp_reg_allow_reg = !if_pcomp_reg_allow_reg"
                  />
                  <span></span>
                </label>

                <span class="ml-3 cursor-pointer">Visa endast ifall region/moderföreningen har valts vid registrering</span>
              </div>

              <b-alert show variant="light">
                Ifall detta är en regionsförening som har ett antal lokala föreningar under sig bör detta markeras i checkboxen nedan, detta är då det utökade "Flerstegsmedlemskapfunktionen" ska fungera
              </b-alert>

              <div class="d-flex align-items-center mb-6">
                <label
                        class="checkbox checkbox-lg checkbox-outline checkbox-success"
                >
                  <input
                    type="checkbox"
                    v-model="is_region"
                    @click="is_region = !is_region"
                  />
                  <span></span>
                </label>

                <span class="ml-3 cursor-pointer">Detta är en regionsförening</span>
              </div>


              <b-alert show variant="warning" v-if="is_region">
                Observera! Du MÅSTE välja minst en region i områdesfördelningen för att regionsföreningar ska kunna mappas korrekt för medlemmar under registrering
              </b-alert>
            
            </b-card>
            

           <!-- <b-alert show variant="light">
              Ger möjlighet för medlemmar som registrera sig att bli medlem i fler än en förening.
            </b-alert>

            <div class="d-flex align-items-center mb-6">
              <label
                      class="checkbox checkbox-lg checkbox-outline checkbox-success"
              >
                <input
                        type="checkbox"
                        name=""
                        v-model="registration.allow_multiple"
                        @click="registration.allow_multiple = !registration.allow_multiple"
                />
                <span></span>
              </label>

              <span class="ml-3 cursor-pointer">Tillåt registrering i flera föreningar</span>
            </div>-->

            <!--<div class="d-flex align-items-center mb-6" v-if="company.pc_id">
              <label
                      class="checkbox checkbox-lg checkbox-outline checkbox-success"
              >
                <input
                        type="checkbox"
                        name=""
                        v-model="registration.show_from_pc"
                        @click="registration.show_from_pc = !registration.show_from_pc"
                />
                <span></span>
              </label>
              <span class="ml-3 cursor-pointer"
              >Denna förening skall vara valbar ifall medlem registrerar sig i
                moderföreningen</span
              >
            </div>-->

            
          <AreaAllocSettings 
            :regions="regions"
            @mapByRegionUpdate="mapByRegionUpdate"
          />

          <b-card title="" class="mb-2 mx-auto mt-8" hide-footer>
            
            <b-alert show variant="danger" v-if="map_by_region && allow_multiple">
              Systemet klarar inte av "Automatisk områdestilldelning" och "Flerstegsmedlemskap" eftersom den ena kräver att medlemmar endast väljer en förening vid registrering, medan den andre öppnar upp möjligheten att registrera sig på flera föreningar
            </b-alert>

            <div class="mt-4">
              <b-button type="submit" variant="primary">Spara</b-button>
            </div>
          </b-card>
        </b-form>
      </b-col>
    </b-row>
  </div>
</template>
<style scoped>
  .checkbox.checkbox-light-success > span {
    background-color: white;
    border: 1px solid #ddd;
  }

  ::v-deep .btn-action {
    border: 0;
    background: none;
    outline: none !important;
    box-shadow: none;
    outline: none !important;
    padding: 0.5rem 1rem;
    color: #a2a5b9;
    font-weight: 500;
    font-size: 0.9rem;
    background-color: #c1c1c1;
    transition: all 0.3s ease;
    border-radius: 4px;
  }

  ::v-deep .select-all {
    border: 0;
    background: none;
    outline: none !important;
    box-shadow: none;
    outline: none !important;
    padding: 0.5rem 1rem;
    color: #a2a5b9;
    font-weight: 500;
    font-size: 0.9rem;
    background-color: #c1c1c1;
    transition: all 0.3s ease;
    border-radius: 4px;
    cursor: pointer;
  }

  ::v-deep .deselect-all {
    border: 0;
    background: none;
    outline: none !important;
    box-shadow: none;
    outline: none !important;
    padding: 0.5rem 1rem;
    color: #a2a5b9;
    font-weight: 500;
    font-size: 0.9rem;
    background-color: #c1c1c1;
    transition: all 0.3s ease;
    border-radius: 4px;
    cursor: pointer;
  }

  ::v-deep .list-box-wrapper {
    font-family: Poppins, Helvetica, 'sans-serif';
  }
</style>
<script>
  import AreaAllocSettings from '@/view/pages/ml/settings/AreaAllocSettings.vue';
  import axios from 'axios';
  import { mapGetters } from 'vuex';

  export default {
    name: 'registration',
    props: ['company', 'regions'],
    components: {
      AreaAllocSettings
    },
    computed: {
      ...mapGetters(['currentCompanyId'])
    },
    watch: {
      allow_multiple(newValue, oldValue) {
        this.registration.allow_multiple = newValue;
      },
      is_region(newValue, oldValue) {
        this.registration.is_region = newValue;

        if (newValue) { // they can not co-exist
          this.if_pcomp_reg_allow_reg = false;
        }
      },
      if_pcomp_reg_allow_reg(newValue, oldValue) {
        this.registration.if_pcomp_reg_allow_reg = newValue;

        if (newValue) {
          this.is_region = false;
        }
      },
      company(newValue, oldValue) {
        if (newValue) {
          for (var k in this.registration) {
            if (
              newValue.registration.hasOwnProperty(k) &&
              newValue.registration[k] != undefined
            )
              this.registration[k] = newValue.registration[k];
          }
        }
      },
      check_join(newVal, oldVal){
        newVal.filter((item, index) => {
          if (!item){
            this.registration.age_req_all.splice(index, 1, null);
          }
        })
      },
    },
    mounted() {
      for (var k in this.regions) {
        this.sourceRegions.push({ code: k, name: this.regions[k].region });
      }

      this.sourceRegions.sort(function(a, b) {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      });

      this.registration = this.company.registration;
      this.selectedRegistrationOption = this.registration.option;

      if (this.selectedRegistrationOption === null || this.selectedRegistrationOption === undefined || this.selectedRegistrationOption === '') {
        this.selectedRegistrationOption = 'simple';
      }
      
      if (this.registration.hasOwnProperty('is_region')) {
        this.is_region = this.registration.is_region;
      }

      if (this.registration.hasOwnProperty('if_pcomp_reg_allow_reg')) {
        this.if_pcomp_reg_allow_reg = this.registration.if_pcomp_reg_allow_reg;
      }

    },
    data: function() {
      return {
        selectedRegistrationOption: 'simple',
        sourceRegions: [],
        destRegions: [],
        sourceCommunes: [],
        destCommunes: [],
        is_region: false,
        if_pcomp_reg_allow_reg: false,
        map_by_region: false,
        allow_multiple: false,
        registration: {
          is_region: false,
          if_pcomp_reg_allow_reg: false,
          map_by_region: false,
          allow_multiple: false,
          create_parent_members: false,
          demand_parents: false,
          show_from_pc: false,
          join_cond: [
            { type: 'max', val: '60' },
            { type: 'min', val: '18' }
          ],
          pages: [],
          age_req_all: [18, 20],
          family: false,
          age_max_parent: 0
        },
        check_join: [true, true],
      };
    },
    methods: {
      mapByRegionUpdate(value) {
        this.map_by_region = value;
        this.registration.map_by_region = value;
      },

      saveData(e) {
        e.preventDefault();
      
        this.registration.option = this.selectedRegistrationOption;

        axios
          .put('/company', {
            company_id: this.currentCompanyId,
            registration: this.registration
          })
          .then(res => {
            this.toastr('success', 'OK', 'Registreringen uppdaterades');
          })
          .catch(err => {
            console.error(err);
            this.toastr('danger', 'Fel', 'Kunde inte uppdatera registrering');
          });
      },
      onChangeRegion: function({ source, destination }) {
        this.sourceRegions = source;
        this.destRegions = destination;

        this.sourceCommunes = [];

        for (var i = 0; i < this.destRegions.length; ++i) {
          // populate communes based on selected regions
          var region = this.regions[this.destRegions[i].code];
          for (var k in region.communes) {
            this.sourceCommunes.push({
              code: k,
              name: region.communes[k].commune,
              region_code: region.region_code
            });
          }
        }

        // remove from source commune already selected dest communes
        for (var i = 0; i < this.destCommunes.length; ++i) {
          for (var j = 0; j < this.sourceCommunes.length; ++j) {
            if (this.destCommunes[i].code === this.sourceCommunes[j].code) {
              this.sourceCommunes.splice(j, 1);
              break;
            }
          }
        }

        this.sourceCommunes.sort(function(a, b) {
          if (a.name < b.name) {
            return -1;
          }
          if (a.name > b.name) {
            return 1;
          }
          return 0;
        });

        this.destCommunes.sort(function(a, b) {
          if (a.name < b.name) {
            return -1;
          }
          if (a.name > b.name) {
            return 1;
          }
          return 0;
        });
      },
      onChangeCommune: function({ source, destination }) {
        this.sourceCommunes = source;
        this.destCommunes = destination;
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
