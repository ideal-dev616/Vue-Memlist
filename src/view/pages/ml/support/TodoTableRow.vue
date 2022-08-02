<template>
  <tr>
    <td>
      <span class="text-dark-75 font-weight-bolder d-block font-size-lg">{{ todo.name }}</span>
    </td>
    <td>
      {{category[todo.type2]}}
    </td>
    <td>
      {{supportOptions[todo.severity - 1]}}
    </td>
    <td>
      {{status[todo.status]}}
    </td>
    <td>{{ todo.created_at }}</td>
    <td class="text-right pr-0">
      <b-button
        href="#"
        class="button"
        variant="primary"
        @click="selectTodoClicked(todo.todo_id)"
      >
        <!-- <span class="svg-icon svg-icon-md svg-icon-primary"> -->
          <!--begin::Svg Icon-->
          <!-- <inline-svg src="/assets/svg/Write.svg"></inline-svg> -->
          <!--end::Svg Icon-->
        <!-- </span> -->
          Hantera
      </b-button>
      <a
        href="#"
        class="btn btn-icon btn-light btn-sm mx-3"
        @click="deleteTodoClicked(todo.todo_id)"
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
</style>
<script>
import axios from 'axios';
import { mapGetters } from 'vuex';

export default {
  name: 'support-table-row',
  props: ['todo'],
  computed: {
    ...mapGetters(['currentCompanyId'])
  },
  data() {
    return {
      category: {
        //Teknisk
        N: 'NOTSET',
        I: 'Teknisk support',
        F: 'Ekonomi support',
        B: 'Försäljning' ,
        S: 'Förslag',
      },
      supportOptions: [
        // Allvarighetsgrad
        'låg',
        'låg',
        'låg',
        'låg',
        'medel',
        'medel',
        'medel',
        'hög',
        'hög',
        'hög',
      ],
      status: {
        WAIT : 'VÄNTAR',
        DRAFT: 'UTKAST',
        NOT  : 'EJ KLAR',
        DONE : 'KLART',
        CN   : 'BEKRÄFTAD',
        DEL  : 'BORTTAGEN',
        ACC  : 'ACCEPTERAD',
        REJ  : 'AVVISAD',
        BAC  : 'BACKLOG',
        FUT  : 'FRAMTID',
        UNREAD : 'OLÄST',
        READ : 'LÄST',
        DOC  : 'STÄNGT'
      },
    };
  },
  mounted() {
    this.checkValue();
  },
  watch: {

  },
  methods: {
    selectTodoClicked(todo_id) {
      this.$emit('selectTodoClicked', todo_id);
    },
    deleteTodoClicked(todo_id) {
      this.$emit('deleteTodoClicked', todo_id);
    },
    checkValue()
    {
      if (this.todo.severity > 7 || this.todo.severity < 1)
        this.todo.severity = 1;
    },
  }
};
</script>
