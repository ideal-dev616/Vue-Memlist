<template>
    <div id="app">
        <div class="container">
            <div id="bar">
                <h1 class="pt-3">E-posteditor</h1>

                <b-button variant="primary" class="ml-2" v-on:click="saveDesign">Spara</b-button>

                <!--<button v-on:click="exportHtml">Export HTML</button>-->
            </div>
            <EmailEditor
                    :appearance="appearance"
                    :min-height="minHeight"
                    :project-id="projectId"
                    :locale="locale"
                    :options="options"
                    v-on:load="editorLoaded"
                    ref="emailEditor"
            />
        </div>
    </div>
</template>

<script>
    import { EmailEditor } from 'vue-email-editor';
    import __tags from '@/assets/plugins/email-editor/merge-tags.js';
    import { mapGetters } from 'vuex';

    export default {
        name: 'EmailTemplateEditor',
        components: {
            EmailEditor
        },
        props: ['design'],
        computed: {
            ...mapGetters(['currentCompanyId', 'currentPeriodId']),
            options() {
                return {
                    user: {
                        id: this.currentCompanyId
                    },
                    mergeTags: {},
                    features: {
                        userUploads: true
                    }
                }
            },
        },
        data() {
            return {
                minHeight: "790px",
                locale: "en",
                projectId: 14545,
                appearance: {
                    theme: 'dark',
                    panels: {
                        tools: {
                            dock: 'right'
                        }
                    }
                },
            }
        },
        mounted(){
          __tags.filter(item => {
              this.options.mergeTags[item.id] = {name: item.name, value: `%${item.id}%`};
          });
        },
        methods: {
            editorLoaded() {
                // Pass your template JSON here
                const design = this.isJson(this.design) ? JSON.parse(this.design) : this.design;
                try {
                    this.$refs['emailEditor'].editor.loadDesign(design);
                } catch (e){
                    console.log(e)
                }
            },
            saveDesign() {
                this.$refs['emailEditor'].editor.saveDesign(
                    (data) => {
                        this.$refs['emailEditor'].editor.exportHtml(
                            (val) => {
                                this.$emit('saveDesign', JSON.stringify(data), val.html);
                            }
                        )
                    }
                );
            },
            isJson(str){
                try{
                    JSON.parse(str);
                } catch {
                    return false;
                }
                return true;
            }
        },
    }
</script>
<style scoped>
    .unlayer-editor {
        height: 80vh;
    }
    #app .container {
        background-color: #293039;
        display: flex;
        flex-direction: column;
        position: relative;
        height: 100%;
        width: 100%;
        max-width: 100%;
    }
    #bar {
        flex: 1;
        background-color: #293039;
        color: white;
        padding: 10px;
        display: flex;
        max-height: 65px;
    }
    #bar h1 {
        flex: 1;
        font-size: 16px;
        text-align: left;
    }
    #bar button {
        min-width: 80px;
        cursor: pointer;
    }
</style>
