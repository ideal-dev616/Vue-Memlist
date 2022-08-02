<template>
    <div class="px-5" id="page-advanced-search">
        <h5 class="mb-6 ml-2">Avancerad sök</h5>
        <b-card no-body>
            <div class="create-member">
                <b-button class="mr-2" variant="success" @click="createMember">Skapa ny medlem</b-button>
                <span class="">Avancerad sökfunktion, spara urval och exporter till Excel</span>
            </div>
        </b-card>
        <create-member
            v-if="showNew"
            class="mt-4 create-member-section"
            :regions="regions"
            :countries="countries"
            :genders="genders"
            :isNew="client_id === null"
            :client_id="client_id"
            :constreq="constreq"
            @onClose="createMember"
            @onDelete="deleteMember"
        ></create-member>
        <!-- <b-card class="mt-4" v-if="showNew"> </b-card> -->
        <b-row class="mt-4">
            <b-col lg="12">

                <search-options
                    ref="searchOptions"
                    class="mt-4"
                    :countries="countries"
                    :periods="periods"
                    :genders="genders"
                    :payments="payments"
                    :ladoks="ladoks"
                    :no-permission="noPermission"
                    :button_disabled='search_button_disabled'
                    showEvents
                    showRegions
                    @onSearch="onSearch"
                    @queryCreated="queryCreated"
                    @querySelected="querySelected"
                ></search-options>
            </b-col>
            <b-col lg="12">
                <b-card class="search-result-scrollto">
                    <template #header>
                        <div class="d-flex justify-content-between align-items-center">
                            <h5>&nbsp;</h5>
                            <b-dropdown text="Exportera" variant="outline-success">
                                <b-dropdown-item @click="exportExcel($event)">
                                    <fa-icon :icon="['fas', 'file-excel']" class="mr-2" size="lg"/>
                                    Excel
                                </b-dropdown-item>
                                <!--<b-dropdown-item @click="exportCSV($event)">
                                    <fa-icon :icon="['fas', 'file-csv']" class="mr-2" size="lg"/>
                                    CSV
                                </b-dropdown-item>-->
                            </b-dropdown>
                        </div>
                    </template>
                    <div class="p-6">
                        <search-result class="search-results" :clients="clients" @clientSelected="clientSelected" @showFields="setExcelColumns"/>
                    </div>
                </b-card>
            </b-col>
        </b-row>
    </div>
</template>
<style lang="scss" scoped>
    #page-advanced-search {
        .create-member {
            padding: 25px;
            display: flex;
            flex: 1;

            span {
                flex-grow: 1;
                display: flex;
                align-items: center;
                justify-content: center;
            }
        }
    }
</style>

<script>
    import axios from 'axios';
    import createMember from '@/view/components/createMember.vue';
    import searchOptions from '@/view/components/searchOptions.vue';
    import searchResult from '@/view/components/searchResult.vue';
    import moment from 'moment';
    import {mapGetters} from 'vuex';

    export default {
        name: 'advancedSearch',
        components: {
            createMember,
            searchOptions,
            searchResult
        },
        computed: {
            ...mapGetters(['currentCompanyId', 'currentPeriodId', 'periods'])
        },
        data() {
            return {
                noPermission: false,
                client_id: null,
                showNew: false,
                search_button_disabled: false,
                selectedSearch: null,
                searchHistory: [{value: null, text: 'Välj sparad sökning'}],
                regions: [],
                countries: [],
                genders: [
                    {value: 'M', text: 'Man'},
                    {value: 'F', text: 'Kvinna'},
                    {value: 'O', text: 'Annat'},
                    {value: 'U', text: 'Okänt'}
                ],
                payments: [
                    {value: 'Y', text: 'Betalat'},
                    {value: 'N', text: 'Ej Betalat'}
                ],
                ladoks: [
                    {value: 'OK', text: 'Aktiv Student'},
                    {value: 'NO', text: 'Ej Student'},
                    {value: 'S', text: 'Väntar'},
                    {value: 'N', text: 'Saknas'}
                ],
                clients: [],
                columns: [],
                constreq:[],
            };
        },
        async mounted() {
            const loader = this.$loading.show();
            // get regions
            const res = await axios.get('/location/regions');
            if (res.status === 200) {
                // region load
                for (const [k, region] of Object.entries(res.data.regions)) {
                    const communes = [];
                    for (const [key, comm] of Object.entries(region.communes)) {
                        communes.push({value: key, text: comm.commune});
                    }
                    this.regions.push({
                        text: region.region,
                        value: region.region_code,
                        communes: communes
                    });
                }
            } else {
                // no region found
            }
            // country
            const res1 = await axios.get('/location/countries');
            if (res1.status === 200) {
                this.countries = res1.data.countries;
            } else {
            }
            // get constreq
            const res3 = await axios.get(`/company?company_id=${this.currentCompanyId}`);
            if (res3.status === 200){
                this.constreq = res3.data.company.constreq;
            } else {}
            // periods
            loader.hide();
        },
        watch: {
            currentCompanyId(newValue, oldvalue) {
                this.showNew = false;
                this.clients = [];
            },
            currentPeriodId(newValue, oldvalue) {
                this.showNew = false;
                this.clients = [];
            }
        },
        methods: {
            clientSelected(client) {
                this.client_id = client.client_id;
                this.showNew = true;
                this.scrollToClassName('create-member-section');
            },
            scrollToClassName(classname) {
                var that = this;
                setTimeout(function () {

                    const el = that.$el.getElementsByClassName(classname)[0];

                    if (el) {
                        const yOffset = -70;
                        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;

                        window.scrollTo({top: y, behavior: 'smooth'});
                    }
                }, 100);
            },
            queryCreated(query) {
                this.searchHistory.push({value: query.id, text: query.name});
            },
            querySelected(query_id){
                if (query_id){
                    axios.post('/search/byquery', {query_id, company_id: this.currentCompanyId}).then(res=>{
                        this.noPermission = res.status === 403;
                        if (res.status === 200){
                            const clients = [...res.data.users, ...res.data.clients];
                            this.clients = clients.map(item => {
                                item.period = Object.keys(res.data.periods).length > 0 ? res.data.periods[item.period_id].name : '';
                                item.company = item.current_company_id
                                    ? res.data.companies[item.current_company_id]
                                    : res.data.companies[item.company_id];
                                item.rdt = moment(item.rdt).format('YYYY-MM-DD')
                                return item;
                            });
                            this.scrollToClassName('search-result-scrollto');
                        }
                        if (res.status === 500){
                            this.toastr('danger', 'Server fel', 'Kunde inte söka');
                        }
                    }).catch(err=> {
                        console.log(err);
                        this.toastr('danger', 'Server Fel', 'Det valda valet kunde inte hittas.');
                    });
                } else {
                    this.noPermission = false;
                    this.clients = []
                }
            },
            onSearch(query) {
                const loader = this.$loading.show();
                this.search_button_disabled = true;
                axios
                    .post('/search/direct', query)
                    .then(res => {
                        this.noPermission = res.status === 403;
                        if (res.status === 200){
                            const clients = [...res.data.users, ...res.data.clients];
                            this.clients = clients.map(item => {
                                if(item.period_id) item.period = Object.keys(res.data.periods).length > 0 ? res.data.periods[item.period_id].name : '';
                                item.company = item.current_company_id
                                    ? res.data.companies[item.current_company_id]
                                    : res.data.companies[item.company_id];
                                item.rdt = moment(item.rdt).format('YYYY-MM-DD')
                                return item;
                            });
                            this.scrollToClassName('search-result-scrollto');
                        }
                        if (res.status === 500)
                            this.toastr('danger', 'Server fel', 'Kunde inte söka');
                        this.search_button_disabled = false;
                        loader.hide();
                    })
                    .catch(err => {
                        this.search_button_disabled = false;
                        loader.hide();
                        this.toastr('danger', 'Server fel', 'Kunde inte söka');
                    });
            },
            toastr(type, title, message) {
                this.$bvToast.toast(message, {
                    title: title,
                    autoHideDelay: 1000,
                    appendToast: true,
                    variant: type
                });
            },
            setExcelColumns(val){
                this.columns = val;
            },
            exportExcel(e) {
                e.preventDefault();

                var query = this.$refs['searchOptions'].createQuery();
                axios
                    .post('/client/exportsearch', {query: query, columns: this.columns})
                    .then(res => {
                        //location.href = res.data.url;
                        console.log(res.data.url);

                        var filename = res.data.url.replace(/^.*[\\\/]/, '')

                        this.downloadWithAxios(res.data.url, filename);

                        this.toastr('success', 'OK', 'Exporten lyckades');
                    })
                    .catch(err => {
                        console.error(err);
                        this.toastr('danger', 'Server fel', 'Kunde inte exportera');
                    });
            },
            exportCSV() {

            },
            forceFileDownload(response, title) {
                console.log(title)
                const url = window.URL.createObjectURL(new Blob([response.data]))
                const link = document.createElement('a')
                link.href = url
                link.setAttribute('download', title)
                document.body.appendChild(link)
                link.click()
            },
            downloadWithAxios(url, title) {
                axios({
                    method: 'get',
                    url,
                    responseType: 'arraybuffer',
                })
                    .then((response) => {
                        this.forceFileDownload(response, title)
                    })
                    .catch(() => console.log('error occured'))
            },
            createMember() {
                this.showNew = !this.showNew
                this.client_id = null
            },
            deleteMember(){
                axios.delete(`/client?client_id=${this.client_id}`).then(res => {
                    if (res.status === 200) {
                        this.toastr('success', 'Radera', 'Medlem suppgifterna har raderats.');
                        console.log('')
                        this.clients = this.clients.filter(item => this.client_id !== item.client_id);
                        this.createMember();
                        this.scrollToClassName('search-result-scrollto');
                    } else {
                        this.toastr('danger', 'Serverfel', 'Det gick inte att radera medlem.');
                    }
                }).catch(err => {
                    console.log(err);
                    this.toastr('danger', 'Serverfel', 'Det gick inte att radera medlem.');
                })
            },
        }
    };
</script>
