<template>
  <b-card header-bg-variant="secondary">
    <SPARLookup
      ref="sparModal"
      :client_id="form.client_id"
    />
    <template #header> <fa-icon :icon="['fas', 'users']" class="mr-1" />Medlemsdata </template>
    <b-card-body>
      <b-form @submit.prevent="onSubmit">
        <div class="form-create-member border border-secondary">
          <b-form-group label="Medlemsnummer" label-for="member-num">
            <b-form-input
                    id="member-num"
                    v-model="form.public_id"
                    placeholder="Lämna tomt för autogenererat"
            />
          </b-form-group>
          <b-row>
            <b-col md="6">
              <b-form-group label="Förnamn" label-for="member-firstname">
                <b-form-input
                        v-if="constreq.includes('MEMBER_REQ_FULLNAME')"
                        id="member-firstname"
                        v-model="form.firstname"
                        placeholder="Samtliga tilltalsnamn"
                        :state="validFn"
                        required
                />
                <b-form-input
                        v-else
                        id="member-firstname"
                        v-model="form.firstname"
                        placeholder="Samtliga tilltalsnamn"
                />
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group label="Efternamn" label-for="member-lastname">
                <b-form-input
                        v-if="constreq.includes('MEMBER_REQ_FULLNAME')"
                        id="member-lastname"
                        v-model="form.lastname"
                        placeholder="Efternamn"
                        :state="validLn"
                        required
                />
                <b-form-input
                        v-else
                        id="member-lastname"
                        v-model="form.lastname"
                        placeholder="Efternamn"
                />
              </b-form-group>
            </b-col>
          </b-row>
          <b-form-group label="Inmatat Personnummer" label-for="member-security-number">
            <b-row>
              <b-col>
                <b-form-input
                        v-if="constreq.includes('MEMBER_REQ_PERSONNR') || constreq.includes('MEMBER_REQ_SSN')"
                        id="member-security-number"
                        v-model="form.in_personnr"
                        placeholder="Ex: 19850130"
                        :state="validSSN"
                        required
                />
                <b-form-input
                        v-else
                        id="member-security-number"
                        v-model="form.in_personnr"
                        placeholder="Ex: 19850130"
                />
              </b-col>
              <b-col>
                <div class="d-flex">
                  <b-form-input disabled  v-model="form.birthyear" />
                  <b-form-input class="ml-3" disabled  v-model="form.birthmonth" />
                  <b-form-input class="ml-3" disabled  v-model="form.birthday" />
                  <b-form-input class="ml-3" disabled  v-model="form.ssn_last_4" />
                </div>
              </b-col>
            </b-row>
          </b-form-group>

          <b-row>
            <b-col md-6>
              <b-form-group label="Egen definerat kön" label-for="member-gender">
                <b-form-select id="member-gender" v-model="form.sex" :options="genders" />
              </b-form-group>
            </b-col>
            <b-col md-6>
            </b-col>

          </b-row>

        </div>

        <div class="form-create-member border border-secondary mt-5">
          <b-row >
            <b-col md="6">
              <b-form-group label="C/O" label-for="member-co">
                <b-form-input
                        id="member-co"
                        v-model="form.co"
                        placeholder=""
                />
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col md="6">
              <b-form-group label="Gatuadress" label-for="member-street">
                <b-form-input
                        v-if="constreq.includes('MEMBER_REQ_ADDRESS')"
                        id="member-street"
                        v-model="form.address"
                        placeholder="Ex: Hornsgatan 12"
                        :state="validAddress"
                        required
                />
                <b-form-input
                        v-else
                        id="member-street"
                        v-model="form.address"
                        placeholder="Ex: Hornsgatan 12"
                />
              </b-form-group>
            </b-col>
            <b-col md="2">
              <b-form-group label="Postkod" label-for="member-postcode">
                <b-form-input
                        v-if="constreq.includes('MEMBER_REQ_ADDRESS')"
                        id="member-postcode"
                        v-model="form.zipcode"
                        placeholder="Ex: 12214"
                        :state="validZip"
                        required
                />
                <b-form-input
                        v-else
                        id="member-postcode"
                        v-model="form.zipcode"
                        placeholder="Ex: 12214"
                />
              </b-form-group>
            </b-col>
            <b-col md="4">
              <b-form-group label="Postort" label-for="member-postal">
                <b-form-input
                        v-if="constreq.includes('MEMBER_REQ_ADDRESS')"
                        id="member-postal"
                        v-model="form.post"
                        :state="validPost"
                        required
                />
                <b-form-input
                        v-else
                        id="member-postal"
                        v-model="form.post"
                />
              </b-form-group>
            </b-col>
          </b-row>
          <b-row v-if="form.country === 'SE'">
            <b-col md="6">
              <b-form-group label="Region" label-for="member-region">
                <b-form-select
                        id="member-region"
                        :options="regions"
                        v-model="form.region_code"
                        @change="onRegionChange"
                />
              </b-form-group>
            </b-col>
            <b-col md-6>
              <b-form-group label="Kommun" label-for="member-commun">
                <b-form-select
                        id="member-commun"
                        :options="communes"
                        v-model="form.commune_code"
                />
              </b-form-group>
            </b-col>
          </b-row>
          <b-form-group label="Land" label-for="member-countries">
            <b-row>
              <b-col md="6">
                <b-form-select
                        id="member-countries"
                        v-model="form.country"
                        :options="countries"
                        text-field="sv"
                        value-field="iso"
                />
              </b-col>
              <b-col md="6" class='d-flex justify-content-end'>
                <b-button variant="outline-success" @click="showSPAR" >
                  SPAR
                </b-button>
              </b-col>
            </b-row>
          </b-form-group>
        </div>

        <div class="form-create-member border border-secondary mt-5">
          <b-row>
            <b-col md="6">
              <b-form-group label="Mobiltelefon" label-for="member-mobile">
                <b-form-input
                        v-if="constreq.includes('MEMBER_REQ_PHONE') || (constreq.includes('MEMBER_REQ_EMAILPHONE ') && !validEmail)"
                        id="member-mobile"
                        :state="validTel"
                        v-model="form.phone"
                        placeholder="+46"
                        required
                />
                <b-form-input
                        v-else
                        id="member-mobile"
                        v-model="form.phone"
                        placeholder="+46"
                />
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group
                      v-if="constreq.includes('MEMBER_REQ_EMAIL') || (constreq.includes('MEMBER_REQ_EMAILPHONE ') && !validTel)"
                      label="Email"
                      label-for="member-email"
              >
                <b-form-input id="member-email" :state="validEmail" required v-model="form.email" />
                <b-form-invalid-feedback id="member-email-feedback" v-if="invalidEmail">
                  E-postadressen är redan registrerad i systemet. För att bjuda in denna e-post till denna förening, använd "Bjud in" knappen
                </b-form-invalid-feedback>
              </b-form-group>
              <b-form-group label="Email" label-for="member-email" v-else>
                <b-form-input id="member-email" v-model="form.email" />
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col md="6">
              <b-form-group label="Lösenord" label-for="member-password">
                <b-form-input type="password" id="member-password" v-model="password" placeholder="" />
              </b-form-group>
            </b-col>
            <b-col md="6">

             </b-col>
          </b-row>
        </div>
        <!--Begin:: Parent table-->
        <div v-if="client_id" class="form-create-member border border-secondary mt-5" >
          <b-row class="mb-4">
            <b-col cols="9">Målsman</b-col>
            <b-col cols="3" class='d-flex justify-content-end'>
              <a
                      class="btn btn-primary font-weight-bolder font-size-sm"
                      style="max-height: 38px;"
                      @click="createParent"
              >
                <i class="menu-icon flaticon2-plus" style="font-size: 1em"></i>Ny målsman
              </a>
            </b-col>
          </b-row>

          <b-collapse :visible="showParentForm" id="collapse-attribute-form">
            <b-row align-content="between">
              <b-col>
                <b-form-group label="Förnamn" label-for="parentFName">
                  <b-form-input id="parentFName" type="text" v-model="parent.fn"  />
                </b-form-group>
              </b-col>
              <b-col >
                <b-form-group label="Efternamn" label-for="parentLName">
                  <b-form-input id="parentLName" type="text" v-model="parent.ln"  />
                </b-form-group>
              </b-col>
              <b-col>
                <b-form-group label="Telefon" label-for="parentPhone">
                  <b-form-input id="parentPhone" v-model="parent.ph"/>
                </b-form-group>
              </b-col>
              <b-col md="3">
                <b-form-group label="E-post" label-for="parentEmail">
                  <b-form-input id="parentEmail" type="email" v-model="parent.em"/>
                </b-form-group>
              </b-col>
              <b-col md="2" class="d-flex align-items-center">
                <b-button id="parentSave" variant="outline-success" size="sm" :disabled="!disabledSaveParent" @click="onSaveParent">Spara</b-button>
              </b-col>
            </b-row>
          </b-collapse>

          <hr class="my-3"/>
          <b-table responsive :fields="parentFields" :items="parentItems" head-variant="dark" thead-class="col-3">
            <template #cell(action) ="data">
              <a
                      class="btn btn-icon btn-light btn-sm mx-1"
                      @click="editParent(data.index)"
              >
              <span class="svg-icon svg-icon-md svg-icon-primary">
                <!--begin::Svg Icon-->
                <inline-svg src="/assets/svg/Write.svg"></inline-svg>
                <!--end::Svg Icon-->
              </span>
              </a>

              <a
                      class="btn btn-icon btn-light btn-sm mx-1"
                      @click="deleteParent(data.index)"
              >
              <span class="svg-icon svg-icon-md svg-icon-primary">
                <!--begin::Svg Icon-->
                <inline-svg src="/assets/svg/Trash.svg"></inline-svg>
                <!--end::Svg Icon-->
              </span>
              </a>
            </template>
          </b-table>
        </div>
        <!--End:: Parent table-->

        <div class="form-create-member border border-secondary mt-5" >
          <b-row>
            <b-col cols="9">Attribut</b-col>
            <b-col cols="3" class='d-flex justify-content-end'>
              <a
                class="btn btn-primary font-weight-bolder font-size-sm"
                style="max-height: 38px;"
                @click="showAttrForm = !showAttrForm"
              >
                <i class="menu-icon flaticon2-plus" style="font-size: 1em"></i>Nytt attribut
              </a>
            </b-col>
          </b-row>

          <b-collapse :visible="showAttrForm" id="collapse-attribute-form">
            <b-row>
              <b-col md="5">
                <b-form-group label="Kolumn" label-for="attr-name">
                  <b-form-select id="attr-name" v-model="attrName" :options="attrNames" />
                </b-form-group>
              </b-col>
              <b-col md="5">
                <b-form-group label="Värde" label-for="attr-value">
                  <b-form-select id="attr-value" v-model="attrVal" :options="attrVals" />
                </b-form-group>
              </b-col>
              <b-col md="2" class="d-flex align-items-center">
                <b-button id="attrSave" variant="outline-success" size="sm" @click="onSaveAttr">Spara</b-button>
              </b-col>
            </b-row>
          </b-collapse>

          <hr class="my-3"/>
          <b-table responsive :fields="attrFields" :items="attrItems" head-variant="dark" thead-class="col-4">
            <template #cell(action) ="data">
              <a
                      class="btn btn-icon btn-light btn-sm mx-1"
                      @click="editAttr(data.index)"
              >
              <span class="svg-icon svg-icon-md svg-icon-primary">
                <!--begin::Svg Icon-->
                <inline-svg src="/assets/svg/Write.svg"></inline-svg>
                <!--end::Svg Icon-->
              </span>
              </a>

              <a
                      class="btn btn-icon btn-light btn-sm mx-1"
                      @click="deleteAttr(data.index)"
              >
              <span class="svg-icon svg-icon-md svg-icon-primary">
                <!--begin::Svg Icon-->
                <inline-svg src="/assets/svg/Trash.svg"></inline-svg>
                <!--end::Svg Icon-->
              </span>
              </a>
            </template>
          </b-table>
        </div>
        <div v-if="client_id != null" class="form-create-member border border-secondary mt-5">
          <b-row class="mt-6">
            <b-col md="6">
              <div class="d-flex">
                <b-form-group label="Registreringsdatum">
                  <b-form-input disabled v-model="form.rdt " />
                </b-form-group>
              </div>
            </b-col>
            <b-col md="6">
              <b-form-group label="Medlemskapstid">
                <div class="d-flex">
                  <b-form-input disabled class="pl-6"  :value="currentPeriod.from"/>
                  <span class="pl-5 pr-5 pt-3">To</span>
                  <b-form-input disabled :value="currentPeriod.to"/>
                </div>
              </b-form-group>
            </b-col>
          </b-row>

          <b-row class="mt-6">
            <b-col md="6">

              <b-form-group label="Giltig Från Datum">
                <b-form-datepicker id="input-3" v-model="form.vfdt"> </b-form-datepicker>
              </b-form-group>

            </b-col>
            <b-col md="6">

                <b-form-group label="Giltig Till Datum">
                  <b-form-datepicker id="input-3" v-model="form.vtdt"> </b-form-datepicker>
                </b-form-group>

            </b-col>
          </b-row>
          <b-row class="mt-6">
            <b-col md="6">

              <b-form-group label="Stickprov URL">
                <b-form-input id="input-3" :value="spurl" disabled> </b-form-input>
              </b-form-group>

            </b-col>
            <b-col md="6">


            </b-col>
          </b-row>
        </div>

        <div v-if="client_id" class="form-create-member border border-secondary mt-5 pt-2 pb-2">
            <b-row class='mt-4'>
              <b-col md="9">
                <div class="pt-2">
                  Skicka förnyelse
                </div>
              </b-col>
              <b-col md="3">
                <div>
                  <b-button  variant="primary" class="btn-memberEditForm" size="sm" @click="showConfirm(1)" >Skicka</b-button>
                </div>
              </b-col>
              <Confirm title="Förnya medlemskap" message="Vill du skicka e-post om förnyelse till medlemmen?" ref="renewal" :type="'success'" @confirm="onRenewal" />
            </b-row>

            <hr class="my-4">
            <b-row >
              <b-col md="9">
                <div class="pt-2">
                  Skicka återställning av lösenord
                </div>
              </b-col>
              <b-col md="3">
                <div >
                  <b-button variant="primary" class="btn-memberEditForm" size="sm" @click="showConfirm(2)" >Skicka</b-button>
                </div>
              </b-col>
              <Confirm title="Återställ lösenord" message="Vill du skicka länk om återställande?" ref="resetPass" :type="'success'"  @confirm="onResetPass" />
            </b-row>

            <hr class="my-4">
            <b-row >
              <b-col md="9">
                <div class="pt-2">
                  Logga in som medlem
                </div>
              </b-col>
              <b-col md="3">
                <div>
                  <b-button variant="primary" class="btn-memberEditForm" size="sm" @click="login" >Logga in</b-button>
                </div>
              </b-col>
            </b-row>

            <hr class="my-4">
            <b-row >
              <b-col md="9">
                <div class="pt-2">
                  Ladda ner registerutdrag
                </div>
              </b-col>
              <b-col md="3">
                <div>
                    <b-button variant="primary" class="btn-memberEditForm" size="sm" @click="onExport">Ladda ner</b-button>
                </div>
              </b-col>
            </b-row>
        </div>

        <div v-if="client_id" class="form-create-member border border-secondary mt-5">
          <b-row >
            <b-col md="9">
              <div class="pt-2">
                Radera medlem från systemet
              </div>
            </b-col>
            <b-col md="3">
              <div>
                <b-button variant="danger" class="btn-memberEditForm" size="sm" @click="showConfirm(3)" >Radera</b-button>
              </div>
            </b-col>
            <Confirm
                    title="Radera medlem"
                    :message="`Vänligen bekräfta att du vill ta bort ${form.firstname} ${form.lastname}. Genom att bekräfta denna uppmaning kommer medlem helt raderas ur systemet.`"
                    ref="deleteMember"
                    :type="'success'"
                    @confirm="$emit('onDelete')"
            />
          </b-row>
        </div>

        <div class="form-create-member border border-secondary mt-5">
<!--          <b-row>-->
<!--            <b-col md="12">-->
              <!-- <b-alert show variant="light">
                Fält som är metadata är data som följer med från importen och som inte går att göra
                sökningar på. Flytta över metadata till äkta medlemsattribut genom att
                <b>klicka på pilen</b> för att göra datat sökbart.
              </b-alert> -->
<!--            </b-col>-->
<!--          </b-row>-->
          <b-row align-v="center">
            <b-col md="9">
              <div class="pt-2">
                Spara medlemsdata
              </div>
            </b-col>
            <b-col md="3">
              <div class="mb-3">
                <b-button variant="success" class="btn-memberEditForm" size="sm" type="submit" :disabled="isValid">Spara</b-button>
              </div>
              <div>
                <b-button variant="secondary" class="btn-memberEditForm" size="sm" @click="onClose">Stäng</b-button>
              </div>
            </b-col>
          </b-row>
        </div>
      </b-form>
    </b-card-body>
  </b-card>
</template>
<style lang="scss" scoped>
.form-create-member {
  max-width: 800px;
  margin: 0 auto;
  padding: 25px;
}
  .btn-memberEditForm {
    width: 85px;
  }
</style>
<script>
import axios from 'axios';
import { mapGetters } from 'vuex';
import { SET_CLIENT_ID } from "../../core/services/store/common.module";
import Confirm from '@/view/components/Confirm.vue';
import SPARLookup from '@/view/components/SPARLookup.vue';
import moment from "moment";
import validate_pers_number from '@/core/services/personnr';

export default {
  name: 'create-member',
  components: {
    Confirm,
    SPARLookup
  },
  data() {
    return {
      password: '',
      spurl: '',
      form: {
        number: '',
        firstname: '',
        lastname: '',
        security_number: '',
        mobile: '',
        email: '',
        sex: 'M',
        country:'',
        commune_code:'',
        region_code:'',
        rdt: '',
        login_token: '',
        co:'',
        birthyear:'',
        birthmonth:'',
        birthday:'',
        ssn_last_4:''
      },
      attrName: null,
      attrNames: [],
      attrVal: null,
      attrVals: [],
      attrIndex: null,
      showAttrForm: false,
      showParentForm: false,
      invalidEmail: false,
      validEmail:false,
      validSSN: false,
      validBirth: false,
      validTel:false,
      validAddress: false,
      validZip: false,
      validPost: false,
      validFn: false,
      validLn: false,
      originalEmail: '',
      attrFields: [
        {key: 'attrName', label: 'Kolumn', thStyle: 'width: 30%'},
        {key: 'value', label: 'Värde', thStyle: 'width: 50%'},
        {key: 'action', label: '', thStyle: 'width: auto'},
      ],
      attrItems: [
      ],
      parentFields: [
        {key: 'fn', label: 'Förnamn', thStyle: 'width: 20%'},
        {key: 'ln', label: 'Efternamn', thStyle: 'width: 20%'},
        {key: 'ph', label: 'Telefon', thStyle: 'width: 20%'},
        {key: 'em', label: 'E-post', thStyle: 'width: 20%'},
        {key: 'action', label: '', thStyle: 'width: auto'},
      ],
      parentItems: [],
      parentIndex:'',
      parent: {
        ln:'', fn:'', em:'', ph:'', pn:''
      },
      communes:{},
      isPut: !this.isNew,
      currentClientId: this.$store.getters.currentClientId,
      clientExcelField: {
        'Förening': 'company_name',
        'Medlemsnummer': 'public_id',
        'Förnamn': 'firstname',
        'Efternamn': 'lastname',
        'Personnummer': 'in_personnr',
        'Kön': 'sex_name',
        'C/O': 'co',
        'Gata': 'address',
        'Postnummer': 'zipcode',
        'Postort': 'post',
        'Region': 'region_name',
        'Kommun': 'commune_name',
        'Land': 'country_name',
        'Telefon': 'phone',
        'E-post': 'email',
        'Period': 'period_name',
        'Betalat': 'paying',
        'LADOK': 'ladok',
        'Ålder': 'age',
        'Registreringsdatum': 'rdt',
      },
    };
  },
  props: {
    client_id: { type: Number, default: null },
    isNew: { type: Boolean, default: false },
    regions: { type: Array, default: [] },
    countries: { type: Array, default: [] },
    genders: {type: Array, default: []},
    constreq: {type: Array, required: true},
  },
  watch: {
    client_id(newValue, oldValue) {
      console.log('change: ', newValue);

      if (newValue) {
        this.loadClient(newValue);
        console.log('client id load: ' + newValue);
      }
    },
    attrName(newVal, oldVal){
      const group = this.attrNames.find(item=> item.value === newVal);
      if (group !== undefined ){
          this.attrVals = [];
        group.props.filter((prop, index)=>{
          this.attrVals.push({value:index, text: prop.name, id:prop.prop_id });
        });
        this.attrVal = 0;
      }
    },
    showAttrForm(newVal, oldVal){
      if (newVal) this.attrIndex = null;
    },
    'form.in_personnr': function(newVal, oldVal){
      let formatted = validate_pers_number(newVal);
      console.log(formatted)
      this.validSSN = this.constreq.includes('MEMBER_REQ_SSN') ? formatted.valid : formatted.success;
      this.form.birthyear = formatted.year;
      this.form.birthmonth = formatted.month;
      this.form.birthday = formatted.day;
      this.form.ssn_last_4 = formatted.valid ? formatted.last : '';
    },
    'form.email': async function(){
      // const sameEmail = this.form.email === this.originalEmail;
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      const val = re.test(String(this.form.email).toLowerCase());
      this.invalidEmail = false;
      this.validEmail = val;
      // if (!val && !sameEmail) {
      //   this.invalidEmail = false;
      //   this.validEmail = false;
      // }
      // if (val && !sameEmail){
      //   const res = await axios.get(`/user/checkemail?email=${this.form.email}`);
      //   this.invalidEmail = res.status === 200;
      //   this.validEmail = !this.invalidEmail;
      // }
      // if(sameEmail){
      //   this.invalidEmail = false;
      //   this.validEmail = true;
      // }
    },
    'form.phone': function (newVal, oldVal){
      this.validTel = this.validate_phone(newVal);
    },
    'form.address': function (newVal, oldVal){
      this.validAddress = this.is_set(newVal);
    },
    'form.zipcode': function (newVal, oldVal){
      this.validZip = this.is_set(newVal);
    },
    'form.post': function(newVal, oldVal){
      this.validPost = this.is_set(newVal);
    },
    'form.firstname': function (newVal, oldVal){
      this.validFn = this.is_set(newVal);
    },
    'form.lastname': function (newVal, oldVal){
      this.validLn = this.is_set(newVal);
    }
  },
  computed: {
    ...mapGetters(['currentCompanyId', 'companies', 'periods', 'company']),
    currentPeriod(){
        let currentPeriodId = this.$store.getters['currentPeriodId']
        let periods = this.$store.getters['periods']
        return periods.filter(item => item.id === currentPeriodId)[0]
    },
    disabledSaveParent(){
      let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      const valid_email = re.test(String(this.parent.em).toLowerCase());
      const valid_lName = this.is_set(this.parent.ln);
      const valid_fName = this.is_set(this.parent.fn);
      const valid_phone = this.is_set(this.parent.ph) && !!Number(this.parent.ph);
      return valid_email && valid_lName && valid_fName && valid_phone;
    },
    isValid(){
      const valid_ssn = (this.constreq.includes('MEMBER_REQ_SSN') || this.constreq.includes('MEMBER_REQ_PERSONNR')) ? this.validSSN : true;
      const valid_name = this.constreq.includes('MEMBER_REQ_FULLNAME') ? (this.validFn && this.validLn) : true;
      const valid_email_tel = this.constreq.includes('MEMBER_REQ_EMAILPHONE') ? this.validTel || this.validEmail : true;
      const valid_email = this.constreq.includes('MEMBER_REQ_EMAIL') ? this.validEmail : true;
      const valid_tel = this.constreq.includes('MEMBER_REQ_PHONE') ? this.validTel : true;
      const valid_address = this.constreq.includes('MEMBER_REQ_ADDRESS') ? (this.validAddress && this.validPost && this.validZip) : true;
      return !(valid_address && valid_name && valid_email && valid_tel && valid_email_tel && valid_ssn);
    }
  },
  async mounted() {
    await this.loadAttributes();
    this.client_id && await this.loadClient(this.client_id);
  },
  methods: {
    onClose(){
      this.$emit('onClose');
    },
    loadAttributes(){
      axios.get(`/property_group/extlist?company_id=${this.currentCompanyId}`)
      .then(res => {
        if(res.status === 200){
          res.data.groups.filter((group, index)=> {
            this.attrNames.push({value: index, text: group.name, id: group.group_id, props: group.props})
          });
          this.attrName = 0;
        }
        return res.status;
      }).catch(err => console.log(err))
    },
    showSPAR() {
      this.$refs['sparModal'].show();
    },
    loadClient(client_id) {
      this.resetForm();
      axios
        .get(`/client?client_id=${client_id}`)
        .then(res => {
          if (res.status === 200){
            this.$store.dispatch(SET_CLIENT_ID, client_id)
            this.form = res.data.client;
            this.originalEmail = res.data.client.email;
            this.parentItems = res.data.client.parents;
            this.spurl = `https://${window.location.hostname}/spurl/${this.form.spurl}`;

            if (this.form.rdt === null || this.form.rdt === undefined) {
              this.form.rdt = '';
            }
            else {
              this.form.rdt = this.form.rdt; //this.maskDate(this.form.rdt)
            }
            this.decodeProperties(res.data.client.properties);
            this.onRegionChange(res.data.client.region_code);
          } else {
            this.toastr('danger', 'Serverfel', 'Kunde inte hämta medlemsdata');
          }
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Serverfel', 'Kunde inte hämta medlemsdata');
        });
    },
    onRegionChange(value) {
      console.log('REGION )( CHANGED', value)
      if (value === null || value === '' || value === undefined){
        this.form.region_code = '';
        this.form.commune_code = '';
      } else {
        this.communes = this.regions.find(x => x.value === value).communes;
        this.form.region = value
      }
    },

    maskDate(str){
      console.log(str.toString())
      const year = str.toString().substring(0, 4)
      const month = str.toString().substring(4, 6)
      const date = str.toString().substring(6)
      return `${year}-${month}-${date}`
    },
    toastr(type, title, message) {
      this.$bvToast.toast(message, {
        title: title,
        autoHideDelay: 2000,
        appendToast: true,
        variant: type
      });
    },
    async onSubmit(){
      this.form.properties = this.encodeProperties();
      this.form.company_id = this.$store.getters.currentCompanyId
      this.form.period_id = this.$store.getters.currentPeriodId
      this.form.parents_data = this.parentItems;
      if (this.password !== '' && this.password.length > 6) {
        this.form.password = this.password;
      }
      // show loading
      const loader = this.$loading.show();
      const res = this.isPut
              ? await axios.put(`/client/${this.client_id}`, this.form)
              : await axios.post('/client', this.form)

      if (res.status === 200) {

        // success
          if (this.isPut) {
            this.toastr('success', 'OK', 'Medlemmen har uppdaterats');
          }
          else {
            this.toastr('success', 'OK', 'Medlemmen har skapats');
          }
          this.isPut = true
          this.form = res.data.client
          this.form.client_id = parseInt(this.form.client_id);
          await this.$store.dispatch(SET_CLIENT_ID, parseInt(res.data.client.client_id))
        } else {
          this.toastr('danger', 'Serverfel', 'Det gick inte att skapa medlem.');
        }
        loader && loader.hide();
    },
    showConfirm(val){
      switch (val) {
        case 1:
          this.$refs['renewal'].show();
          break
        case 2:
          this.$refs['resetPass'].show();
          break
        case 3:
          this.$refs['deleteMember'].show();
          break
      }
    },
    onRenewal(){
      const payload = {
        client_id : this.client_id
      };
      axios
        .post(`/client/sendrenew`, payload)
        .then(res => {
          this.toastr('success', 'förnyelse', 'Förnyelse-länken har skickats via e-post.')
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Serverfel', 'kunde inte maila');
        });
    },
    onResetPass(){
      const payload = {
        client_id : this.client_id,
        email: this.form.email
      };
      axios
        .post(`/client/forget`, payload)
        .then(res => {
          this.toastr('success', 'förnyelse', 'Förnyelse-länken har skickats via e-post.')
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Serverfel', 'kunde inte maila');
        });
    },

    onSaveParent(){
      this.parent.pn = '';
      if (this.is_set(this.parentIndex))
        this.parentItems[this.parentIndex] = this.parent;
      else
        this.parentItems.push(this.parent);
      console.log('Parent', this.parentItems)
      this.showParentForm = false;
      this.parent = {};
    },
    createParent(){
      this.parentIndex = '';
      this.showParentForm = !this.showParentForm;
    },
    editParent(index){
      this.showParentForm =  !this.showParentForm;
      if (this.showParentForm){
        this.parentIndex = index;
        this.parent = this.parentItems[index];
      }
    },
    deleteParent(index){
      this.parentItems.splice(index, 1);
    },
    onSaveAttr() {
      if (this.attrName === '' || this.attrVal === ''){
        return false;
      }
      const group = this.attrNames[this.attrName];
      const prop = this.attrVals[this.attrVal];
      const found = this.attrItems.find(item => item.group_id === group.id && item.prop_id === prop.id);
      const item = {attrName: group.text , value: prop.text , group_id: group.id, prop_id: prop.id  };
      if(this.attrIndex !== null) this.attrItems.splice(this.attrIndex, 1, item)
      else {
        if (found === undefined) this.attrItems.push(item);
      }
      this.attrIndex = null;
      this.showAttrForm = false;
    },
    editAttr(index){
      this.attrIndex = index;
      this.showAttrForm = true;
      const prop = this.attrItems[index];
      const foundName = this.attrNames.find(item => item.id === prop.group_id);
      if (foundName !== undefined){
        this.attrName = foundName.value;
      }
      const foundVal = this.attrVals.find(item => item.id === prop.prop_id);
      if (foundVal !== undefined){
        this.attrVal = foundVal.value;
      }
    },
    deleteAttr(index){
      this.attrItems.splice(index, 1);
    },
    encodeProperties(){
      let res = [];
        const items = this.attrItems.reduce((item, obj) => {
          const key = String(obj.group_id);
          if (!item[key]){
              item[key] = {};
              item[key].prop_ids = [];
              item[key].group_id = '';
          }
          item[key].group_id = key;
          item[key].prop_ids.push(String(obj.prop_id));
          return item;
      }, {});

      for (const key in items){
          res.push(items[key]);
      }
      return res;
    },
    decodeProperties(props){
      this.attrItems = [];
      props.filter(prop=>{
        prop.values.filter(val => {
          const item = {attrName: prop.name, value: val.name, group_id: prop.id, prop_id:val.id, };
          this.attrItems.push(item);
        });
      })
    },
    login(){
      const routeData = this.$router.resolve({path: `/profile/${this.client_id}/${this.form.login_token}`})
      window.open(routeData.href, '_blank')
    },
    onExport(){
      axios.get(`/client/xlsx?client_id=${this.client_id}`).then(res => {
        var filename = res.data.filepath.replace(/^.*[\\\/]/, '')

        this.downloadWithAxios(res.data.filepath, filename);

        this.toastr('success', 'OK', 'Exporten lyckades');
      }).catch(err => console.log(err))
    },
    forceFileDownload(response, title) {
      console.log(title)
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', title)
      document.body.appendChild(link)
      link.click()
    },
    downloadWithAxios(url, title) {
      axios({
        method: 'get',
        url,
        responseType: 'arraybuffer',
      }).then((response) => {
          this.forceFileDownload(response, title)
        }).catch(() => console.log('error occured'))
    },
    resetForm(){
      this.form = {
          number: '',
          firstname: '',
          lastname: '',
          security_number: '',
          mobile: '',
          email: '',
          sex: 'M',
          country:'',
          commune_code:'',
          region_code:'',
          rdt: '',
          login_token: '',
          co:'',
          birthyear:'',
          birthmonth:'',
          birthday:'',
          ssn_last_4:''
      }
    },
    validate_phone(phone) {
      if ((phone+'').length < 6) {
        return false;
      }

      var re = /^\+?\d*$/;
      return re.test(String(phone).toLowerCase());
    },
    is_set(vv) {
      return vv !== null && vv !== undefined && vv !== '' && vv !== ' ';
    },
  }
};
</script>
<style scoped>
</style>
