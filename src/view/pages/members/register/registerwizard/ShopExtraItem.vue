<template>

    <b-card no-body class="overflow-hidden mb-8">
        <b-row no-gutters>
        <b-col lg="4" style="background-color: white">
            <b-card-img
            v-if="shopitem.frontend.img_url !== '' && shopitem.frontend.img_url"
            
            :src="shopitem.frontend.img_url"
            class="rounded-0"
            ></b-card-img>
        </b-col>
        <b-col lg="8">
            <b-card-body :title="shopitem.name">
            <b-card-text>
                {{ shopitem.descr }}
            </b-card-text>
            <b-card-text>
                <b-row>
                    <b-col lg="3">
                    <h5 style="margin-top: 10px;">{{ shopitem.price_sek + shopitem.vat_sek }} kr</h5>
                    </b-col>
                    
                    <b-col lg="3">
                        <b-form-input
                        id="num_bought"
                        v-model="num_bought"
                        placeholder="0"
                        disabled
                    ></b-form-input>
                    </b-col>
                    <b-col lg="3">
                        <b-button href="#" variant="primary" @click="addShopItem(shopitem.shop_item_id, $event)">Lägg till</b-button>
                    </b-col>
                    <b-col lg="3">
                        <b-button v-if="num_bought > 0" href="#" variant="danger" @click="removeShopItem(shopitem.shop_item_id, $event)">Ta bort</b-button>
                    </b-col>
                    <b-col lg="3">
                    <h5 style="margin-top: 10px; font-weight: 100;"> {{ (shopitem.price_sek + shopitem.vat_sek) * num_bought }} kr</h5>
                    </b-col>
                </b-row>
            </b-card-text>
            </b-card-body>
        </b-col>
        </b-row>
    </b-card>

</template>

<style lang="scss" scoped>
.checkbox > span {
  background-color: white;
  border: 1px solid #ddd;
}
</style>
<script>
import axios from 'axios';
import { mapGetters } from 'vuex';

export default {
  name: 'shop-extra-item',
  props: ['shopitem'],
  components: {

  },
  data() {
    return {
      num_bought: 0
    };
  },
  mounted() {},
  watch: {

  },
  methods: {
    clear() {
      this.num_bought = 0;
    },
    removeShopItem(shop_item_id, e) {
      e.preventDefault();

      this.num_bought--;

      this.$emit('removeShopItem', shop_item_id);
    },
    addShopItem(shop_item_id, e) {
      e.preventDefault();

      this.num_bought++;

      this.$emit('addShopItem', shop_item_id);
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
