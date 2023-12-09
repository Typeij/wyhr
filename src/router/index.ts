import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router"
import login from "../components/login/login.vue"
import { get } from "../utils/local"
const routes: RouteRecordRaw[] = [
    {
        path: "/",
        redirect: "/index"
    },
    {
        name:"login",
        path:"/login",
        component:login
    },
    {
        name: "index",
        path: "/index",
        component:()=>import("../components/layout/index.vue"),
            children: [
            {
                name: "ctrl",
                path: "ctrl",
                component: () => import("../components/layout/children/ctrl.vue")
            }
        ]
    },
    

]
const router = createRouter({
    history: createWebHashHistory(),
    routes
})

// //重新配置动态路由
// if (router.getRoutes().length != router.options.routes.length) {

        //路由失效
    let Menu= get('menu')
    if(Menu){
        Menu.forEach((item:any) => {
            let children = []
            if (item.children.length > 0) {
                // console.log(item)
                //有二级路由
                children = item.children.map((v: any) => {
                    return router.addRoute('index', {
                        path: v.powerUrl,
                        name: v.powerUrl,
                        meta: {
                            list: [item.powerName, v.powerName]
                        },
                        // component:()=>import(`./layout/children/${v.powerUrl}`)
                        component: () => import(`../components/layout/children/${v.powerUrl}.vue`)
                    })
                })
            }

        })
    }

// }
//全局前置路由守卫
router.beforeEach((to,_,next)=>{//参数不使用用下划线占位
    console.log(router.getRoutes()) // 获取 当前router 中全部配置信息（addRoute）
    console.log(router.options.routes)
    //登录不验证
    if(to.path === "/login"){
        next()
    }else{
        //验证是否登录
        const token= get("token")
        if(token){
            next()
        }else
        {
            next("/login")
        }
    }
})






export default router