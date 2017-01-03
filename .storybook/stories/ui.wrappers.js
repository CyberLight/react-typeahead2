import React, { PureComponent } from 'react';
import Promise from 'promise';
import 'whatwg-fetch';

import Typeahead from '../../src/index';

class DataLoader {
  static getData(data) {
      let _status = (response) => {
        if (response.status >= 200 && response.status < 300) {
          return response
        } else {
          var error = new Error(response.statusText)
          error.response = response
          throw error;
        }
      };

      return new Promise((resolve, reject) => {
          const URL = `https://typeahead-js-twitter-api-proxy.herokuapp.com/demo/search?q=${data}`
          let options = {
            method: 'GET'
          };
          fetch(URL, options).
          then(this._status).
          then(r => r.json()).
          then(resolve).
          catch(reject);
      });
  }
}

class TestWrapper extends PureComponent {
  constructor(props){
      super(props);
      this.state = {
        options: props.options,
        value: props.value,
        enableShowLoading: props.enableShowLoading
      }
  }

  componentWillReceiveProps(nextProps){
    this.setState({
      options: nextProps.options,
      value: nextProps.value,
      enableShowLoading: nextProps.enableShowLoading
    });
  }

  _onChange = (e) => {
      var value = e.target.value;
      this.setState({
        value: value
      });
  }

  _onFetchData = async (value) => {
    var allData = this.props.allData;

    if(this.state.enableShowLoading){
      this.setState({
        showLoading: true
      });
      let response = await DataLoader.getData(value);
      this.setState({
        showLoading: false,
        value: this.state.value,
        options: Array.from(response.slice(0,5))
      });
    } else {
      this.setState({
        showLoading: false,
        value: this.state.value,
        options: Array.from(
          allData.filter(x => x.name.toLowerCase().indexOf(value.toLowerCase()) >= 0).slice(0,5))
      });
    }
  }

  render(){
    var options = this.state.options;
    return (
      <Typeahead
        className={this.props.className || ""}
        displayKey="name"
        value={this.state.value}
        onChange={this._onChange}
        onFetchData={this._onFetchData}
        optionTemplate={this.props.optionTemplate}
        loadingTemplate={this.props.loadingTemplate}
        showLoading={this.state.showLoading}
        debounceRate={this.props.debounceRate}
        minLength={1}
        options={options}/>
    )
  }
}

export {TestWrapper};
