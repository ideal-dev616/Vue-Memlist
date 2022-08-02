<template>
    <b-modal ref="modal" v-model="showModal" hide-footer>
        <div class="form-create-member border border-secondary">
            <b-row>
                <b-col md="6">
                    <b-form-group label="ID" label-for="fa-id">
                        <b-form-input
                                id="fa-id"
                                v-model="form.id"
                                disabled
                        />
                    </b-form-group>
                </b-col>
            </b-row>
            <b-row>
                <b-col md="6">
                    <b-form-group label="Förnamn" label-for="fa-firstname">
                        <b-form-input
                                id="fa-firstname"
                                v-model="form.fn"
                        />
                    </b-form-group>
                </b-col>
                <b-col md="6">
                    <b-form-group label="Efternamn" label-for="fa-lastname">
                        <b-form-input
                                id="fa-lastname"
                                v-model="form.ln"
                        />
                    </b-form-group>
                </b-col>
            </b-row>
            <b-row>
                <b-col md="12">
                    <b-form-group label="Personnumber" label-for="fa-person-number">
                        <b-form-input
                                id="fa-person-number"
                                v-model="form.pn"
                        />
                    </b-form-group>
                </b-col>
            </b-row>
            <b-row>
                <b-col md="6">
                    <b-form-group label="E-post" label-for="fa-email">
                        <b-form-input
                                id="fa-email"
                                v-model="form.em"
                        />
                    </b-form-group>
                </b-col>
                <b-col md="6">
                    <b-form-group label="Mobiltelefon" label-for="fa-phone">
                        <b-form-input
                                id="fa-phone"
                                v-model="form.ph"
                        />
                    </b-form-group>
                </b-col>
            </b-row>

            <b-row class="mt-6">
                <b-col class="d-flex justify-content-end">
                    <b-button variant="outline-success" class="m-1" @click="save">
                        Spara
                    </b-button>
                    <b-button variant="outline-primary" class="m-1" @click="cancel">
                        Ångra
                    </b-button>
                </b-col>
            </b-row>
        </div>
    </b-modal>
</template>

<script>
    import moment from 'moment';
    export default {
        name: "RegisterFamilyForm",
        props: {
          data: {
              type: Object,
              default: null
          },
        },
        data(){
            return {
                showModal: false,
                form: {
                    id: null,
                    fn: '',
                    ln: '',
                    pn: '',
                    em: '',
                    ph: '',
                    tp: 'FA'
                },
            }
        },
        methods: {
            show(){
                if (!this.data)this.resetForm();
                this.showModal = true;
            },
            hide(){
                this.showModal = false;
            },
            cancel() {
                this.$refs['modal'].hide();
                this.$emit('cancel');
            },
            save() {
                this.$emit('save', );
            },
            resetForm(){
                this.form = {
                        id: moment().unix(),
                        fn: '',
                        ln: '',
                        pn: '',
                        em: '',
                        ph: '',
                        tp: 'FA'
                };
            }
        },
        watch: {
            data(newVal, oldVal){
                if (newVal) this.form = newVal;
                else this.resetForm();
            }
        }
    }
</script>

<style lang="scss" scoped>
    .form-create-member {
        max-width: 800px;
        margin: 0 auto;
        padding: 25px;
    }
</style>
