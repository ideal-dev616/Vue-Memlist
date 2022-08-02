<template>
    <b-card title="Familjeregister">
        <register-family-form :data="data" ref="familyForm" />

        <div class="card-body">
            <div class="card-toolbar text-right">
                <a class="btn btn-primary font-weight-bolder font-size-sm mb-8" @click="createFA"
                ><i class="menu-icon flaticon2-plus" style="font-size: 1.0em;"></i>Ny familjemedlem</a>
            </div>
            <b-table :fields="fields" :items="items" >
                <template #cell(action) = "data">
                    <div class="text-right">
                        <a
                           class="btn btn-icon btn-light btn-sm mx-3"
                           @click="editFA(data.item)"
                        >
                            <span class="svg-icon svg-icon-md svg-icon-primary">
                              <!--begin::Svg Icon-->
                              <inline-svg src="/assets/svg/Write.svg"></inline-svg>
                                <!--end::Svg Icon-->
                            </span>
                        </a>
                        <a
                                class="btn btn-icon btn-light btn-sm mx-3"
                                @click="deleteFA(data.item.id)"
                        >
                            <span class="svg-icon svg-icon-md svg-icon-primary">
                              <!--begin::Svg Icon-->
                              <inline-svg src="/assets/svg/Trash.svg"></inline-svg>
                                <!--end::Svg Icon-->
                            </span>
                        </a>
                    </div>
                </template>
            </b-table>
        </div>
    </b-card>
</template>

<script>
    import RegisterFamilyForm from "@/view/components/RegisterFamilyForm";
    export default {
        name: "RegisterFamily",
        components: {RegisterFamilyForm},
        props: ['company_id', 'page', 'member-type'],
        data() {
            return {
                fields: [
                    {key: 'fn', label: 'Förnamn'},
                    {key: 'ln', label: 'Efternamn'},
                    {key: 'em', label: 'E-post'},
                    {key: 'ph', label: 'Mobiltelefon'},
                    {key: 'pn', label: 'Personnumber'},
                    {key: 'id', lebel: 'ID'},
                    {key: 'tp', label: 'FA'},
                    {key: 'action', label: ''},
                ],
                items: [
                    {fn: 'Tortu', ln: 'Ch', em: 'Tortu@gmail.com', ph: '1234556', pn: '2000121223423', id: 'adsfasdfa', tp: 'FA'}
                ],
                data: null
            }
        },
        methods: {
            createFA(){
                this.resetForm();
                this.$refs['familyForm'].show();
            },
            editFA(data){
                this.data = data;
                this.$refs['familyForm'].show();
            },
            deleteFA(id){
                this.items = this.items.filter(item => item.id !== id);
            },
            resetForm(){
                this.data = null
            }
        }
    }
</script>

<style lang="scss" >
    .table > tbody > tr > td {
        vertical-align: middle;
    }
    .login-body {
        max-width: 500px;
        max-height: 300px;
        width: 100%;
        height: 100%;
    }
</style>
