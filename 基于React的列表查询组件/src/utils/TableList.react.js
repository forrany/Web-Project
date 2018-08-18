import React,{Component} from "react"
import "./TableList.css"
import TripItem from './TripItem.react'

class TabelList extends Component{
    constructor() {
        super();
        this.state = {
            key : true,
            items : [],
        }
    }
    deleteItem(value) {
        this.props.deleteItem(value);
    }
    render() {
        let items = [];
        if(this.props.items.length === 0){
            items.push(<tr><th colSpan="12" className="tempEmpty">暂无记录</th></tr>);
        }else{
            this.props.items.forEach((item) => {
                items.push(<TripItem deleteItem = {this.deleteItem.bind(this)}  item={item}/>);
            });
        }
        return (
            <div>
                <table className="manageTable" cellspacing="0px" >
                    <thead>
                        <tr className="manageList">
                            <td className="manageList"><input type="checkbox" /></td>
                            <td className="manageList">行程id</td>
                            <td className="manageList">行程名称</td>
                            <td className="manageList">天数</td>
                            <td className="manageList">目的地</td>
                            <td className="manageList">标签</td>
                            <td className="manageList">观光点数量</td>
                            <td className="manageList">平台</td>
                            <td className="manageList">状态</td>
                            <td className="manageList">最后修改时间</td>
                            <td className="manageList">最后修改人</td>
                            <td className="manageList" colSpan="4">操作</td>
                        </tr>
                    </thead>
                    <tbody>
                        {items}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default TabelList