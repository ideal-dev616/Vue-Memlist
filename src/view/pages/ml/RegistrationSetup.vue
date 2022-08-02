<template>
  <div class="px-5" id="page-registrationsetup">
    <h5 class="mb-6 ml-2">Registeringswizard</h5>

    <PagesTable
      :items="pages"
      :types="types"
      @moveUpClicked="moveUp"
      @moveDownClicked="moveDown"
      @createPageClicked="createPage"
      @selectPageClicked="selectPage"
      @deletePageClicked="deletePage"
      @toastr="toastr"
    />
    <div class="scroll-to-container"></div>
    <b-card
      title=""
      class="mb-2 edit-reg-container"
      ref="edit-reg"
      id="edit-reg"
      hide-footer
      v-if="creating || editing"
    >
      <div>
        <b-form @submit="savePage" class="mt-8">
          <b-form-group id="input-group-id" label="ID" label-for="input-id">
            <b-form-input
              id="input-id"
              v-model="page.id"
              type="text"
              disabled
            ></b-form-input>
          </b-form-group>

          <b-form-group id="input-group-name" label="Namn" label-for="input-name">
            <b-form-input id="input-name" v-model="page.name" type="text"></b-form-input>
          </b-form-group>

          <b-form-group
            id="input-group-type"
            label="Typ"
            label-for="input-type"
            v-if="page.type !== 'confirm'"
          >
            <b-form-select v-model="type" :options="typeOptions"></b-form-select>
          </b-form-group>

          <div v-if="page.type === 'personnr'">
            <b-form-group>
              <div class="d-flex align-items-center">
                <label
                  class="checkbox checkbox-lg checkbox-outline checkbox-success"
                >
                  <input
                    type="checkbox"
                    name=""
                    v-model="page.settings.is_mandatory"
                    @click="page.settings.is_mandatory = !page.settings.is_mandatory"
                  />
                  <span></span>
                </label>
                <span class="ml-3 cursor-pointer"
                  >Medlemmen måste fylla i fullständigt personnummer</span
                >
              </div>
            </b-form-group>
            <b-form-group>
              <div class="d-flex align-items-center">
                <label
                  class="checkbox checkbox-lg checkbox-outline checkbox-success"
                >
                  <input
                    type="checkbox"
                    name=""
                    v-model="page.settings.spar"
                    @click="page.settings.spar = !page.settings.spar"
                  />
                  <span></span>
                </label>
                <span class="ml-3 cursor-pointer"
                  >Gör SPAR uppslag för underlätta registreringen (Kostnad tillkommer)</span
                >
              </div>
            </b-form-group>
          </div>

          <div v-if="page.type === 'parents'">
            <div class="d-flex align-items-center mb-6 w-50" v-if="page.settings.from_age">
              <b-input-group class="mb-2 md-8">
                <b-input-group-prepend is-text
                >Målsman måste vara minst ålder</b-input-group-prepend
                >
                <b-form-input
                        type="number"
                        disabled
                        v-model="page.settings.from_age"
                ></b-form-input>
              </b-input-group>
            </div>
            <p class="mt-4 mb-8">Obligatoriska uppgifter</p>

            <b-form-group>
              <div class="d-flex align-items-center">
                <label
                  class="checkbox checkbox-lg checkbox-outline checkbox-success"
                >
                  <input
                    type="checkbox"
                    name=""
                    disabled
                    v-model="page.settings.name"
                    checked="checked"
                    @click="page.settings.name = !page.settings.name"
                  />
                  <span></span>
                </label>
                <span class="ml-3 cursor-pointer">Namn</span>
              </div>
            </b-form-group>

            <b-form-group>
              <div class="d-flex align-items-center">
                <label
                  class="checkbox checkbox-lg checkbox-outline checkbox-success"
                >
                  <input
                    type="checkbox"
                    name=""
                    disabled
                    v-model="page.settings.email"
                    checked="checked"
                    @click="page.settings.email = !page.settings.email"
                  />
                  <span></span>
                </label>
                <span class="ml-3 cursor-pointer">E-post</span>
              </div>
            </b-form-group>

            <b-form-group>
              <div class="d-flex align-items-center">
                <label
                  class="checkbox checkbox-lg checkbox-outline checkbox-success"
                >
                  <input
                    type="checkbox"
                    name=""
                    v-model="page.settings.personnr"
                    checked="checked"
                    @click="page.settings.personnr = !page.settings.personnr"
                  />
                  <span></span>
                </label>
                <span class="ml-3 cursor-pointer">Personnummer</span>
              </div>
            </b-form-group>

            <b-form-group>
              <div class="d-flex align-items-center">
                <label
                  class="checkbox checkbox-lg checkbox-outline checkbox-success"
                >
                  <input
                    type="checkbox"
                    name=""
                    v-model="page.settings.phone"
                    checked="checked"
                    @click="page.settings.phone = !page.settings.phone"
                  />
                  <span></span>
                </label>
                <span class="ml-3 cursor-pointer">Telefon</span>
              </div>
            </b-form-group>

            <b-form-group>
              <div class="d-flex align-items-center">
                <label
                  class="checkbox checkbox-lg checkbox-outline checkbox-success"
                >
                  <input
                    type="checkbox"
                    name=""
                    v-model="page.settings.address"
                    checked="checked"
                    @click="page.settings.address = !page.settings.address"
                  />
                  <span></span>
                </label>
                <span class="ml-3 cursor-pointer">Gatuadress</span>
              </div>
            </b-form-group>

            <b-form-group>
              <div class="d-flex align-items-center">
                <label
                  class="checkbox checkbox-lg checkbox-outline checkbox-success"
                >
                  <input
                    type="checkbox"
                    name=""
                    v-model="page.settings.zipcode"
                    checked="checked"
                    @click="page.settings.zipcode = !page.settings.zipcode"
                  />
                  <span></span>
                </label>
                <span class="ml-3 cursor-pointer">Postkod</span>
              </div>
            </b-form-group>

            <b-form-group>
              <div class="d-flex align-items-center">
                <label
                  class="checkbox checkbox-lg checkbox-outline checkbox-success"
                >
                  <input
                    type="checkbox"
                    name=""
                    v-model="page.settings.region"
                    checked="checked"
                    @click="page.settings.region = !page.settings.region"
                  />
                  <span></span>
                </label>
                <span class="ml-3 cursor-pointer">Region</span>
              </div>
            </b-form-group>

            <b-form-group>
              <div class="d-flex align-items-center">
                <label
                  class="checkbox checkbox-lg checkbox-outline checkbox-success"
                >
                  <input
                    type="checkbox"
                    name=""
                    v-model="page.settings.commune"
                    checked="checked"
                    @click="page.settings.commune = !page.settings.commune"
                  />
                  <span></span>
                </label>
                <span class="ml-3 cursor-pointer">Kommun</span>
              </div>
            </b-form-group>
          </div>

          <div v-if="page.type === 'details'">
            <p class="mt-4 mb-8">Obligatoriska uppgifter</p>

            <b-form-group>
              <div class="d-flex align-items-center">
                <label
                  class="checkbox checkbox-lg checkbox-outline checkbox-success"
                >
                  <input
                    type="checkbox"
                    name=""
                    disabled
                    v-model="page.settings.name"
                    checked="checked"
                    @click="page.settings.name = !page.settings.name"
                  />
                  <span></span>
                </label>
                <span class="ml-3 cursor-pointer">Namn</span>
              </div>
            </b-form-group>

            <b-form-group>
              <div class="d-flex align-items-center">
                <label
                  class="checkbox checkbox-lg checkbox-outline checkbox-success"
                >
                  <input
                    type="checkbox"
                    name=""
                    disabled
                    v-model="page.settings.email"
                    checked="checked"
                    @click="page.settings.email = !page.settings.email"
                  />
                  <span></span>
                </label>
                <span class="ml-3 cursor-pointer">E-post</span>
              </div>
            </b-form-group>

            <b-form-group>
              <div class="d-flex align-items-center">
                <label
                  class="checkbox checkbox-lg checkbox-outline checkbox-success"
                >
                  <input
                    type="checkbox"
                    name=""
                    v-model="page.settings.password"
                    checked="checked"
                    @click="page.settings.password = !page.settings.password"
                  />
                  <span></span>
                </label>
                <span class="ml-3 cursor-pointer">Lösenord</span>
              </div>
            </b-form-group>

            <b-form-group>
              <div class="d-flex align-items-center">
                <label
                  class="checkbox checkbox-lg checkbox-outline checkbox-success"
                >
                  <input
                    type="checkbox"
                    name=""
                    v-model="page.settings.company_name"
                    @click="page.settings.company_name = !page.settings.company_name"
                  />
                  <span></span>
                </label>
                <span class="ml-3 cursor-pointer">Eventuellt företagsnamn</span>
              </div>
            </b-form-group>

            <b-form-group>
              <div class="d-flex align-items-center">
                <label
                  class="checkbox checkbox-lg checkbox-outline checkbox-success"
                >
                  <input
                    type="checkbox"
                    name=""
                    v-model="page.settings.birthdate"
                    @click="page.settings.birthdate = !page.settings.birthdate"
                  />
                  <span></span>
                </label>
                <span class="ml-3 cursor-pointer">Födelsedata</span>
              </div>
            </b-form-group>

            <b-form-group>
              <div class="d-flex align-items-center">
                <label
                  class="checkbox checkbox-lg checkbox-outline checkbox-success"
                >
                  <input
                    type="checkbox"
                    name=""
                    v-model="page.settings.phone"
                    @click="page.settings.phone = !page.settings.phone"
                  />
                  <span></span>
                </label>
                <span class="ml-3 cursor-pointer">Telefonnummer</span>
              </div>
            </b-form-group>

            <b-form-group>
              <div class="d-flex align-items-center">
                <label
                  class="checkbox checkbox-lg checkbox-outline checkbox-success"
                >
                  <input
                    type="checkbox"
                    name=""
                    v-model="page.settings.address"
                    @click="page.settings.address = !page.settings.address"
                  />
                  <span></span>
                </label>
                <span class="ml-3 cursor-pointer">Gatuadress</span>
              </div>
            </b-form-group>

            <b-form-group>
              <div class="d-flex align-items-center">
                <label
                  class="checkbox checkbox-lg checkbox-outline checkbox-success"
                >
                  <input
                    type="checkbox"
                    name=""
                    v-model="page.settings.co"
                    @click="page.settings.co = !page.settings.co"
                  />
                  <span></span>
                </label>
                <span class="ml-3 cursor-pointer">C/O</span>
              </div>
            </b-form-group>

            <b-form-group>
              <div class="d-flex align-items-center">
                <label
                  class="checkbox checkbox-lg checkbox-outline checkbox-success"
                >
                  <input
                    type="checkbox"
                    name=""
                    v-model="page.settings.zipcode"
                    @click="page.settings.zipcode = !page.settings.zipcode"
                  />
                  <span></span>
                </label>
                <span class="ml-3 cursor-pointer">Postkod</span>
              </div>
            </b-form-group>

            <b-form-group>
              <div class="d-flex align-items-center">
                <label
                  class="checkbox checkbox-lg checkbox-outline checkbox-success"
                >
                  <input
                    type="checkbox"
                    name=""
                    v-model="page.settings.region"
                    @click="page.settings.region = !page.settings.region"
                  />
                  <span></span>
                </label>
                <span class="ml-3 cursor-pointer">Region</span>
              </div>
            </b-form-group>

            <b-form-group>
              <div class="d-flex align-items-center">
                <label
                  class="checkbox checkbox-lg checkbox-outline checkbox-success"
                >
                  <input
                    type="checkbox"
                    name=""
                    v-model="page.settings.commune"
                    @click="page.settings.commune = !page.settings.commune"
                  />
                  <span></span>
                </label>
                <span class="ml-3 cursor-pointer">Kommun</span>
              </div>
            </b-form-group>

            <b-form-group>
              <div class="d-flex align-items-center">
                <label
                  class="checkbox checkbox-lg checkbox-outline checkbox-success"
                >
                  <input
                    type="checkbox"
                    name=""
                    v-model="page.settings.billing"
                    @click="page.settings.billing = !page.settings.billing"
                  />
                  <span></span>
                </label>
                <span class="ml-3 cursor-pointer">Fakturaadress</span>
              </div>
            </b-form-group>
          </div>

          <div v-if="page.type === 'shop'">
            <p class="mt-4 mb-8">Visning</p>

            <b-form-group>
              <div class="d-flex align-items-center">
                <label
                  class="checkbox checkbox-lg checkbox-outline checkbox-success"
                >
                  <input
                    type="checkbox"
                    name=""
                    v-model="page.settings.memberships"
                    checked="checked"
                    @click="page.settings.memberships = !page.settings.memberships"
                  />
                  <span></span>
                </label>
                <span class="ml-3 cursor-pointer">Visa medlemskap</span>
              </div>
            </b-form-group>

            <b-form-group>
              <div class="d-flex align-items-center">
                <label
                  class="checkbox checkbox-lg checkbox-outline checkbox-success"
                >
                  <input
                    type="checkbox"
                    name=""
                    v-model="page.settings.extras"
                    checked="checked"
                    @click="page.settings.extras = !page.settings.extras"
                  />
                  <span></span>
                </label>
                <span class="ml-3 cursor-pointer">Visa merförsäljning</span>
              </div>
            </b-form-group>
          </div>

          <div v-if="page.type === 'area_alloc'">
            <p class="mt-4 mb-8">Visning</p>

            <b-form-group>
              <div class="d-flex align-items-center">
                <label
                  class="checkbox checkbox-lg checkbox-outline checkbox-success"
                >
                  <input
                    type="checkbox"
                    name=""
                    v-model="page.settings.memberships"
                    checked="checked"
                    @click="page.settings.memberships = !page.settings.memberships"
                  />
                  <span></span>
                </label>
                <span class="ml-3 cursor-pointer">Visa medlemskap</span>
              </div>
            </b-form-group>
          </div>

          <div v-if="page.type === 'confirm'">
            <b-form-group>
              <div>
                <ConfirmTable
                  :page="this.page"
                  @toastr="toastr"
                >
                </ConfirmTable>
              </div>
            </b-form-group>

            <!-- todo: add a tinymce editor for the terms -->
          </div>

          <b-form-group
            id="html-group"
            label="Text"
            label-for="html"
            v-if="page.type !== 'confirm'"
          >
            <editor
              v-model="page.html"
              api-key="qjaly68mahdluhx0rongdllvelixwgn18730f5z7fdzq6hq2"
              :init="{
                height: 500,
                menubar: false,
                plugins: [
                  'advlist autolink lists link image charmap print preview anchor',
                  'searchreplace visualblocks code fullscreen',
                  'insertdatetime media table paste code help wordcount'
                ],
                toolbar:
                  'undo redo | formatselect | bold italic backcolor | \
                    alignleft aligncenter alignright alignjustify | \
                    bullist numlist outdent indent | removeformat'
              }"
            />
          </b-form-group>

          <b-button type="submit" variant="primary"
            v-if="page.type !== 'confirm'"
          >Spara</b-button>
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
import Editor from '@tinymce/tinymce-vue';
import axios from 'axios';
import { mapGetters } from 'vuex';
import PagesTable from '@/view/pages/ml/registrationsetup/PagesTable.vue';
import ConfirmTable from '@/view/pages/ml/registrationsetup/ConfirmTable.vue';

export default {
  name: 'registrationsetup',
  components: {
    PagesTable,
    ConfirmTable,
    editor: Editor
  },
  computed: {
    ...mapGetters(['currentCompanyId', 'currentPeriodId', 'periods'])
  },
  mounted() {
    this.loadPages();
  },
  data() {
    return {
      page: {
        name: 'test',
        active: false,
        html: 'content',
        index: 0,
        type: 'personnr',
        id: 'aaa',
        settings: {}
      },
      settings: {
        personnr: {
          is_mandatory: false,
          spar: false
        },
        details: {
          address: false,
          birthdate: false,
          phone: false,
          company_name: false
        },
        shop: {
          memberships: false,
          extras: false
        },
        parents: {
          address: false,
          personnr: false,
          phone: false,
          from_age: 18
        }
      },
      typeOptions: [
        { value: 'personnr', text: 'Personnummer' },
        { value: 'details', text: 'Personuppgifter' },
        { value: 'reg_family', text: 'Familjemedlemskap' },
        { value: 'properties', text: 'Attribut/Utbildning' },
        { value: 'parents', text: 'Målsman' },
        { value: 'shop', text: 'Butik/Medlemskap' },
        { value: 'area_alloc', text: 'Områdesfördelning' },
        // { value: 'confirm', text: 'Bekräftelse' }
      ],
      types: {
        personnr: 'Personnummer',
        details: 'Personuppgifter',
        properties: 'Attribut/Utbildning',
        parents: 'Målsman',
        shop: 'Butik',
        area_alloc: 'Områdesfördelning',
        confirm: 'Bekräftelse',
        reg_family: 'Familjemedlemskap',
      },
      creating: false,
      editing: false,
      pages: [
        {
          name: 'test',
          active: false,
          html: 'content',
          index: 0,
          type: 'personnr',
          id: 'aaa',
          settings: {}
        }
      ],
      type: '',
      confirmPageId: '',
      age_req_parent: [null, null],
    };
  },

  watch: {
    type(newValue, oldValue) {
      this.page.type = newValue;

      if (newValue === 'parents') {
        this.page.settings.from_age = 18;
      }
      if (newValue === 'confirm') {
        this.page.settings.accept_terms = true;
      }
    },
    currentCompanyId(newValue, oldvalue) {
      if (newValue) {
        this.loadPages();
      }
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
      //formData.append('ladok_id', this.form.ladok_id);
      //formData.append('file_source', 'ladok');
      //formData.append('file_type', 'FILE_CSV');
      //formData.append('form_ladok_id', this.form.ladok_id);
      formData.append('company_id', this.currentCompanyId);

      axios
        .post('/fileupload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then(res => {})
        .catch(err => {
          this.toastr('danger', 'Server Fel', 'Kunde inte ladda upp fil');
          console.log(err);
        });
    },
    async loadData() {
      if (!this.currentCompanyId) {
        return;
      }

      this.loadPages();
    },

    moveUp(page_id) {
      this.movePage(page_id, 'up');
    },

    moveDown(page_id) {
      this.movePage(page_id, 'down');
    },

    movePage(page_id, dir) {
      axios
        .put('/company/regpagemove', { id: page_id, dir: dir, company_id: this.currentCompanyId })
        .then(res => {
          this.loadPages();
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte skapa sida');
        });
    },

    createPage() {
      console.log('Creating a page');
      this.creating = true;
      this.editing = true;

      this.page = { settings: {} };

      this.scrollToEditPage();
    },

    savePage(e) {
      e.preventDefault();

      if (this.creating) {
        this.postPage();
      } else {
        this.putPage();
      }
    },

    putPage() {
      this.page.company_id = this.currentCompanyId;
      axios
        .put('/company/regpage', this.page)
        .then(res => {
          if (res.status === 204) {
            this.creating = false;
            this.toastr('success', 'OK', 'Sidan uppdaterades');
            if (this.page.type != 'confirm') {
              this.editing = false;
              this.page = res.data.page;
              this.loadPages();
            }
          }
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte skapa sida');
        });
    },

    postPage() {
      this.page.company_id = this.currentCompanyId;
      console.log(this.page, ': PageData');
      axios
        .post('/company/regpage', this.page)
        .then(res => {
          if (res.status === 201) {
            this.creating = false;
            this.page = res.data.page;
            this.toastr('success', 'OK', 'Sidan skapades');
            if (this.page.type != 'confirm') {
              this.editing = false;
              this.page = res.data.page;
              this.loadPages();
            }
          }
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte skapa sida');
        });
    },

    deletePage(id) {
      axios
        .delete(`/company/regpage?id=${id}&company_id=${this.currentCompanyId}`)
        .then(res => {
          this.pages = this.pages.filter(item => item.id !== id);

          this.creating = false;
          this.editing = false;

          this.toastr('success', 'OK', 'Sidan togs bort');
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte ta bort sidan');
        });
    },

    selectPage(id) {

      for (var i = 0; i < this.pages.length; ++i) {
        if (this.pages[i].id === id) {
          this.page = this.pages[i];

          if (this.page.settings === undefined || this.page.settings === null) {
            this.page.settings = {};
          }

          this.creating = false;
          this.editing = true;
          this.type = this.page.type;

          this.scrollToEditPage();
          break;
        }
      }
    },

    createConfirmPage() {
      this.page.company_id = this.currentCompanyId;
      console.log(this.page, ': PageData');
      var pageData = {
        type: 'confirm',
        company_id: this.currentCompanyId,
        name: 'Confirm',
        settings: { terms: [] }
      };
      axios
        .post('/company/regpage', pageData)
        .then(res => {
          if (res.status === 201) {
            this.creating = false;
            this.editing = false;
            this.loadPages();
            this.confirmPageId = res.data.page.id;
          }
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte skapa sida');
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

    loadPages() {
      this.pages = [];
      console.log(this.currentCompanyId, ': company id');
      axios
        .get(`/company?company_id=${this.currentCompanyId}`)
        .then(res => {
          if (res.status === 200) {
            this.pages = res.data.company.registration.pages;
            this.age_req_parent = res.data.company.registration.age_req_parent;
            if (this.pages == undefined)
              this.pages = [];
            let tempConfirmPages = this.pages.filter(function(item) {return item.type=='confirm'});
            if (tempConfirmPages.length > 1)
              this.deletePage(tempConfirmPages[0].id);
            if (tempConfirmPages.length === 0)
              this.createConfirmPage();

            this.pages = this.pages.sort(function(a, b) {
              if (a.index < b.index) { return -1; }
              return 1;
            });


            console.log('pages sort');
            console.log(this.pages);
          }
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte lista sidor');
        });
    },

    scrollToEditPage() {
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
