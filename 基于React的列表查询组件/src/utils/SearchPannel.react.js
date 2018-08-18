import React, {Component} from 'react'
import ReactDom from 'react-dom'
import MySelect from './Selete.react';
import './SearchPannel.css';

var arrow = require('../img/arrow-down.png');
var filterKey = {
    plat: "all",
    state: "all",
    daysPre: "1",
    daysAfter: "7",
},
    domSets = {};
class SearchPannel extends Component {
    constructor(){
        super(); 
        this.state = {
            value : []    //存储的value值用于更新下拉多选tags的值  注意select作为子组件，尽量不设置state。
        } 
    }
    changeValue(value) {
        this.setState({
            value: value
        },function () { filterKey.select = this.state.value;})    /*setstate异步带来的问题，需要传入第二个参数解决，第二个参数是一个回掉函数，状态改变完毕，才会执行*/
    }
    componentDidMount() {
        domSets.terminiDom = ReactDom.findDOMNode(this.refs.termini);
        domSets.daysPreDom = ReactDom.findDOMNode(this.refs.daysPre);
        domSets.daysAfterDom = ReactDom.findDOMNode(this.refs.daysAfter);
        domSets.stateDom = ReactDom.findDOMNode(this.refs.state);
        domSets.platDom = ReactDom.findDOMNode(this.refs.plat);
        domSets.idDom = ReactDom.findDOMNode(this.refs.id);
        domSets.keyWordDom = ReactDom.findDOMNode(this.refs.keyWord);
    }
    Tchange() {  
        filterKey.termini = domSets.terminiDom.value;
    }
    dPchange() {
        filterKey.daysPre = domSets.daysPreDom.value;
    }
    dAchange() {
        filterKey.daysAfter = domSets.daysAfterDom.value;
    }
    Schange() {
        filterKey.state = domSets.stateDom.value
    }
    Plchange() {
        filterKey.plat = domSets.platDom.value
    }
    IDchange() {
        filterKey.id = domSets.idDom.value
    }
    Kchange() {
        filterKey.keyWord = domSets.keyWordDom.value
    }
    reset() {
        filterKey = {
            plat: "all",
            state: "all",
            daysPre: "1",
            daysAfter: "7",
        }
        domSets.keyWordDom.value = "";
        domSets.terminiDom.value = "";
        domSets.daysPreDom.value = "";
        domSets.daysAfterDom.value = "";
        domSets.stateDom.value = "all";
        domSets.platDom.value = "all";
        domSets.idDom.value = "";
        this.props.searchItems(filterKey);   //搜索条件变为初始状态，不过滤任何值
        this.setState({
            value : []            //清空select中的tags值
        })  
    }

    queryhandle() {
        this.props.searchItems(filterKey);
        
    }
    render() {
        return (
            <div className="serachPannel">
                <span className="active"><strong>管理后台</strong></span> / <span class="normal">行程列表</span>
                <table id="searchTable" cellPadding="10">
                    <tr>
                        <td>
                            <span>包含目的地</span><input onChange={this.Tchange.bind(this)} ref="termini" className="left" type="text" placeholder="请输入字符后选择"/>
                        </td>
                        <td>
                            <span>行程天数</span><input onChange={this.dPchange.bind(this)} ref="daysPre" className="days" type="number" min="1" max="7" placeholder="1"/> 到 <input onChange={this.dAchange.bind(this)} ref="daysAfter" className="days" type="number" min="1" max="7" placeholder="7"/>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span>行程标签</span> 
                            <div className="myselect">
                                <MySelect changeValue={this.changeValue.bind(this)} value={this.state.value}/>
                            </div>
                             
                        </td>
                        <td>
                            <span>状态</span>
                            <div className="selectWrapper1">
                                <select onChange={this.Schange.bind(this)} ref="state" name="state" id="select1">
                                    <option value="all">全部</option>
                                    <option value="published">已发布</option>
                                    <option value="unpublished">未发布</option>
                                </select>
                                <img alt="箭头" src={arrow} />
                            </div>
                            
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span>平台</span>
                            <div className="selectWrapper2">
                                <select onChange={this.Plchange.bind(this)} ref="plat" name="plat" id="select2">
                                    <option value="all">全部</option>
                                    <option value="meituan">美团</option>
                                </select>
                                <img alt="箭头" src={arrow} />
                            </div>

                        </td>
                        <td>
                            <span>行程id</span><input onChange={this.IDchange.bind(this)} ref="id" className="right" type="text" placeholder="请输入行程id"/>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span>关键词搜索</span><input onChange={this.Kchange.bind(this)} ref="keyWord" className="left" type="text" placeholder="请输入检索词"/>
                        </td>
                    </tr>
                </table>
                <ul class="buttonManage">
                    <li>
                        <input type="button" id="query" value="查询" onClick={this.queryhandle.bind(this)}/>
                        <input onClick={this.reset.bind(this)} type="button" id="reset" value="重置条件"/>
                    </li>
                    <li>
                        <input type="button" className="batch" id="online" value="批量上线" />
                        <input type="button" className="batch" id="offline" value="批量下线" />
                    </li>
                </ul>
            </div>
        )
    }
}

export default SearchPannel