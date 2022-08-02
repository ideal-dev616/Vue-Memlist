import Vue from 'vue';
import Router from 'vue-router';
import store from '@/core/services/store';

Vue.use(Router);
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
const routes = [
  {
    path: '/',
    redirect: '/ml-dashboard',
    component: () => import('@/view/layout/Layout'),
    children: [
      {
        path: '/ml-dashboard',
        name: 'ml-dashboard',
        component: () => import('@/view/pages/ml/Dashboard.vue')
      },
      {
        path: '/ml-advanced-search',
        name: 'ml-advanced-search',
        component: () => import('@/view/pages/ml/AdvancedSearch.vue')
      },
      {
        path: '/ml-advanced-search-test',
        name: 'ml-advanced-search-test',
        component: () => import('@/view/pages/testing/AdvancedSearch.vue')
      },
      {
        path: '/ml-sendout',
        name: 'ml-sendout',
        component: () => import('@/view/pages/ml/Sendout.vue')
      },
      {
        path: '/ml-sendout/:id',
        name: 'ml-sendout',
        component: () => import('@/view/pages/ml/Sendout.vue')
      },
      {
        path: '/ml-todo-wizard/:id',
        name: 'ml-todo-wizard',
        component: () => import('@/view/pages/ml/TodoWizard.vue')
      },
      {
        path: '/ml-templates',
        name: 'ml-templates',
        component: () => import('@/view/pages/ml/Templates.vue')
      },
      {
        path: '/ml-templates/:sendout_id/:is_edit/:template_id',
        name: 'ml-templates',
        component: () => import('@/view/pages/ml/Templates.vue')
      },
      {
        path: '/ml-ladok',
        name: 'ml-ladok',
        component: () => import('@/view/pages/ml/LADOK.vue')
      },
      {
        path: '/ml-stickprov',
        name: 'ml-stickprov',
        component: () => import('@/view/pages/ml/Stickprov.vue')
      },
      {
        path: '/ml-files',
        name: 'ml-files',
        component: () => import('@/view/pages/ml/Files.vue')
      },
      {
        path: '/ml-shopitem',
        name: 'ml-shopitem',
        component: () => import('@/view/pages/ml/ShopItem.vue')
      },
      {
        path: '/ml-properties',
        name: 'ml-properties',
        component: () => import('@/view/pages/ml/MemberAttributes.vue')
      },
      {
        path: '/ml-mucf',
        name: 'ml-mucf',
        component: () => import('@/view/pages/ml/MUCF.vue')
      },
      {
        path: '/ml-quicksearch/:id',
        name: 'ml-quicksearch',
        component: () => import('@/view/pages/ml/QuickSearch.vue')
      },
      {
        path: '/ml-quicksearch',
        name: 'ml-quicksearch',
        component: () => import('@/view/pages/ml/QuickSearch.vue')
      },
      {
        path: '/ml-language',
        name: 'ml-language',
        component: () => import('@/view/pages/ml/Language.vue')
      },
      {
        path: '/ml-companies',
        name: 'ml-companies',
        component: () => import('@/view/pages/ml/Companies.vue')
      },
      {
        path: '/ml-errors',
        name: 'ml-errors',
        component: () => import('@/view/pages/ml/Errors.vue')
      },
      {
        path: '/ml-settings/:id',
        name: 'ml-settings',
        component: () => import('@/view/pages/ml/Settings.vue')
      },
      {
        path: '/ml-settings',
        name: 'ml-settings',
        component: () => import('@/view/pages/ml/Settings.vue')
      },
      {
        path: '/ml-events',
        name: 'ml-events',
        component: () => import('@/view/pages/ml/Events.vue')
      },
      {
        path: '/ml-system',
        name: 'ml-system',
        component: () => import('@/view/pages/ml/System.vue')
      },
      {
        path: '/ml-import',
        name: 'ml-import',
        component: () => import('@/view/pages/ml/Import.vue')
      },
      {
        path: '/ml-importcompanies',
        name: 'ml-importcompanies',
        component: () => import('@/view/pages/ml/ImportCompanies.vue')
      },
      {
        path: '/ml-member-manager',
        name: 'ml-member-manager',
        component: () => import('@/view/pages/ml/MembersManager.vue')
      },
      {
        path: '/ml-payments',
        name: 'ml-payments',
        component: () => import('@/view/pages/ml/Payments.vue')
      },
      {
        path: '/ml-profile',
        name: 'ml-profile',
        component: () => import('@/view/pages/ml/UserProfile.vue')
      },
      {
        path: '/ml-support',
        name: 'ml-support',
        component: () => import('@/view/pages/ml/Support.vue')
      },
      {
        path: '/ml-apikeys',
        name: 'ml-apikeys',
        component: () => import('@/view/pages/ml/APIKeys.vue')
      },
      {
        path: '/ml-registersetup',
        name: 'ml-registersetup',
        component: () => import('@/view/pages/ml/RegistrationSetup.vue')
      },
      {
        path: '/ml-subcompany',
        name: 'ml-subcompany',
        component: () => import('@/view/pages/ml/Subcompany.vue')
      },
      {
        path: '/',
        component: () => import('@/view/layout/Vuetify.vue'),
        children: [
          {
            path: '/ml-users',
            name: 'ml-users',
            component: () => import('@/view/pages/ml/Users.vue')
          },
          {
            path: '/ml-users/:id',
            name: 'ml-users',
            component: () => import('@/view/pages/ml/Users.vue')
          },
          {
            path: '/ml-todo',
            name: 'ml-todo',
            component: () => import('@/view/pages/ml/Todo.vue')
          },
          {
            path: '/ml-periods',
            name: 'ml-periods',
            component: () => import('@/view/pages/ml/Periods.vue')
          },
          {
            path: '/ml-billing',
            name: 'ml-billing',
            component: () => import('@/view/pages/ml/Billing.vue')
          },
          {
            path: '/ml-book',
            name: 'ml-book',
            component: () => import('@/view/pages/ml/Book.vue')
          },
        ]
      },
      {
        path: '/ml-admin',
        name: 'ml-admin-support',
        component: () => import('@/view/pages/ml/AdminSupport.vue')
      }
    ]
  },
  {
    path: '/',
    component: () => import('@/view/pages/ml/auth/Auth.vue'),
    children: [
      {
        name: 'ml-login',
        path: '/ml-login',
        component: () => import('@/view/pages/ml/auth/Login.vue')
      },
      {
        name: 'ml-tokenlogin',
        path: 'ml-tokenlogin/:token',
        component: () => import('@/view/pages/ml/auth/LoginToken.vue')
      },
      {
        name: 'ml-tokenlogin',
        path: 'ml-tokenlogin/:token/*',
        component: () => import('@/view/pages/ml/auth/LoginToken.vue')
      },
      {
        name: 'ml-activate',
        path: '/ml-activate/:user_id/:token',
        component: () => import('@/view/pages/ml/auth/Activate.vue')
      },
      {
        name: 'ml-register',
        path: '/ml-register/:company_id',
        component: () => import('@/view/pages/ml/auth/Register.vue')
      },
      {
        name: 'ml-forget',
        path: '/ml-forget',
        component: () => import('@/view/pages/ml/auth/Forget.vue')
      },
      {
        name: 'ml-reset',
        path: '/ml-reset/:token',
        component: () => import('@/view/pages/ml/auth/Reset.vue')
      }
    ]
  },
  {
    path: '/',
    component: () => import('@/view/pages/members/register/Layout.vue'),
    children: [
      {
        name: 'register',
        path: '/register/:id',
        component: () => import('@/view/pages/members/register/RegisterWizard.vue')
      },
    ]
  },
  {
    path: '/',
    component: () => import('@/view/pages/members/loggedin/Layout.vue'),
    children: [
      {
        name: 'profile',
        path: '/profile',
        component: () => import('@/view/pages/members/loggedin/Profile.vue')
      },
      {
        name: 'profile',
        path: '/profile/:client_id',
        component: () => import('@/view/pages/members/loggedin/Profile.vue')
      },
      {
        name: 'profile',
        path: '/profile/:client_id/:token',
        component: () => import('@/view/pages/members/loggedin/Profile.vue')
      },
      {
        name: 'event',
        path: '/event/:id',
        component: () => import('@/view/pages/members/public/EventDetails.vue')
      },
      {
        name: 'events',
        path: '/events/:id',
        component: () => import('@/view/pages/members/public/Events.vue')
      },
    ]
  },
  {
    path: '/',
    component: () => import('@/view/pages/members/auth/Auth.vue'),
    children: [
      {
        name: 'login',
        path: '/login/:company_id',
        component: () => import('@/view/pages/members/auth/Login.vue')
      },
      {
        name: 'renew',
        path: '/renew/:client_id/:login_token/:renew_date',
        component: () => import('@/view/pages/members/auth/Renewal.vue')
      },
      {
        name: 'activate',
        path: '/activate/:client_id/:token',
        component: () => import('@/view/pages/members/auth/Activate.vue')
      },
      // {
      //   name: 'confirm',
      //   path: '/confirm/:client_id/:code',
      //   component: () => import('@/view/pages/members/auth/Confirm.vue')
      // },
      {
        name: 'forget',
        path: '/forget/:company_id',
        component: () => import('@/view/pages/members/auth/Forget.vue')
      },
      {
        name: 'forget',
        path: '/forget',
        component: () => import('@/view/pages/members/auth/Forget.vue')
      },
      {
        name: 'reset',
        path: '/reset/:token',
        component: () => import('@/view/pages/members/auth/Reset.vue')
      },
    ]
  },
  {
    name: 'payment-accept',
    path: '/payment-accept',
    component: () => import('@/view/pages/members/payment/PaymentAccept.vue')
  },
  {
    name: 'payment-callback',
    path: '/payment-callback',
    component: () => import('@/view/pages/members/payment/PaymentCallback.vue')
  },
  {
    name: 'payment',
    path: '/payment/:client_id',
    component: () => import('@/view/pages/members/payment/PaymentPage.vue')
  },
  {
    name: 'signup',
    path: '/signup',
    component: () => import('@/view/pages/ml/auth/SignupWizard.vue')
  },
  {
    name: 'signup',
    path: '/signup/:id',
    component: () => import('@/view/pages/ml/auth/SignupWizard.vue')
  },
  {
    name: 'spurl',
    path: '/spurl/:id',
    component: () => import('@/view/pages/members/public/Stickprov.vue')
  },
  {
    path: '*',
    redirect: '/404'
  },
  {
    // the 404 route, when none of the above matches
    path: '/404',
    name: '404',
    component: () => import('@/view/pages/Error.vue')
  },
  {
    path: '/fortnox-redirect/:authorization-code',
    name: 'fortnox-redirect',
    component: () => import('@/view/pages/api/FortnoxAuthenticate.vue')
  },
  {
    path: '/fortnox-redirect',
    name: 'fortnox-redirect',
    component: () => import('@/view/pages/api/FortnoxAuthenticate.vue')
  }
];

const router = new Router({
  mode: 'history',
  routes,
  scrollBehavior() {
    return { x: 0, y: 0 };
  }
});

const public_access = {
  'ml-login': true,
  'ml-forget': true,
  'ml-activate': true,
  'ml-register': true,
  'ml-reset': true,
  'ml-tokenlogin': true,
}

router.beforeEach((to, from, next) => {
  const __acl = store.getters['currentAccess'] ? store.getters['currentAccess'] : [];
  const __isTalongAdmin = store.getters['isTalongAdmin'];

  const dest = to.path.replace("/", "");

  if (!hasAccess(dest, __acl, __isTalongAdmin)) {
    router.push({name: '404'});
  }
  else {
    return next();
  }
});

const hasAccess = (name, acl, isTalongAdmin) => {
  

  const stripped = name.split('/')[0];

  if (acl === null || acl === undefined) {
    return true;
  }

  console.log('checking access: ' + stripped);

  if (stripped === 'ml-todo-wizard') { return true; }

  if (stripped.substr(0,'3') !== 'ml-') {
    return true;
  }

  if (stripped in public_access) {
    return true;
  }

  if (isTalongAdmin) {
    return true;
  }

  if (stripped in acl) {
    if (acl[stripped].su && !isTalongAdmin) {
      return false;
    }

    return acl[stripped].p !== '-';
  }

  return false;
};
export default router;
