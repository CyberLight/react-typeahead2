import React, {PureComponent} from 'react';
import Typeahead from '../../src/index';

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

  _onFetchData = (value) => {
    var allData = this.props.allData;

    if(this.state.enableShowLoading){
      this.setState({
        showLoading: true
      });
      setTimeout(()=>{
        this.setState({
          showLoading: false,
          value: this.state.value,
          options: Array.from(
            allData.filter(x => x.name.toLowerCase().indexOf(value.toLowerCase()) >= 0))
        });
      }, 2000);
    } else {
      this.setState({
        showLoading: false,
        value: this.state.value,
        options: Array.from(
          allData.filter(x => x.name.toLowerCase().indexOf(value.toLowerCase()) >= 0))
      });
    }
  }

  render(){
    var options = this.state.options;
    return (
      <Typeahead
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
