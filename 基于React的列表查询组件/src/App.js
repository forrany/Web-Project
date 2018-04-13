import React, {Component} from 'react'
import ReactDOM from 'react-dom';
import SearchPannel from './utils/SearchPannel.react'
import TableList from './utils/TableList.react'
import Trips from './utils/Function.react'
import Nav from './utils/Nav.react'
import Addtrip from './utils/Addtrip.react'
import Pageselect from './utils/Pageselect.react'
import './main.css';
class App extends Component {
    constructor(props){
        super(props);
        this.state = {
            tags : [],
            trips : new Trips,
            pageLen: "",
        }
        this.page = 0;
        this.state.pageLen = this.state.trips.trips.length;  //用于传给翻页组件，总共多少列表
        this.setState({
            trips: this.state.trips.pageSelect(0)  // 初始化，翻页到0位置
        })
    }
    deleteItem(value){
        this.setState({
            trips: this.state.trips.deleteItem(value)
        })
    }
    searchItems(searchObj){
        this.setState({
            trips : this.state.trips.searchItems(searchObj)
        },function () {
            this.setState({pageLen: this.state.trips.trips.length});  //setState异步带来问题，等待trip更新完，更新pageLen
            this.page = 0;                                            //每次筛选，都从第一页显示
            }); 
    }
    pageSelect(page) {
        switch(page){
            case 0: 
                this.page = 0;
                this.setState({trips: this.state.trips.pageSelect(this.page)});
                break;
            case 1: 
                if(this.page === 0){    //检测，如果是第一页，则不相应下一页请求
                    break;
                }
                this.page--;
                this.setState({trips: this.state.trips.pageSelect(this.page)});
                break;
            case 2: 
                if(this.state.trips.trips.length < 2){    //检测，如果是最后一页，则不相应下一页请求
                    break;
                }
                this.page++;
                this.setState({trips: this.state.trips.pageSelect(this.page)});
                break;
            case 3:
                this.page = Math.floor(this.state.pageLen/2);  //末页，因为每页显示两条，因此pageLen/2
                this.setState({trips: this.state.trips.pageSelect(this.page)});
                break;
        }
    }
    addTrip() {
        this.setState({
            trips: this.state.trips.disleteAllItem()
        })
        let addBlock = ReactDOM.findDOMNode(this.refs.add);
        addBlock.style.zIndex = "999";
    }
    closeAdd() {
        let addBlock = ReactDOM.findDOMNode(this.refs.add);
        addBlock.style.zIndex = "-1";   //关闭添加行程的图层
        this.setState({
            trips : this.state.trips.searchItems("")   //恢复行程列表
        });
    }
    render() {
        return(
            <div id = "content">
                <div className="aside">
                    <Nav closeAdd={this.closeAdd.bind(this)} addTrip = {this.addTrip.bind(this)}/>
                </div>
                <div className="main">
                    <SearchPannel searchItems={this.searchItems.bind(this)}/>   
                    <TableList deleteItem={this.deleteItem.bind(this)} items={this.state.trips.trips}/>
                    <Pageselect pageLen={this.state.pageLen} pageSelect={this.pageSelect.bind(this)} />
                    <div className="addTrip" ref="add">
                        <Addtrip />
                    </div>
                </div>
                
            </div> 
        )
    }
}

export default App;
