<template>
<div>
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

            <tr v-for="(item, index) in items" :key="item.id" class="cursor-pointer">
                <td style="min-width: 40px" class="pl-7">
                    <label class="checkbox checkbox-lg checkbox-outline checkbox-success">
                        <input type="checkbox" name="" v-model="item.selected" @change="selectionChanged(index)"/>
                        <span></span>
                    </label>
                </td>
                <td @click="selectEvent(index)">
                    <p>{{item.name}}</p><p>{{item.to_datetime}}</p>
                </td>
            </tr>
            <tbody>
            </tbody>
        </table>
    </div>
    <!--end::Table-->
</div>
</template>

<script>
    import moment from 'moment';

    export default {
        name: "eventOption",
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
            getData(){
                let items = [];
                let ids =[];
                this.items.filter(item => {
                    if (item.selected) {
                        ids.push(item.id);
                        items.push(item);
                    }
                });
                return ids.length > 0 ? {items, ids} : null;
            },
            selectEvent(index){
                this.items[index].selected = !this.items[index].selected;
                this.selectionChanged(index);
            },
            selectionChanged(index) {
                let events = [];
                let event_ids =[];
                this.items.filter(item => {
                    if (item.selected) {
                        event_ids.push(item.id);
                        events.push(item);
                    }
                });
                this.$emit('eventSelected', {events, event_ids});
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
