import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter);

const routes = [
    {
      path:'/',
      redirect:'/login'
    },{
      path:'/login',
      component:()=>import('../components/Login')
    },{
      path:'/home',
      component:()=>import('../views/Home'),
        redirect: '/welcome',
        children:[
            {
                path:'/welcome',
                component:()=>import('../components/Welcome')
            },{
                path:'/users',
                component:()=>import('../components/Users/User')
            },{
                path:'/rights',
                component:()=>import('../components/Power/Rights')
            },{
                path:'/roles',
                component:()=>import('../components/Power/Roles')
            },{
                path:'/categories',
                component:()=>import('../components/goods/category')
            },{
                path:'/reports',
                component:()=>import('../components/report/Report')
            },{
                path:'/params',
                component:()=>import('../components/goods/Params')
            },{
                path:'/goods',
                component:()=>import('../components/goods/List')
            },{
                path:'/goods/add',
                component:()=>import('../components/goods/Add')
            }
        ]
    },
]

const router = new VueRouter({
  routes
});


router.beforeEach((to,from,next)=>{
  //to将要去
  //from 从哪来
  //next函数.放行
  //获取token
  const tokenStr=window.sessionStorage.getItem('token');
  if(to.meta === true && !tokenStr)return next('/login');
  next();
});

export default router
