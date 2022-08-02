<template>
    <div class="mb-8">
        <!--begin::Advance Table Widget 9-->
        <b-card>
            <!--begin::Body-->
                <div class="card-body ">
                    <!--begin::checkbox-->
                    <div class="d-flex align-items-center pl-7 pb-5">
                        <label class="checkbox checkbox-lg checkbox-outline checkbox-success">
                            <input type="checkbox" name="" v-model="isOldEvent" />
                            <span></span>
                        </label>
                        <span
                                class="ml-3 cursor-pointer"
                                @click="isOldEvent = !isOldEvent"
                        >Tidigare evenemang</span
                        >
                    </div>

                    <hr class="my-1" />
                    <!--begin::Table-->
                    <div class="table-responsive">
                        <table class="table table-head-custom table-vertical-center table-head-bg table-borderless">
                            <thead>
                            <tr class="text-left">
                                <th style="min-width: 40px" class="pl-7">
                                </th>
                                <th>Evenemang</th>
                                <th>Datum</th>
                            </tr>
                            </thead>
                            <tr v-for="(item, index) in items" :key="item.id" class="cursor-pointer">
                                <td style="min-width: 40px" class="pl-7">
                                    <label class="checkbox checkbox-lg checkbox-outline checkbox-success">
                                        <input type="checkbox" name="" v-model="item.selected" @change="selectionChanged(index)"/>
                                        <span></span>
                                    </label>
                                </td>
                                <td @click="selectEvent(index)">{{item.name}}</td>
                                <td @click="selectEvent(index)">{{item.to_datetime}}</td>
                            </tr>
                            <tbody>
                            </tbody>
                        </table>
                    </div>
                    <!--end::Table-->
                </div>
            <!--end::Body-->
        </b-card>

        <!--end::Advance Table Widget 9-->
    </div>
</template>

<script>
    import moment from 'moment';

    export default {
        name: "searchWithEvent",
        props: ['events'],
        data(){
            return {
                eventHistory: [{ value: null, text: 'Det finns inga sparade sökningar'}],
                fields: [
                    {key:'selected', label: ''},
                    {key:'name', label: 'Evenemang'},
                    {key:'to_datetime', label: 'Datum'}
                ],
                items: [],
                items_all: [],
                selectedEvent: null,
                isOldEvent: false
            }
        },
        methods: {
            selectEvent(index){
                this.items[index].selected = !this.items[index].selected;
                this.selectionChanged(index);
            },
            selectionChanged(index) {
                const event_ids = this.items.filter(item => item.selected).map(item => `${item.id}`);
                console.log(event_ids, "IDS");
                this.$emit('eventSelected', event_ids);
            },
            filterEvents(){
                const crDt =new Date();
                if (this.events && this.events.length > 0){
                    const items_all = this.events.map(item => {
                        return {
                            id: item.event_id,
                            selected: false,
                            name: item.name,
                            to_datetime: moment(item.to_datetime).format('YYYY-MM-DD hh:mm:ss')
                        }
                    });
                    this.items = items_all.filter(item => {
                        const dt = Date.parse(item.to_datetime);
                        return this.isOldEvent ? crDt > dt : crDt < dt;
                    })
                }
            },
        },
        watch: {
            isOldEvent(newVal, oldVal){
               this.filterEvents();
                this.$emit('eventSelected', []);
            },
        },
        mounted(){
            this.filterEvents();
        }
    }
</script>

<style lang="scss" scoped>
    .checkbox.checkbox-light-success > span {
        background-color: white;
        border: 1px solid #ddd;
    }
</style>
