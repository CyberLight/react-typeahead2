# React Typeahead2

[![Jest tests count](https://img.shields.io/badge/jest-49%20tests-blue.svg)](https://travis-ci.org/CyberLight/react-typeahead2)
[![Coverage Status](https://coveralls.io/repos/github/CyberLight/react-typeahead2/badge.svg?branch=master)](https://coveralls.io/github/CyberLight/react-typeahead2?branch=master)
[![Build Status](https://travis-ci.org/CyberLight/react-typeahead2.svg?branch=master)](https://travis-ci.org/CyberLight/react-typeahead2)
[![npm version](https://badge.fury.io/js/react-typeahead2.svg)](https://badge.fury.io/js/react-typeahead2)
[![Build status](https://ci.appveyor.com/api/projects/status/1xl417l6f3u3eqlf?svg=true)](https://ci.appveyor.com/project/CyberLight/react-typeahead2)
[![npm downloads](https://img.shields.io/npm/dm/react-typeahead2.svg?style=flat-square)](https://www.npmjs.com/package/react-typeahead2)
[![Gitter Chat](http://img.shields.io/badge/chat-online-brightgreen.svg)](https://gitter.im/react-typeahead2)

[![NPM](https://nodei.co/npm/react-typeahead2.png)](https://nodei.co/npm/react-typeahead2/)

[![Code Climate](https://codeclimate.com/github/CyberLight/react-typeahead2/badges/gpa.svg)](https://codeclimate.com/github/CyberLight/react-typeahead2)
[![Issue Count](https://codeclimate.com/github/CyberLight/react-typeahead2/badges/issue_count.svg)](https://codeclimate.com/github/CyberLight/react-typeahead2)
[![Test Coverage](https://codeclimate.com/github/CyberLight/react-typeahead2/badges/coverage.svg)](https://codeclimate.com/github/CyberLight/react-typeahead2/coverage)

[![Dependency Status](https://david-dm.org/CyberLight/react-typeahead2.svg)](https://david-dm.org/CyberLight/react-typeahead2)
[![devDependencies Status](https://david-dm.org/CyberLight/react-typeahead2/dev-status.svg)](https://david-dm.org/CyberLight/react-typeahead2?type=dev)
[![peerDependencies Status](https://david-dm.org/CyberLight/react-typeahead2/peer-status.svg)](https://david-dm.org/CyberLight/react-typeahead2?type=peer)

React Typeahead2 component like an Twitter typeahead

[Storybook demo link](https://cyberlight.github.io/react-typeahead2/)

* Like twitter Typeahead control

### About Component

#### Used

* ```styled-components``` for embed css with React components
* ```jest```, ```enzume```, ```webpack``` for testing purposes
* ```React Storybook``` for developing control in browser with live demo

#### You can

* Manually show/hide spinner
* Manually show/hide empty option item
* Use ```onFetchData``` event for fetching data from server using value entered by user
* Limit count of triggering ```onFetchData``` event, using ```rateLimitBy```, ```rateLimitWait```, ```minLength```

### Component features

#### Keyboard keys:

* ```Esc``` - for hide expanded list of items
* ```ArrowUp```, ```ArrowDown``` - for navigate by list items.
* ```Enter``` - for selecting item from expanded list.
* ```Tab```, ```End``` - for autocomplete item if hint displayed.

#### Properties

* ```optionTemplate``` - function template for render option item ```required```
* ```displayKey``` - string name of field for displaying value after select option ```required```
* ```emptyTemplate``` - function template for display empty option item ```optional```
* ```loadingTemplate``` - function for displaying custom spinner template ```optional```
* ```hint``` - bool value for enable/disable hint displaying ```optional``` (displayed only for LTR)
* ```minLength``` - int value for min value (if input value length >= ```minLength``` then trigger ```onFetchData``` event)
* ```showLoading``` - bool flag for show/hide spinner
* ```value``` - string value displaying in input element
* ```className``` - for additional classes for input
* ```options``` - list of option items (can be array of Objects or ```Immutable.List``` of ```Immutable.Record```)
* ```rateLimitBy``` - string value of ```['none', 'trottle', 'debounce']``` for limit count ```onFetchData``` events
* ```rateLimitWait``` - int value used for ```trottle``` and ```debounce```
* ```showEmpty``` - flag for show/hide empty option item. (displayed only if no items in ```options``` property)
* ```placeholder``` - string placeholder for displaying inside control

#### Events

* ```onChange``` - event handler which trigger when input value changed
* ```onFetchData``` - event handler which depends on ```rateLimitBy```, ```rateLimitWait```, ```minLength```
* ```onBlur``` - event handler for standard ```blur``` event of input
* ```onOptionClick``` - event handler for handle choosing option from list
* ```onOptionChange``` - event handler like ```onOptionClick```
* ```onClick``` - event handler for standard click on input element

#### Css classes

* ```.rtex-option-container``` - class for options list container
* ```.rtex-option-item``` - class for options item
* ```.rtex-hint``` - class for hint input element
* ```.rtex-input``` - class for input element

### Example

#### Simple usage Example

```
import Typeahead from 'react-typeahead2';

const OptionTemplate = props => {
  const getStyles = (selected) => {
    if (selected) {
      return {textAlign: 'left', backgroundColor: 'blue', color: 'white'};
    }
    return {textAlign: 'left'};
  };
  return (<div style={getStyles(props.selected)}>{`Id: ${props.data.id} - Name: ${props.data.name}`}</div>);
};

// .... some code here
<div style={{width: '180px', margin: '0 auto'}}>
  <Typeahead
    value=""
    options={[{id:1, name:'name 1'}, {id:2, name: 'name 2'}]}
    displayKey="name"
    optionTemplate={OptionTemplate}
  />
</div>
// .... some code here
```

#### Bootstrap 3 styling example

```Css
.rtex-option-container {
    min-width: 160px;
    margin-top: 2px;
    padding: 5px 0;
    background-color: #fff;
    border: 1px solid #ebebeb;
    -webkit-background-clip: padding-box;
    -moz-background-clip: padding;
    background-clip: padding-box;
    width: 100%;
    overflow-y: auto;
    max-height: 250px;
}

.rtex-option-item {
  border-top: inherit;
}

.rtex-hint {
  background-color: white;
}

.rtex-input {
  position: relative;
  background-color: transparent;
  background-image: url(data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7);
}
```

#### Like Twitter typeahead styling example

```Css
.TwitterStylePage {
  background-color: #f2f9ff;
  font: normal normal normal 18px/1.2 "Helvetica Neue", Roboto, "Segoe UI", Calibri, sans-serif;
  color: #292f33;
}

.TwitterStylePage .rtex-hint, .TwitterStylePage .rtex-input {
  width: 100%;
  padding: 5px 8px;
  font-size: 24px;
  line-height: 30px;
  border: 1px solid #024e6a;
  -webkit-border-radius: 8px;
  -moz-border-radius: 8px;
  border-radius: 8px;
}

.TwitterStylePage .rtex-input {
  position: relative;
  background-color: transparent;
  background-image: url(data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7);
  outline: none;
}

.TwitterStylePage .rtex-container {
  position: relative;
  width: 500px;
  margin: 50px auto 0 auto;
  padding: 15px;
  text-align: left;
  background-color: #0097cf;
  background-image: -moz-linear-gradient(top, #04a2dd, #03739c);
  background-image: -webkit-gradient(linear, 0 0, 0 100%, from(#04a2dd), to(#03739c));
  background-image: -webkit-linear-gradient(top, #04a2dd, #03739c);
  background-image: -o-linear-gradient(top, #04a2dd, #03739c);
  background-image: linear-gradient(top, #04a2dd, #03739c);
  background-repeat: repeat-x;
  border: 1px solid #024e6a;
  -webkit-border-radius: 10px;
  -moz-border-radius: 10px;
  border-radius: 10px;
  -webkit-box-shadow: 0 0 2px #111;
  -moz-box-shadow: 0 0 2px #111;
  box-shadow: 0 0 2px #111;
}

.TwitterStylePage .rtex-container *,
.TwitterStylePage .rtex-container *::after,
.TwitterStylePage .rtex-container *::before {
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}

.TwitterStylePage .rtex-option-container {
    position: absolute;
    top: 95%;
    left: 2.5%;
    z-index: 100;
    width: 95%;
    margin-bottom: 20px;
    overflow: hidden;
    background-color: #fff;
    -webkit-border-radius: 8px;
    -moz-border-radius: 8px;
    border-radius: 8px;
    box-shadow: 0px 0px 0px 1px green;
    -webkit-box-shadow: 0 5px 10px rgba(0,0,0,.2);
    -moz-box-shadow: 0 5px 10px rgba(0,0,0,.2);
    box-shadow: 0 5px 10px rgba(0,0,0,.2);
}

.TwitterStylePage .EmptyItem {
  position: relative;
  padding: 10px;
  font-size: 24px;
  line-height: 30px;
  text-align: center;
}
```

### Contributing

* See ```CONTRIBUTING.md```

### License

* See ```LICENSE```
