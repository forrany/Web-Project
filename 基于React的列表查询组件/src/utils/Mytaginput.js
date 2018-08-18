import React, {Component} from 'react'
import TagsInput from 'react-tagsinput'  //taginput 插件
import 'react-tagsinput/react-tagsinput.css' //taginput样式

class Mytaginput extends Component {
    handleChange(tags) {
        this.props.changeTags(tags);
        /*this.setState({tags});*/
    }
    render() {
        return (
            <div className ="tagWrapper"  >
                <TagsInput ref = 'tag' value={this.props.tags} onChange={this.handleChange.bind(this)} />
            </div>
        );
    }
}
export default Mytaginput