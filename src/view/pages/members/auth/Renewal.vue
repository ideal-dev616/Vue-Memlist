<template>
        <b-card class="login-body mb-5">
            <div class="h-100 d-flex align-items-center text-center flex-wrap justify-content-center" v-if="isAuthenticated === true">
                <h3 v-if="isOk === null" class="mt-auto">Jag vill förnya mitt medlemskap i {{company.name}} för {{period.name}}</h3>
                <b-row v-if="isOk === null">
                    <b-col><b-button class="mr-5" variant="success" @click="isOk = true">Ja</b-button></b-col>
                    <b-col><b-button @click="isOk = false"> Avbryt</b-button></b-col>
                </b-row>
                <div class="">
                    <h3 v-show="isOk === true">Tack för din förnyelse</h3>
                    <h3 v-show="isOk === false">Du kan bekräfta medlemskapet vid en senare tidpunkt</h3>
                </div>
            </div>

            <div class="h-100 d-flex align-items-center text-center flex-wrap justify-content-center" v-if="isAuthenticated === false">
                <h3>Kunde inte hämta medlemsdata</h3>
            </div>
        </b-card>

</template>

<script>
    import axios from "axios";

    export default {
        name: "Renewal",
        data(){
            return {
                isAuthenticated: null,
                client: {},
                company: {},
                period: [],
                isOk: null,
                renew_date: '',
            }
        },
        methods: {
            loadClientToken(){
                const loader = this.$loading.show();
                const token = this.$route.params.login_token;
                axios.post('/client/token', {login_token: token})
                    .then(res => {
                        console.log('api response', res.data)
                        if (res.status === 200) {
                            loader.hide();
                            this.client = res.data.client;
                            this.company = res.data.company;
                            this.period = res.data.periods.filter(item => {
                                return item.id === res.data.client.period_id
                            })[0];
                            console.log('Period', this.period)
                            this.isAuthenticated = true;
                        }
                    })
                    .catch(err => {
                        this.isAuthenticated = false;
                        this.toastr('danger', 'Serverfel', 'Kunde inte hämta medlemsdata');
                    })
            },
        },
        async mounted(){
            this.renew_date = this.$route.params.renew_date;
            await this.loadClientToken();
        }
    }
</script>

<style lang="scss" scoped>
    .login-body {
        max-width: 500px;
        max-height: 300px;
        width: 100%;
        height: 100%;
    }
</style>
