<template>
    <b-card no-body class="mb-8">
        <template #header>
            <h5 class="mb-0"> Kostnad </h5>
        </template>
        <div class='mt-3 ml-3 mr-3'>
            <b-alert show variant="secondary">Denna körning kommer att kosta {{cost}} SEK</b-alert>
            <b-alert show variant="secondary">Tillgänglig budget:  {{budget}} SEK</b-alert>
        </div>
    </b-card>
</template>

<script>
    import axios from 'axios';
    import { mapGetters } from 'vuex';

    export default {
        name: "BudgetView",
        props:['numToSend', 'isSMS'],
        data(){
            return {
                billing: {},
                budget: 0,
                cost: 0
            }
        },
        computed: {
          ...mapGetters(['currentCompanyId']),
        },
        watch: {
          numToSend(){
              this.validate();
          }
        },
        mounted(){
            this.getBillInfo()
        },
        methods: {
            getBillInfo(){
                axios
                    .get(`/billing/active?company_id=${this.currentCompanyId}`)
                    .then(res => {
                        if (res.status === 200){
                            this.budget = res.data.billing.sms_budget;
                            this.billing = res.data.billing;
                            this.validate();
                        }
                    }).catch(err => {
                        console.log(err)
                })
            },

            validate(){
                this.cost = this.isSMS ? this.billing.sms_sek_per_send * (this.numToSend ? this.numToSend : 0) : 0;
                this.$emit('showBudgetStatus', this.numToSend ? this.budget > this.cost : true );
            }
        }
    }
</script>

<style scoped>

</style>
