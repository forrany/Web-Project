import React,{Component} from "react"


class TripItem extends Component {
    deleteItem(){
        let value = this.props.item.key;
        this.props.deleteItem(value);
    }
    render() {
        return (
            <tr className="manageList">
                <td className="content"><input className="check" type="checkbox" /></td>
                <td className="content">{this.props.item.info.id}</td>
                <td className="content">{this.props.item.info.trip}</td>
                <td className="content">{this.props.item.info.days}</td>
                <td className="content">{this.props.item.info.termini}</td>
                <td className="content">{this.props.item.info.tags}</td>
                <td className="content">{this.props.item.info.number}</td>
                <td className="content">{this.props.item.info.plat}</td>
                <td className="content">{this.props.item.info.state}</td>
                <td className="content">{this.props.item.info.lastime}</td>
                <td className="content">{this.props.item.info.lastPerson}</td>
                <td className="buttonWrapper"><input className="manage" type="button" value="编辑" /></td>
                <td className="buttonWrapper"><input className="manage" type="button" value="发布" /></td>
                <td className="buttonWrapper"><input className="manage" type="button" value="预览" /></td>
                <td className="buttonWrapper"><input onClick = {this.deleteItem.bind(this)} className="manage" type="button" value="删除" /></td>
                
            </tr>    
        )
    }
}
export default TripItem