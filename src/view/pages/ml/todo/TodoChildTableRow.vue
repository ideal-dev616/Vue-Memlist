<template>

  <tr>
    <td>
      {{ task.name }}
    </td>
    <td>
      {{ task.updated_at }}
    </td>
    <td>
      <b-form-select
          id="status"
          v-model="status"
          :options="statusOptions"
      ></b-form-select>
    </td>
    <td class="text-center">
      {{ this.task.comments ? this.task.comments.length : 0 }}
    </td>
    <td class="text-right pr-0" >
      <a
        v-if="task.files.length > 0 && task.type === 'FILE_WIZARD'"
        href="#"
        class="btn btn-icon btn-light btn-sm mx-2"
        @click="showFilesClicked"
      >
        <span class="svg-icon svg-icon-md svg-icon-primary">
          <!--begin::Svg Icon-->
          <inline-svg src="/assets/svg/download-solid.svg"></inline-svg>
          <!--end::Svg Icon-->
        </span>
      </a>
      <a
        href="#"
        class="btn btn-icon btn-light btn-sm mx-2"
        @click="showCommentsClicked"
      >
        <span class="svg-icon svg-icon-md svg-icon-primary">
          <!--begin::Svg Icon-->
          <inline-svg src="/assets/svg/chat.svg"></inline-svg>
          <!--end::Svg Icon-->
        </span>
      </a>
      <a
        href="#"
        class="btn btn-icon btn-light btn-sm mx-2"
        @click="selectRowClicked"
      >
        <span class="svg-icon svg-icon-md svg-icon-primary">
          <!--begin::Svg Icon-->
          <inline-svg src="/assets/svg/Write.svg"></inline-svg>
          <!--end::Svg Icon-->
        </span>
      </a>
      <a
        href="#"
        class="btn btn-icon btn-light btn-sm mx-2"
        @click="deleteRowClicked"
      >
        <span class="svg-icon svg-icon-md svg-icon-primary">
          <!--begin::Svg Icon-->
          <inline-svg src="/assets/svg/Trash.svg"></inline-svg>
          <!--end::Svg Icon-->
        </span>
      </a>
    </td>
  </tr>
</template>
<style lang="scss" scoped>
.checkbox > span {
  background-color: white;
  border: 1px solid #ddd;
}
.hplus {
  cursor: pointer;
}
.hminus {
  cursor: pointer;
}
</style>
<script>
import axios from 'axios';
import moment from 'moment';
import { mapGetters } from 'vuex';

export default {
  name: 'row-child-table-parent-row',
  props: ['type','row'],
  computed: {
    ...mapGetters(['currentCompanyId']),
  },
  data() {
    return {
      task: { files: [] },
      /*row: {
        name: 'title',
        file_id: 'file_id',
        id: 'todo_task_id',
        status: 'status',
        updated_at: '2020-01-01',
        num_comments: 0
      },*/
      statusOptions: [
        //{ value: 'DRAFT', text: 'Utkast' },
        //{ value: 'INVALID', text: 'Ej giltig' },
        //{ value: 'WAIT', text: 'Väntar' },
        { value: 'NOT', text: 'Komplettera' },
        { value: 'DONE', text: 'Klar' },
        //{ value: 'CN', text: 'Bekräftat' },
        //{ value: 'DEL', text: 'Raderat' },
        //{ value: 'ACC', text: 'Accepterat' },
        //{ value: 'REJ', text: 'Avslaget' },
        //{ value: 'BAC', text: 'Backlog' },
        //{ value: 'FUT', text: 'Framtida' },
        { value: 'CLOSE', text: 'Stängt' },
      ],
      statusName: {
        DRAFT: 'Utkast',
        INVALID: 'Ej giltig',
        WAIT: 'Väntar',
        NOT: 'Ej klar',
        DONE: 'Klar',
        CN: 'Bekräftat',
        DEL: 'Raderat',
        ACC: 'Accepterat',
        REJ: 'Avslaget',
        BAC: 'Backlog',
        FUT: 'Framtida',
        CLOSE: 'Stängt',
      },
      status: ''
    };
  },
  mounted() {
    this.status = this.row.status;
    this.task = this.row;
    console.log('row.status');
  },
  watch: {
    status(newValue, oldValue) {
      console.log('status changed: ' + newValue);
      if (newValue && oldValue !== '') {
        this.changeStatus(newValue);
      }
    },
    'row': {
      handler(val){
        this.task = val;
      },
      deep: true
    }
  },
  methods: {
    changeStatus(newStatus) {
      axios
        .put('/todo_task', { todo_task_id: this.row.todo_task_id, status: newStatus })
        .then(res => {
          this.status = res.data.task.status;
          this.task = res.data.task;
          this.$emit('updateTaskStatus');
          this.toastr('success', 'OK', 'Status uppdaterat');
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte uppdatera status');
        });
    },
    forceFileDownload(response, title) {

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
      })
        .then((response) => {
          this.forceFileDownload(response, title)
        })
        .catch(() => console.log('error occured'))
    },
    showFilesClicked() {

      this.$emit('showFilesClicked', this.row.todo_task_id);

      /*if (this.row.files !== undefined && this.row.files.length > 0) {
        var file_id = this.task.files[this.task.files.length -1].file_id;

        axios
          .get(`/file?file_id=${file_id}`)
          .then(res => {
            //location.href = res.data.file.public_path;
            this.downloadWithAxios(res.data.file.public_path, res.data.file.name);
          })
          .catch(err => {
            console.error(err);
            this.toastr('danger', 'Server Fel', 'Kunde inte hämta fil');
          });
      }*/
    },
    showCommentsClicked() {
      this.$emit('showCommentsClicked', this.row.todo_task_id);
    },
    selectRowClicked() {
      this.$emit('selectRowClicked', this.row.todo_task_id);
    },
    deleteRowClicked() {
      this.$emit('deleteRowClicked', this.row.todo_task_id);
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
