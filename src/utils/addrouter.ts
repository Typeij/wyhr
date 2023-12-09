// import { reactive, ref, onMounted } from "vue"// 引入钩子
// import { useRouter } from "vue-router"// 引入路由
// const router = useRouter()// 创建路由对象
// import { set, get } from '../utils/local'
// import { GetPower } from '../servers/index'
// import { dataTree } from "../utils/datatree"
// let dataList = ref<any[]>([])

// export const getMenu = async (userId: number) => {
//     let test = {
//         userId
//     }
//     let res: any = await GetPower(test)
//     console.log(res)
//     // datas=res.data
//     dataList.value = dataTree(res.data)
//     console.log(dataList.value)
//     //动态路由
//     let Menu: any[] = dataList.value;
//     let oldMenu = get('menu')
//     if (oldMenu) {
//         //之前有路由则删掉
//         oldMenu.forEach(v => {
//             router.removeRoute(v.name)
//         })
//     }
//     Menu.forEach(item => {
//         let children = []
//         if (item.children.length > 0) {
//             //有二级路由
//             children = item.children.map(v => {
//                 return router.addRoute('index', {
//                     path: v.powerUrl,
//                     name: v.powerUrl,
//                     meta: v.meta,
//                     // component:()=>import(`./layout/children/${v.powerUrl}`)
//                     component: () => import(`../layout/children/${v.powerUrl}.vue`)
//                 })
//             })
//         }

//     })
//     set('menu', Menu)
//     console.log(router.getRoutes());
//     // router.push("/index")

// }