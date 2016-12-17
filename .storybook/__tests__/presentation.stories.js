import React, {PureComponent} from 'react';
import { storiesOf, action } from '@kadira/storybook';
import Typeahead from '../../src/index';

const allOptions = [
  {id:1, name:'al'},
  {id:2, name:'ali'},
  {id:3, name:'ali-ba'},
  {id:3, name:'ali-baba'},
  {id:4, name:'box'},
  {id:5, name:'fox in box'},
  {id:6, name:'earth'}
];


class TestWrapper extends PureComponent {
  constructor(props){
      super(props);
      this.state = {
        options: props.options,
        value: props.value
      }
  }

  componentWillReceiveProps(nextProps){
    this.setState({
      options: nextProps.options,
      value: nextProps.options
    });
  }

  _onChange = (e) => {
      var value = e.target.value;
      this.setState({
        value: value
      });
  }

  _onFetchData = (e) => {
    var value = e.target.value;
    this.setState({
      options: Array.from(allOptions.filter(x => x.name.indexOf(value) >= 0))
    });
  }

  _templateOption = (props) => {
    const getStyle = data => {
      if (data.selected) {
        return {
          backgroundColor: 'blue',
          color: 'white'
        };
      }
      return {};
    }
    return (
      <div style={getStyle(props)}>
        {props.data.name}
      </div>
    )
  }

  render(){
    var options = this.state.options;
    return (
      <Typeahead
        displayKey="name"
        value={this.state.value}
        onChange={this._onChange}
        onFetchData={this._onFetchData}
        optionTemplate={this._templateOption}
        minLength={1}
        options={options}/>
    )
  }
}


storiesOf('Presentation UI', module)
  .add('default view', () => (
      <Typeahead
        displayKey="name"
        options={[]}
        optionTemplate={props => {
        return (
          <div>
            {props.data.name}
          </div>
        )
      }}/>
  ))
  .add('simple options view', () => {
    return (
      <Typeahead
        displayKey="name"
        value={"test"}
        optionTemplate={props => {
          const getStyle = data => {
            if (data.selected) {
              return {
                backgroundColor: 'blue',
                color: 'white'
              };
            }
            return {};
          }
          return (
            <div style={getStyle(props)}>
              {props.data.name}
            </div>
          )
        }}
        options={[
          {id:1, name:'View #1'},
          {id:2, name:'View #2'},
          {id:3, name:'Super long View #3'}
        ]}/>
      )
    })
    .add('simple onchange options view', () => {
        var options = [];
        return (
          <TestWrapper options={options}/>
        );
    });


  // .add('some emojies as the text', () => (
  //   <Button>😀 😎 👍 💯</Button>
  // ))
  // .add('custom styles', () => {
  //   const style = {
  //     fontSize: 20,
  //     textTransform: 'uppercase',
  //     color: '#FF8833',
  //   };
  //   return (
  //     <Button style={style}>Hello</Button>
  //   );
  // });
