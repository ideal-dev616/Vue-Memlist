<template>
  <div class="px-5" id="page-subcompany">
    <h5 class="mb-6 ml-2">Underföreningar</h5>

    <Confirm
      title="Bekräfta borttagning"
      message="Är du säker på att du vill ta bort?"
      ref="confirmModal"
      @cancel="cancelRemove"
      @confirm="confirmRemove"
    />

    <b-modal ref="editCompanyModal" size="lg" hide-footer>
      <b-alert v-if="creating" show variant="primary">Du håller på att skapa en underförening/grupp till {{ parent.text }}</b-alert>

      <b-alert v-if="!creating" show variant="secondary">Du håller på att editera {{ editcompany.text }}</b-alert>
      <Basic
        :company_id="editcompany.id"
        :company="company"
        :regions="regions"
        :creating="creating"
        @saved="companySaved"
      />
    </b-modal>

    <b-card
      title=""
      class="mb-2"
      hide-footer
      oncontextmenu="return false;"
    >

        <v-tabs
            background-color="white"
            color="deep-purple accent-4"
            right
        >
            <v-tab>Föreningshierarki</v-tab>
            <v-tab>Inställningar</v-tab>

            <v-tab-item>
                <b-row class="mt-8 mb-4">
                    <b-col lg="6">
                        <b-button v-if="selectedNode !== null" variant="outline-success" class="ml-2" type="button" @click="editCompanyClicked">Editera</b-button>
                        <b-button v-if="selectedNode !== null" variant="outline-success" class="ml-2" type="button" @click="createCompanyClicked">Skapa Ny</b-button>
                        <b-button v-if="selectedNode !== null && selectedNode.model.parent_id !== undefined" variant="outline-danger" class="ml-2" type="button" @click="removeCompanyClicked">Ta bort</b-button>
                    </b-col>
                    <b-col lg="2">

                    </b-col>
                    <b-col lg="2">

                    </b-col>
                </b-row>
                <v-treeview class="mt-8" v-model="treeData" :treeTypes="treeTypes" @selected="selected" :openAll="openAll" style="min-height: 2000px;"></v-treeview>
            </v-tab-item>

            <v-tab-item>

            </v-tab-item>
        </v-tabs>
    </b-card>

  </div>
</template>

<style lang="scss" scoped>

.checkbox.checkbox-light-success > span {
  background-color: white;
  border: 1px solid #ddd;
}
</style>

<script>
import axios from 'axios';
import { mapGetters } from 'vuex';
import VTreeview from "v-treeview"
import Basic from '@/view/pages/ml/settings/Basic.vue';
import Confirm from '@/view/components/Confirm.vue';
import { SET_COMPANIES } from '@/core/services/store/common.module';

export default {
  name: 'subcompany',
  components: {
    VTreeview,
    Basic,
    Confirm
  },
  computed: {
    ...mapGetters(['currentCompanyId', 'currentPeriodId'])
  },
  mounted() {
    this.loadData();
  },
  data() {
    return {
      openAll: true,
      treeTypes: [
        {
          type: "#",
          max_children: 6,
          max_depth: 4,
          valid_children: [
            "default",
            "riks",
            "student",
            "workgroup"
          ]
        },
        {
          type: "default",
          icon: "fas fa-building",
          valid_children: ["default", "riks", "student", "workgroup"]
        },
        {
          type: "riks",
          icon: "fas fa-sitemap",
          valid_children: ["default", "riks", "student", "workgroup"]
        },
        {
          type: "student",
          icon: "fas fa-book",
          valid_children: ["default", "riks", "student", "workgroup"]
        },
        {
          type: "workgroup",
          icon: "fas fa-user",
          valid_children: ["workgroup"]
        }
      ],
      treeData: [],
      contextItems: [],
      selectedNode: null,
      regions: {},
      editcompany: {},
      creating: false,
      parent: null,
      company: null
    };
  },
  watch: {
    currentCompanyId(newValue, oldvalue) {
      if (newValue) {
        this.loadData();
      }
    }
  },
  methods: {
    editCompanyClicked() {
      var company_id = this.selectedNode.model.id;

      axios
        .get(`/company?company_id=${company_id}`)
        .then(res => {
          this.company = res.data.company;

          this.editcompany = this.getCompanyInTree(this.treeData[0], company_id);
          this.creating = false;
          this.$refs['editCompanyModal'].show();
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte hämta föreningsdata');
        });
    },
    createCompanyClicked() {
      var parent_company_id = this.selectedNode.model.id;
      this.parent = this.getCompanyInTree(this.treeData[0], parent_company_id);
      this.company = {
        pc_id: parent_company_id,
        name: 'Ny förening'
      }

      this.creating = true;

      this.$refs['editCompanyModal'].show();
    },
    removeCompanyClicked() {
      var company_id = this.selectedNode.model.id;

      this.$refs['confirmModal'].show();
    },
    confirmRemove() {
      axios
        .delete(`/company?company_id=${this.selectedNode.model.id}`)
        .then(res => {
          this.loadHierarchy();

          this.reloadCompanies();
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte ta bort underförening');
        });
/*
      var company = {
        company_id: this.selectedNode.model.id,
        pc_id: ''
      };

      axios
        .put('/company', company)
        .then(res => {
          this.loadHierarchy();

          this.reloadCompanies();
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte ta bort underförening');
        });*/
    },
    cancelRemove() {
      console.log('remove cancelled');
      // dont do anything
    },
    reloadCompanies() {
      axios
      .get('/company/list')
      .then(res => {
        if (res.status === 200) {
          console.log('dispatching SET COMPANIES');
          this.$store.dispatch(SET_COMPANIES, res.data.companies);
        }
      })
      .catch(err => {
        console.error(err);
        this.toastr('danger', 'Serverfel', 'Gick inte att hämta föreningslista');
      });
    },
    createCompany() {
      this.$refs['editCompanyModal'].show();

      this.creating = true;

      this.company = {
        name: 'Nytt'
      };



    },
    getCompanyInTree(parent, company_id) {
      if (parent.id === company_id) {
        return parent;
      }

      for (var i = 0; i < parent.children.length; ++i) {
        var p = this.getCompanyInTree(parent.children[i], company_id);

        if (p !== null && p.id === company_id) {
          return p;
        }
      }

      return null;
    },
    editCompany(company_id) {
      this.$refs['editCompanyModal'].show();

      axios
        .get(`/company?company_id=${company_id}`)
        .then(res => {
          this.company = res.data.company;
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte hämta förening');
        });
    },
    async loadData() {
      if (!this.currentCompanyId) {
        return;
      }
      this.loadRegions();
      this.loadHierarchy();
    },
    getLangType(type) {
      switch(type) {
        case 'default': return 'Lokalförening';
        case 'student': return 'Studentkår';
        case 'riks': return 'Riksförbund';
        case 'workgroup': return 'Arbetsgrupp';
      }

      return 'Inget';
    },
    hierarchyToTreeData(tree) {
      this.treeData = [];

      var root = {};
      this.convertNode(root, root, tree);

      this.treeData.push(root);
    },
    convertNode(parent, treeNode, memlistNode) {
      treeNode.id = memlistNode.company_id;
      treeNode.text = memlistNode.name;
      treeNode.type = memlistNode.type;
      treeNode.children = [];
      treeNode.count = 0;
      treeNode.parent_id = parent.id === treeNode.id ? undefined : parent.id;

      console.log('treeNode');
      console.log(treeNode);

      if (parent !== treeNode) {
        parent.children.push(treeNode);
        parent.count++;
      }

      for (var i = 0; i < memlistNode.children.length; ++i) {
        var newNode = {};

        this.convertNode(treeNode, newNode, memlistNode.children[i]);
      }
    },
    async loadHierarchy() {
      const loader = this.$loading.show();
      const res = await axios.get(`/company/hierarchy?company_id=${this.currentCompanyId}`);
      if (res.status == 200) {
        this.hierarchyToTreeData(res.data.tree);
      } else {
        console.error(err);
        this.toastr('danger', 'Server Fel', 'Kunde inte ladda hierarki');
      };
      loader & loader.hide();
    },
    async loadRegions() {
      const loader = this.$loading.show();
      const res = await axios.get('/location/regions');
      if (res.status == 200)
        this.regions = res.data.regions;
      else {
        console.error(err);
        this.toastr('danger', 'Server Fel', 'Kunde inte hämta regioner');
      }
      loader & loader.hide();
    },
    getTypeRule(type) {
      var typeRule = this.treeTypes.filter(t => t.type == type)[0];
      return typeRule;
    },
      companySaved() {
      this.$refs['editCompanyModal'].hide();
      this.creating = false;
      this.loadData();
    },
    contextSelected(command) {

      console.log('context command: ' + command);

      switch (command) {
        case "Skapa Lokalförening":
          var node = {
            text: "New default Plan",
            type: "default",
            children: []
          };
          this.selectedNode.addNode(node);
          break;
        case "Skapa Studentkår":
          var node = {
            text: "New student",
            type: "student",
            children: []
          };
          this.selectedNode.addNode(node);
          break;
        case "Skapa Arbetsgrupp":
          var node = {
            text: "Ny arbetsgrupp",
            type: "workgroup",
            children: []
          };
          this.selectedNode.addNode(node);
          break;
        case "Ändra":
          this.selectedNode.editName();
          break;
        case "Ta bort":
          break;
      }
    },
    selected(node) {
      this.selectedNode = node;

      console.log("node selected");
      console.log(this.selectedNode);
      console.log(this.selectedNode.model);

      this.contextItems = [];
      var typeRule = this.getTypeRule(this.selectedNode.model.type);
      typeRule.valid_children.map(function(type, key) {
        var childType = this.getTypeRule(type);
        var item = {
          title: "Skapa " + this.getLangType(type),
          icon: childType.icon,
          type: childType
        };
        this.contextItems.push(item);
      }, this);

      this.contextItems.push({ title: "Ändra", icon: "far fa-edit" });
      this.contextItems.push({ title: "Ta bort", icon: "far fa-trash-alt" });
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
