<template>
  <div class="px-5" id="page-shop_items">
    <h5 class="mb-6 ml-2">Butiksartiklar</h5>

    <b-alert v-if="apiKeyNotFound" show variant="danger">Det finns ingen API nyckel uppsatt för betalningar på huvudföreningen. För att betalningar ska kunna fungera krävs det att det finns korrekta nycklar uppsatta samt att avtal med betalningsleverantör har upprättats. Kontakta memlist support för att veta mer.</b-alert>

    <ShopItemsTable
      :items="shop_items"
      @createShopItemClicked="createShopItem"
      @selectShopItemClicked="selectShopItem"
      @deleteShopItemClicked="deleteShopItem"
      @toastr="toastr"
    />
    <div class="scroll-to-container"></div>
    <b-card
      title=""
      class="mb-2 edit-shop_item-container"
      ref="edit-shop_item"
      id="edit-shop_item"
      hide-footer
      v-if="creating || editing"
    >
      <div>
        <b-form
            @submit="updateShopItem"
            class="mt-8">
          <b-form-group id="input-group-shop_item_id" label="ID" label-for="input-shop_item_id">
            <b-form-input
              id="input-shop_item_id"
              v-model="form.shop_item_id"
              type="text"
              disabled
            ></b-form-input>
          </b-form-group>


          <h5 class="mb-8 mt-8">Presentation:</h5>
          <b-form-group id="input-group-name" label="Namn" label-for="input-name">
            <b-form-input
              id="input-name"
              v-model="form.name"
              type="text"
            ></b-form-input>
          </b-form-group>

          <b-form-group id="input-group-descr" label="Beskrivning" label-for="input-descr">
            <b-form-textarea
                id="input-descr"
                size="sm"
                placeholder="Beskrivande text om artikeln..."
                v-model="form.descr"
            ></b-form-textarea>
          </b-form-group>

          <h5 class="mb-8 mt-8">Bild på artikeln:</h5>

          <b-row class="ml-1" v-if="form.frontend.img_url != ''">
            <b-col lg="12"><b-img style="max-height: 300px;" :src="form.frontend.img_url" fluid thumbnail></b-img></b-col>

          </b-row>
          <b-row class="mt-2">
            <b-col lg="12"><b-button type="button" variant="success" @click="selectFile()">Ladda upp bild</b-button></b-col>
          </b-row>

          <input hidden type="file" id="file" ref="file" v-on:change="handleFileUpload()" accept="image/*"/>

          <h5 class="mb-8 mt-8">Prissättning:</h5>
          <b-form-group id="input-group-price_sek" label="Styckpris @ Inkl Moms" label-for="input-price_sek">
            <b-form-input
              id="input-price_sek"
              v-model="form.price_sek"
              type="text"

            ></b-form-input>
          </b-form-group>

          <b-form-group id="input-group-vat_sek" label="Varav Moms" label-for="input-vat_sek">
            <b-form-input
              id="input-vat_sek"
              v-model="form.vat_sek"
              type="text"

            ></b-form-input>
          </b-form-group>

          <h5 class="mb-8 mt-8">Bokföring:</h5>
          <b-form-group id="input-group-book_acct_article" label="Bokför under konto" label-for="input-book_acct_article">
            <b-form-input
              id="input-book_acct_article"
              v-model="form.book_acct_article"
              type="text"

            ></b-form-input>
          </b-form-group>

          <b-form-group id="input-group-book_acct_vat" label="Momskonto" label-for="input-book_acct_vat">
            <b-form-input
              id="input-book_acct_vat"
              v-model="form.book_acct_vat"
              type="text"

            ></b-form-input>
          </b-form-group>

          <b-form-group id="input-group-book_place" label="Kostnadsställe" label-for="input-book_place">
            <b-form-input
              id="input-book_place"
              v-model="form.book_place"
              type="text"

            ></b-form-input>
          </b-form-group>

          <b-form-group id="input-group-book_tags" label="Taggar" label-for="input-book_tags">
            <Select2
                v-model="myValue"
                :options="myOptions"
                :settings="{ tags: true, multiple: true }"
                @change="tagChanged($event)"
                @select="tagSelected($event)"
                />
            <p class="mt-2">Skriv in en textsträng och tryck sedan ENTER</p>
          </b-form-group>

          <h5 class="mb-8 mt-8">Inställningar:</h5>
          <b-form-group id="send_email_template_id-group" label="Skicka E-post vid köp" label-for="send_email_template_id">
            <b-form-select
                id="send_email_template_id"
                v-model="form.meta.send_email_template_id"
                :options="templateOptions"
            ></b-form-select>
          </b-form-group>

          <div class="d-flex align-items-center mb-6">
            <b-input-group class="mb-2">
                <b-input-group-prepend is-text>
                  <label class="checkbox checkbox-sm checkbox-outline checkbox-success">
                    <input
                            type="checkbox"
                            aria-label="Checkbox for following text input"
                            v-model="check_join[0]"
                    />
                    <span></span>
                  </label>
                </b-input-group-prepend>
                <b-input-group-prepend is-text
                >Person måste vara minst ålder</b-input-group-prepend
                >
                <b-form-input
                        type="number"
                        min="0"
                        max="200"
                        placeholder="0"
                        v-model="form.rules.age_min"
                        :disabled="!check_join[0]"
                ></b-form-input>
            </b-input-group>
          </div>

          <div class="d-flex justify-content-between mb-6">
            <b-input-group class="mb-2">
              <b-input-group-prepend is-text>
                <label class="checkbox checkbox-sm checkbox-outline checkbox-success">
                  <input
                    type="checkbox"
                    aria-label="Checkbox for following text input"
                    v-model="check_join[1]"
                  />
                  <span></span>
                </label>
              </b-input-group-prepend>

              <b-input-group-prepend is-text>
                Person måste vara högst ålder
              </b-input-group-prepend>
              <b-form-input
                type="number"
                min="0"
                max="200"
                placeholder="0"
                v-model="form.rules.age_max"
                :disabled="!check_join[1]"
              ></b-form-input>
            </b-input-group>
          </div>


          <b-form-group class='ml-4'>
            <div class="d-flex align-items-center">
                <label class="checkbox checkbox-outline checkbox-success">
                <input type="checkbox" name="" v-model="form.is_active"  @click="form.is_active = form.is_active ? 0 : 1" />
                <span></span>
                </label>
                <span class="ml-3 cursor-pointer"
                >Aktiv</span
                >
            </div>

            <div class="d-flex align-items-center mt-6">
                <label class="checkbox checkbox-outline checkbox-success">
                <input type="checkbox" name="reg_only" v-model="form.frontend.reg_only" />
                <span></span>
                </label>
                <span class="ml-3 cursor-pointer"
                >Visa endast vid medlemsregistrering</span
                >
            </div>

            <div class="d-flex align-items-center mt-6">
                <label class="checkbox checkbox-outline checkbox-success">
                <input type="checkbox" name="is_member_fee" v-model="is_member_fee" />
                <span></span>
                </label>
                <span class="ml-3 cursor-pointer"
                >Är medlemsavgift</span
                >
            </div>
          </b-form-group>

          <b-form-group v-if="is_member_fee">
            <div class='ml-4'>
              <div>
                <label class="radio radio-outline radio-success mb-4">
                  <input type="radio" v-model="form.meta.is_days" :value="true" name="type" />
                  <span style="margin-right: 12px;"></span>
                  Medlemskapet gäller i antal dagar
                </label>
                <label class="radio radio-outline radio-success mb-4">
                  <input type="radio" v-model="form.meta.is_days" :value="false" name="type" />
                  <span style="margin-right: 12px;"></span>
                  Medlemskapat gäller i antal perioder
                </label>
              </div>

              <div class='ml-0'>
                <b-form-group id="input-group-meta-num_days" label="Antal dagar" label-for="input-meta-num_days" v-if="form.meta.is_days">
                  <b-form-input
                    id="input-meta-num_days"
                    v-model="form.meta.num_days"
                    type="number"
                  ></b-form-input>
                </b-form-group>

                <div v-if="form.meta.is_days == false">
                    <ShopItemPeriodsTable
                      :periods="periods"
                      @toastr="toastr"
                      />
                </div>
              </div>
            </div>
          </b-form-group>

          <b-button type="submit" variant="primary">Spara</b-button>

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
import 'vue-select/dist/vue-select.css';
import Select2 from 'v-select2-component';

import axios from 'axios';
import { mapGetters } from 'vuex';
import ShopItemsTable from '@/view/content/widgets/advance-table/ShopItemsTable.vue';
import ShopItemPeriodsTable from '@/view/content/widgets/advance-table/ShopItemPeriodsTable.vue';


export default {
  name: 'shop_items',
  components: {
    ShopItemsTable, Select2, ShopItemPeriodsTable
  },
  computed: {
    ...mapGetters(['currentCompanyId', 'currentPeriodId', 'periods', 'reg_only']),
  },
  mounted() {
    this.checkAPISetup();
    this.loadTemplates();
    this.loadShopItems();
  },
  data() {
    return {
      apiKeyNotFound: false,
      templates: [],
      templateOptions: [],
      myValue: '',
      myOptions: [],
      file: {
          name: 'bild0.jpg'
      },
      member_fee: false,
      form: {
       shop_item_id:        '',
        company_id:          '',
        name:                '',
        descr:               '',
        price_sek:           0,
        vat_sek:             0,
        frontend:            {
            img_url: '',
            reg_only: 0
        },
        is_active:           false,
        discounts:           {
            pct: 0,
            amount: 0,
            reason: ''
        },
        meta:                {
            num_periods: 0,
            is_member_fee: 0,
            is_days: false,
            member_fee: false,
            send_email_template_id: null,
            periods: [] /** { period_id: string; from: string; to: string; name: string; } */
        },
        book_acct_vat:       0,
        book_acct_article:   0,
        book_place:          '',
        book_tags:           [],

        rules: {age_min: 0, age_max: 0}
      },
      is_member_fee: false,
      test_days: true,
      tagOptions: [],
      creating: false,
      editing: false,
      shop_items: [],
      shop_item: '',
      reg_only_true: true,
      check_join: [false, false],
      item_type: 'reg_only_true'
    };
  },
  watch: {
    currentCompanyId(newValue, oldvalue) {
      if (newValue) {
        this.loadShopItems();
      }
    },
   check_join(newVal, oldVal){
        if (!newVal[0]) this.form.rules.age_min = null;
        if (!newVal[1]) this.form.rules.age_max = null;
    },
    item_type(newVal, oldVal){
      this.reg_only_true = newVal === 'reg_only_true';
      this.member_fee = newVal === 'member_fee';
    },
    is_member_fee(newVal, oldVal) {

    }

  },
  methods: {
    handleFileUpload() {
      this.file = this.$refs.file.files[0];

      this.uploadFile();
    },
    selectFile() {
      this.$refs.file.click();
    },
    uploadFile() {
      let formData = new FormData();
      formData.append('file', this.file);
      formData.append('shop_item_id', this.form.shop_item_id);
      formData.append('file_source', 'shop_items');
      formData.append('file_type', 'FILE_IMAGE');
      formData.append('form_shop_item_id', this.form.shop_item_id);
      formData.append('company_id', this.currentCompanyId);
      axios
      .post( '/fileupload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )
      .then(res => {
        this.toastr('success', 'OK', 'Bilden laddades upp');
        console.log(res.data);
        this.form.frontend.img_url = res.data.fileobjs[0].public_path;
        console.log(this.form.frontend.img_url, ": URL");
      })
      .catch( err => {
        console.error(err);
        this.toastr('danger', 'Server Fel', 'Kunde inte ladda upp fil');
      });
    },

    checkAPISetup() {
      axios
        .get(`/api_key/service?service=dintero&company_id=${this.currentCompanyId}`)
        .then(res => {
          if (res.status === 404) {
            this.apiKeyNotFound = true;
          }
          else {
            this.apiKeyNotFound = false;
          }
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Fel', 'Kunde inte hämta API nyckeldata');
        });
    },

    async loadTemplates() {
      if (!this.currentCompanyId) {
        return;
      }

      this.templates = [];
      this.templateOptions = [];
      axios
        .get(`/template/list?company_id=${this.currentCompanyId}`)
        .then(res => {
          if (res.status === 200) {
            this.templates = res.data.templates;

            this.templates.forEach(t => {
              this.templateOptions.push({ text: t.name, value: t.template_id });
            });
          }
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte lista artiklar');
        });
    },
    tagChanged(ee) {

    },
    tagSelected(ee) {

    },
    async loadData() {
      if (!this.currentCompanyId) {
        return;
      }
      if (!this.titles) {
        return;
      }

      this.loadShopItems();
    },
    createShopItem() {
        this.resetForm();
      this.creating = false;
      this.editing = true;

      this.scrollToEditShopItem();

      this.form.company_id = this.currentCompanyId;
      this.form.period_id = this.currentPeriodId;
      this.form.frontend.reg_only = true;
      axios
        .post('/shop_item', this.form)
        .then(res => {
        if (res.status === 201) {
            this.creating = false;
            this.form = res.data.shop_item;
            this.toastr('success', 'OK', 'Artikel skapades');
            this.loadShopItems();
        }
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte skapa artikel');
        });
    },
    deleteShopItem(shop_item_id) {
      axios
        .delete(`/shop_item?shop_item_id=${shop_item_id}&company_id=${this.currentCompanyId}`)
        .then(res => {
          this.shop_items = this.shop_items.filter(item => item.shop_item_id !== shop_item_id);

          this.creating = false;
          this.editing = false;

          this.toastr('success', 'OK', 'Artikel togs bort');
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte ta bort artikel');
        });
    },
    selectShopItem(shop_item_id) {
      axios
        .get(`/shop_item?shop_item_id=${shop_item_id}&company_id=${this.currentCompanyId}`)
        .then(res => {

          this.form = res.data.shop_item;
          if (this.form.meta.is_days == null) {
            this.form.meta.is_days = false;
          }

          this.is_member_fee = this.form.meta.is_member_fee === 1;

           this.check_join[1] = false;
           this.check_join[0] = false;

          if (this.form.rules){
              if (this.form.rules.age_max) this.check_join[1] = true;
              if (this.form.rules.age_min) this.check_join[0] = true;
          } else {
              this.form.rules = {age_min: null, age_max: null};
          }

          this.creating = false;
          this.editing = true;

          // this.member_fee = this.form.meta.is_member_fee == 1;

          for (var i = 0; i < this.periods.length; ++i) {
            this.periods[i].selected = false;
          }

          if (this.form.meta.periods === null || this.form.meta.periods === undefined) {
            this.form.meta.periods = [];
          }

          for (var i = 0; i < this.periods.length; ++i) {

            for (var j = 0; j < this.form.meta.periods.length; ++j) {
              if (this.periods[i].id === this.form.meta.periods[j]) {
                this.periods[i].selected = true;
                break;
              }
            }
          }

          this.scrollToEditShopItem();
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte hämta artikel');
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
    loadShopItems() {
      this.shop_items = [];
      axios
        .get(`/shop_item/list?company_id=${this.currentCompanyId}&period_id=${this.currentPeriodId}`)
        .then(res => {
          if (res.status === 200) {
            this.shop_items = res.data.items;
          }
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte lista artiklar');
        });
    },
    updateShopItem(e) {
        e.preventDefault();
        console.log(this.form, "Form");

        this.form.meta.is_member_fee = this.is_member_fee ? 1 : 0;
        this.form.meta.member_fee = this.is_member_fee === 1;

        //this.form.meta.is_member_fee = this.member_fee ? 1 : 0;

        for (var i = 0; i < this.periods.length; ++i) {
          if (this.periods[i].selected) {
            this.form.meta.periods.push(this.periods[i].id);
          }
        }
        this.form.frontend.reg_only = true;
        if (this.creating) {
            axios
            .post('/shop_item', this.form)
            .then(res => {
              if (res.status === 201) {
                this.creating = false;
                this.form = res.data.shop_item;
                console.log(this.form, "CreateForm");
                this.toastr('success', 'OK', 'Artikeln skapades');
                this.loadShopItems();
              }
            })
            .catch(err => {
              console.error(err);
              this.toastr('danger', 'Server Fel', 'Kunde inte skapa artikeln');
            });
        }
        else {


            axios
            .put('/shop_item', this.form)
            .then(res => {
              if (res.status === 200) {
                this.creating = false;
                this.form = res.data.shop_item;
                console.log(this.form, "UpdateForm");
                this.toastr('success', 'OK', 'Artikeln uppdaterades');
                this.loadShopItems();
              }
            })
            .catch(err => {
              console.error(err);
              this.toastr('danger', 'Server Fel', 'Kunde inte uppdatera artikeln');
            });
        }
    },
    scrollToEditShopItem() {
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
      resetForm(){
        this.form = {
          shop_item_id:        '',
          company_id:          '',
          name:                '',
          descr:               '',
          price_sek:           0,
          vat_sek:             0,
          frontend:            {
          img_url: '',
              reg_only: 0
          },
          is_active:           false,
              discounts:           {
              pct: 0,
                  amount: 0,
                  reason: ''
          },
          meta:                {
              num_periods: 0,
                  is_member_fee: 0,
                  member_fee: false,
                  send_email_template_id: null,
                  periods: [] /** { period_id: string; from: string; to: string; name: string; } */
          },
          book_acct_vat:       0,
              book_acct_article:   0,
              book_place:          '',
              book_tags:           [],
              rules: {age_min: 0, age_max: 0}
          };
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
