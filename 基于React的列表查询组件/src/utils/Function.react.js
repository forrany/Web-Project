import Data from "./config.json"

class tripItem{
    constructor(item){
        this.info = {};
        this.info.id = item.id;
        this.info.trip = item.trip;
        this.info.days = item.days;
        this.info.termini = item.termini.join(',')
        this.info.tags = item.tags.join(',')
        this.info.number = item.number;
        this.info.plat = item.plat;
        this.info.state = item.state;
        this.info.lastime = item.lastime;
        this.info.lastPerson = item.lastPerson;
        this.key = ++tripItem.key;
    }
}
tripItem.key = 0;

export default class Trips {
    constructor(){
        this.allTrips = [
            new tripItem(Trips.Data[1]),
            new tripItem(Trips.Data[2]),
            new tripItem(Trips.Data[3]),
            new tripItem(Trips.Data[4]),
            new tripItem(Trips.Data[5])
        ];
        this.trips = this.allTrips;
        this.middleLayer = this.allTrips; //中间层，用于中间参数传递
    }
    /*
    删除所有类目，显示子页面(添加行程)
    形式上删除表格中内容，实际内容仍然保存在this.allTrips
    PS: 此方法仅为模拟，真正应用中，用路由代替页面的更换
    */
    disleteAllItem() {    
        this.trips = [];
        return this;
    } 
    /*
        删除其中条目
        思路:根据创建List时，每个Item所绑定的key值寻找到要删除的对象，对其进行过滤
    */
    deleteItem(value) {
        let key = value;
        this.trips = this.trips.filter( item =>{
            return item.key !== key;
        })
        return this;
    }
    /*
        条目检索
        思路： 
            1.传入参数为一个对象，其中保存了关于搜索组件中各个input中的关键词和内容
            2.将关键词记录，如果关键词存在(不是undefined)，进入if语句进行检索。关键词key将检索所有包含的内容
            3.id 检索，如果id不为空，那将以item的id为检索条件进行过滤，再将对象返回
            4.termini目的地检索、状态state检索、平台plat检索同理
            5.select检索稍有不同，因为select是个字符串，且字符串不是连贯句子，而是逐个标签。因此这里首先将其按","分割
              为数组，再遍历数组的每个值，进行过滤检索
            6.天数检索，与id检索类似，但是需要添加逻辑判断，要求后面的数字比前面的数字大
    */
    searchItems(searchObj) {      
        this.searchObj = searchObj;
        this.trips = this.allTrips;    //每次搜索都会复位
        this.key = searchObj.keyWord;
        this.id = searchObj.id;
        this.termini = searchObj.termini;
        this.state = searchObj.state;
        this.plat = searchObj.plat;
        this.select = searchObj.select;
        if(this.key){
            this.trips = this.trips.filter(item => {
                return item.info.tags.indexOf(this.key)!==-1 ||
                       item.info.trip.indexOf(this.key)!==-1 ||
                       item.info.termini.indexOf(this.key)!==-1 ||
                       item.info.id.indexOf(this.key)!==-1 ||
                       item.info.days.indexOf(this.key)!==-1 ||
                       item.info.number.indexOf(this.key)!==-1 ||
                       item.info.lastPerson.indexOf(this.key)!==-1;

            });
        }
        if(this.id){
            this.trips = this.trips.filter(item =>{
                return item.info.id.indexOf(this.id) !== -1;
            })
        }
        if(this.termini) {
            this.trips = this.trips.filter(item =>{
                return item.info.termini.indexOf(this.termini) !==-1;
            })
        }
        if(this.state) {
            if(this.state==="unpublished"){
                this.trips = this.trips.filter(item => {
                    return item.info.state.indexOf("未发布") !== -1;
                })
            }
            if(this.state==="published"){
                this.trips = this.trips.filter(item => {
                    return item.info.state.indexOf("已发布")!== -1;
                })
            }
        }
        if(this.plat){
            if(this.plat==="meituan"){
                this.trips = this.trips.filter(item =>{
                    return item.info.plat.indexOf("美团")!== -1;
                })
            }
        }
        if(this.select){
            let temp = this.select.split(",");
            for(var i = 0; i < temp.length; i++){
                this.trips = this.trips.filter(item => {
                    return item.info.tags.indexOf(temp[i])!== -1;
                })    
            }
        }
        if(searchObj.daysPre && searchObj.daysAfter){
            let pre = searchObj.daysPre,
                after = searchObj.daysAfter;
            if(pre >= after){
                alert("请检查所选天数是否正确");
            }else{
                this.trips = this.trips.filter(item => {
                    return parseInt(item.info.days) >= parseInt(pre) && parseInt(item.info.days) <= parseInt(after);
                })
            }
        }
        this.middleLayer = this.trips;
        if(this.trips.length > 2){
            this.trips = this.middleLayer.slice(0,2);
        }
        return this;
    }
    /*
        表格分页组件
        表格分页与数据过滤原理类似，每页显示2个条目，则令this.trips通过slice方法，每次返回 page*2
        关键： this.trips = this.trips.slice(page*2,page*2+2)
    */
    pageSelect(page) {     
        this.trips = this.middleLayer.slice(page*2,page*2+2)
        return this;
    }
}
 

Trips.Data = Data;