<template>
  <div class="px-5 mb-8" id="page-todowizard">
    <b-modal v-model="showStepModal" ref="todo-step-modal" hide-footer title="">
      <div class="d-block text-center">
        <h3></h3>
      </div>
      <b-button class="mt-3" variant="outline-success" block @click="nextPage">OK</b-button>
      <b-button class="mt-2" variant="outline-warning" block @click="resumePage">Cancel</b-button>
    </b-modal>
    <h4 class="mb-8 ml-2 mt-8">Att göra</h4>

    <b-card title="" class="mb-2" hide-footer>
      <!--begin: Wizard-->
      <div
              class="wizard wizard-3"
              id="kt_wizard_v3"
              data-wizard-state="step-first"
              data-wizard-clickable="true"
      >
        <!--begin: Wizard Nav -->
        <div class="wizard-nav border-bottom mb-1 mb-lg-5">
          <div class="wizard-steps px-8 py-8 px-lg-15 py-lg-3">
            <template v-for="(item, i) in pages">
              <div
                      class="wizard-step"
                      v-bind:key="i"
                      data-wizard-type="step"
                      v-bind:data-wizard-state="item.state"
              >
                <div class="wizard-label">
                  <h3 class="wizard-title">
                    <span>{{ i + 1 }}</span> {{ i === 0? 'Introduktion' : item.name }}
                  </h3>
                  <div class="wizard-bar"></div>
                </div>
              </div>
            </template>

            <div
                    class="wizard-step"
                    data-wizard-type="step"
                    data-wizard-state="pending"
            >
              <div class="wizard-label">
                <h3 class="wizard-title">
                  <span>{{ pages.length + 1 }}</span> Klart
                </h3>
                <div class="wizard-bar"></div>
              </div>
            </div>
          </div>
        </div>
        <!--end: Wizard Nav -->

        <!--begin: Wizard Body-->
        <div class="row justify-content-center px-8 px-lg-10">
          <div class="col-xl-12 col-xxl-7">
            <!--begin: Wizard Form-->
            <form class="form" id="kt_form" @submit.prevent="">
              <template v-for="(page, i) in pages">
                <div
                        class="pb-5 pt-5"
                        v-bind:key="i"
                        data-wizard-type="step-content"
                        v-bind:data-wizard-state="page.state"
                >
                  <!--<h4 class="mb-10 font-weight-bold text-dark">{{ page.name }}</h4>-->
                  <IntroPage
                          v-if="i === 0"
                          :todo="todo"
                          :task="page.task"
                  />

                  <TodoWizardPage
                          v-else
                          :page="page"
                          :todo="todo"
                          :task="page.task"
                          @selectedStatus="selectedTaskStatus"
                          @fileUploaded="fileUploaded"
                          @disableNext="(val)=>{disabledNextButton=val}"
                  />
                </div>
              </template>

              <!-- Begin: Final confirm step -->
              <div
                      class="pb-5"
                      data-wizard-type="step-content"
                      data-wizard-state="pending"
              >
                <b-row align-v="center" style="height: 300px">
                  <b-col align="center">
                    <h4 class="font-weight-bold text-dark">Inlämningen är genomförd</h4>
                  </b-col>
                </b-row>

              </div>
              <!-- End: Final confirm step -->

              <!--begin: Wizard Actions -->
              <div class="d-flex justify-content-between border-top pt-16">
                <div class="mr-2" >
                  <button
                          class="btn btn-light-primary font-weight-bold text-uppercase px-9 py-4"
                          data-wizard-type="action-prev"
                          v-if='isVisablePrevious()'
                          :disabled="isDisablePrevious()"
                  >
                    Föregående
                  </button>
                </div>
                <div>
                  <button
                          v-if="!isLastTask"
                          class="btn btn-primary font-weight-bold text-uppercase px-9 py-4"
                          :disabled="!isIntro && disabledNextButton"
                          @click="getStepModal"
                  >
                    <!--                    data-wizard-type="action-next"-->
                    Nästa steg
                  </button>
                </div>
              </div>
              <!--end: Wizard Actions -->
            </form>
          </div>
        </div>
      </div>
    </b-card>
  </div>
</template>

<style lang="scss" scoped>
  @import '@/assets/sass/pages/wizard/wizard-3.scss';

  .checkbox.checkbox-light-success > span {
    background-color: white;
    border: 1px solid #ddd;
  }
</style>

<script>
  import axios from 'axios';
  import { mapGetters } from 'vuex';
  import TodoWizardPage from '@/view/pages/ml/todowizard/TodoWizardPage.vue';
  import IntroPage from "@/view/pages/ml/todowizard/IntroPage";

  import KTUtil from '@/assets/js/components/util';
  import KTWizard from '@/assets/js/components/wizard';

  export default {
    name: 'todowizard',
    components: {
      TodoWizardPage,
      IntroPage
    },
    computed: {
      ...mapGetters(['currentCompanyId', 'currentPeriodId']),
      isLastTask(){
        console.log('TODO-WIZARD', this.wizard ? this.wizard.getStep() : '', this.pages.length)
        return this.wizard? this.wizard.getStep() === this.pages.length +1 : false;
      },
      isIntro(){
        return this.wizard? this.wizard.getStep() === 1 : false;
      }
    },
    mounted: function () {
      this.loadData();
    },
    data() {
      return {
        disabledNextButton: true,
        form: {},
        showNext: true,
        currentPage: 0,
        wizard: null,
        order: {},
        pages: [],
        todo: null,
        task: null,
        todo_id: null,
        showStepModal: false,
      };
    },
    watch: {
      showNext(newVal, oldVal) {
        console.log('showNext changed: ' + newVal);
      },
    },
    methods: {
      selectedTaskStatus(status){
        // console.log('currentStep', !!this.wizard, this.wizard.getStep())
        this.disabledNextButton = false;
        if (!!this.wizard)
          this.pages[this.wizard.currentStep-1].task.status = status;
      },
      fileUploaded(file) {
        //console.log(file);
      },
      isVisablePrevious() {
        return !this.isLastTask;
        // for (let index = 0; index < this.pages.length; index++) {
        //   if (this.pages[index].hasOwnProperty("task"))
        //     if (this.pages[index].task.hasOwnProperty("status"))
        //       if (this.pages[index].task.status != 'DONE')
        //         return true;
        // }
        // return false;
      },
      isDisablePrevious() {
        var enableButton = false;
        // if (this.pages.length > this.currentPage && this.currentPage > 0)
        //   if (this.pages[this.currentPage - 1].hasOwnProperty("task")
        //           && this.pages[this.currentPage - 1].task.hasOwnProperty("status"))
        //     enableButton = this.pages[this.currentPage].task.status === 'DONE';
        return enableButton;
      },
      getStepModal(){
        const status = ['COMPLETE'];
        const currentStatus = this.pages[this.wizard.currentStep-1].task.status;
        if (status.includes(currentStatus)){
          this.showStepModal = true;
        } else {
          this.nextPage();
        }
      },
      resumePage(e){
        this.showStepModal = false;
        this.wizard.resume();
      },
      nextPage(e) {
        const status = ['DONE', 'NOT'];
        const isStatus = this.pages[this.wizard.currentStep] && status.includes(this.pages[this.wizard.currentStep].task.status);
        this.showStepModal = false;
        // make sure that the next button is properly disabled when clicking on next
          this.disabledNextButton = isStatus ? false :!this.pages[this.wizard.getStep()-1].valid;
        this.wizard.goNext();
        // this.currentPage = this.wizard.currentStep-1;
      },

      isValid(valid, index) {
        console.log('received isValid signal from ' + index + ': ' + valid);

        var currentStep = 0;

        if (this.wizard !== undefined && this.wizard !== null) {
          currentStep = this.wizard.getStep() - 1;
        }

        console.log('currentstep: ' + currentStep + ' index: ' + index);

        if (index == currentStep) {
          this.showNext = valid;
          console.log('showing next: ' + valid);
          this.disabledNextButton = !valid;
        }
        else {
          console.log('not showing next');
        }

        if (this.pages.length > index) {
          this.pages[index].valid = valid;
        }
      },
      finish() {
        axios
          .put('/todo', { status: 'DONE', todo_id: this.todo_id })
          .then(res => {
            this.toastr('success', 'OK', 'Status uppdaterat');
          })
          .catch(err => {
            console.error(err);
            this.toastr('danger', 'Fel', 'Kunde inte uppdatera status');
          });
      },
      createWizard() {
        var that = this;

        that.showNext = true;

        // Initialize form wizard
        that.wizard = new KTWizard('kt_wizard_v3', {
          startStep: 1, // initial active step number
          clickableSteps: true // allow step clicking
        });

        // Validation before going to next page
        that.wizard.on('beforeNext', function (/*wizardObj*/) {
          // validate the form and use below function to stop the wizard's step
          // wizardObj.stop();
        });

        // Change event
        that.wizard.on('change', function (/*wizardObj*/) {
          setTimeout(() => {
            KTUtil.scrollTop();

            that.currentPage = that.wizard.currentStep;

            if ((that.currentPage-1) === that.pages.length) {
              console.log('last page');
            }
          }, 200);
        });

        that.showNext = false;
      },
      async loadData() {
        this.todo_id = this.$route.params.id;

        axios
                .get(`/todo?todo_id=${this.todo_id}`)
                .then(res => {
                  this.todo = res.data.todo;

                  // add introPage to array
                  this.todo.tasks.splice(0,0,{
                    name: res.data.todo.name,
                    descr: res.data.todo.descr
                  })

                  this.pages = []
                  for (var i = 0; i < this.todo.tasks.length; ++i) {
                    var task = this.todo.tasks[i];
                    this.pages.push({
                      type: i === 0 ? 'intro' : 'normal',
                      state: i === 0 ? 'current' : 'pending',
                      name: task.name,
                      index: i,
                      task: task
                    });
                  }

                  var that = this;

                  setTimeout(function(){
                    that.createWizard();
                  }, 100);
                })
                .catch(err => {
                  console.error(err);
                  this.toastr('danger', 'Server Fel', 'Kunde inte hämta att-göra data');
                });
      },
      toastr(type, title, message) {
        this.$bvToast.toast(message, {
          title: title,
          autoHideDelay: 2000,
          appendToast: true,
          variant: type
        });
      }
    }
  };
</script>
