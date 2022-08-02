<template>
  <div class="" id="component-area-alloc-settings">
    <b-card title="" class="mb-2 mx-auto mt-8" hide-footer>
    <h4 class="mb-8">Områdesfördelning</h4>
    <b-alert show variant="light"
    >Områdesfördelning innebär att när en medlem försöker registrera sig på
     riksförbundet/moderföreningen så kommer medlemmen istället att bli medlem för denna
     förening, förutsatt att medlemmens område stämmer överrens med nedan anvgina
     kommuner.</b-alert
    >

    <!--<div class="d-flex align-items-center mb-6">
        <label class="checkbox checkbox-lg checkbox-outline checkbox-success">
        <input
          type="checkbox"
          name=""
          v-model="map_by_region"
          @click="map_by_region = !map_by_region"
        />
        <span></span>
        </label>
        <span class="ml-3 cursor-pointer">Automatiskt tilldela förening för registrerande medlem</span>
    </div>-->

    <div class="mt-4">
        <DualListBox
          :source="sourceRegions"
          :destination="destRegions"
          label="name"
          @onChangeList="onChangeRegion"
        />
    </div>

    <div class="mt-4">
        <DualListBox
          :source="sourceCommunes"
          :destination="destCommunes"
          label="name"
          @onChangeList="onChangeCommune"
        />
    </div>
    </b-card>
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
  import DualListBox from 'dual-listbox-vue';
  import 'dual-listbox-vue/dist/dual-listbox.css';
  import AreaAllocSettings from '@/view/pages/ml/settings/AreaAllocSettings.vue';
  import { mapGetters } from 'vuex';
  import axios from 'axios';

  export default {
    name: 'area-alloc-settings',
    props: ['regions'],
    components: {
      DualListBox
    },
    computed: {
      ...mapGetters(['currentCompanyId', 'currentPeriodId'])
    },
    watch: {
      map_by_region(newValue, oldValue) {
        this.$emit('mapByRegionUpdate', newValue);
      }
    },
    mounted() {
      
      this.sourceRegions = [];
      this.communeList = {};

      for (var k in this.regions) {
        console.log(this.regions[k]);
        this.sourceRegions.push({ code: k, name: this.regions[k].region });

        var communes = this.regions[k].communes;

        for (var c in communes) {
          this.communeList[c] = { rc: k, cc: c };
        }
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


      this.onChangeRegion({ source: this.sourceRegions, destination: this.destRegions });
      // Format regions

      this.loadAreaAlloc();
    },
    data: function() {
      return {
        destCommuneList: {},
        communeList: {},
        map_by_region: false,
        sourceRegions: [],
        destRegions: [],
        sourceCommunes: [],
        destCommunes: [],
        initialized: false
      };
    },
    methods: {
      loadAreaAlloc() {

        console.log('---- loading area alloc ----');

        axios
          .get(`/area_alloc/list?company_id=${this.currentCompanyId}`)
          .then(res => {

            var aa = res.data.area_alloc;

            console.log('area alloc');
            console.log(aa);

            var tmp = {};

            for (var a of aa) {

              if (!(a.rc in tmp)) {
                this.sourceRegions = this.sourceRegions.filter(item => item.code !== a.rc)
                var obj = { code: a.rc, name: this.regions[a.rc].region };

                this.destRegions.push(obj);
                tmp[a.rc] = true;
              }
            }

            this.onChangeRegion({ source: this.sourceRegions, destination: this.destRegions  });

            tmp = {};

            for (var a of aa) {
              
              if (!(a.cc in tmp)) {
                this.sourceCommunes = this.sourceCommunes.filter(item => (item.code+'') !== (a.cc+''))

                if (this.regions[a.rc].communes === undefined || this.regions[a.rc].communes[a.cc] === undefined) {
                  continue;
                }

                var obj = { code: a.cc, name: this.regions[a.rc].communes[a.cc].commune, region_code: a.rc };

                this.destCommunes.push(obj);
                tmp[a.cc] = true;
              }
            }

            this.initialized = true;
            
          })
          .catch(err => {
            console.error(err);
            this.toastr('danger', 'Fel', 'Kunde inte hämta områdesfördelning');
          });
      },

      postCommunes() {
        var regions = [];

        for (var k of this.destRegions) {
          regions.push(k.code);
        }

        var communes = [];

        for (var k in this.destCommuneList) {
          communes.push(this.destCommuneList[k]);
        }

        axios 
          .post('/area_alloc', { company_id: this.currentCompanyId, communes: communes, regions: regions })
          .then(res => {
            if (res.status === 201) {
              //this.toastr('success', 'OK', 'Områdesfördelning uppdaterad');
            }
          })
          .catch(err => {
            console.error(err);
            this.toastr('danger', 'Fel', 'Kunde inte skapa områdesfördelning');
          });
      },
      onChangeRegion: function({ source, destination }, post) {
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
        
        if (this.initialized) {
          this.postCommunes();
        }
      },
      onChangeCommune: function({ source, destination }) {
        this.sourceCommunes = source;
        this.destCommunes = destination;

        this.destCommuneList = {};

        for (var rec of this.destCommunes) {
          var commune = this.communeList[rec.code];
          this.destCommuneList[commune.cc] = { rc: commune.rc, cc: commune.cc };
        }

        this.postCommunes();
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
