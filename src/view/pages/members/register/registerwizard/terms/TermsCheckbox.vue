<template>
    <b-row>
      <b-col lg="1">
        <label class="float-right checkbox checkbox-lg checkbox-outline checkbox-success">
          <input
            type="checkbox"
            v-model="selected"
            :key="term.id"
            :value="term.id"
          />
          <span></span>
        </label>
      </b-col>
      <b-col lg="11">
        <p @click="showTerm" class="termdescr" v-html="text"></p>
      </b-col>
    </b-row>
</template>

<style lang="scss" scoped>
.checkbox > span {
  background-color: white;
  border: 1px solid #ddd;
}
.termdescr {
  cursor: pointer;
}
</style>
<script>
import axios from 'axios';
import { mapGetters } from 'vuex';

export default {
  name: 'term-component',
  props: ['term'],
  components: {
    
  },
  data() {
    return {
      selected: false,
      text: ''
    };
  },
  watch: {
    selected(newValue, oldValue) {
      console.log('emitting selected: ' + this.term.id + ' value: ' + newValue);
      this.$emit('selected', this.term.id, newValue);
    }
  },
  mounted() {
    this.text = this.term.descr;

    if (this.text === '' || this.text === undefined || this.text === null) {
      this.text = '&nbsp;';
    }

    var tag_start = this.text.indexOf('%');
    var tag_end = this.text.indexOf('%', tag_start + 1);

    var tag_str = this.text.substring(tag_start+1, tag_end);

    var before = this.text.substring(0, tag_start);
    var after = this.text.substring(tag_end+1);

    this.text = before + '<span style="color: #006dca; text-decoration: underline;">' + tag_str + '</span>' + after;
  },

  methods: {

    showTerm() {
      console.log('showing term: ' + this.term.id);
      this.$emit('showTerm', this.term.id);
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
