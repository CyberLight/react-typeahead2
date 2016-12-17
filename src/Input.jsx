import React, {PureComponent} from 'react';
import styled from 'styled-components';


class Input extends PureComponent {
  isCursorAtEnd = () => {
    let valueLen = this.props.value.length;
    return this._input.selectionStart === valueLen &&
           this._input.selectionEnd === valueLen;
  }

  focus = () => {
    this._input.focus();
  }

  render(){
    var {innerRef, ...other} = this.props;
    return (
      <input ref={c => {this._input = c;}} {...other} />
    );
  }
}

export default Input;
