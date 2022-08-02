<template>
  <!--begin::Advance Table Widget 9-->
  <div class="card card-custom card-stretch gutter-b">
    <!--begin::Body-->
    <div class="card-body pt-0 pb-3">
      <b-alert class="mt-8" v-if="startImport && poll" show variant="secondary"
        ><strong>Vänligen vänta</strong><br />Raderna importeras och valideras. Detta steg kan
        ta några minuter beroende på hur stor filen är.</b-alert
      >

      <div v-if="startImport && poll" class="d-flex justify-content-center mt-10 mb-10">
        <b-spinner
          class="mx-auto text-center align-center"
          type="grow"
          label="Loading..."
        ></b-spinner>
      </div>

      <div v-if="startImport && !poll">
        <h4 class="mt-8">Granska resultatet av importen</h4>
        <!--begin::Table-->
        <div class="table-responsive mt-4">
          <table
            class="table table-head-custom table-vertical-center table-head-bg table-borderless"
          >
            <tbody>
              <tr class="text-left">
                <td>Antal totalt</td>
                <td>{{ objects.total }}</td>
              </tr>
              <tr>
                <td>Antal med fel</td>
                <td>{{ objects.errors }}</td>
              </tr>
              <tr>
                <td>Antal nya</td>
                <td>{{ objects.create }}</td>
              </tr>
              <tr>
                <td>Antal uppdaterade</td>
                <td>{{ objects.update }}</td>
              </tr>
            </tbody>
          </table>

          <div class="mt-8">
            <div class="form-group">
              <label style="font-weight: bold" class="mb-8">Importalternativ</label>
              <div class="radio-list">
                <label class="radio radio-outline radio-success mb-4" v-if="objects.errors > 0">
                  <input
                    type="radio"
                    v-model="import_option"
                    name="radios1"
                    value="include_errors"
                  />
                  <span></span>
                  Importera alla, inklusive med fel
                </label>
                <label class="radio radio-outline radio-success mb-4" v-if="objects.errors > 0">
                  <input
                    type="radio"
                    v-model="import_option"
                    name="radios1"
                    value="exclude_errors"
                  />
                  <span></span>
                  Importera endast utan fel
                </label>
                <label class="radio radio-outline radio-success mb-4" v-if="objects.errors == 0">
                  <input type="radio" v-model="import_option" name="radios1" value="all" />
                  <span></span>
                  Importera alla
                </label>
              </div>
            </div>
          </div>

          <div>
            <div class="table-responsive mt-8">
              <table
                class="table table-head-custom table-vertical-center table-head-bg table-borderless"
              >
                <thead>
                  <tr class="text-left">
                    <th style="min-width: 40px">
                      <span class="text-dark-75">Rad</span>
                    </th>
                    <th>Förnamn</th>
                    <th>Efternamn</th>
                    <th>Fel</th>
                  </tr>
                </thead>
                <tbody>
                  <ImportErrorRow
                    v-for="item in error_rows"
                    :key="item.id"
                    :error="item"
                  />
                </tbody>
              </table>
            </div>
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
.checkbox > span {
  background-color: white;
  border: 1px solid #ddd;
}
</style>
<script>
import axios from 'axios';
import { mapGetters } from 'vuex';
import ImportErrorRow from '@/view/pages/ml/import/ImportErrorRow.vue';

export default {
  name: 'import-confirm-page',
  props: ['mapped_columns', 'startImport', 'file_id', 'datatype'],
  components: {
    ImportErrorRow
  },
  computed: {
    ...mapGetters(['currentCompanyId', 'currentPeriodId'])
  },
  data() {
    return {
      objects: {
        total: 0,
        errors: 0,
        create: 0,
        update: 0
      },
      import_option: null,
      interval_id: -1,
      error_rows: [],
      poll: false,
      import: {
        import_id: '10',
        rows: [
          {
            deleted: 0,
            import_record_id: '1733',
            import_id: '10',
            crud: 'X',
            src_loc: '',
            table_name: 'ml_client',
            cols: [
              {
                col_name: 'rdt',
                prev_val: '',
                new_val: '2018-01-19 01:30:00',
                valtype: '',
                status: '',
                reason: ''
              },
              {
                col_name: 'firstname',
                prev_val: '',
                new_val: 'Jakob',
                valtype: '',
                status: '',
                reason: ''
              },
              {
                col_name: 'lastname',
                prev_val: '',
                new_val: 'Nilsson',
                valtype: '',
                status: '',
                reason: ''
              },
              {
                col_name: 'email',
                prev_val: '',
                new_val: 'kem15jni@student.lu.se',
                valtype: '',
                status: 'FAIL',
                reason: 'Ogilitig email'
              }
            ],
            table_pk_id: '',
            table_pk_name: 'client_id',
            result: 'fatal',
            status: 'FAIL',
            error_row: {
              row_number: 2,
              error_cols: [
                {
                  name: 'email',
                  error_value: 'lund',
                  reason: 'Ogilitig email',
                  source_value: 'lund',
                  max_length: 128
                }
              ],
              has_error: true
            }
          }
        ],
        num_records_inserted: 0,
        num_records_updated: 0,
        num_records_error: 34,
        status: 'IMP_WAIT'
      }
    };
  },
  mounted() {},
  watch: {
    startImport(newValue, oldValue) {
      console.log('confirm page, start import: ' + newValue);
      if (newValue) {
        this.startImportJob(
          this.file_id,
          this.mapped_columns,
          this.currentPeriodId,
          this.currentCompanyId
        );
      }
    },
    import_option(newValue, oldValue) {
      if (newValue) {
        this.$emit('finalizeReady', newValue);
      }
    },
    import_id(newValue, oldValue) {
      if (newValue && newValue !== '') {
        console.log('Confirm page Import ID has been set: ' + newValue);
      }
    },
    poll(newValue, oldValue) {
      if (newValue) {
        var that = this;
        that.interval_id = setInterval(function () {
          console.log('fetching...');
          that.fetchImportJob(that.import.import_id);
        }, 1000);
      } else {
        console.log('poll false, clearing');
        clearInterval(this.interval_id);
      }
    }
  },
  methods: {
    getColValue(cols, col_name) {
      for (var i = 0; i < cols.length; ++i) {
        if (cols[i].col_name === col_name) {
          return cols[i].new_val;
        }
      }

      return 'Hittades ej';
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
    exportErrors(import_id) {
      axios
        .post('/import/exporterrors', { import_id: import_id })
        .then(res => {
          location.href = res.data.file_url;
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte generera exportfil');
        });
    },
    startImportJob(file_id, mapped_columns, period_id, company_id) {
      axios
        .post(this.datatype === 'clients' ? '/import/client' : '/import/company', {
          file_id: file_id,
          mapped_columns: mapped_columns,
          period_id: period_id,
          company_id: company_id
        })
        .then(res => {
          this.import = { import_id: res.data.import_id };
          this.poll = true;
          console.log('Starting to poll');

          this.$emit('setImportId', this.import.import_id);
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte starta import');
        });
    },
    fetchImportJob(import_id) {
      axios
        .get(`/import?import_id=${import_id}`)
        .then(res => {
          if (res.data.import.status === 'PENDING') {
            console.log('pending still...');
            return;
          }

          if (res.status === 200) {
            clearInterval(this.interval_id);
          }

          this.import = res.data.import;

          this.objects.total = this.import.num_records_inserted + this.import.num_records_updated;
          this.objects.errors = this.import.num_records_error;
          this.objects.create = this.import.num_records_inserted;
          this.objects.update = this.import.num_records_updated;

          if (this.objects.errors > 0) {
            this.$refs.radio_all;
          }

          for (var i = 0; i < this.import.rows.length; ++i) {
            var row = this.import.rows[i];

            if (row.status === 'FAIL') {
              var errors = [];

              for (var j = 0; j < row.error_row.error_cols.length; ++j) {
                var col = row.error_row.error_cols[j];
                errors.push(col.reason + ': ' + col.error_value);
              }

              if (this.datatype === 'clients') {
                this.error_rows.push({
                  id: this.randomstr(8),
                  row: row.error_row.row_number,
                  firstname: this.getColValue(row.cols, 'firstname'),
                  lastname: this.getColValue(row.cols, 'lastname'),
                  errors: errors
                });
              }
              else if (this.datatype === 'companies') {
                this.error_rows.push({
                  id: this.randomstr(8),
                  row: row.error_row.row_number,
                  name: this.getColValue(row.cols, 'name'),
                  errors: errors
                });
              }
            }
          }

          this.poll = false;

          this.toastr('success', 'OK', 'Klart');
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte importera');
        });
    },
    finalizeImport() {
      axios
        .post('/import/finalize', { import_id: this.import.import_id, option: this.import_option })
        .then(res => {
          // hide the spinner
          // we might have a todo item waiting for import of clients
          // we should update that todo item in the backend

          if (res.status === 200) {
            this.toastr('success', 'OK', 'Importen är klar');

            this.$emit('importFinalized');
          } else {
            this.$emit('importFailed');
          }
        })
        .catch(err => {
          console.error(err);
        });
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
