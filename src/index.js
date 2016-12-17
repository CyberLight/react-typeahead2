import React, {PureComponent} from 'react';
import styled from 'styled-components';
import Input from './Input.jsx';

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
    selectedIndex: -1,
    hint: true,
    minLength: 1
  }

  static propTypes = {
    optionTemplate: React.PropTypes.func.isRequired,
    selectedIndex: React.PropTypes.number,
    onChange: React.PropTypes.func,
    onFetchData: React.PropTypes.func,
    onBlur: React.PropTypes.func,
    onOptionClick: React.PropTypes.func,
    onOptionChange: React.PropTypes.func,
    displayKey: React.PropTypes.string.isRequired,
    hint: React.PropTypes.bool,
    minLength: React.PropTypes.number
  }

  constructor(props){
    super(props);
    this.state = {
      value: props.value,
      dropdownVisible: false,
      options: props.options,
      selectedIndex: props.selectedIndex,
      hint: props.hint,
      minLength: props.minLength,
      hintValue: ""
    };
  }

  componentDidMount() {
    document.addEventListener('click', this._onDocActivate);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this._onDocActivate);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      value: nextProps.value,
      options: nextProps.options,
      selectedIndex: nextProps.selectedIndex,
      hint: nextProps.hint,
      minLength: nextProps.minLength
    });
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
    this.setState({
      value: value,
      selectedIndex: -1,
      dropdownVisible: true
    });
    if (this.props.onChange) {
        this.props.onChange(e);
    }

    console.log("<------ AAAAAA: ", value.length >= this.state.minLength);
    if (value.length >= this.state.minLength) {
      if(this.props.onFetchData){
        this.props.onFetchData(e);
      }
    }
  }

  _getOptionsCount = () => {
    var options = this.state.options;
    return options && options.length || options.size || 0;
  }

  _optionClick = (index) => {
    var options = this.state.options;
    if(this.props.onOptionClick){
      this.props.onOptionClick(options[index], index);
      this.props.onOptionChange(options[index], index);
    }

    this.setState({
      selectedIndex: index,
      dropdownVisible: false,
      value: options[index][this.props.displayKey]
    },() => {
      this._input.focus();
    });
  }

  _onKeyDown = (e) => {
    var key = e.key;
    var options = this.state.options;
    var dropdownVisible = this.state.dropdownVisible;
    var selectedIndex = this.state.selectedIndex;
    var displayKey = this.props.displayKey;

    switch (key) {
      case 'Esc':
      case 'Escape':
        this.setState({
          dropdownVisible: false
        });
        break;
      case 'End':
      case 'Tab':

        break;
      case 'Enter':
        this.setState({
          value: options[selectedIndex][displayKey],
          dropdownVisible: false
        });
        if(this.props.onOptionChange){
          this.props.onOptionChange(options[selectedIndex], selectedIndex);
        }
        break;
      case 'ArrowUp':
      case 'ArrowDown':
        var increment = key == 'ArrowUp' ? -1 : 1;

        var len = this._getOptionsCount();
        if (!dropdownVisible &&
             (options && len > 0)) {
          this.setState({
            dropdownVisible: true
          });
        }

        var calcIndex = (len) => {
          var newIndex = selectedIndex + increment;
          if (newIndex < 0) {
            newIndex += len;
          }
          return newIndex % len;
        }

        if(dropdownVisible &&
           (options && len > 0)){
            var newIndex = calcIndex(len);
            var hintEnabled = this.state.hint;
            this.setState({
              selectedIndex: newIndex,
              hintValue: (hintEnabled ? options[newIndex][displayKey] : "")
            });
        }
        break;
      default:
        break;
    }
  }

  _renderInputs = () => {
    var value = this.state.value;
    return (
      <TypeaheadDiv>
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
