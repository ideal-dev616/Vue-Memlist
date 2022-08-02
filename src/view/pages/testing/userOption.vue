<template>
                <b-form-group label="Sök efter användare baserat på titeln" label-for="new-search-user-title">
                    <v-select
                            multiple
                            id="new-search-user-title"
                            v-model="showFields"
                            :options="options"
                    />
                    <div class="d-flex align-items-center mt-3 mb-5">
                        <label class="checkbox checkbox-lg checkbox-outline checkbox-success">
                            <input type="checkbox" name="" v-model="dir" />
                            <span></span>
                        </label>
                        <span class="ml-3 cursor-pointer" @click="dir = !dir"
                        >Användare som sitter i styrelse</span>
                    </div>
                    <div class="d-flex align-items-center ">
                        <label class="checkbox checkbox-lg checkbox-outline checkbox-success">
                            <input type="checkbox" name="" v-model="acc" />
                            <span></span>
                        </label>
                        <span class="ml-3 cursor-pointer" @click="acc = !acc"
                        >Användare som är revisor </span>
                    </div>
                </b-form-group>
</template>

<script>
    import {mapGetters} from 'vuex';
    import axios from 'axios';

    import vSelect from 'vue-select';
    import 'vue-select/dist/vue-select.css';
    export default {
        name: "userOption",
        components: {vSelect},
        props: ['selected_companies'],
        data(){
            return {
                showFields: [],
                options: [],
                option_list: [
                    {key: 'uPfNXjet', label: 'Ordförande'},
                    {key: 'jGWnE8Yt', label: 'Vice Ordförance'},
                    {key: 'nxE5VM7L', label: 'Kassör'},
                    {key: 'elqHHWrf', label: 'Ledamot'},
                    {key: 'HkqPDwKL', label: 'Generalsekreterare'},
                    {key: 'flfhSGnZ', label: 'Kanslist'},
                    {key: '0xRPnqC6', label: 'Kontaktperson'},
                    {key: 'MbgRnP0A', label: 'Övrigt'}
                ],
                fields:[],
                acc:false,
                dir:false,
                payload: {
                    dir: false,
                    acc: false,
                    titles: [] // string array
                },
            }
        },
        computed: {
            ...mapGetters(['companies'])
        },
        watch: {
            showFields(newValue, oldvalue){
                this.setTitles(oldvalue);
                // remove initial named "all" element.
                if (oldvalue.length === 1 && oldvalue[0].key === 'all')
                    this.showFields.splice(0, 1);
                this.emitPayload();
            },
            dir(newVal, oldVal){
                this.emitPayload();
            },
            acc(newVal, oldVal){
                this.emitPayload();
            },
            selected_companies(newVal, oldVal){
                this.setList();
            },
        },
        async  mounted(){
            await this.setList();
            this.emitPayload();
        },
        methods: {
          setList(){
            this.options = [];

            axios
              .get('/system/titles')
              .then(res => {
                let titles = res.data.titles;
                titles.filter(title=> {
                    this.option_list.filter(item => {
                        if (title.id === item.key){
                            this.options.push(item);
                        }
                    })
                })
              })
              .catch(err => {
                console.error(err);
                this.toastr('danger', 'Fel', 'Kunde inte lista systemtitlar');
              });
          },
          setTitles(){
            let titles = []
              let labels = []
            this.showFields.filter(field => {
              titles = titles.concat(field.key);
              labels = labels.concat(field.label);
            });
            this.payload.titles = titles;
            this.payload.labels = labels;
          },
            emitPayload(){
                this.payload.dir = this.dir;
                this.payload.acc = this.acc;
                this.$emit('setUserQuery', this.payload);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .checkbox.checkbox-light-success > span {
        background-color: white;
        border: 1px solid #ddd;
    }
</style>
