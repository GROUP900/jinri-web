import pcframe from './components/pcframe.vue';
import pcfocus from './components/pcfocus.vue';
import month from './components/month.vue';

const routers = [{
  path: '/',
  component:pcframe,
  redirect: {
    name: 'latest'
  },
  children: [{
    path: 'latest',
    component: pcfocus,
    name: 'latest'
  },
  {
    path: 'day/:date',
    component: pcfocus,
    name: 'day'
  }]
},{
  name: 'month',
  path: '/month/:date',
  component:month
}]

export default routers
