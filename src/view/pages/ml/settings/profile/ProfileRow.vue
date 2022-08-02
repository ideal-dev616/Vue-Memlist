<template>
  <div class="d-flex align-items-center mb-4">
    <label class="checkbox checkbox-lg checkbox-outline checkbox-success">
      <input
        type="checkbox"
        name=""
        v-model="profilerow.checked"
        @click="profilerow.checked = !profilerow.checked"
      />
      <span></span>
    </label>
    <span class="ml-3 cursor-pointer">{{ profilerow.name }}</span>
  </div>
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
  name: 'profile-row',
  props: ['profilerow'],
  computed: {
    ...mapGetters(['currentCompanyId'])
  },
  data() {
    return {
      /*requirement: {
        id: '',
        checked: false,
        lang_text: {}
      },*/
    };
  },
  mounted() {

  },
  watch: {},
  methods: {
    getLangText(id, lang_text, lang) {
      for (var i = 0; i < lang_text.length; ++i) {
        if (lang_text[i].lang === lang) {
          return lang_text[i].text;
        }
      }

      return 'Språköversättning saknas: ' + id;
    }
  }
};
</script>
