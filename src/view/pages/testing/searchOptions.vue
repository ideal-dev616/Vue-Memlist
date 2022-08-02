<template>
    <div>
        <b-modal v-model="showSavedSearchModal">
            <b-table :fields="fields" :items="items">
                <template #cell(action)="data">
                    <a
                            class="btn btn-icon btn-light btn-sm mx-3"
                            @click="deleteQuery(data.item.value)"
                    >
              <span class="svg-icon svg-icon-md svg-icon-primary">
                <!--begin::Svg Icon-->
                <inline-svg src="/assets/svg/Trash.svg"></inline-svg>
                  <!--end::Svg Icon-->
              </span>
                    </a>
                </template>
            </b-table>
        </b-modal>

        <b-card >
            <template #header>
                <h5 v-if="showNumClients" class="mb-1"><b-icon class="mr-2" icon="check-circle" font-scale="1.3" :variant="selectedSearch && !noPermission?'success':'secondary'" /> Gör ett urval</h5>
                <h5 v-else>Gör en sökning</h5>
            </template>

            <!--Begin:: companySelect-->
            <b-form-group id="companySelect" label="Föreningar" label-for="companySelect">
                <b-row align-content="between" align-v="center">
                    <b-col>
                        <CompanySelect
                                ref="companySelect"
                                :ids="company_ids"
                                @selectedCompanies="ableSave = false"
                        />
                    </b-col>
                    <b-col cols="auto">
                        <p class="cursor-pointer m-auto w-76 btn-hover-primary" @click="toggleSidebar">
                            <fa-icon icon="sliders-h" size="lg"/>
                            Fler filter
                        </p>
                    </b-col>
                </b-row>
            </b-form-group>
            <!--End:: companySelect-->

            <!--Begin:: saveSearch-->
            <b-collapse :visible="ableSave" id="saveSearch">
                <b-form-group v-if="ableSave" class="mt-9" label="Spara sökning / urval" label-for="saved-name">
                    <b-row align-v="center" align-content="between">
                        <b-col>
                            <b-form-input
                                    placeholder="Namn på sökning / urval"
                                    id="saved-name"
                                    v-model="savetext"
                            />
                        </b-col>
                        <b-col cols="auto">
                            <div class="w-76">
                            </div>
                        </b-col>
                    </b-row>
                </b-form-group>
            </b-collapse>
            <!--End:: saveSearch-->

            <!--Begin:: selectQuery-->
            <b-form-group label="Välj sparat urval" label-for="select-savedsearch" >
                <b-row align-content="between" align-v="center">
                    <b-col>
                        <b-form-select v-model="selectedSearch" id="select-savedsearch" :options="searchHistory"></b-form-select>
                    </b-col>
                    <b-col cols="auto">
                        <div class="w-76">
                            <a
                                    class="btn btn-icon btn-light btn-sm"
                                    @click="showSavedSearchModal = true"
                            >
                          <span class="svg-icon svg-icon-md svg-icon-primary">
                            <!--begin::Svg Icon-->
                            <inline-svg src="/assets/svg/CogWheel.svg"></inline-svg>
                              <!--end::Svg Icon-->
                          </span>
                            </a>
                        </div>
                    </b-col>
                </b-row>

            </b-form-group>
            <!--End:: selectQuery-->

            <!--Begin:: alert for numClients, do a search-->
            <b-alert :show="showNumClients" :variant="colorOne">
                {{alertOne}}
            </b-alert>
            <!--end:: alert for numClients, do a search-->

            <!--Begin:: searchButton-->
            <b-form-group>
                <div class="d-flex justify-content-start">
                    <b-button variant="light" size="sm" class="" @click="onReset($event)">Rensa</b-button>
                    <b-button v-if="!ableSave" style="width: 109px" variant="primary" size="sm" class="ml-2" @click="onSearch($event)">Sök</b-button>
                    <b-button v-else style="width: 109px" variant="success" size="sm" class="ml-2" @click="onSave($event)" :disabled="button_disabled">Spara Sökning</b-button>
                </div>
            </b-form-group>
            <!--End:: searchButton-->

            <!--Begin:: alert for numClients, do a search-->
            <b-alert :show="showNumClients && !isShowSearch" :variant="colorOne">
                {{alertOne}}
            </b-alert>
            <!--end:: alert for numClients, do a search-->

            <!--Begin:: alert 403 noPermission-->
            <b-alert :show="noPermission" variant="danger">
                Du har inte tillgång till valda föreningar. Be administratör att lägga till din användare i föreningen.
            </b-alert>
            <!--End:: alert 403 noPermission-->

            <!--Begin:: alert query-->
            <b-alert :show="!queryOk && !noPermission && showNumClients" variant="danger">
                Ett urval måste väljas
            </b-alert>
            <!--End:: alert query-->

            <!--Begin:: close button-->
            <b-row v-if="isShowSearch">
                <b-col align="end">
                    <b-button class="w-15" variant="primary" @click="isShowSearch = false">Stäng</b-button>
                </b-col>
            </b-row>
            <!--End:: close button-->

        </b-card>
        <!--Begin:: sidebar-->
        <b-sidebar z-index="1000" v-model="showOptions" id="searchOption" bg-variant="white" no-header right shadow>
            <template #default="{hide}" style="overflow-y: hidden">

                <!--Begin:: sidebar header-->
                <div class="sidebar-header bg-primary d-flex align-items-center justify-content-between px-8">
                    <h3>Filters</h3>
                    <fa-icon icon="times" size="lg" class="cursor-pointer" @click="toggleSidebar" />
                </div>
                <!--End:: sidebar header-->

                <!--Begin:: sidebar body-->
                <div class="px-8 mt-8">
                    <!--Begin:: Back button-->
                    <b-form-group >
                        <b-row align-v="end" id="btn-back" class="cursor-pointer" @click="goBack">
                            <b-col>
                                <p class="mb-0" >
                                    <fa-icon icon="chevron-left" /> Back
                                </p>
                            </b-col>
                            <b-col v-if="optionTemp.key || isOptionList">
                                {{optionTemp.label}}
                            </b-col>
                        </b-row>
                    </b-form-group>
                    <!--End:: Back button-->

                    <!--Begin:: Search Field-->
                    <b-form-group v-if="!optionTemp.key && !isOptionList" label="Medlemsegenskaper" label-for="filterOptions">
                        <b-input-group>
                            <b-form-input
                                    id="filterOptions"
                                    type="search"
                                    placeholder="Sök på filter"
                                    v-model="filterOptions"
                            />
                            <b-input-group-append id="filterOption-text" is-text>
                                <i class="flaticon2-search-1"></i>
                            </b-input-group-append>
                        </b-input-group>
                    </b-form-group>
                    <!--End:: Search Field-->

                    <div>
                        <perfect-scrollbar
                                class="quick-search-wrapper scroll mt-8"
                                style="max-height: 72vh; min-height: 60vh; position: relative;"
                                v-bind:options="{ suppressScrollX: true }"
                        >
                            <!--Begin:: Option List-->
                            <div class="mt-3 pl-3" v-if="!optionTemp.key && !isOptionList">
                                <b-row v-for="item in searchOptions" :key="item.key" class="cursor-pointer option-list-item py-5" @click="selectedOption(item)">
                                    <b-col>
                                        {{item.label}}
                                    </b-col>
                                </b-row>
                            </div>
                            <!--End:: Option List-->

                            <!--Begin:: Selected options list-->
                            <div v-else-if="isOptionList">
                                <div v-for="(item, index) in selectedOptions" :key="item.key">

                                    <!--Begin:: Event section-->
                                    <b-card no-body class="mt-2 p-4" v-if="item.key === 'event'">
                                        <b-row align-v="center" >
                                            <b-col class="d-flex justify-content-between align-items-center">
                                                {{item.label}}

                                                <a
                                                        class="btn btn-icon btn-light btn-sm"
                                                        @click="removeFilter(index)"
                                                >
                                                  <span class="svg-icon svg-icon-md svg-icon-primary">
                                                    <inline-svg src="/assets/svg/Trash.svg"></inline-svg>
                                                  </span>
                                                </a>
                                            </b-col>
                                        </b-row>
                                        <!--Begin:: EventItem -->
                                        <b-row v-for="el in item.items" :key="el.id">
                                            <b-col class="pt-1 pb-1">
                                                <b-card no-body class="p-4">
                                                    <p class="mb-1">{{el.name}}</p>
                                                    <p class="mb-0 w-100 text-right font-11 text-black-50">{{el.to_datetime}}</p>
                                                </b-card>
                                            </b-col>
                                        </b-row>
                                        <!--End:: EventItem -->
                                    </b-card>
                                    <!--End:: Event section-->

                                    <!--Begin:: User section-->
                                    <b-card no-body class="mt-2 p-4" v-else-if="item.key === 'user'">
                                        <b-row align-v="center" >
                                            <b-col class="d-flex justify-content-between align-items-center">
                                                {{item.label}}

                                                <a
                                                        class="btn btn-icon btn-light btn-sm"
                                                        @click="removeFilter(index)"
                                                >
                                                  <span class="svg-icon svg-icon-md svg-icon-primary">
                                                    <inline-svg src="/assets/svg/Trash.svg"></inline-svg>
                                                  </span>
                                                </a>
                                            </b-col>
                                        </b-row>
                                        <b-row>
                                            <b-col>
                                                <b-card no-body class="p-4">
                                                    <p>titeln</p>
                                                    <p>
                                                        <b-badge v-for="el in item.labels" :key="el" class="mt-1" variant="light" pill href="#">
                                                            {{el}}
                                                        </b-badge>
                                                    </p>
                                                    <p class="mb-0 w-100 text-right font-11 text-black-50" v-if="item.dir">Users sitting on the board</p>
                                                    <p class="mb-0 w-100 text-right font-11 text-black-50" v-if="item.acc">Users who are accountants</p>
                                                </b-card>
                                            </b-col>
                                        </b-row>
                                    </b-card>
                                    <!--End:: User section-->

                                    <!--Begin:: Client section-->
                                    <b-card no-body class="mt-2 p-4" v-else-if="item.key === 'client'">
                                        <b-row align-v="center" >
                                            <b-col class="d-flex justify-content-between align-items-center">
                                                {{item.label}}

                                                <a
                                                        class="btn btn-icon btn-light btn-sm"
                                                        @click="removeFilter(index)"
                                                >
                                                  <span class="svg-icon svg-icon-md svg-icon-primary">
                                                    <inline-svg src="/assets/svg/Trash.svg"></inline-svg>
                                                  </span>
                                                </a>
                                            </b-col>
                                        </b-row>
                                        <b-row>
                                            <b-col>
                                                <b-card no-body class="p-4">
                                                    <p>
                                                        <b-badge v-for="el in item.prop_names" :key="el" class="mt-1" variant="light" pill href="#">
                                                            {{el}}
                                                        </b-badge>
                                                    </p>
                                                    <p class="mb-0 w-100 text-right font-11 text-black-50">{{item.group_name}}</p>
                                                </b-card>
                                            </b-col>
                                        </b-row>
                                    </b-card>
                                    <!--End:: Client section-->

                                    <!--Begin:: Region section-->
                                    <b-card no-body class="mt-2 p-4" v-else-if="item.key === 'region'">
                                        <div v-if="item.names.length > 1">
                                            <b-row align-v="center">
                                                <b-col class="d-flex justify-content-between align-items-center">
                                                    {{item.label}}

                                                    <a
                                                            class="btn btn-icon btn-light btn-sm"
                                                            @click="removeFilter(index)"
                                                    >
                                                      <span class="svg-icon svg-icon-md svg-icon-primary">
                                                        <inline-svg src="/assets/svg/Trash.svg"></inline-svg>
                                                      </span>
                                                    </a>
                                                </b-col>
                                            </b-row>
                                            <b-row>
                                                <b-col>
                                                    <b-card no-body class="p-4">
                                                        <p>
                                                            <b-badge v-for="el in item.names" :key="el" class="mt-1" variant="light" pill href="#">
                                                                {{el}}
                                                            </b-badge>
                                                        </p>
                                                    </b-card>
                                                </b-col>
                                            </b-row>
                                        </div>
                                        <div v-else>
                                            <b-row align-v="center" >
                                                <b-col cols="5">{{item.label}}</b-col>
                                                <b-col cols="4">
                                                    {{item.names[0]}}
                                                </b-col>
                                                <b-col align="end">
                                                    <a
                                                            class="btn btn-icon btn-light btn-sm"
                                                            @click="removeFilter(index)"
                                                    >
                                                      <span class="svg-icon svg-icon-md svg-icon-primary">
                                                        <!--begin::Svg Icon-->
                                                        <inline-svg src="/assets/svg/Trash.svg"></inline-svg>
                                                          <!--end::Svg Icon-->
                                                      </span>
                                                    </a>
                                                </b-col>
                                            </b-row>
                                        </div>
                                    </b-card>
                                    <!--End:: Region section-->

                                    <!--Begin:: period section-->
                                    <b-card no-body class="mt-2 p-4" v-else-if="item.key === 'period_id'">
                                        <b-row align-v="center" >
                                            <b-col class="d-flex justify-content-between align-items-center">
                                                {{item.label}}

                                                <a
                                                        class="btn btn-icon btn-light btn-sm"
                                                        @click="removeFilter(index)"
                                                >
                                                  <span class="svg-icon svg-icon-md svg-icon-primary">
                                                    <inline-svg src="/assets/svg/Trash.svg"></inline-svg>
                                                  </span>
                                                </a>
                                            </b-col>
                                        </b-row>
                                        <b-row>
                                            <b-col>
                                                <b-card no-body class="p-4">
                                                    <p>{{item.name}}</p>
                                                    <p class="mb-0 w-100 text-right font-11 text-black-50">{{`${item.from} - ${item.to}`}}</p>
                                                </b-card>
                                            </b-col>
                                        </b-row>
                                    </b-card>
                                    <!--End:: period section-->

                                    <!--Begin:: default-->
                                    <b-card no-body class="mt-2 p-4" v-else>
                                        <b-row align-v="center" >
                                            <b-col :cols="item.value[0] !== true && item.value[0] !== 1 ? 5 : 9">{{item.label}}</b-col>
                                            <b-col cols="4" v-if="item.value[0] !== true && item.value[0] !== 1">
                                                {{is_set(item.text) ? item.text : item.value[0]}}
                                            </b-col>
                                            <b-col align="end">
                                                <a
                                                        class="btn btn-icon btn-light btn-sm"
                                                        @click="removeFilter(index)"
                                                >
                                              <span class="svg-icon svg-icon-md svg-icon-primary">
                                                <!--begin::Svg Icon-->
                                                <inline-svg src="/assets/svg/Trash.svg"></inline-svg>
                                                  <!--end::Svg Icon-->
                                              </span>
                                                </a>
                                            </b-col>
                                        </b-row>
                                    </b-card>
                                    <!--Begin:: default-->
                                </div>

                                <b-button class="mt-8" variant="primary" size="sm" @click="addMore">lägg fler filter</b-button>
                            </div>
                            <!--End:: Selected options list-->

                            <!--Begin:: Option item-->
                            <div v-else>
                                <div v-if="optionTemp.key === 'age'">
                                    <b-form-group label="Från Ålder" label-for="new-search-fromage">
                                        <b-form-input id="new-search-fromage" v-model="optionItem[0]" placeholder="Från" />
                                    </b-form-group>
                                    <b-form-group label="Till Ålder" label-for="new-search-toage">
                                        <b-form-input id="new-search-toage" v-model="optionItem[1]" placeholder="Till" />
                                    </b-form-group>
                                </div>
                                <div v-else-if="optionTemp.key === 'firstname'">
                                    <b-form-group label="Förnamn" label-for="new-search-firstname">
                                        <b-form-input id="new-search-fromage" v-model="optionItem[0]" placeholder="Förnamn" />
                                    </b-form-group>
                                </div>
                                <div v-else-if="optionTemp.key === 'lastname'">
                                    <b-form-group label="Efternamn" label-for="new-search-lastname">
                                        <b-form-input id="new-search-fromage" v-model="optionItem[0]" placeholder="Efternamn" />
                                    </b-form-group>
                                </div>
                                <div v-else-if="optionTemp.key === 'street'">
                                    <b-form-group label="Gatuadress" label-for="new-search-street">
                                        <b-form-input id="new-search-street" v-model="optionItem[0]" placeholder="Gatuadress" />
                                    </b-form-group>
                                </div>
                                <div v-else-if="optionTemp.key === 'region'">
                                    <b-form-group id="input-group-7" label="Region" label-for="input-7">
                                        <multi-select ref="regionSelect" :selected-data="region_codes" :data="regionOptions" />
                                    </b-form-group>
                                </div>
                                <div v-else-if="optionTemp.key === 'zipcode'">
                                    <b-form-group label="Postkod" label-for="new-search-postcode">
                                        <b-form-input id="new-search-postcode" v-model="optionItem[0]" placeholder="Postkod" />
                                    </b-form-group>
                                </div>
                                <div v-else-if="optionTemp.key === 'commune'">
                                </div>
                                <div v-else-if="optionTemp.key === 'country'">
                                    <b-form-group label="Land" label-for="new-search-countries">
                                        <b-form-select id="new-search-countries" v-model="optionItem[0]">
                                            <b-form-select-option
                                                    v-for="(c, i) in countries"
                                                    :key="`search-country-${i}`"
                                                    :value="c.iso"
                                            >{{ c.sv }}</b-form-select-option
                                            >
                                        </b-form-select>
                                    </b-form-group>
                                </div>
                                <div v-else-if="optionTemp.key === 'period_id'">
                                    <b-form-group label="Period" label-for="new-search-period">
                                        <b-form-select
                                                id="new-search-period"
                                                v-model="optionItem[0]"
                                                :options="periods"
                                                text-field="name"
                                                value-field="id"
                                        >
                                        </b-form-select>
                                    </b-form-group>
                                </div>
                                <div v-else-if="optionTemp.key === 'payment'">
                                    <b-form-group label="Betalstatus för perioden" label-for="new-search-payment">
                                        <b-form-select id="new-search-payment" v-model="optionItem[0]">
                                            <b-form-select-option
                                                    v-for="(p, i) in payments"
                                                    :key="`search-payment-${i}`"
                                                    :value="p.value"
                                            >{{ p.text }}</b-form-select-option
                                            >
                                        </b-form-select>
                                    </b-form-group>
                                </div>
                                <div v-else-if="optionTemp.key === 'gender'">
                                    <b-form-group label="Kön" label-for="new-search-gender">
                                        <b-form-select id="new-search-gender" v-model="optionItem[0]">
                                            <b-form-select-option
                                                    v-for="(g, i) in genders"
                                                    :key="`search-gender-${i}`"
                                                    :value="g.value"
                                            >{{ g.text }}</b-form-select-option
                                            >
                                        </b-form-select>
                                    </b-form-group>
                                </div>
                                <div v-else-if="optionTemp.key === 'ladok'">
                                    <b-form-group label="LADOK status" label-for="new-search-ladoks">
                                        <b-form-select id="new-search-ladoks" v-model="optionItem[0]">
                                            <b-form-select-option
                                                    v-for="(l, i) in ladoks"
                                                    :key="`search-ladok-${i}`"
                                                    :value="l.value"
                                            >{{ l.text }}</b-form-select-option
                                            >
                                        </b-form-select>
                                    </b-form-group>
                                </div>
                                <div v-else-if="optionTemp.key === 'no_email'" class="d-flex align-items-center mb-8">
                                    <label class="checkbox checkbox-lg checkbox-outline checkbox-success">
                                        <input type="checkbox" name="" v-model="optionItem[0]" />
                                        <span></span>
                                    </label>
                                    <span class="ml-3 cursor-pointer" @click="optionItem[0] = !optionItem[0]"
                                    >Endast medlemmar som saknar e-post</span
                                    >
                                </div>
                                <div v-else-if="optionTemp.key === 'has_error'"  class="d-flex align-items-center mb-8">
                                    <label class="checkbox checkbox-lg checkbox-outline checkbox-success">
                                        <input type="checkbox" name="" v-model="optionItem[0]" />
                                        <span></span>
                                    </label>
                                    <span
                                            class="ml-3 cursor-pointer"
                                            @click="optionItem[0] = !optionItem[0]"
                                    >Endast medlemmar med fel</span
                                    >
                                </div>
                                <div v-else-if="optionTemp.key === 'cl_conf'"  class="d-flex align-items-center mb-8">
                                    <label class="checkbox checkbox-lg checkbox-outline checkbox-success">
                                        <input type="checkbox" name="" v-model="optionItem[0]" />
                                        <span></span>
                                    </label>
                                    <span
                                            class="ml-3 cursor-pointer"
                                            @click="optionItem[0] = !optionItem[0]"
                                    >Endast medlemmar som har bekräftat medlemskap för perioden</span
                                    >
                                </div>
                                <div v-else-if="optionTemp.key === 'is_stickprov'"  class="d-flex align-items-center mb-8">
                                    <label class="checkbox checkbox-lg checkbox-outline checkbox-success">
                                        <input type="checkbox" name="" v-model="optionItem[0]" />
                                        <span></span>
                                    </label>
                                    <span class="ml-3 cursor-pointer" @click="optionItem[0] = !optionItem[0]"
                                    >Endast medlemmar i stickprover</span
                                    >
                                </div>
                                <div v-else-if="optionTemp.key === 'client'">
                                    <client-option :groups="groups" name="clientOption" ref="clientOption"/>
                                </div>
                                <div v-else-if="optionTemp.key === 'user'">
                                    <user-option :selected_companies = "selected_companies" @setUserQuery="setUserQuery" />
                                </div>
                                <div v-else-if="optionTemp.key === 'event'">
                                    <event-option ref="eventOption" @eventSelected="eventSelected" :events="events" />
                                </div>

                                <b-button class="mt-5" variant="primary" size="sm" :disabled="disableAddFilter" @click="addFilter">Lägg till filter</b-button>
                            </div>
                            <!--End:: Option item-->
                        </perfect-scrollbar>
                    </div>
                </div>
                <!--End:: sidebar body-->
            </template>
        </b-sidebar>
        <!--End:: sidebar-->

    </div>
</template>
<style lang="scss" scoped>
    .checkbox.checkbox-light-success > span {
        background-color: white;
        border: 1px solid #ddd;
    }
    .btn-hover-primary {
        &:hover {
            color: #3699FF;
        }
    }
    .w-76{
        width: 76px;
    }
    .b-sidebar-body {
        .sidebar-header {
            height: 65px;
            color: white;
        }
        .option-list-item{
            &:hover {
                background-color: #f5f5f5;
            }
        }
    }
    #btn-back{
        &:hover {
            background-color: #f5f5f5;
        }
    }
    #filterOption-text{
        .input-group-text {
            background-color: unset;
            border-left: unset;
        }
    }
    #filterOptions {
        border-right: unset;
        &:focus {
            #filterOption-text{
                .input-group-text {
                    background-color: unset;
                    border-left: unset;
                    border-color: #2a4eff;
                }
            }
        }
    }
</style>
<script>
    import axios from 'axios';
    import moment from 'moment';
    import VueSimpleRangeSlider from 'vue-simple-range-slider';
    import { mapGetters } from 'vuex';
    import 'vue-simple-range-slider/dist/vueSimpleRangeSlider.css';
    import CompanySelect from '@/view/components/companySelect.vue';
    import MultiSelect from '@/view/components/multiSelect.vue';
    import userOption from '@/view/pages/testing/userOption.vue';
    import eventOption from "@/view/pages/testing/eventOption.vue";
    import clientOption from "@/view/pages/testing/clientOption.vue";

    export default {
        name: 'search-options',
        components: {eventOption, VueSimpleRangeSlider, CompanySelect, MultiSelect, userOption, clientOption},
        data() {
            return {
                user: {},
                eventOptions: [],
                regions: {},
                communes: {},
                regionOptions: [],
                communeOptions: [],
                queries: [],
                groups:[],
                searchHistory: [{ value: null, text: 'Det finns inga sparade sökningar'}],
                selectedSearch: null,
                isShowSearch: this.collapse,
                showSavedSearchModal: false,
                fields: [
                    {key:'text', label: 'Name'},
                    {key: 'date', label: 'Date'},
                    {key: 'action'}
                ],
                events: [],
                selectedEventIds:[],
                isShowEvents: false,
                company_ids:[],
                region_codes: [],
                colorOne: 'success',

                props:[],
                showOptions:false,
                isOptionList: false,
                isByQuery: false,
                isReset: false,
                ableSave: false,
                savetext: '',
                searchOptions: [],
                searchOptionList:[
                    { label: 'Användare', key:'user', index: 1},
                    { label: 'Attribut', key:'client', index: 2},
                    { label: 'Ålder', key:'age', index: 3},
                    { label: 'Bekräftat medlemskap', key:'cl_conf', index: 4},
                    { label: 'Betalstatus', key:'payment', index: 5},
                    { label: 'Efternamn', key:'lastname', index: 6},
                    { label: 'Eventdeltagare', key:'event', index: 7},
                    { label: 'Förnamn', key:'firstname', index: 8},
                    { label: 'Gatuadress', key:'street', index: 9},
                    { label: 'Kön', key:'gender', index: 10},
                    { label: 'LADOK', key:'ladok', index: 11},
                    { label: 'Land', key:'country', index: 12},
                    { label: 'Medlemmar i stickprover', key:'is_stickprov', index: 13},
                    { label: 'Medlemmar med fel', key:'has_error', index: 14},
                    { label: 'Medlemsperiod', key:'period_id', index: 15},
                    { label: 'Postkod', key:'zipcode',  index: 16},
                    { label: 'Region', key:'region',  index: 17},
                    { label: 'Saknar e-post', key:'no_email', index: 18},
                ],
                selectedOptions:[],
                optionTemp:{
                    key:'',
                    label:''
                },
                optionItem:[],
                filterOptions:'',
                eventIds:[],
                eventItems:[],
                userTitles: [
                    {key: 'uPfNXjet', label: 'Ordförande'},
                    {key: 'jGWnE8Yt', label: 'Vice Ordförance'},
                    {key: 'nxE5VM7L', label: 'Kassör'},
                    {key: 'elqHHWrf', label: 'Ledamot'},
                    {key: 'HkqPDwKL', label: 'Generalsekreterare'},
                    {key: 'flfhSGnZ', label: 'Kanslist'},
                    {key: '0xRPnqC6', label: 'Kontaktperson'},
                    {key: 'MbgRnP0A', label: 'Övrigt'}
                ],
            };
        },
        props: {
            countries: { type: Array, default: [] },
            periods: { type: Array, default: [] },
            genders: { type: Array, default: [] },
            payments: { type: Array, default: [] },
            ladoks: { type: Array, default: [] },
            showEvents: { type: Boolean, default: false },
            showRegions: { type: Boolean, default: false },
            collapse: {type: Boolean, default: false},
            useSavedSearch: {type: Boolean, default: true},
            button_disabled: {type: Boolean, default: false},
            noPermission: {type: Boolean, default: false},
            queryOk: {type: Boolean, default: false},
            numClients: {type: Number, default: null},
            showNumClients: {type: Boolean, default: false}
        },
        mounted() {
            this.searchOptions = this.searchOptionList;
            if (this.showEvents) {
                this.loadEvents();
            }

            if (this.showRegions) {
                this.loadRegions();
            }

            this.loadCompany();
            this.loadGroups();
        },
        watch: {
            filterOptions(newVal, oldVal){
                let list = []
                if (newVal.length >0)
                    list = this.searchOptionList.filter(item => {
                        return item.label.toLowerCase().includes(newVal.toLowerCase());
                    });
                else
                    list = this.searchOptionList;
                const els = this.selectedOptions.map(i => i.label.toLowerCase());
                this.searchOptions = list.filter(item => {
                    return !els.includes(item.label.toLowerCase());
                })
            },
            selectedOptions(){
                if (this.isReset)
                    this.$emit('onReset');
                else
                    this.$emit('onSearch', this.getQuery());
            },
            /**
             *
             * */
            selectedSearch(newVal, oldVal) {
                for (var i = 0; i < this.queries.length; ++i) {
                    if (this.queries[i].id === newVal) {
                        this.setQuery(this.queries[i]);
                        break;
                    }
                }
                this.$emit('querySelected', newVal);
            },
            isShowSearch(newVal, oldVal){
                if (newVal === true)
                    this.scrollToClassName('card mb-8')
            },
        },
        computed: {
            ...mapGetters(['currentCompanyId', 'currentPeriodId']),
            selected_companies(){
                return this.$refs['companySelect'].getCompanies();
            },
            items(){
                return this.searchHistory.filter(item => {
                    return item.value !== null;
                })
            },
            alertOne(){
                let text = '';
                if (this.numClients === null || this.numClients === undefined) {
                    this.colorOne = "warning";
                    text = "Gör en sökning för att kontrollera hur många medlemmar som finns i urvalet";
                } else {
                    text = `Antal medlemmar i urvalet: ${this.numClients}`;
                    this.colorOne = "success";
                }
                return text;
            },

            /** */
            disableAddFilter(){
                const itemList = ['age', 'client', 'user', 'event', 'region', 'period'];
                const failedAge = this.optionTemp.key === 'age' && this.optionItem.length !== 2;
                const failedEvent = this.optionTemp.key === 'event' && this.eventIds.length === 0;
                const failedUser = this.optionTemp.key === 'user' && !this.user.dir && !this.user.acc && this.user.titles && this.user.titles.length === 0;
                const failedItems = !itemList.includes(this.optionTemp.key) && this.optionItem.length === 0;
                return failedItems || failedAge || failedEvent || failedUser;
            }
        },
        methods: {
            goBack(){
                if(this.optionTemp.key || this.isOptionList)
                    this.resetOptionTemp();
                else
                    this.toggleSidebar();
            },
            addMore(){
                this.resetOptionTemp();
            },
            addFilter(){
                let item = null;
                switch (this.optionTemp.key) {
                    case 'client':
                        const data = this.$refs['clientOption'].getData();
                        item = {...this.optionTemp, ...data};
                        break;
                    case 'user':
                        item = {...this.optionTemp, ...this.user};
                        break;
                    case 'event':
                        item = {...this.optionTemp, items: this.eventItems, ids: this.eventIds};
                        break;
                    case 'age':
                        item = {
                            ...this.optionTemp,
                            value: [`${this.optionItem[0]} - ${this.optionItem[1]}`],
                            from_age: this.optionItem[0],
                            to_age: this.optionItem[1]
                        };
                        break;
                    case 'region':
                        let names = [];
                        const region_codes = this.$refs['regionSelect'].getData();
                        if (region_codes[0] === 'all')
                            names = ['Alla'];
                        else
                            names =  Object.values(this.regions).filter(item => region_codes.includes(item.region_code)).map(item => item.region);
                        item = { ...this.optionTemp, names, region_codes};
                        break;
                    case 'period_id':
                        let period = {};
                        this.periods.filter(item => {
                            if (item.id === this.optionItem[0]) period = item;
                        });
                        item = { ...this.optionTemp, ...period};
                        break;
                    case 'ladok':
                        item = { ...this.optionTemp, value: this.optionItem, text: ''};
                        if (this.optionItem[0] === 'all')
                            item.text = 'Alla';
                        else {
                            const val = this.ladoks.filter(el => el.value === this.optionItem[0]);
                            item.text = val[0].text;
                        }
                        break;
                    case 'country':
                        item = { ...this.optionTemp, value: this.optionItem, text: ''};
                        if (this.optionItem[0] === 'all')
                            item.text = 'Alla';
                        else {
                            this.countries.forEach(el => {
                                if (el.iso === this.optionItem[0]){
                                    item.text = el.sv;
                                }
                            })
                        }
                        break;
                    case 'payment':
                        item = { ...this.optionTemp, value: this.optionItem, text: ''};
                        if (this.optionItem[0] === 'all')
                            item.text = 'Alla';
                        else {
                            this.payments.filter(el => el.value === this.optionItem[0]);
                            this.payments.forEach(el => {
                                if (el.value === this.optionItem[0]) item.text = el.text;
                            })
                        }
                        break;
                    case 'gender':
                        item = { ...this.optionTemp, value: this.optionItem, text: ''};
                        if (this.optionItem[0] === 'all')
                            item.text = 'Alla';
                        else {
                            this.genders.forEach(gender => {
                                if (this.optionItem[0] === gender.value)
                                    item.text = gender.text;
                            })
                        }
                        break;
                    default:
                        item = { ...this.optionTemp, value: this.optionItem, text: ''};
                        break;
                }

                if (item) {
                    this.selectedOptions.push(item);
                    this.selectedOptions.sort((a, b) => a.index - b.index);
                    this.searchOptions = this.searchOptions.filter(item => item.key !== this.optionTemp.key);
                    this.isOptionList = true;
                    console.log('Add_Filter', this.selectedOptions)
                }
            },
            removeFilter(i){
                const {label, key, index} = this.selectedOptions[i];
                this.selectedOptions.splice(i, 1);
                this.searchOptions.push({label, key, index});
                this.searchOptions.sort((a, b) => a.index - b.index);
            },
            selectedOption(item){
                this.optionTemp = item;
            },
            resetOptionTemp(){
                this.optionTemp = {key:'',label: ''};
                this.optionItem = [];
                this.isOptionList = false;
            },
            resetSidebar(){
                this.resetOptionTemp();
                this.isOptionList = this.selectedOptions.length !== 0;
            },
            toggleSidebar(){
                this.showOptions = !this.showOptions;
                let that = this;
                setTimeout(function(){
                    that.resetSidebar();
                }, 500)
            },
            onSearch() {
                this.$emit('onSearch', this.getQuery());
            },
            onSave(e) {
                e.preventDefault();
                axios
                    .post('/search/query', this.getQuery() )
                    .then(res => {
                        this.toastr('success', 'OK', 'Sökning skapad');

                        var query = res.data.query;

                        this.$emit('queryCreated', query);
                        this.queries.push(query);
                        this.searchHistory.push({ value: query.id, text: query.name });
                        this.selectedSearch = query.id;
                    })
                    .catch(err => {
                        console.error(err);
                        this.toastr('danger', 'Server Fel', 'Kunde inte skapa sökning');
                    });
            },
            onReset(e) {
                e.preventDefault();

                this.isReset = true;
                this.ableSave = false;
                this.selectedSearch = null;
                this.selectedOptions = [];
                this.$refs['companySelect'].reset();
            },
            getQuery() {
                this.isReset = false;
                this.ableSave = true;
                let commune_code = null;
                let sexes = ['all'];
                let event_ids = [];
                let user = {};
                let groups = [];
                let region_codes = ['all'];
                let street = '';
                let types = [];
                let variables = [
                    {key:'period_id', value: this.currentPeriodId},
                    {key:'ladok', value: 'all'},
                    {key:'country', value: 'all'}
                ];
                console.log('selected_options', this.selectedOptions)
                console.log('Reset', this.isReset);

                this.selectedOptions.filter((item, index) => {
                    switch (item.key) {
                        case 'user':
                            const {acc, dir, titles} = item;
                            types.push('user');
                            user = {acc, dir, titles};
                            break;
                        case 'event':
                            event_ids = item.ids;
                            break;
                        case 'gender':
                            sexes = [item.value];
                            break;
                        case 'client':
                            const {group_id, prop_ids} = item;
                            types.push('member');
                            groups.push({group_id, prop_ids});
                            break;
                        case 'age':
                            const {from_age, to_age} = item;
                            variables.push({key:'from_age', value:from_age});
                            variables.push({key:'to_age', value:to_age});
                            break;
                        case 'street':
                            if(this.is_set(item.value[0]))
                                variables.push({key:'address', value: item.value[0]});
                            break;
                        case 'region':
                            region_codes = item.region_codes;
                            break;
                        case 'payment':
                            variables.push({key:'paying', value: item.value[0]});
                            break;
                        case 'has_error':
                        case 'is_stickprov':
                        case 'cl_conf':
                            variables.push({key:item.key, value:1});
                            break;
                        case 'ladok':
                        case 'country':
                            variables.filter((el, index) => {
                                if (el.key === item.key) el.value = item.value[0];
                            });
                            break;
                        case 'period_id':
                            variables.filter((el, index) => {
                                if (el.key === item.key) el.value = item.id;
                            });
                            break;
                        case 'firstname':
                        case 'lastname':
                        case 'zipcode':
                        case 'no_email':
                            if(this.is_set(item.value[0]))
                                variables.push({key:item.key, value:item.value[0]});
                            break;
                    }
                });
                if (types.length === 0 && !this.isReset){
                    types = ['member'];
                    groups = this.groups.length > 0 ? [{group_id: this.groups[0].value, prop_ids: ['all']}] : [];
                }

                return {
                    id: '',
                    name: this.savetext,
                    variables,
                    user,
                    date: moment().format('YYYY-MM-DD'),
                    event_ids,
                    company_ids: this.$refs['companySelect'].getCompanies(),
                    types,
                    commune_code,
                    region_codes,
                    groups,
                    sexes,
                    selected_company_id: this.currentCompanyId,
                    company_id: this.currentCompanyId,
                    order_by: { key: 'lastname', value: 'desc' },
                    street,
                    limit: 999999,
                    page: 1,
                }
            },
            setQuery(query) {
                console.log('setting query');
                console.log(query);
                const {
                    commune_code, company_id, company_ids, date, event_ids, groups, id, limit, name, order_by, page,
                    region_codes, selected_company_id, sexes, street, types, user, variables
                } = query;
                let selected_options = [];

                groups && this.loadProps(groups[0].group_id);
                if (types.includes('member') && groups){
                    const group_names = this.groups.filter(item=>item.value === groups[0].group_id).map(item => item.text);
                    const prop_names = groups[0].prop_ids[0] === 'all'
                        ? ['Alla']
                        : this.props.filter(item => this.groups[0].prop_ids.includes(item.code)).map(item => item.label);

                    selected_options.push({
                        key: 'client',
                        group_id: groups[0].group_id,
                        prop_ids:groups[0].prop_ids,
                        group_name: group_names[0],
                        prop_names,
                    });
                }
                if (types.includes('user') && user){
                    const labels = this.userTitles.filter(title => user.titles.includes(title.key)).map(title => title.label);
                    selected_options.push({
                        key: 'user',
                        labels,
                        ...user
                    })
                }

                if (region_codes && region_codes.length > 0){
                    let regionNames = [];
                    if (region_codes[0] === 'all')
                        regionNames = ['Alla'];
                    else
                        regionNames =  Object.values(this.regions).filter(item => region_codes.includes(item.region_code)).map(item => item.region);
                    selected_options.push({
                        key:'region',
                        names: regionNames,
                        region_codes
                    })
                }
                if (sexes && sexes.length > 0 && sexes[0] !== 'all'){
                    let temp = {key: 'gender', value: sexes[0], text: ''};
                    this.genders.forEach(gender => {
                        if (sexes.includes(gender.value))
                            temp.text = gender.text;
                    })
                    selected_options.push(temp);
                }
                if (event_ids && event_ids.length > 0){
                    const event_items = this.events.filter(item => event_ids.includes(item.event_id));
                    selected_options.push({
                        key: 'event',
                        items: event_items,
                        ids: event_ids
                    });
                }
                if (variables && variables.length > 0){
                    let age_temp = {};
                    variables.forEach(item => {
                        switch (item.key) {
                            case 'country':
                                if (item.value !== 'all'){
                                    this.countries.forEach(el => {
                                        if (el.iso === item.value){
                                            selected_options.push({key: item.key, value: [item.value], text: el.sv});
                                        }
                                    })
                                }
                                break;
                            case 'ladok':
                                if (item.value !== 'all'){
                                    const val = this.ladoks.filter(el => el.value === item.value);
                                    selected_options.push({key: item.key, value: [item.value], text: val[0].text});
                                }
                                break;
                            case 'period_id':
                                this.periods.filter(el => {
                                    if (el.id === item.value) {
                                        selected_options.push({key: item.key, value: [item.value], ...el});
                                    }
                                });
                                break;
                            case 'paying':
                                const paymentItem = this.payments.filter(el => el.value === item.value);
                                selected_options.push({key: 'payment', value: [paymentItem[0].value], text:paymentItem[0].text});
                                break;
                            case 'address':
                                if (this.is_set(item.value)){
                                    selected_options.push({key:'street', value:[item.value]});
                                }
                                break;
                            case 'from_age':
                                age_temp.from_age = item.value;
                                break;
                            case 'to_age':
                                age_temp.to_age = item.value;
                                break;
                            default:
                                selected_options.push({key: item.key, value: [item.value]});
                                break;
                        }
                    });
                    if (Object.values(age_temp).length > 0)
                        selected_options.push({
                            key: 'age',
                            value: [`${age_temp.from_age} - ${age_temp.to_age}`],
                            from_age: age_temp.from_age,
                            to_age: age_temp.to_age
                        });

                }

                // Add index, label to each element of selected_options
                let tt = [];
                this.searchOptionList.forEach(item => {
                    selected_options.forEach(el => {
                        if (el.key === item.key) tt.push({...el, ...item});
                    });
                });
                this.selectedOptions = tt.sort((a, b) => a.index - b.index);

                // Reset searchOptions based on the selected_options
                this.searchOptions = this.searchOptionList.filter(item => selected_options.every(el => {
                    return el.key !== item.key;
                }));
                this.resetSidebar();
            },
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
            is_set(vv) {
                return vv !== null && vv !== undefined && vv !== '' && vv !== ' ';
            },

            /**
             *
             * */
            eventSelected(val) {
                this.eventIds = val.event_ids ? val.event_ids : [];
                this.eventItems = val.events ? val.events : [];
                console.log('Event_selected', this.eventIds, )
                this.$emit('eventSelected', val.event_ids);
            },
            async deleteQuery(id){

                const res = await axios.delete(`/company/searchquery?id=${id}&company_id=${this.currentCompanyId}`);
                if (res.status === 200){
                    this.toastr('success', 'Ok', 'Den valda sparade sökningen har just tagits bort.');
                    this.searchHistory = this.searchHistory.filter(item=>{
                        return item.value !== id
                    });
                    this.selectedSearch = null;
                } else {
                    this.toastr('danger', 'Server Fel', 'Det gick inte att ta bort den valda sparade sökningar.');
                }
            },
            setUserQuery(user){
                console.log('User_Data', user)
                this.user = user;
            },
            selectQuery(query_id) {
                this.selectedSearch = query_id;
            },
            createQuery() {
                return this.getQuery();
            },
            loadCompany() {
                axios
                    .get(`/company?company_id=${this.currentCompanyId}`)
                    .then(res => {
                        if (res.status === 200) {
                            this.company = res.data.company;
                        }

                        this.searchHistory = [{ value: null, text: 'Välj sparad sökning' }];
                        this.queries = [];
                        for (var i = 0; i < this.company.settings.search_queries.length; ++i) {
                            var query = this.company.settings.search_queries[i];

                            this.queries.push(query);
                            this.searchHistory.push({ value: query.id, text: query.name, date: query.date });
                        }
                    })
                    .catch(err => {
                        console.error(err);
                        this.toastr('danger', 'Server Fel', 'Kunde inte hämta föreningsinställningar');
                    });
            },
            loadEvents() {
                axios
                    .get(`/events/list?company_id=${this.currentCompanyId}&period_id=${this.currentPeriodId}`)
                    .then(res => {
                        this.events = res.data.events[this.currentCompanyId];
                    })
                    .catch(err => {
                        console.error(err);
                        this.toastr('danger', 'Server Fel', 'Kunde inte hämta evenemangslista');
                    });
            },
            loadGroups() {
                this.groups = [];
                axios
                    .get(`/property_group/list?company_id=${this.currentCompanyId}&period_id=${this.currentPeriodId}`)
                    .then(res => {
                        if (res.status === 200) {
                            this.groups = res.data.groups.map(group=>{
                                return {text: group.name, value: group.group_id};
                            });
                        }
                    })
                    .catch(err => {
                        console.error(err);
                        this.toastr('danger', 'Server Fel', 'Kunde inte lista kategorier');
                    });
            },
            loadRegions() {
                axios
                    .get('/location/regions')
                    .then(res => {
                        this.regions = res.data.regions;
                        this.regionOptions = [];

                        for (var k in this.regions) {
                            this.regionOptions.push({ code: k, label: this.regions[k].region });
                        }

                        this.regionOptions.sort(function (a, b) {
                            if (a.text < b.text) {
                                return -1;
                            }
                            if (a.text > b.text) {
                                return 1;
                            }
                            return 0;
                        });
                    })
                    .catch(err => {
                        console.error(err);
                        this.toastr('danger', 'Server Fel', 'Kunde inte hämta regioner');
                    });
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
            toastr(type, title, message) {
                this.$bvToast.toast(message, {
                    title: title,
                    autoHideDelay: 2000,
                    appendToast: true,
                    variant: type
                });
            },

        }
    };
</script>
