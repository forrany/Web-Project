import React, {Component} from 'react'

class Mytextarea extends Component{
	onEdit() {
		let value = this.refs.myTA.value;
		this.props.onTextAreachange(value);
		this.refs.myTA.style.height = "auto";
		if(this.refs.myTA.scrollHeight >= this.refs.myTA.offsetHeight) {
			this.refs.myTA.style.height = this.refs.myTA.scrollHeight + 'px'
		}
	}
	render() {
		return (
			<div>
				<textarea onChange={this.onEdit.bind(this)} ref="myTA"></textarea>
			</div>)
	}
}

export default Mytextarea