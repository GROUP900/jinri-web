import login from './components/login.vue'
import list from './components/list.vue'
import main from './components/main.vue'
import setting from './components/setting.vue'
import add from './components/add.vue'

const routers = [{
    path: '/login',
    name: 'login',
    component: login
  },{
    path: '/',
    component: main,
    children: [{
        path: '',
        redirect: 'list'
      },
      {
        path: 'list',
        name: 'list',
        component: list
      },{
        path: '/add',
        name:'add',
        component: add
      },{
        path: '/edit/:id',
        name:'edit',
        component: add
      },{
        path: '/setting',
        name:'setting',
        component: setting
      },
      {
        path: '/logout',
        name: 'logout'
      }
    ]
    }
]

export default routers
