import React, { PureComponent } from 'react';

class LiContainer extends PureComponent {

  static propTypes = {
    selected: React.PropTypes.bool,
    optionIndex: React.PropTypes.number,
    onClick: React.PropTypes.func,
    children: React.PropTypes.any,
  }

  constructor(props) {
    super(props);
    this.state = {
      selected: this.props.selected,
      optionIndex: this.props.optionIndex,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      selected: nextProps.selected,
      optionIndex: nextProps.optionIndex,
    });
  }

  _onClick = (e) => {
    e.nativeEvent.stopImmediatePropagation();
    this.props.onClick(this.state.optionIndex);
  }

  render() {
    return (
      /* eslint-disable jsx-a11y/no-static-element-interactions */
      <li
        aria-selected={this.props.selected}
        role="option"
        onClick={this._onClick}
      >
        { this.props.children }
      </li>
      /* eslint-enable jsx-a11y/no-static-element-interactions */
    );
  }
}

export default LiContainer;
