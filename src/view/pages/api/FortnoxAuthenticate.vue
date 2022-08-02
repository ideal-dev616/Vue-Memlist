<template>
  <div class="d-flex flex-column flex-root">
    <div
      class="d-flex flex-row-fluid flex-column bgi-size-cover bgi-position-center bgi-no-repeat p-10 p-sm-30"
    >

      <div v-if="!done">
        <h5>
          Vänligen vänta...
        </h5>
      </div>

      <div v-if="done">

        <div v-if="!error">
          
          <div v-if="connected">
            <h5>
              Er memlist förening <strong>{{ company_name }}</strong> har framgångsrikt kopplats till Fortnox. Du kan stänga denna sida.
            </h5>
          </div>

          <div v-if="!connected">
            <h5>
              Du är inte inloggad på Memlist - Kopiera följande kod och klistra in i Inställningar -> Fortnox -> Publikt ID: <strong>{{ public_token }}</strong>
            </h5>
          </div>

        </div>

        <div v-if="error">
          <h5>
            <strong>Fel</strong> Försök igen senare eller kontakta memlist support
          </h5>
        </div>

      </div>

    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "fortnox-redirect",
  mounted() {
    this.code = this.$route.query['authorization-code'];

    if (this.$route.query['authorization-code']) {
      this.code = this.$route.query['authorization-code'];
    }
    else {
      this.code = this.$route.params['authorization-code'];
    }
    
    this.authenticate(this.code);
  },
  data() {
    return {
      public_token: '',
      code: '',
      error: false,
      connected: false,
      done: false,
      company_name: '',
      debug: null
    }
  },
  computed: {
  },
  methods: {
    authenticate(code) {
      axios 
        .post('/fortnox/auth', {
          'authorization-code': code
        })
        .then(res => {

          if (res.status !== 200) {
            this.error = true;
            this.done = true;
            return;
          }

          this.debug = res.data;

          this.error = false;
          this.done = true;

          const connected = res.data.connected;
          const company_id = res.data.company_id;
          const company_name = res.data.company_name;
          const public_token = res.data.public_token;

          this.connected = connected;
          this.public_token = public_token;
          this.company_name = company_name;
          
          console.log('Fortnox integration OK');
        })
        .catch(err => {
          console.error(err);
          this.error = true;
          this.done = true;
        });
    }
  }
};
</script>
