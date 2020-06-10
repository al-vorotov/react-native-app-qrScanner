'use strict';
import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Linking,
  Dimensions,
} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';

class ScanScreen extends Component {
  constructor() {
    super();

    this.state = {
      url: '',
      showMarker: false,
      currentTimeoutId: null,
    };
  }

  onRead(value) {
    const {url, currentTimeoutId} = this.state;

    if (url !== value.data) {
      this.setState({
        url: value.data,
        showMarker: true,
      });
    }
    if (currentTimeoutId) {
      clearTimeout(currentTimeoutId);
    }
    this.setState({
      showMarker: true,
    });

    const id = setTimeout(() => {
      this.setState({
        showMarker: false,
      });
    }, 100);
    this.setState({
      currentTimeoutId: id,
    });
  }

  openUrl() {
    const {url} = this.state;
    const regExp = new RegExp(
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_\+.~#?&\/\/=]*)/,
    );
    const testUrl = regExp.test(url);
    if (testUrl) {
      Linking.openURL(url).catch((err) =>
        console.error('An error occured', err),
      );
    }
  }

  render() {
    const {showMarker} = this.state;
    return (
      <QRCodeScanner
        onRead={this.onRead.bind(this)}
        cameraStyle={style.camera}
        topViewStyle={style.zeroContainer}
        markerStyle={style.marker}
        showMarker={showMarker}
        reactivate={true}
        bottomContent={
          <TouchableOpacity
            style={style.textContainer}
            onPress={this.openUrl.bind(this)}>
            <Text>{this.state.url}</Text>
          </TouchableOpacity>
        }
      />
    );
  }
}

const style = StyleSheet.create({
  zeroContainer: {
    height: 0,
    flex: 0,
  },
  camera: {
    width: '100%',
    height: Dimensions.get('window').height,
  },
  textContainer: {
    height: '30%',
    width: '90%',
    backgroundColor: 'rgb(160, 160, 160)',
    borderRadius: 4,
    position: 'absolute',
    bottom: '3.5%',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
  },
  marker: {
    backgroundColor: 'rgba(0, 255, 0, 0.1)',
  },
});

export default ScanScreen;
