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
      component:()=>import('../views/Home')
    }
]

const router = new VueRouter({
  routes
});


router.beforeEach((to,from,next)=>{
  //to将要去
  //from 从哪来
  //next函数.放行
  if(to.path==='/login')return next();
  //获取token
  const tokenStr=window.sessionStorage.getItem('token');
  if(!tokenStr) return next('/login');
  next();
});

export default router
