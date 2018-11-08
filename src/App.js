import React, { Component } from 'react';
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
      loading: false
    };
    this.onDrop = this.onDrop.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this._handleImageChange = this._handleImageChange.bind(this);

  }


  _handleImageChange (e) {
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

  onSubmit (e) {
    e.preventDefault();
    this.setState({ error: "" });
    this.setState({ loading: true });
    const self = this;
    if (self.state.file) {
      const formData = new FormData();
      formData.append("file", this.state.file);
      formData.append(
        "upload_preset",
        process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET
      );

      //Upload Image
      axios
        .post(
          `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUD_NAME}/image/upload/`,
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

  }

  addOverlay (response) {
    const self = this;
    axios
      .get(
        `https://res.cloudinary.com/${process.env.REACT_APP_CLOUD_NAME}/image/upload/l_${
        response.data.public_id
        },h_1300,w_1300,r_max,x_110,y_110/${process.env.REACT_APP_IMAGE_OVERLAY}.jpg`
      )
      .then(function (response) {
        console.log(response);
        console.log(response.config.url);
        self.setState({ url: response.data });
        FileSaver.saveAs(response.config.url, `Yahweh.jpg`);
        self.setState({ loading: false });
      })
      .catch(function (err) {
        console.log(err);
        self.setState({ loading: false });
        self.setState({ error: "An error occured please try again" });
      });
  }

  onDrop (pictureFiles) {

    this.setState({
      pictures: []
    })

    this.setState({
      pictures: this.state.pictures.concat(pictureFiles),
    });
  }

  render () {
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
        width="70"
      />;
    }
    else {
      load = "";
    }

    return (
      <div className="App">
        <div className='header'>
          <img className="logo-img" src={`https://res.cloudinary.com/${process.env.REACT_APP_CLOUD_NAME}/image/upload/v1540676155/ra_logo.png`} alt="ra-logo" />
          <h2>Yahweh '18</h2>
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
              <input type="submit" value="Create Image" className="btn btn-primary mb-2 upload-btn" />
            </form>

          </div>
        </div>
        <footer>Built from the ground up with <span role='img' aria-label="Love emoji">❤️</span> by <a href='https://twitter.com/Benjamin_Alamu'>Benjamin Alamu</a></footer>
      </div>
    );
  }
}

export default App;
