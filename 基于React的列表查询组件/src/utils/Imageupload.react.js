import React, {Component} from 'react'
import Dropzone from 'react-dropzone'
import request from 'superagent'
import './Imageupload.css'
/*
这里的两个静态变量分别是Cloudinary API所需要用到的用户名及相关上传地址
*/
const CLOUDINARY_UPLOAD_PRESET = "vincent";
const CLOUDINARY_UPLOAD_URL = "https://api.cloudinary.com/v1_1/vincentkoo/image/upload"
var style = {
	cursor: "pointer",
	width: "100%",
	height:"100%",
}
var dragstyle = {
	width:"150px",
	height:"130px",
	border:"2px dashed rgb(102,102,102)",
	borderRadius:"5px"
}

class ContactForm extends Component{
	constructor(props) {
	    super(props);
	    this.state = {
	      uploadedFileCloudinaryUrl: ''
	    };
	  }
	  /*
		react-dropzone 文档说它总是返回一个上传文件的数组，所以我们将该数组传递给 onImageDrop 方法的 files 参数
	  */
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
	  /*
		用 superagent 将我们之前设置的两个 const POST 到 Cloudinary 。
		.field 方法 能让我们将数据附加到 POST 请求中。这些数据包含了 Cloudinary 处理上传图片的所有信息。通过调用 .end，执行请求并提供回调
	  */
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
	  /*
		渲染部分，为了实现所给图片的效果，这里当图片上传成功后，上传的框将会消失，同时由上传预览的图片代替。

	  */
	render() {
		return(
				<div id="imageUploadWrapper">
			      <div ref="drag" className="FileUpload">
			        <Dropzone  style={dragstyle}
				      multiple={false}
				      accept="image/*"
				      onDrop={this.onImageDrop.bind(this)}>
				      <div style = {style}>上传图片</div>
				    </Dropzone>
			      </div>
			 
			      <div>
			        {this.state.uploadedFileCloudinaryUrl === '' ? null :
			        <div id="innerImage">
			          <img id="img" alt="上传图片" src={this.state.uploadedFileCloudinaryUrl} />
			        </div>}
			      </div>
			    </div>
		)
	}
} 

export default ContactForm