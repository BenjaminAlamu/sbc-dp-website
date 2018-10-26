import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Loader from 'react-loader-spinner'
import axios from "axios";
import ImageUploader from "react-images-upload";
import FileSaver from "file-saver";


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      file: null,
      error: " ",
      pictures: [],
      url: "",
      image_id: "",
      name: "",
      loading: false
    };
    this.onDrop = this.onDrop.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({ name: event.target.value });
  }

  onDrop(picture) {
    this.setState({ pictures: picture });
    console.log(this.state);
  }

  onSubmit(e) {
    e.preventDefault();
    this.setState({ error: "" });
    this.setState({ loading: true });
    const self = this;
    if ((self.state.name.length > 0) && (self.state.pictures.length > 0)) {
      const formData = new FormData();
      formData.append("file", this.state.pictures[0]);
      formData.append(
        "upload_preset",
        process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET
      );

      //Upload Image
      axios
        .post(
          `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload/`,
          formData
        )
        .then(function (response) {
          console.log(response.data.public_id);
          self.addOverlay(response);
        })
        .catch(function (err) {
          console.log(err);
          self.setState({ loading: false });
          self.setState({ error: "An error occured please try again" });
        });
    }
    else if (!self.state.pictures.length > 0) {
      self.setState({ error: "Please select an image" });
      self.setState({ loading: false });
    }

    else if (!self.state.name.length > 0) {
      self.setState({ error: "Please enter your name" });
      self.setState({ loading: false });
    }
  }

  addOverlay(response) {
    const self = this;
    axios
      .get(
        `https://res.cloudinary.com/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload/l_${
        response.data.public_id
        },r_max,w_400,h_400,x_34,y_34/c_crop,g_face/l_text:Arial_24:${self.state.name},x_315,y_140/${process.env.REACT_APP_CLOUDINARY_IMAGE_OVERLAY}`
      )
      .then(function (response) {
        console.log(response);
        console.log(response.config.url);
        self.setState({ url: response.data });
        FileSaver.saveAs(response.config.url, `${self.state.name}.jpg`);
        self.setState({ loading: false });
      })
      .catch(function (err) {
        console.log(err);
        self.setState({ loading: false });
        self.setState({ error: "An error occured please try again" });
      });
  }

  render() {
    const loading = this.state.loading
    let load;

    if (loading) {
      load = <Loader
        type="ThreeDots"
        color="#00BFFF"
        height="100"
        width="100"
      />;
    }
    else {
      load = "";
    }

    return (
      <div className="App">
        <div className='header'>
          <img src="./sbc.jpeg" alt="sbc-logo" />
          <p>Shepherdhill Baptist Church & Indian Christian Congregation</p>
          <p>presents an Interdenominational Power Revival tagged</p>
          <h5>TRIUMPH AT LAST (Gen. 49:19)</h5>
        </div>
        <div className='row image-part'>
          <div className='col-md-4 col-md-offset-1'>
            <div className='info'>
              <p>How to create your personalized DP</p>
              <ol>
                <li>Click on Select Image</li>
                <li>Select an image from your computer or phone</li>
                <li>Enter your name in the text field provided</li>
                <li>Click on create Image</li>
                <li>Wait for your image to download</li>
              </ol>
            </div>
          </div>
          <div className='col-md-6 upload'>
            <p>Upload your image here</p>
            {/* Image Uploader */}
            <form onSubmit={this.onSubmit}>
              <ImageUploader
                buttonText="Select image"
                withPreview={true}
                withIcon={false}
                fileContainerStyle={{ height: 250 + 'px' }}
                onChange={this.onDrop}
                fileTypeError="File format not supported. Please select a png or jpg image"
                fileSizeError="Image size is too large"
                imgExtension={[".jpg", ".png", "jpeg",]}
                maxFileSize={5242880}
                singleImage={true}

              />
              <p className='error'>{this.state.error}</p><br />
              <div className="form-group">
                <input type="text" className="form-control" value={this.state.name} placeholder="Enter name here" onChange={this.handleChange} />
              </div>
              <input type="submit" value="Create Image" className="btn btn-primary mb-2 upload-btn" />
            </form>
            {load}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
