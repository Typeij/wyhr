export const dataTree=(data:any)=>{

      let dataarr:any[]=[];

 
    data.map(item=>{
        if(item.parentId==0){
            // dataList.set(item.id,item);
            let obj:any={
                ...item,
                children:[]
            }
            dataarr.push(obj)
        }

    })
    data.map(item=>{
        dataarr.map(item1=>{
            if(item.parentId==item1.id){
                item1.children.push(item)
            }
        })
    })
    return dataarr

}