import React, {PureComponent} from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import _ from 'lodash';

import Input from './Input.jsx';
import SpinnerGif from './static/spinner.gif';
import {getDirection} from './utils';

const PresentationInput = styled(Input)`
  color: silver;
  width: inherit;
  -webkit-text-fill-color: silver;
  position: absolute;
  width: inherit;
  padding: 2px 0;
  border-width: 1px;
`;

const ComboboxInput = styled(Input)`
  width: inherit;
  position: inherit;
  background: transparent;
  padding: 2px 0;
  border-width: 1px;
`;

const TypeaheadDiv = styled.div`
  width: inherit;
  position: relative;
`;

const TypeaheadContainer = styled.div`
  width: 100%;
  position: relative;
`;

const UlContainer = styled.ul`
  width: inherit;
  background: #fff;
  position: absolute;
  box-sizing: border-box;
  display: ${props => (props.visible ? 'block' : 'none')};
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const LoadingImg = styled.img`
  position: absolute;
  top: 1px;
  ${props => (props.dir == "rtl" ? 'left: 0' : 'right: 0')};
  width: ${props => props.height}px;
  height: ${props => props.height}px;
  display: ${props => (props.visible ? 'block' : 'none')};
`

var defaultLoadingTemplate = (props) =>
  (<LoadingImg src={SpinnerGif} height={props.height} dir={props.dir} visible={props.visible}/>);

class LiContainer extends PureComponent {

  static propTypes = {
    selected: React.PropTypes.bool,
    optionIndex: React.PropTypes.number,
    onClick: React.PropTypes.func
  }

  constructor(props){
    super(props);
    this.state = {
      selected: this.selected,
      optionIndex: this.optionIndex
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      selected: nextProps.selected,
      optionIndex: nextProps.optionIndex
    });
  }

  _onClick = (e) => {
    e.nativeEvent.stopImmediatePropagation();
    this.props.onClick(this.state.optionIndex);
  }

  render () {
    return (
      <li aria-selected={this.props.selected}
          role='option'
          onClick={this._onClick}>
          {this.props.children}
      </li>
    )
  }
}

class Typeahead extends PureComponent {

  static defaultProps = {
    value: "",
    dropdownVisible: false,
    options: [],
    hint: true,
    minLength: 1,
    showLoading: false,
    debounceRate: 100,
    loadingTemplate: defaultLoadingTemplate
  }

  static propTypes = {
    optionTemplate: React.PropTypes.func.isRequired,
    loadingTemplate: React.PropTypes.func,
    onChange: React.PropTypes.func,
    onFetchData: React.PropTypes.func,
    onBlur: React.PropTypes.func,
    onOptionClick: React.PropTypes.func,
    onOptionChange: React.PropTypes.func,
    displayKey: React.PropTypes.string.isRequired,
    hint: React.PropTypes.bool,
    minLength: React.PropTypes.number,
    showLoading: React.PropTypes.bool,
    debounceRate: React.PropTypes.number,
    value: React.PropTypes.string
  }

  constructor(props){
    super(props);
    this.state = {
      value: props.value,
      dropdownVisible: false,
      options: props.options,
      selectedIndex: -1,
      hint: props.hint,
      minLength: props.minLength,
      hintValue: "",
      showLoading: props.showLoading,
      direction: "ltr",
      width: 0,
      height: 0
    };
  }

  componentDidMount() {
    document.addEventListener('click', this._onDocActivate);
    var value = this.state.value;
    this._onChange({target:{value: value}});

    if (value.length >= this.state.minLength) {
      this._fetchDataHandler(value);
    }
    let {clientHeight, clientWidth} = ReactDOM.findDOMNode(this._input);

    this.setState({
      width: clientWidth,
      height: clientHeight
    });
  }

  componentWillUnmount() {
    document.removeEventListener('click', this._onDocActivate);
  }

  componentWillReceiveProps(nextProps) {
    var dir = getDirection(this._input);
    var value = nextProps.value;
    var displayKey = nextProps.displayKey
    var options = nextProps.options
    var hint = (dir == "rtl" ? false : nextProps.hint);
    var nextValue = this._getValueByIndex(options, 0, displayKey);
    var hintValue = (hint ? this._getHint(value, nextValue) : "")

    this.setState({
      value: nextProps.value,
      options: nextProps.options,
      selectedIndex: this._getSelectedIndex(options, 0),
      hint: hint,
      minLength: nextProps.minLength,
      showLoading: nextProps.showLoading,
      hintValue: hint ? hintValue : "",
      direction: dir
    });
  }

  _getValueByIndex = (options, index, displayKey) => {
    var value = options &&
           options.length &&
           options[index] &&
           options[index][displayKey] ||
           this.state.value;
    return value;
  }

  _getSelectedIndex = (options, index) => {
    return index > 0 ?
           (index % this._getOptionsCount(options)) :
           index;
  }

  _onDocActivate = (e) => {
      this.setState({
        dropdownVisible: false
      });
  }

  _onFocus = (e) => {
    if(!this.state.dropdownVisible){
      this.setState({
        dropdownVisible: true
      });
    }
  }

  _onClick = (e) => {
    e.nativeEvent.stopImmediatePropagation();
    if (this.props.onClick) {
      this.props.onClick(e);
    }
  }

  _onBlur = (e) => {
    if (this.props.onBlur) {
        this.props.onBlur(e);
    }
  }

  _onChange = (e) => {
    var value = e.target.value;
    var options = this.state.options;
    var dir = getDirection(this._input);
    var hint = (dir == "rtl" ? false : this.state.hint);

    this.setState({
      value: value,
      selectedIndex: -1,
      dropdownVisible: true,
      hint: hint
    });

    if (this.props.onChange) {
        this.props.onChange(e);
    }

    if (value.length >= this.state.minLength) {
        this._fetchDataHandler(value);
    }
  }

  _fetchDataHandler = _.debounce((value) => {
    if(this.props.onFetchData){
      this.props.onFetchData(value);
    }
  }, this.props.debounceRate);

  _getOptionsCount = (options) => {
    return options && options.length || options.size || 0;
  }

  _optionClick = (index) => {
    var options = this.state.options;
    var displayKey = this.props.displayKey;

    if(this.props.onOptionClick){
      this.props.onOptionClick(options[index], index);
      this.props.onOptionChange(options[index], index);
    }

    this.setState({
      selectedIndex: index,
      dropdownVisible: false,
      value: this._getValueByIndex(options, index, displayKey)
    });
  }

  _getHint = (currentValue, nextValue) => {
    if (nextValue.startsWith(currentValue)) {
      return nextValue;
    }
    return "";
  }

  _onKeyDown = (e) => {
    var hint = this.state.hint;
    var key = e.key;
    var options = this.state.options;
    var dropdownVisible = this.state.dropdownVisible;
    var selectedIndex = this.state.selectedIndex;
    var displayKey = this.props.displayKey;
    var value = this.state.value;
    var hintValue = hint ? this.state.hintValue : "";

    switch (key) {
      case 'Esc':
      case 'Escape':
        this.setState({
          dropdownVisible: false,
          hintValue: ""
        });
        break;
      case 'End':
      case 'Tab':
        if (hint && !e.shiftKey) {
          if(hintValue){
            e.preventDefault();
            this.setState({
              value: hintValue,
              hintValue: "",
              dropdownVisible: false
            });
          } else {
            this.setState({
              dropdownVisible: false
            });
          }
        }
        break;
      case 'Enter':
        if(this._getOptionsCount(options) > 0){
          this.setState({
            value:  this._getValueByIndex(options, selectedIndex, displayKey),
            dropdownVisible: false
          });
          if(this.props.onOptionChange){
            this.props.onOptionChange(options[selectedIndex], selectedIndex);
          }
        }
        break;
      case 'ArrowUp':
      case 'ArrowDown':
        var increment = key == 'ArrowUp' ? -1 : 1;

        var len = this._getOptionsCount(options);
        if (!dropdownVisible &&
             (options && len > 0)) {
          var nextValue =  this._getValueByIndex(options, selectedIndex, displayKey);
          this.setState({
            dropdownVisible: true,
            hintValue: (hint ? this._getHint(value, nextValue) : "")
          });
        }

        var calcIndex = (len, curIndex) => {
          var newIndex =  curIndex + increment;
          if (newIndex < 0) {
            newIndex += len;
          }
          return newIndex % len;
        }

        if(dropdownVisible &&
           (options && len > 0)){
            var newIndex = calcIndex(len, selectedIndex);
            var nextValue = options[newIndex][displayKey];
            this.setState({
              selectedIndex: newIndex,
              hintValue: (hint ? this._getHint(value, nextValue) : "")
            });
        }
        break;
      default:
        break;
    }
  }

  _renderInputs = () => {
    var value = this.state.value;
    var LoadingTemplate = this.props.loadingTemplate;

    return (
      <TypeaheadDiv className="rtex-input-container">
        <PresentationInput
          disabled={true}
          role="presentation"
          aria-hidden={true}
          value={this.state.hintValue}
          className="rtex-hint"/>
        <ComboboxInput
          innerRef={c => {this._input = c;}}
          role="combobox"
          aria-autocomplete='both'
          value={value}
          spellCheck={false}
          autoComplete={false}
          autoCorrect={false}
          onFocus={this._onFocus}
          onClick={this._onClick}
          onBlur={this._onBlur}
          onChange={this._onChange}
          onKeyDown={this._onKeyDown}
          className="rtex-input"/>
        <LoadingTemplate className="rtex-default-spinner"
                         dir={this.state.direction}
                         height={this.state.height}
                         visible={this.state.showLoading}/>
      </TypeaheadDiv>
    )
  }

  _renderOptions = () => {
    var dropdownVisible = this.state.dropdownVisible;
    var value = this.state.value;
    var OptionTemplate = this.props.optionTemplate;
    var options = this.state.options;

    return (
      <UlContainer
          className="rtex-option-container"
          visible={dropdownVisible}>
          {
            options.map((data, index) => {
                let selected = this.state.selectedIndex == index;
                return(
                  <LiContainer
                    selected={selected}
                    optionIndex={index}
                    key={index}
                    onClick={this._optionClick}
                    onMouseOver={this._optionMouseOver}>

                    <OptionTemplate
                      data={data}
                      index={index}
                      value={value}
                      selected={selected}/>

                  </LiContainer>
                );
            })
          }
      </UlContainer>
    )
  }

  render(){
    return (
      <TypeaheadContainer
        ref={c => { this._container = c; }}
        className="rtex-container">
        {this._renderInputs()}
        {this._renderOptions()}
      </TypeaheadContainer>
    );
  }
}

export default Typeahead;
