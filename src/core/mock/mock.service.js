import Vue from 'vue';

var MockAdapter = require('axios-mock-adapter');

// mock testing user accounts
const users = [
  {
    email: 'admin@demo.com',
    password: 'demo',
    token: 'mgfi5juf74j'
  },
  {
    email: 'admin2@demo.com',
    password: 'demo',
    token: 'fgj8fjdfk43'
  }
];

const listnonaccept = [
  {
    company_id: '1111-2222-3333',
    name: 'Test Company 1',
    org_number: '881122-3344',
    created_at: '2021-01-10 18:00:00'
  },
  {
    company_id: '5555-6666-7777',
    name: 'Test Company 2',
    org_number: '991111-1122',
    created_at: '2021-01-13 18:00:00'
  }
];

const todos = [
  {
    todo_id: 'a',
    name: 'A thing todo',
    to_datetime: '2021-03-20 20:00:00',
    status: 'NOT',
    tasks: [
      {
        todo_task_id: 'ab',
        status: 'NOT',
        name: 'Upload file',
        type: 'IMPORT_MEMBERS'
      }
    ]
  },
  {
    todo_id: 'b',
    name: 'Another todo',
    to_datetime: '2021-03-21 20:00:00',
    status: 'NOT',
    tasks: [
      {
        todo_task_id: 'ac',
        status: 'NOT',
        name: 'Upload file',
        type: 'FILE_CSV'
      }
    ]
  }
];

const companies = [
  {
    company_id: '1111-2222-3333',
    name: 'Test Company 1'
  },
  {
    company_id: '5555-6666-7777',
    name: 'Test Company 2'
  },
  {
    company_id: '1234-2313-4232',
    name: 'Test Company 3'
  },
  {
    company_id: '3495-4530-7692',
    name: 'Test Company 4'
  }
];

const MockService = {
  init() {
    // this sets the mock adapter on the default instance
    var mock = new MockAdapter(Vue.axios);

    // mock login request
    mock.onPost('/login').reply(data => {
      const credential = JSON.parse(data.data);
      const found = users.find(user => {
        return credential.email === user.email && credential.password === user.password;
      });
      if (found) {
        return [200, found];
      }
      return [404, { errors: ['The login detail is incorrect'] }];
    });

    mock.onGet(/company\/listnonaccept\/?.*/).reply(data => {
      return [200, listnonaccept];
    });

    mock.onGet('/company/list').reply(data => {
      return [200, companies];
    });

    mock.onGet(/todo\/list\/?.*/).reply(data => {
      return [200, todos];
    });

    mock.onPut('/company/select').reply(data => {
      return [200, 'Success'];
    });

    // mock info update request
    mock.onPost('/personal_info').reply(data => {
      users.user_personal_info = data;
      return users.user_personal_info;
    });

    // mock to verify authentication
    mock.onGet(/\/verify\/?/).reply(data => {
      const token = data.headers.Authorization.replace('Token ', '');
      if (token !== 'undefined') {
        const found = users.find(user => {
          return token === user.token;
        });
        return [200, found];
      }
      return [401, { errors: ['Invalid authentication'] }];
    });
  }
};

export default MockService;
