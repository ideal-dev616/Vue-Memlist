<template>
  <div id="page-auth">
    <div class="auth-header">
      <a href="#" class="logo">
<!--        <img src="/assets/images/memlist-logo-svart-30.png" />-->
      </a>
      <div class="auth-header-register">
        <span class="pr-2">Har du inget konto?</span>
        <router-link :to="registerLink()" tag="a" class="line-link blue-link f-500"
          >Registrera</router-link
        >
      </div>
    </div>
    <div class="auth-body-wrapper">
      <router-view />
    </div>
  </div>
</template>

<style lang="scss" scoped>
#page-auth {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 2rem 3rem;
  overflow-y: auto;
  background-color: white;
  @media (max-width: 1024px) {
    padding: 1.5rem 2rem;
  }

  .auth-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    @media (max-width: 1024px) {
      display: flex;
      flex-direction: column;
      padding: 1.5rem 2rem;
      .logo {
        margin-bottom: 2rem;
      }
    }
    .auth-header-register {
      color: #9d9fb1;
      font-size: 1.1rem !important;
      font-weight: 500;
    }
  }
  .auth-body-wrapper {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 3rem;

    @media (max-width: 1024px) {
      padding: 0 1.5rem;
    }
  }
  .auth-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>

<script>
export default {
  name: 'auth',
  methods: {
    registerLink() {
      return '/register/' + this.$route.params.company_id;
    }
  }
};
</script>
