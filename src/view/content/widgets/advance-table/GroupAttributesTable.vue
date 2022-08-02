<template>
  <!--begin::Advance Table Widget 9-->
  <div class="card card-custom card-stretch gutter-b">
    <!--begin::Header-->
    <div class="card-header border-0 py-5">
      <h3 class="card-title align-items-start flex-column">
        <span class="card-label font-weight-bolder text-dark pl-2">Attribut inom kategorin</span>
      </h3>
      <div class="card-toolbar">
        <a
          href="#"
          class="btn btn-primary font-weight-bolder font-size-sm"
          @click="createGroupAttributeClicked"
          ><i class="menu-icon flaticon2-plus" style="font-size: 1em"></i>Nytt Attribut</a
        >
      </div>
    </div>
    <!--end::Header-->
    <!--begin::Body-->
    <div class="card-body pt-0 table-responsive">
      <b-table
        id="stickprov-table"
        :fields="headers"
        :items="properties"
        head-variant="light"
        class='w-100 mh-100'
        sticky-header
      >
        <template #cell(action)='row'>
          <div class='d-flex justify-content-end'>
            <a
              href="#"
              class="btn btn-icon btn-light btn-sm mx-3"
              @click="selectGroupAttributeClicked(row.item.prop_id)"
            >
              <span class="svg-icon svg-icon-md svg-icon-primary">
                <!--begin::Svg Icon-->
                <inline-svg src="/assets/svg/Write.svg"></inline-svg>
                <!--end::Svg Icon-->
              </span>
            </a>
            <a
              href="#"
              class="btn btn-icon btn-light btn-sm"
              @click="deleteGroupAttributeClicked(row.item.prop_id)"
            >
              <span class="svg-icon svg-icon-md svg-icon-primary">
                <!--begin::Svg Icon-->
                <inline-svg src="/assets/svg/Trash.svg"></inline-svg>
                <!--end::Svg Icon-->
              </span>
            </a>
          </div>
        </template>
      </b-table>
    </div>

    <div class="card-body pt-0 pb-3">
      <!--begin::Table-->
      <!-- <div class="table-responsive">
        <table class="table table-head-custom table-vertical-center table-head-bg table-borderless">
          <thead>
            <tr class="text-left">
              <th style="min-width: 40px" class='pl-7'>
                <span class="text-dark-75">Attribut</span>
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(item, i) in properties">
              <GroupAttributesTableRow
                v-bind:key="i"
                :prop="item"
                :currentCompanyId="currentCompanyId"
                @selectGroupAttributeClicked="selectGroupAttributeClicked"
                @deleteGroupAttributeClicked="deleteGroupAttributeClicked"
                @toastr="toastr"
              />
            </template>
          </tbody>
        </table>
      </div> -->
      <div class="scroll-to-attributes"></div>
      <div v-if="creating || editing">
        <div class="card card-custom card-stretch gutter-b">
          <div class="card-header border-0 py-5">
            <h3 class="card-title align-items-start flex-column">
              <span class="card-label font-weight-bolder text-dark">Editera Attribut</span>
            </h3>
          </div>
          <div class="card-body pt-0 pb-3">
            <b-form @submit="updateProperty" class="mt-8">
              <b-form-group id="input-group-prop_id" label="ID" label-for="input-prop_id">
                <b-form-input
                  id="input-prop_id"
                  v-model="form.prop_id"
                  type="text"
                  disabled
                ></b-form-input>
              </b-form-group>

              <b-form-group id="input-group-prop-name" label="Namn" label-for="input-prop-name">
                <b-form-input id="input-prop-name" v-model="form.name" type="text"></b-form-input>
              </b-form-group>

              <b-form-group
                id="input-group-prop-descr"
                label="Beskrivning"
                label-for="input-prop-descr"
              >
                <b-form-textarea
                  id="input-prop-descr"
                  size="sm"
                  placeholder="Beskrivande text om attributet..."
                  v-model="form.descr"
                ></b-form-textarea>
              </b-form-group>

              <b-button type="submit" variant="primary" :disabled="form.name==''">Spara</b-button>
            </b-form>
          </div>
        </div>
      </div>
      <!--end::Table-->
    </div>
    <!--end::Body-->
  </div>
  <!--end::Advance Table Widget 9-->
</template>
<style lang="scss" scoped>
.checkbox.checkbox-light-success > span {
  background-color: white;
  border: 1px solid #ddd;
}
</style>
<script>
import axios from 'axios';
import GroupAttributesTableRow from '@/view/content/widgets/advance-table/GroupAttributesTableRow.vue';
import { validationMixin } from 'vuelidate';
import { required, email, minLength, sameAs } from 'vuelidate/lib/validators';

export default {
  mixins: [validationMixin],
  name: 'props-table',
  props: ['currentCompanyId', 'group_id'],
  components: {
    GroupAttributesTableRow
  },
  mounted() {
    this.loadAttributes();
  },
  watch: {
    group_id(newValue, oldvalue) {
      this.creating = false;
      this.editing = false;
      this.loadAttributes();
    }
  },
  methods: {
    createGroupAttributeClicked() {
      this.creating = false;
      this.editing = true;

      this.scrollToEditGroup();

      this.form.company_id = this.currentCompanyId;
      this.form.period_id = this.currentPeriodId;
      this.form.group_id = this.group_id;
      this.form.name = '';
      this.form.descr = '';

      axios
        .post('/member_property', this.form)
        .then(res => {
          if (res.status === 201) {
            this.creating = false;
            this.form = res.data.member_property;
            console.log(this.form, "Attribute");
            this.toastr('success', 'OK', 'Attributet skapades');
            this.loadAttributes();
          }
        })
        .catch(err => {
          this.toastr('danger', 'Server Fel', 'Kunde inte skapa attributet');
        });
    },
    loadAttributes() {
      this.properties = [];
      axios
        .get(`/member_property/list?group_id=${this.group_id}`)
        .then(res => {
          if (res.status === 200) {
            this.properties = res.data.properties;
          }
        })
        .catch(err => {
          this.toastr('danger', 'Server Fel', 'Kunde inte lista attribut');
        });
    },
    selectGroupAttributeClicked(prop_id) {
      this.editing = true;
      this.creating = false;
      this.scrollToEditGroup();
      for (let i = 0;i < this.properties.length; i++)
        if (prop_id == this.properties[i].prop_id) {
          this.form = this.properties[i];
          break;
        }
    },
    updateProperty(e) {
      this.$v.form.$touch();
      if (this.$v.form.$anyError) {
        this.toastr('danger', 'Info', 'Namnattributet måste finnas.');
        return;
      }
      e.preventDefault();
      console.log(this.form, ": Form Data");
      this.form.group_id = this.group_id;
      axios
        .put('/member_property', this.form)
        .then(res => {
          if (res.status === 200) {
            this.creating = false;
            this.editing = false;
            this.form = res.data.member_property;
            this.toastr('success', 'OK', 'Attributet uppdaterades');
            this.loadAttributes();
          }
        })
        .catch(err => {
          this.toastr('danger', 'Server Fel', 'Kunde inte uppdatera attributet');
        });
    },
    deleteGroupAttributeClicked(prop_id) {
      axios
        .delete(`/member_property?prop_id=${prop_id}&company_id=${this.currentCompanyId}`)
        .then(res => {
          this.properties = this.properties.filter(item => item.prop_id !== prop_id);

          this.creating = false;
          this.editing = false;

          this.toastr('success', 'OK', 'Attributet togs bort');
        })
        .catch(err => {
          this.toastr('danger', 'Server Fel', 'Kunde inte ta bort attributet');
        });

      this.$emit('deleteGroupAttributeClicked', prop_id);
    },
    scrollToEditGroup() {
      var that = this;
      setTimeout(function () {
        const el = that.$el.getElementsByClassName('scroll-to-attributes')[0];

        if (el) {
          const yOffset = -70;
          const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;

          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 100);
    },
    toastr(type, title, message) {
      this.$emit('toastr', type, title, message);
    },
    validateState(name) {
      const { $dirty, $error } = this.$v.form[name];
      return $dirty ? !$error : null;
    },
  },
  data() {
    return {
      properties: [],
      headers: [
        {
          key: 'name',
          label: 'Attribut',
          sortable: true,
          thClass: 'pl-7 w-100',
          tdClass: 'pl-7 align-middle'
        },
        {
          key: 'action',
          label: '',
          thClass: 'w-110px',
          tdClass: 'align-middle'
        },
      ],
      list: [],
      form: {
        prop_id: '',
        name: '',
        descr: '',
        company_id: null,
        period_id: null
      },
      creating: false,
      editing: false
    };
  },
  validations: {
    form: {
      name: { required, minLength: minLength(1) }
    }
  },
};
</script>
