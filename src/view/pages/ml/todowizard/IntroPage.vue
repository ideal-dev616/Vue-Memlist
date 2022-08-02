<template>
    <div class="card card-custom card-stretch">
        <!--begin::Body-->
        <div class="card-body pt-3 pb-3">
            <h5 class="mb-4 mt-4 ">{{ task.name }}</h5>

            <p class="mb-8">{{ task.descr}}</p>

            <!--Begin:: period table-->
            <div class="card card-custom card-stretch gutter-b">
                <!--begin::Body-->
                <div class="card-body pt-0 pb-3">
                    <h6 class="mb-4 mt-5">Inlämningsperiod</h6>

                    <!--begin::Table-->
                    <div class="table-responsive">
                        <table class="table table-head-custom table-vertical-center table-head-bg table-borderless">
                            <thead>
                            <tr class="text-left">
                                <th style="min-width: 110px">Startdatum </th>
                                <th style="min-width: 110px">Slutdatum </th>
                            </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <span class="text-dark-75  d-block font-size-lg">{{todo.from_datetime}}</span>
                                    </td>
                                    <td>
                                        <span class="text-dark-75 d-block font-size-lg">{{todo.to_datetime}}</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <!--end::Table-->
                </div>
                <!--end::Body-->
            </div>
            <!--End:: period table-->

            <!--Begin:: tasks list table-->
            <div class="card card-custom card-stretch gutter-b">
                <!--begin::Body-->
                <div class="card-body pt-0 pb-3">
                    <h6 class="mb-4 mt-5 ">Dina ärenden</h6>

                    <!--begin::Table-->
                    <div class="table-responsive">
                        <table class="table table-head-custom table-vertical-center table-head-bg table-borderless">
                            <thead>
                            <tr class="text-left">
                                <th style="min-width: 110px">namn </th>
                                <th></th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="(item, index) in todo.tasks" :key="index" v-if="index !== 0">
                                <td>
                                    <span :id="`task-${index}`" class="text-dark-75 d-block font-size-lg" style="width: fit-content !important;">
                                        {{item.name}}
                                    </span>
                                    <b-popover
                                        :target="`task-${index}`"
                                        triggers="hover focus"
                                        :content="item.descr"
                                        placement="righttop"
                                    />
                                </td>
                                <td></td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <!--end::Table-->
                </div>
                <!--end::Body-->
            </div>
            <!--End:: tasks list table-->
        </div>
        <!--end::Body-->
    </div>
</template>

<script>
    export default {
        name: "IntroPage",
        props: ['todo','task'],
    }
</script>

<style scoped>

</style>
