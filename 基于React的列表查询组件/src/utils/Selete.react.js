import React ,{Component} from 'react'
import Select from 'react-select'
import 'react-select/dist/react-select.css';

const options = [
    {value:"经典",label:"经典"},
    {value:"参观博物馆",label:"参观博物馆"},
    {value:"历史",label:"历史"},
    {value:"情侣",label:"情侣"},
    {value:"购物",label:"购物"},
    {value:"暑假",label:"暑假"},
    {value:"城市",label:"城市"}

]

class MySelect extends Component{
    constructor(props){
        super(props);
    }
    handleChange(value){
        this.props.changeValue(value);
        //this.props.returnValue(value);
      
    }
    render() {
        const value = this.props.value;
        return(
            <Select name="form0field-name"
                value = {value}
                placeholder="请选择标签"
                multi = {true}
                simpleValue = {true}
                onChange = {this.handleChange.bind(this)}
                options = {options}
            />
        );
    }
}
export default MySelect