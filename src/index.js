import React, { PureComponent } from 'react';
import debounce from 'lodash.debounce';
import trottle from 'lodash.throttle';
import styled from 'styled-components';
import Immutable from 'immutable';

import SpinnerGif from './static/spinner.gif';
import getDirection from './utils';
import LiContainer from './components/LiContainer';
import PresentationInput from './components/PresentationInput';
import ComboboxInput from './components/ComboboxInput';
import TypeaheadDiv from './components/TypeaheadDiv';
import TypeaheadContainer from './components/TypeaheadContainer';
import UlContainer from './components/UlContainer';
import LoadingImg from './components/LoadingImg';

const EmptyDefaultTemplate = styled.div`
  text-align: center;
  font-weight: bold;
`;

const defaultLoadingTemplate = props =>
  (<LoadingImg
    src={SpinnerGif}
    className={props.className}
    height={props.height}
    dir={props.dir}
  />);

defaultLoadingTemplate.propTypes = {
  height: React.PropTypes.number,
  dir: React.PropTypes.string,
  className: React.PropTypes.string,
};

const EmptyTemplate = () => (<EmptyDefaultTemplate>No items</EmptyDefaultTemplate>);

class Typeahead extends PureComponent {

  static defaultProps = {
    value: '',
    dropdownVisible: false,
    options: [],
    hint: true,
    minLength: 0,
    showLoading: false,
    loadingTemplate: defaultLoadingTemplate,
    emptyTemplate: EmptyTemplate,
    className: '',
    rateLimitBy: 'none',
    rateLimitWait: 100,
    showEmpty: false,
    emptyVisible: false,
    placeholder: '',
  }

  static propTypes = {
    optionTemplate: React.PropTypes.func.isRequired,
    emptyTemplate: React.PropTypes.func,
    loadingTemplate: React.PropTypes.func,
    onChange: React.PropTypes.func,
    onFetchData: React.PropTypes.func,
    onBlur: React.PropTypes.func,
    onOptionClick: React.PropTypes.func,
    onOptionChange: React.PropTypes.func,
    onClick: React.PropTypes.func,
    displayKey: React.PropTypes.string.isRequired,
    hint: React.PropTypes.bool,
    minLength: React.PropTypes.number,
    showLoading: React.PropTypes.bool,
    value: React.PropTypes.any,
    className: React.PropTypes.string,
    options: React.PropTypes.oneOfType([
      React.PropTypes.array,
      React.PropTypes.instanceOf(Immutable.List),
    ]),
    rateLimitBy: React.PropTypes.oneOf(['none', 'trottle', 'debounce']),
    rateLimitWait: React.PropTypes.number,
    showEmpty: React.PropTypes.bool,
    placeholder: React.PropTypes.string,
  }

  constructor(props) {
    super(props);
    this.state = {
      value: String(props.value),
      dropdownVisible: false,
      options: props.options,
      selectedIndex: -1,
      hint: props.hint,
      minLength: props.minLength,
      hintValue: '',
      showLoading: props.showLoading,
      direction: 'ltr',
      width: 0,
      height: 0,
      rateLimitBy: props.rateLimitBy,
      rateLimitWait: props.rateLimitWait,
      emptyVisible: false,
      showEmpty: props.showEmpty,
      placeholder: props.placeholder,
      _debounceFetchHandler: debounce(this._defaultFetchHandler, props.rateLimitWait),
      _trottleFetchHandler: trottle(this._defaultFetchHandler, props.rateLimitWait),
    };
  }

  componentDidMount() {
    const value = this.state.value;
    document.addEventListener('click', this._onDocActivate);

    if (this.state.minLength && (value.length >= this.state.minLength)) {
      this._fetchDataHandler(value);
    }

    const { clientHeight, clientWidth } = this._inputTypeAhead._input;
    /* eslint-disable react/no-did-mount-set-state */
    this.setState({
      height: clientHeight,
      width: clientWidth,
    });
    /* eslint-enable react/no-did-mount-set-state */
  }

  componentWillReceiveProps(nextProps) {
    const dir = getDirection(this._inputTypeAhead._input);
    const value = String(nextProps.value);
    const displayKey = nextProps.displayKey;
    const options = nextProps.options;
    const hint = (dir === 'rtl' ? false : nextProps.hint);
    const nextValue = this._getValueByIndex(options, 0, displayKey);
    const hintValue = (hint ? this._getHint(value, nextValue) : '');
    const hasOptions = (this._getOptionsCount(nextProps.options) > 0);
    const { clientHeight, clientWidth } = this._inputTypeAhead._input;

    this.setState({
      value,
      options: nextProps.options,
      selectedIndex: this._getSelectedIndex(options, 0),
      hint,
      minLength: nextProps.minLength,
      showLoading: nextProps.showLoading,
      dropdownVisible: hasOptions,
      hintValue: hint ? hintValue : '',
      direction: dir,
      width: clientWidth,
      height: clientHeight,
      rateLimitBy: nextProps.rateLimitBy,
      rateLimitWait: nextProps.rateLimitWait,
      showEmpty: nextProps.showEmpty,
      placeholder: nextProps.placeholder,
      _debounceFetchHandler: debounce(this._defaultFetchHandler, nextProps.rateLimitWait),
      _trottleFetchHandler: trottle(this._defaultFetchHandler, nextProps.rateLimitWait),
    });
  }

  componentWillUnmount() {
    document.removeEventListener('click', this._onDocActivate);
  }

  _getValueByIndex = (options, index, displayKey) => {
    if (Immutable.List.isList(options)) {
      return String((options &&
             options.size &&
             options.get(index) &&
             options.get(index)[displayKey]) ||
             this.state.value);
    }

    return String((options &&
           options.length &&
           options[index] &&
           options[index][displayKey]) ||
           this.state.value);
  }

  _getSelectedIndex = (options, index) => {
    return index > 0 ?
           (index % this._getOptionsCount(options)) :
           index;
  }

  _onDocActivate = () => {
    this.setState({
      dropdownVisible: false,
      emptyVisible: false,
    });
  }

  _onFocus = () => {
    const hasOptions = (this._getOptionsCount(this.props.options) > 0);

    this.setState({
      dropdownVisible: hasOptions,
      emptyVisible: (this.state.showEmpty && !hasOptions),
    });
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
    const value = String(e.target.value);
    const dir = getDirection(this._inputTypeAhead._input);
    const hint = (dir === 'rtl' ? false : this.state.hint);
    const hasOptions = (this._getOptionsCount(this.state.options) > 0);
    const minLength = this.state.minLength;

    if (this.state.minLength && value.length >= minLength) {
      this._fetchDataHandler(value);
    } else if (this.props.onChange) {
      this.props.onChange(e);
    }

    this.setState({
      value,
      selectedIndex: -1,
      dropdownVisible: hasOptions,
      hint,
      direction: dir,
    });
  }

  _defaultFetchHandler = (value) => {
    if (this.props.onFetchData) {
      this.props.onFetchData(value);
    }
  }

  _fetchDataHandler = (value) => {
    const funcMapping = {
      none: this._defaultFetchHandler,
      debounce: this.state._debounceFetchHandler,
      trottle: this.state._trottleFetchHandler,
    };

    funcMapping[this.props.rateLimitBy](value);
  }

  _getOptionsCount = (options) => {
    return options && (options.length || options.size || 0);
  }

  _getOption = (options, index) => {
    if (Immutable.List.isList(options)) {
      return options.get(index);
    }
    return options[index];
  }

  _optionClick = (index) => {
    const options = this.state.options;
    const displayKey = this.props.displayKey;

    if (this.props.onOptionClick) {
      const option = this._getOption(options, index);
      this.props.onOptionClick(option, index);
      if (this.props.onOptionChange) {
        this.props.onOptionChange(option, index);
      }
    }

    this.setState({
      selectedIndex: index,
      dropdownVisible: false,
      value: this._getValueByIndex(options, index, displayKey),
    });
  }

  _getHint = (currentValue, nextValue) => {
    const lowerCurrentValue = String(currentValue).toLowerCase();
    const lowerNextValue = String(nextValue).toLowerCase();
    if (lowerNextValue.toLowerCase().startsWith(lowerCurrentValue)) {
      return String(nextValue);
    }
    return '';
  }

  _onKeyDown = (e) => {
    const hint = this.state.hint;
    const key = e.key;
    const options = this.state.options;
    const dropdownVisible = this.state.dropdownVisible;
    const selectedIndex = this.state.selectedIndex;
    const displayKey = this.props.displayKey;
    const value = this.state.value;
    const hintValue = hint ? this.state.hintValue : '';

    switch (key) {
      case 'Esc':
      case 'Escape': {
        e.preventDefault();
        this.setState({
          dropdownVisible: false,
          emptyVisible: false,
          hintValue: '',
        });
        break;
      }
      case 'End':
      case 'Tab': {
        if (hint && !e.shiftKey) {
          if (hintValue) {
            e.preventDefault();
            this.setState({
              value: hintValue,
              hintValue: '',
              dropdownVisible: false,
            });
          } else {
            this.setState({
              dropdownVisible: false,
            });
          }
        }
        break;
      }
      case 'Enter': {
        if (this._getOptionsCount(options) > 0) {
          this.setState({
            value: this._getValueByIndex(options, selectedIndex, displayKey),
            dropdownVisible: false,
          });
          if (this.props.onOptionChange) {
            this.props.onOptionChange(options[selectedIndex], selectedIndex);
          }
        }
        break;
      }
      case 'ArrowUp':
      case 'ArrowDown': {
        e.preventDefault();
        const increment = key === 'ArrowUp' ? -1 : 1;
        const len = this._getOptionsCount(options);
        const calcIndex = (length, curIndex) => {
          let newIndex = curIndex + increment;
          if (newIndex < 0) {
            newIndex += length;
          }
          return newIndex % length;
        };

        if (!dropdownVisible &&
             (options && len > 0)) {
          const nextValue = this._getValueByIndex(options, selectedIndex, displayKey);
          this.setState({
            dropdownVisible: true,
            hintValue: (hint ? this._getHint(value, nextValue) : ''),
          });
        }

        if (dropdownVisible &&
           (options && len > 0)) {
          const newIndex = calcIndex(len, selectedIndex);
          const nextValue = this._getValueByIndex(options, newIndex, displayKey);
          this.setState({
            selectedIndex: newIndex,
            hintValue: (hint ? this._getHint(value, nextValue) : ''),
          });
        }

        if (this.state.showEmpty && !this.state.emptyVisible) {
          this.setState({
            emptyVisible: true,
          });
        }

        this._setPosition(value.length);
        break;
      }
      default:
        break;
    }
  }

  _setPosition = (pos) => {
    const input = this._inputTypeAhead._input;
    if (input.setSelectionRange) {
      input.setSelectionRange(pos, pos);
    } else if (input.createTextRange) {
      const range = input.createTextRange();
      range.collapse(true);
      range.moveEnd('character', pos);
      range.moveStart('character', pos);
      range.select();
    }
  }

  _renderSpinner = () => {
    const LoadingTemplate = this.props.loadingTemplate;
    if (this.state.showLoading) {
      return (
        <LoadingTemplate
          className="rtex-spinner"
          dir={this.state.direction}
          height={this.state.height}
        />);
    }
    return null;
  }

  _getInputPlaceHolder = (hintValue) => {
    if (hintValue) {
      return '';
    }
    return this.state.placeholder;
  }

  _renderInputs = () => {
    const value = this.state.value;

    return (
      <TypeaheadDiv className="rtex-input-container">
        <PresentationInput
          disabled
          role="presentation"
          aria-hidden
          value={this.state.hintValue}
          className={`rtex-hint ${this.props.className}`}
        />
        <ComboboxInput
          innerRef={(c) => { this._inputTypeAhead = c; }}
          role="combobox"
          aria-expanded="true"
          aria-autocomplete="both"
          placeholder={this._getInputPlaceHolder(this.state.hintValue)}
          value={value}
          spellCheck={false}
          autoComplete={false}
          autoCorrect={false}
          onFocus={this._onFocus}
          onClick={this._onClick}
          onBlur={this._onBlur}
          onChange={this._onChange}
          onKeyDown={this._onKeyDown}
          className={`rtex-input ${this.props.className}`}
        />
        { this._renderSpinner() }
      </TypeaheadDiv>
    );
  }

  _getOptionClasses = (visible) => {
    const defaultClasses = ['rtex-option-container'];
    if (visible) {
      defaultClasses.push('rtex-is-open');
    }
    return defaultClasses.join(' ');
  }

  _renderOptions = () => {
    const value = this.state.value;
    const dropdownVisible = this.state.dropdownVisible;
    const OptionTemplate = this.props.optionTemplate;
    const options = this.state.options;

    return (
      <UlContainer
        className={this._getOptionClasses(dropdownVisible)}
        visible={dropdownVisible}
      >
        {
            options.map((data, index) => {
              const selected = this.state.selectedIndex === index;
              return (
                <LiContainer
                  selected={selected}
                  optionIndex={index}
                  key={index}
                  onClick={this._optionClick}
                >

                  <OptionTemplate
                    data={data}
                    index={index}
                    value={value}
                    selected={selected}
                  />

                </LiContainer>
              );
            })
          }
      </UlContainer>
    );
  }

  _renderEmpty = () => {
    const EmptyOptionTemplate = this.props.emptyTemplate;
    if (!this.state.dropdownVisible &&
        (this.state.showEmpty && this.state.emptyVisible)) {
      return (
        <UlContainer
          className="rtex-option-container rtex-is-open rtex-empty"
          visible
        >
          <LiContainer>
            <EmptyOptionTemplate />
          </LiContainer>
        </UlContainer>
      );
    }
    return null;
  }

  render() {
    return (
      <TypeaheadContainer
        ref={(c) => { this._container = c; }}
        className="rtex-container"
      >
        {this._renderInputs()}
        {this._renderEmpty()}
        {this._renderOptions()}
      </TypeaheadContainer>
    );
  }
}

export default Typeahead;
