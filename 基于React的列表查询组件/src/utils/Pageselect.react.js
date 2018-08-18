import React,{Component} from 'react'
import './Pageselect.css'

class Pageselect extends Component{
	constructor() {
		super();
	}
	firstPage() {
		this.props.pageSelect(0);
	}
	lastPage() {
		this.props.pageSelect(3)
	}
	prevPage() {
		this.props.pageSelect(1)
	}
	nextPage() {
		this.props.pageSelect(2)
	}
	render() {
		return (
			<div id="pageManage">
				<a onClick={this.firstPage.bind(this)} href="#">首页</a>
				<a onClick={this.prevPage.bind(this)} href="#">上一页</a>
				<a onClick={this.nextPage.bind(this)} href="#">下一页</a>
				<a onClick={this.lastPage.bind(this)} href="#">末页</a>
			</div>) 
	}
}

export default Pageselect