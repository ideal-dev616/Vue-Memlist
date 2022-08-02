<template>
  <!--begin::List Widget 8-->
  <div class="card card-custom card-stretch gutter-b">
    <!--begin::Header-->
    <div class="card-header border-0">
      <h3 class="card-title font-weight-bolder text-dark">Meddelanden</h3>
    </div>
    <!--end::Header-->
    <!--begin::Body-->
    <div class="card-body pt-0 px-8">

      <p v-if="comments.length === 0">Det finns inga meddelanden i åtgärden</p>
      <template v-for="(item, i) in comments">
        <!--begin::Item-->
        <div class="mb-10" v-bind:key="i">
          <!--begin::Section-->
          <div class="d-flex align-items-center">
            <!--begin::Symbol-->
            <div class="symbol symbol-45 symbol-light mr-5">
              <span class="symbol-label">
                <inline-svg
                  src="/assets/svg/User.svg"
                  class="h-50 align-self-center"
                ></inline-svg>
              </span>
            </div>
            <!--end::Symbol-->
            <!--begin::Text-->
            <div class="d-flex flex-column flex-grow-1">
              <a
                href="#"
                class="font-weight-bold text-dark-75 text-hover-primary font-size-lg mb-1"
              >
                {{ item.from }}
              </a>
              <span class="text-muted font-weight-bold">
                {{ item.created_at }}
              </span>
            </div>
            <!--end::Text-->
          </div>
          <!--end::Section-->
          <!--begin::Desc-->
          <p class="text-dark-50 m-0 pt-5 font-weight-normal">
            {{ item.text }}
          </p>
          <!--end::Desc-->
        </div>
        <!--end::Item-->
      </template>
    </div>
    <!--end::Body-->
  </div>
  <!--end: List Widget 8-->
</template>

<script>

import { mapGetters } from 'vuex';

export default {
  name: 'chatBox',
  props: ['comments'],
  components: {

  },
  computed: {
    ...mapGetters(['currentCompanyId'])
  },
  data() {
    return {
      /*list: [
        { title: 'Michael Nilsson', alt: '3 timmar sedan', desc: 'Hur gick det med detta?' },
        { title: 'Cliff Lilja', alt: '2 timmar sedan', desc: 'Det gick bra tack' }
      ]*/
    };
  },
  watch: {

  },
  methods: {

  },
  mounted() {

  },

};
</script>
