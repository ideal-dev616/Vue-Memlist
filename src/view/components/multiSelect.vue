<template>
    <div>
        <v-select multiple v-model="showFields" :options="options" />
    </div>
</template>

<script>
    import vSelect from 'vue-select';
    import 'vue-select/dist/vue-select.css';

    export default {
        name: 'multi-select',
        components: {
            vSelect
        },
        props: {
          data: {
              type: Array,
              default: []
          },
            selectedData: {
              type: Array,
              default: []
            }
        },
        data() {
            return {
                options: [],
                fields: [],
                showFields: [{ key: 'all', label: 'Alla', show: true }],
                locked: false
            };
        },
        watch: {
            showFields(newValue, oldvalue) {
                let temp_array = this.fields;
                if (newValue.length === this.fields.length && oldvalue[0].key !== 'all') {
                    this.showFields = [];
                    return;
                }
                for (let i = 0; i < newValue.length; ++i) {
                    if (newValue[i].hasOwnProperty('code')) {
                        newValue[i].key = newValue[i].code;
                    }

                    if (newValue[i].show || !newValue[i].hasOwnProperty('show')) {
                        temp_array = temp_array.filter(function (obj) {
                            return obj.label !== newValue[i].label;
                        });
                    }
                }
                this.options = temp_array;
            },
            data(newValue, oldvalue) {
                if (newValue) this.setLists();
            },
            selectedData(newVal, oldVal){
                if (newVal){
                    this.options.filter(option=>{
                        if (newVal.includes(option.code))
                            this.showFields.push(option);
                    })
                }
            }
        },
        methods: {
            isAll() {
                if (
                    this.showFields.length > 0 &&
                    (this.showFields[0].key === 'all' || this.showFields[0].code === 'all')
                ) {
                    return true;
                }
                return false;
            },
            getData() {
                if (this.isAll()) {
                    return ['all'];
                }

                var ret = [];

                for (let i = 0; i < this.showFields.length; ++i) {
                    if (this.showFields[i].key === 'all' || this.showFields[i].code === 'all') {
                        continue;
                    }

                    ret.push(this.showFields[i].code);
                }

                return ret;
            },
            setLists() {
                this.fields = this.data;

                let temp_array = this.fields;
                let that = this;
                for (let i = 0; i < that.showFields.length; ++i) {
                    if (that.showFields[i].show || !that.showFields[i].hasOwnProperty('show')) {
                        temp_array = temp_array.filter(function (obj) {
                            return obj.label !== that.showFields[i].label;
                        });
                    }
                }
                this.options = temp_array;
            },
            reset(){
                this.showFields = [{ key: 'all', label: 'Alla', show: true }];
            }
        },
        mounted() {

            this.setLists();
            var that = this;
            setInterval(function () {
                // try to fix the multiselect
                if (that.showFields.length > 1 && that.showFields[0].key === 'all') {
                    // prevent 'all' and companies
                    that.showFields = that.showFields.filter(item => item.key !== 'all' && item.code !== 'all');
                } else if (that.showFields.length === 0) {
                    // prevent empty
                    that.showFields = [{ code: 'all', key: 'all', label: 'Alla', show: true }];
                }
            }, 100);
        }
    };
</script>
