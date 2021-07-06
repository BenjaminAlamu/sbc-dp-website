import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import './App.css';
import Loader from 'react-loader-spinner'
import axios from "axios";
import FileSaver from "file-saver";


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      file: null,
      error: " ",
      pictures: [],
      imagePreviewUrl: "",
      name: "",
      loading: false
    };
    this.onDrop = this.onDrop.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this._handleImageChange = this._handleImageChange.bind(this);

  }

  handleChange(event) {
    this.setState({ name: event.target.value });
  }

  _handleImageChange(e) {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      this.setState({
        file: file,
        imagePreviewUrl: reader.result
      });
    }

    reader.readAsDataURL(file)
  }

  onSubmit(e) {
    e.preventDefault();
    this.setState({ error: "" });
    this.setState({ loading: true });
    const self = this;
    if ((self.state.name.length > 0) && (self.state.name.length <= 25) && (self.state.file)) {
      const formData = new FormData();
      formData.append("file", this.state.file);
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
    else if (!self.state.file > 0) {
      self.setState({ error: "Please select an image" });
      self.setState({ loading: false });
    }

    else if (!self.state.name.length > 0) {
      self.setState({ error: "Please enter your name" });
      self.setState({ loading: false });
    }

    else if (!self.state.name.length > 25) {
      self.setState({ error: "Name is too long, maximum of 25 characters" });
      self.setState({ loading: false });
    }
  }

  addOverlay(response) {
    const self = this;
    axios
      .get(
        `https://res.cloudinary.com/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload/l_${
        response.data.public_id
        },h_260,w_260,y_-310,x_15,r_max/l_text:Futura_24:${self.state.name},y_-160,x_80,co_rgb:fff/${process.env.REACT_APP_CLOUDINARY_IMAGE_OVERLAY}`
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

  onDrop(pictureFiles) {

    this.setState({
      pictures: []
    })

    this.setState({
      pictures: this.state.pictures.concat(pictureFiles),
    });
  }

  render() {
    const loading = this.state.loading
    let load;
    let imagePreview;
    const imagePreviewUrl = this.state.imagePreviewUrl;


    if (imagePreviewUrl) {
      imagePreview = (<img src={imagePreviewUrl} alt="" />);
    } else {
      imagePreview = (<div className="previewText">Please select an Image for upload</div>);
    }

    if (loading) {
      load = <Loader
        type="ThreeDots"
        color="#00BFFF"
        height="50"
        width="50"
      />;
    }
    else {
      load = "";
    }

    return (
      <div className="App">
        <div className='header'>
          {/* <img className="logo-img" src={`https://res.cloudinary.com/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload/v1540676155/sbc.png`} alt="sbc-logo" /> */}
          <h5>Exploit 2019</h5>
          <h5>Fit for the Master's use (Matt 21:1-3, 2 Tim 2:20-21)</h5>
        </div>
        <div className='row image-part'>
          <div className='col-md-4 col-md-offset-1'>
            <div className='info'>
              <p>How to create your personalized image</p>
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
            {load}
            <p className="info">Upload your image here</p>
            <p className='error'>{this.state.error}</p><br />
            {/* Image Uploader */}
            <form onSubmit={this.onSubmit}>
              <input className="fileInput "
                type="file"
                accept='image/*'
                onChange={(e) => this._handleImageChange(e)} />
              <div className="imgPreview">
                {imagePreview}
              </div>
              <label>Enter name here: (Limited to 25 characters)</label>
              <div className="form-group">
                <input type="text" className="form-control" maxLength="25" value={this.state.name} placeholder="Enter name here" onChange={this.handleChange} />
              </div>
              <input type="submit" value="Create Image" className="btn btn-primary mb-2 upload-btn" />
            </form>

          </div>
        </div>
        <footer>Built from the ground up with <span role='img' aria-label="Love emoji">❤️</span> by <a href='https://www.facebook.com/MACformation/'>Kehinde Odesola</a></footer>
      </div>
    );
  }
}

export default App;
