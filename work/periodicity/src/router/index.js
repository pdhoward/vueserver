import Vue from 'vue'
import Home from '../components/Home'
import ElementPage from '../components/ElementPage'
import Router from 'vue-router'

Vue.use(Router);

const routes = [{
    path: '/',
    component: Home
  },
  {
    path: '/element/:id',
    component: ElementPage
  },
  {
    path: '/hi',
    component: ElementPage
  },
  {
    path: '*',
    redirect: '/'
  }
]

const Foo = () => import('@/components/ElementPage.vue')

export default new Router({
  routes,
  mode: 'history'
})
