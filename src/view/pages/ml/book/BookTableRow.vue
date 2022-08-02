<template>
  <tr>
    <td>
      <span class="text-dark-75 font-weight-bolder d-block font-size-lg">
          <b-form-group>
            <div class="d-flex align-items-center">
                <label class="checkbox checkbox-lg checkbox-outline checkbox-success">
                <input type="checkbox" name="" v-model="book.selected"  @click="book.selected = !book.selected" />
                <span></span>
                </label>
                <span class="ml-3 cursor-pointer"></span>
            </div>
          </b-form-group>
      </span>
    </td>
    <td>
      <span class="text-dark-75 font-weight-bolder d-block font-size-lg">{{ book.book_id }}</span>
    </td>
    <td>
      <span class="text-dark-75 font-weight-bolder d-block font-size-lg">{{ book.external_id }}</span>
    </td>
    <td>
      <span class="text-dark-75 font-weight-bolder d-block font-size-lg">{{ book.created_at }}</span>
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
  name: 'book-table-row',
  props: ['book'],
  computed: {
    ...mapGetters(['currentCompanyId'])
  },
  data() {
    return {

    };
  },
  mounted() {

  },
  watch: {

  },
  methods: {
    selectBookClicked(booking_id) {
      this.$emit('selectPeriodClicked', period_id);
    },
  }
};
</script>
