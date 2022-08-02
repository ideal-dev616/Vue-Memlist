<template>
    <b-card class="mb-8">
        <b-card-body>
            <b-form-group label="Sök efter klienter baserat på attribut inom kategorin">
                <b-row align-v="center">
                    <b-col>
                        <b-form-select
                                v-model="group_id"
                                :options="groups"
                        />
                    </b-col>
                    <b-col>
                        <multi-select
                                v-if="group_id"
                                ref="selectAttr"
                                :data="props"
                                :selected-data="[]"
                        />
                    </b-col>
                </b-row>
            </b-form-group>
        </b-card-body>
    </b-card>
</template>

<script>
    import axios from "axios";
    import { mapGetters } from 'vuex';
    import MultiSelect from '@/view/components/multiSelect.vue';

    export default {
        name: "searchClient",
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
                return [{group_id: this.group_id, prop_ids: this.prop_ids}]
            },
        },
        mounted(){
            if (this.groups.length > 0) this.group_id = this.groups[0].value;
        }
    }
</script>

<style scoped>

</style>