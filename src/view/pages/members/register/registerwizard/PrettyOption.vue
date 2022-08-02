<template>
    <b-card>
        <label class="kt-option kt-option kt-option--plain" style="margin-top: 12px;"> 
            <span class="kt-option__control">
                <label class="radio radio-outline radio-success mr-5">
                   <input type="radio" :v-model="isSelected" :value="value" :name="name" @click="clicked">
                   <span class='mr-2'></span>
                </label>
            </span> 
            <span class="kt-option__label"> 
                <span class="kt-option__head"> 
                    <span class="kt-option__title"> 
                        {{ title }}
                    </span> 
                </span> 
                <span class="kt-option__body"> 
                    {{ descr }}
                </span> 
                <span style="font-weight: bold;">{{ price }} kr</span> 
            </span> 
        </label> 
    </b-card>
</template>


<style lang="scss" scoped>
.checkbox.checkbox-light-success > span {
  background-color: white;
  border: 1px solid #ddd;
}
.wizard-body {
  max-width: 1000px;
  width: 100%;
}


.kt-option {
  display: flex;
  padding: 1.4em;
  border: 1px solid #ebedf2;
  border-radius: 4px; }
  .kt-option .kt-option__control {
    width: 2.7rem;
    padding-top: 0.1rem; }
    .kt-option .kt-option__control .kt-radio {
      display: block; }
  .kt-option .kt-option__label {
    width: 100%; }
    .kt-option .kt-option__label .kt-option__head {
      display: flex;
      justify-content: space-between; }
      .kt-option .kt-option__label .kt-option__head .kt-option__title {
        font-size: 1.1rem;
        font-weight: 400;
        color: #595d6e; }
      .kt-option .kt-option__label .kt-option__head .kt-option__focus {
        font-size: 1.1rem;
        font-weight: 500;
        color: #48465b; }
    .kt-option .kt-option__label .kt-option__body {
      display: block;
      padding-top: 0.7rem;
      font-size: 0.9rem;
      color: #74788d; }
  .kt-option.kt-option--plain {
    border: 0;
    padding: 0;
    margin-top: -0.2rem;
    margin-bottom: 2rem;
    align-items: center; }
    .kt-option.kt-option--plain .kt-option__control {
      vertical-align: middle;
      width: 2.7rem; }
      .kt-option.kt-option--plain .kt-option__control .kt-radio {
        margin-bottom: 1.6rem; }
    .kt-option.kt-option--plain .kt-option__label .kt-option__body {
      padding-top: 0.2rem; }
  .is-valid .kt-option {
    border-color: #1dc9b7; }
  .is-invalid .kt-option {
    border-color: #fd397a; }

.has-success .kt-option .kt-option__label .kt-option__head .kt-option__title {
  color: #1dc9b7; }

.has-error .kt-option .kt-option__label .kt-option__head .kt-option__title {
  color: #ffb822; }

</style>

<script>
export default { 
    name: 'pretty-option',
    props: ['value', 'name', 'title', 'descr', 'price'],
    data() {
      return {
        isSelected: null
      }
    },
    watch: {
      isSelected(newValue, oldValue) {
        if (newValue) {
          this.$emit('valueChanged', newValue);
        }
      }
    },
    methods: {
      clicked() {
        this.$emit('valueChanged', this.value);
      }
    }
}
</script>