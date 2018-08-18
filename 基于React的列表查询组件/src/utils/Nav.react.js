import React, {Component} from 'react'
var plus = require('../img/circleplus.png'),
    double = require('../img/doubleClomn.png');

class Nav extends Component{
    render(){
        return(
            <ul className="optionWrapper">
                <li onClick = {this.props.closeAdd}>
                    <div>
                        <img alt="行程" src={double} /><span className="active">行程列表</span>
                    </div>
                </li>
                <li onClick = {this.props.addTrip}>
                    <div>
                        <img alt="新增" src={plus} /><span className="normal">新增行程</span>
                    </div>
                </li>
            </ul>
        )
    }
}
export default Nav
