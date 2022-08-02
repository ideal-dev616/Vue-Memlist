<template>
    <b-form-group label="Sök efter klienter baserat på attribut inom kategorin">
                <b-form-select
                        v-model="group_id"
                        :options="groups"
                />
                <multi-select
                        class="mt-5"
                        v-if="group_id"
                        ref="selectAttr"
                        :data="props"
                        :selected-data="[]"
                />
    </b-form-group>
</template>

<script>
    import axios from "axios";
    import { mapGetters } from 'vuex';
    import MultiSelect from '@/view/components/multiSelect.vue';

    export default {
        name: "clientOption",
        components: {MultiSelect},
        props: {
            groups:{
                type: Array,
                default:[]
            }
        },
        data(){
            return {
                group_id:'',
                props: [],
                prop_ids:[],
                group_name:'',
                prop_names:[],
            }
        },
        computed: {
            ...mapGetters(['currentCompanyId']),
        },
        watch: {
            group_id(newVal, oldVal){
                if (newVal){
                    this.loadProps(newVal);
                }
                if (oldVal) this.$refs['selectAttr'].reset();
            }
        },
        methods: {
            loadProps(group_id){
                axios
                    .get(`/member_property/list?group_id=${group_id}`)
                    .then(res => {
                        if (res.status === 200) {
                            this.props = [];
                            this.props = res.data.properties.map(prop=>{
                                return {code:prop.prop_id, label: prop.name};
                            });
                        }
                    })
                    .catch(err => {
                        this.toastr('danger', 'Server Fel', 'Kunde inte lista attribut');
                    });
            },
            getData(){
              this.prop_ids = this.group_id ? this.$refs['selectAttr'].getData() : [];
              this.prop_names = this.props.filter(item => {
                  return this.prop_ids.includes(item.code);
              }).map(item => item.label);
              if (this.prop_ids[0] === 'all') this.prop_names = ['Alla'];
              this.group_names = this.groups.filter(item=>item.value === this.group_id).map(item => item.text);
                return {
                    group_id: this.group_id,
                    group_name: this.group_names[0],
                    prop_ids: this.prop_ids,
                    prop_names: this.prop_names
                };
            },
        },
        mounted(){
            if (this.groups.length > 0) this.group_id = this.groups[0].value;
        }
    }
</script>

<style scoped>

</style>
