import React, { PureComponent } from 'react';

class Input extends PureComponent {

  static propTypes = {
    innerRef: React.PropTypes.any,
    value: React.PropTypes.string,
  }

  isCursorAtEnd = () => {
    const valueLen = this.props.value.length;
    return this._input.selectionStart === valueLen &&
           this._input.selectionEnd === valueLen;
  }

  focus = () => {
    this._input.focus();
  }

  render() {
    const { innerRef, ...other } = this.props;
    return (
      <input ref={(c) => { this._input = c; }} {...other} />
    );
  }
}

export default Input;
