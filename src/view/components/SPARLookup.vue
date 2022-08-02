<template>

  <b-modal ref="modal" v-model="showSPARModal" hide-footer>
    <div class="form-create-member border border-secondary">
        <b-row>
            <b-col md="6">
            <b-form-group label="Förnamn" label-for="member-firstname">
                <b-form-input
                    id="member-firstname"
                    v-model="spar.fn"
                />
            </b-form-group>
            </b-col>
            <b-col md="6">
            <b-form-group label="Efternamn" label-for="member-lastname">
                <b-form-input 
                    id="member-lastname" 
                    v-model="spar.ln" 
                />
            </b-form-group>
            </b-col>
        </b-row>

        <b-row class="mt-6">
            <b-col md="12">
            <b-form-group label="Gatuadress" label-for="member-street">
                <b-form-input
                    id="member-street"
                    v-model="spar.st"
                />
            </b-form-group>
            </b-col>
        </b-row>
        <b-row>
            <b-col md="5">
                <b-form-group label="Postkod" label-for="member-postcode">
                    <b-form-input 
                        id="member-postcode" 
                        v-model="spar.zip"
                    />
                </b-form-group>
            </b-col>
            <b-col md="7">
                <b-form-group label="Postort" label-for="member-postal">
                    <b-form-input 
                        id="member-postal" 
                        v-model="spar.pa" 
                    />
                </b-form-group>
            </b-col>
        </b-row>

        <b-row v-if="sparWaiting" class="mt-6">
            <b-col lg="6">
            <b-button variant="outline-success" @click="doSpar">
                Gör SPAR uppslag
            </b-button>
            </b-col>
            <b-col lg="6">
            </b-col>
        </b-row>

        <b-row v-if="showError">
            <b-col lg="12">
                <b-alert variant="danger" show>{{ errorText }}</b-alert>
            </b-col>
        </b-row>

        <b-row v-if="sparOK" class="mt-6">
            <b-col lg="6">
            <b-button variant="outline-success" @click="save">
                Spara
            </b-button>
            </b-col>
            <b-col lg="6">
            <b-button variant="outline-primary" @click="cancel">
                Ångra
            </b-button>
            </b-col>
        </b-row>

        <b-row v-if="showError" class="mt-6">
            <b-col lg="6">
            <b-button variant="outline-primary" @click="cancel">
                Stäng
            </b-button>
            </b-col>
        </b-row>
    </div>
  </b-modal>
  
</template>
<style lang="scss" scoped>
.form-create-member {
  max-width: 800px;
  margin: 0 auto;
  padding: 25px;
}
</style>
<script>
import axios from 'axios';
import {SET_CLIENT_ID} from "../../core/services/store/common.module";
import Confirm from '@/view/components/Confirm.vue';

export default {
  name: 'create-member',
  components: {
    Confirm
  },
  data() {
    return {
      showError: false,
      errorText: 'Ett fel uppstod',
      showSPARModal: false,
      sparWaiting: true,
      sparOK: false,
      spar: {
        pa: '',
        fn: '',
        ln: '',
        st: '',
        zip: ''
      },
    };
  },
  props: {
    client_id: { type: Number, default: null },
  },
  watch: {
  },
  computed: {
    
  },
  async mounted() {
    
  },
  methods: {
    show() {
      this.showSPARModal = true;
    },
    close() {
      this.showSPARModal = false;
    },
    doSpar() {
      this.doSPARLookup(this.client_id);
    },
    cancel() {
      this.$refs['modal'].hide();
      this.$emit('cancel');
    },
    save() {
      this.$emit('save');
    },
    toastr(type, title, message) {
      this.$bvToast.toast(message, {
        title: title,
        autoHideDelay: 2000,
        appendToast: true,
        variant: type
      });
    },
    doSPARLookup(client_id) {
      this.sparWaiting = false;

      axios 
        .get(`/client/spar?client_id=${client_id}`)
        .then(res => {
          
          if (res.data.reason === 'SPAR disabled') {
            this.showError = true;
            this.errorText = 'SPAR är ej aktiverat';
          }
          else {
            this.spar = res.data.spar;
            this.sparOK = true;
          }

          console.log('error: ' + this.showError);
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Serverfel', 'Kunde inte göra uppslag');
          this.showError = true;
          
        });
    },
  }
};
</script>
<style scoped>
</style>

