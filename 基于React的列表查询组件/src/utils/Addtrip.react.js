import React, {Component} from 'react'
import Mytaginput from './Mytaginput'
import Mytextarea from './Mytextarea.react'
import './Addtrip.css'
import ContactForm from './Imageupload.react'
class Addtrip extends Component{
    constructor(props) {
        super(props);
        this.MytextareaVlue = "";
        this.state = {
            tags1: [],
            tags2: []
        }

    }
    getTextValue(value){       //获取Mytextarea的内容
        this.MytextareaVlue = value;
    }
    componentDidMount() {
        this.nameDom = this.refs.name;
        this.hotnessDom = this.refs.hotness;
        
    }
    nameChange() {    //检查行程名称的内容
        if(this.nameDom.value.length < 5 || this.nameDom.value.length > 30){
            this.refs.label.style.color = "red";
        }else{
            this.refs.label.style.color = "#7a7a7a";
        }

    }
    hotChange() {
        this.hotnessDom.value = this.hotnessDom.value < 0? 0 : this.hotnessDom.value;
        this.hotnessDom.value = this.hotnessDom.value > 100? 100 : this.hotnessDom.value;
    }
    changeTags(tags) {
        this.setState({tags1:tags})
    }
    changeTagsC(tags){
        this.setState({tags2:tags})
    }
    saveTrip() {
        if(this.nameDom.value == ""||this.hotnessDom.value == "" || this.state.tags1.length === 0 || this.state.tags2.length === 0 || this.MytextareaVlue==""){
           alert("请务必填写所有带星号的内容");
        }else if(this.MytextareaVlue.length < 30){
            alert("行程介绍不得少于30个字符")
        }else {
            alert("保存成功")
        }
    } 
    render() {
        return (
            <div className="AddtripWrapper">
                <div className="AddHeader">
                    <input onClick={this.saveTrip.bind(this)} type="button" value="保存" />
                    <input type="button" value="发布" />
                    <input type="button" value="+添加行程" />
                </div>
                <div className="AddContent">
                    <div id="AddContLeft">
                        <p>行程概况</p>
                        <p>Day 1</p>
                        <p>Day 2</p>
                        <p>Day 3</p>
                    </div>
                    <div id="AddContMain">
                        <div className="AddTitle" >
                            <span>*</span>行程名称<input onChange={this.nameChange.bind(this)} ref="name" type="text" id="AddTripTitle"/>
                            <label ref="label" for="AddTripTitle">(名称长度5-30个字)</label>
                        </div>
                        <div id="PhotoPlug">
                            <table>
                                <tr>
                                    <td className="uploadImgText">美团行程头图  (尺寸要求 750*420)</td>
                                    <td className="uploadImgDrag"><ContactForm /></td>
                                </tr>
                                <tr>
                                    <td className="uploadImgText">点评行程头图 (建议尺寸: 705*300 、750*1334)</td>
                                    <td className="uploadImgDrag"><ContactForm /></td> 
                                    <td id="uploadNext">
                                         <ContactForm />
                                    </td>
                                </tr>
                            </table>
                                                     
                        </div>
                        <table id="addTripTable">
                            <tr>
                                <td className="tableText"><span>*</span>目的地</td>
                                <td className="tableTag"><Mytaginput changeTags={this.changeTags.bind(this)} tags={this.state.tags1}/></td>
                            </tr>
                            <tr>
                                <td className="tableText"><span>*</span>标签</td>
                                <td className="tableTag"><Mytaginput changeTags={this.changeTagsC.bind(this)} tags={this.state.tags2}/></td>
                            </tr>
                            <tr>
                                <td className="tableText"><span>*</span>热度</td>
                                <td className="tableTag"><input onChange={this.hotChange.bind(this)} ref="hotness" id="hotness" type="number" min="0" max="100"/>%人旅行者选择此路线</td>
                            </tr>
                            <tr>
                                <td className="tableText"><span>*</span>行程介绍</td>
                                <td className="tableTag"><Mytextarea onTextAreachange={this.getTextValue.bind(this)}/></td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>    
        )
    }
}

export default Addtrip