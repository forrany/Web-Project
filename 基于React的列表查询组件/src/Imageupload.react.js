import React, {Component} from 'react'
import Dropzone from 'react-dropzone'
import request from 'superagent'

const CLOUDINARY_UPLOAD_PRESET = "vincent";
const CLOUDINARY_UPLOAD_URL = "https://api.cloudinary.com/v1_1/vincentkoo/image/upload"
var style = {
	cursor: "pointer",
	width: "100%",
	height:"100%",
}
var dragstyle = {
	width:"150px",
	height:"150px",
	border:"2px dashed rgb(102,102,102)",
	borderRadius:"5px"
}
var testsytle = {
	backgroundColor: "transparent",
	width:"150px",
	height:"150px",
	position:"absolute",
	left: "149px",
    top: "170px",
    pointerEvents:"none"
}
class ContactForm extends Component{
	constructor(props) {
	    super(props);
	    this.state = {
	      uploadedFileCloudinaryUrl: ''
	    };
	  }
	  onImageDrop(files) {
	    this.setState({
	      uploadedFile: files[0]
	    });
	 
	    this.handleImageUpload(files[0]);
	  }
	  disappera() {
	  	let drag = this.refs.drag;
	  	drag.style.display = "none";
	  }
	  handleImageUpload(file) {
	    let upload = request.post(CLOUDINARY_UPLOAD_URL)
	                        .field('upload_preset', CLOUDINARY_UPLOAD_PRESET)
	                        .field('file', file);
	 
	    upload.end((err, response) => {
	      if (err) {
	        console.error(err);
	      }
	 
	      if (response.body.secure_url !== '') {
	        this.setState({
	          uploadedFileCloudinaryUrl: response.body.secure_url
	        });
	        this.disappera();
	      }
	    });
	  }
	render() {
		return(
				<div>
			      <div ref="drag" className="FileUpload">
			        <Dropzone  style={dragstyle}
				      multiple={false}
				      accept="image/*"
				      onDrop={this.onImageDrop.bind(this)}>
				      <div style = {style}>放入内容</div>
				    </Dropzone>
			      </div>
			 
			      <div>
			        {this.state.uploadedFileCloudinaryUrl === '' ? null :
			        <div>
			          <img src={this.state.uploadedFileCloudinaryUrl} />
			        </div>}
			      </div>
			    </div>
		)
	}
} 

export default ContactForm