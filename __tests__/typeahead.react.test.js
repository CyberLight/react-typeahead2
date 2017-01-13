import React from 'react';
import sinon from 'sinon';
import { mount } from 'enzyme';
import Immutable from 'immutable';

import Typeahead from '../src/index';

const { expect } = global;

const SimpleOptionTemplate = (props) => {
  const getStyle = () => {
    if (props.selected) {
      return {
        backgroundColor: 'blue',
        color: 'white',
      };
    }
    return {};
  };

  const getClasses = () => {
    if (props.selected) {
      return 'rtex-option-item rtex-option-selected';
    }
    return 'rtex-option-item';
  };

  return (
    <div className={getClasses()} style={getStyle()}>
      {props.data.name}
    </div>);
};

SimpleOptionTemplate.propTypes = {
  selected: React.PropTypes.bool,
  data: React.PropTypes.object,
};

const documentEventsMap = {};

beforeEach(() => {
  sinon.stub(console, 'error').callsFake((warning) => { throw new Error(warning); });
  sinon.stub(document, 'addEventListener').callsFake((event, cb) => {
    documentEventsMap[event] = cb;
  });
});

afterEach(() => {
  /* eslint-disable no-console */
  console.error.restore();
  /* eslint-enable no-console */
  document.addEventListener.restore();
});

it('Typeahead should raise error on ignoring optionTemplate prop', () => {
  try {
    mount(<Typeahead />);
  } catch (e) {
    expect(e.message).toContain('`optionTemplate` is marked as required');
  }
});

it('Typeahead should raise error on ignoring displayKey prop', () => {
  try {
    const templateFn = () => null;
    mount(<Typeahead optionTemplate={templateFn} />);
  } catch (e) {
    expect(e.message).toContain('`displayKey` is marked as required');
  }
});

it('Typeahead should display value', () => {
  const templateFn = () => null;
  const component = mount(
    <Typeahead
      value="test"
      displayKey={'name'}
      optionTemplate={templateFn}
    />);
  expect(component.find('.rtex-input').props().value).toEqual('test');
});

it('Typeahead should hide/display spinner', () => {
  const templateFn = () => null;
  const component = mount(
    <Typeahead
      value="test"
      showLoading
      displayKey={'name'}
      optionTemplate={templateFn}
    />);
  expect(component.find('.rtex-spinner').length).toEqual(1);

  component.setProps({ showLoading: false });

  expect(component.find('.rtex-spinner').length).toEqual(0);
});

it('Typeahead should raise onFetchData for not empty value', () => {
  const templateFn = () => null;

  const onFetchData = sinon.spy();

  mount(
    <Typeahead
      value="fetch"
      showLoading
      debounceRate={0}
      displayKey={'name'}
      optionTemplate={templateFn}
      onFetchData={onFetchData}
    />);

  expect(onFetchData.called).toBeTruthy();
});

it('Typeahead should raise onChange when value changed', () => {
  const templateFn = () => null;
  const onChange = sinon.spy();

  const component = mount(
    <Typeahead
      value="change"
      showLoading
      displayKey={'name'}
      optionTemplate={templateFn}
      onChange={onChange}
    />);

  const event = { target: { value: 'value changed' } };
  component.find('.rtex-input').at(0).simulate('change', event);
  expect(onChange.called).toBeTruthy();
});

it('Typeahead should show list of items when Down Arrow key presses', () => {
  const options = [
    { id: 1, name: 'value 1' },
    { id: 2, name: 'value 2' },
    { id: 3, name: 'value 3' },
  ];

  const component = mount(
    <Typeahead
      value="change"
      showLoading
      displayKey={'name'}
      options={options}
      optionTemplate={SimpleOptionTemplate}
    />);

  component.find('.rtex-input').at(0).simulate('keyDown', { key: 'ArrowDown' });
  const container = component.find('.rtex-is-open');
  expect(container.length).toEqual(1);
  const items = container.find('.rtex-option-item');
  expect(items.length).toEqual(3);
});

it('Typeahead should move selection for item when ArrowDown pressed', () => {
  const options = [
    { id: 1, name: 'value 1' },
    { id: 2, name: 'value 2' },
    { id: 3, name: 'value 3' },
  ];

  const component = mount(
    <Typeahead
      value=""
      showLoading
      displayKey={'name'}
      options={options}
      optionTemplate={SimpleOptionTemplate}
    />);

  const inputComponent = component.find('.rtex-input').at(0);
  inputComponent.simulate('focus');

  inputComponent.simulate('keyDown', { key: 'ArrowDown' });
  const selectedItem1 = component.find('.rtex-is-open .rtex-option-selected');
  expect(selectedItem1.text()).toEqual('value 1');

  inputComponent.simulate('keyDown', { key: 'ArrowDown' });
  const selectedItem2 = component.find('.rtex-is-open .rtex-option-selected');
  expect(selectedItem2.text()).toEqual('value 2');

  inputComponent.simulate('keyDown', { key: 'ArrowDown' });
  const selectedItem3 = component.find('.rtex-is-open .rtex-option-selected');
  expect(selectedItem3.text()).toEqual('value 3');

  inputComponent.simulate('keyDown', { key: 'ArrowDown' });
  const selectedItem1Again = component.find('.rtex-is-open .rtex-option-selected');
  expect(selectedItem1Again.text()).toEqual('value 1');
});

it('Typeahead should move selection for item when ArrowUp pressed', () => {
  const options = [
    { id: 1, name: 'value 1' },
    { id: 2, name: 'value 2' },
    { id: 3, name: 'value 3' },
  ];

  const component = mount(
    <Typeahead
      value=""
      showLoading
      displayKey={'name'}
      options={options}
      optionTemplate={SimpleOptionTemplate}
    />);

  const inputComponent = component.find('.rtex-input').at(0);
  inputComponent.simulate('focus');

  inputComponent.simulate('keyDown', { key: 'ArrowUp' });
  const selectedItem2 = component.find('.rtex-is-open .rtex-option-selected');
  expect(selectedItem2.text()).toEqual('value 2');

  inputComponent.simulate('keyDown', { key: 'ArrowUp' });
  const selectedItem3 = component.find('.rtex-is-open .rtex-option-selected');
  expect(selectedItem3.text()).toEqual('value 1');

  inputComponent.simulate('keyDown', { key: 'ArrowUp' });
  const selectedItem2Again = component.find('.rtex-is-open .rtex-option-selected');
  expect(selectedItem2Again.text()).toEqual('value 3');

  inputComponent.simulate('keyDown', { key: 'ArrowUp' });
  const selectedItem1 = component.find('.rtex-is-open .rtex-option-selected');
  expect(selectedItem1.text()).toEqual('value 2');
});

it('Typeahead should show options on focus and hide options when <Esc> pressed', () => {
  const options = [
    { id: 1, name: 'value 1' },
    { id: 2, name: 'value 2' },
    { id: 3, name: 'value 3' },
  ];

  const component = mount(
    <Typeahead
      value="value 1"
      showLoading
      displayKey={'name'}
      options={options}
      optionTemplate={SimpleOptionTemplate}
    />);

  const inputComponent = component.find('.rtex-input').at(0);

  inputComponent.simulate('focus');
  expect(component.find('.rtex-is-open').length).toEqual(1);

  inputComponent.simulate('keyDown', { key: 'Esc' });
  expect(component.find('.rtex-is-open').length).toEqual(0);
});

it('Typeahead should select item by press <Enter>', () => {
  const options = [
    { id: 1, name: 'value 1' },
    { id: 2, name: 'value 2' },
    { id: 3, name: 'value 3' },
  ];

  const component = mount(
    <Typeahead
      value="value 1"
      showLoading
      displayKey={'name'}
      options={options}
      optionTemplate={SimpleOptionTemplate}
    />);

  const inputComponent = component.find('.rtex-input').at(0);
  inputComponent.simulate('focus');
  inputComponent.simulate('keyDown', { key: 'ArrowDown' });
  inputComponent.simulate('keyDown', { key: 'ArrowDown' });
  inputComponent.simulate('keyDown', { key: 'Enter' });
  expect(inputComponent.prop('value')).toEqual('value 2');
  expect(component.find('.rtex-is-open').length).toEqual(0);
});

test('Typeahead should show hint for value', () => {
  const options = [
    { id: 1, name: 'value 1' },
    { id: 2, name: 'value 2' },
    { id: 3, name: 'value 3' },
  ];

  const component = mount(
    <Typeahead
      value="valu"
      showLoading
      displayKey={'name'}
      options={options}
      optionTemplate={SimpleOptionTemplate}
    />);

  const inputComponent = component.find('.rtex-input').at(0);
  inputComponent.simulate('focus');

  inputComponent.simulate('keyDown', { key: 'ArrowDown' });
  const hintComponent = component.find('.rtex-hint').at(0);
  expect(hintComponent.prop('value')).toEqual('value 1');

  inputComponent.simulate('keyDown', { key: 'ArrowDown' });
  const hintComponent2 = component.find('.rtex-hint').at(0);
  expect(hintComponent2.prop('value')).toEqual('value 2');

  inputComponent.simulate('keyDown', { key: 'ArrowDown' });
  const hintComponent3 = component.find('.rtex-hint').at(0);
  expect(hintComponent3.prop('value')).toEqual('value 3');
});

test('Typeahead should not show hint if hint disabled', () => {
  const options = [
    { id: 1, name: 'value 1' },
    { id: 2, name: 'value 2' },
    { id: 3, name: 'value 3' },
  ];

  const component = mount(
    <Typeahead
      value="valu"
      showLoading
      hint={false}
      displayKey={'name'}
      options={options}
      optionTemplate={SimpleOptionTemplate}
    />);

  const inputComponent = component.find('.rtex-input').at(0);
  inputComponent.simulate('keyDown', { key: 'ArrowDown' });
  const hintComponent = component.find('.rtex-hint').at(0);
  expect(hintComponent.prop('value')).toEqual('');
});

test('Typeahead should autocomplete by press <Tab> by hint for value', () => {
  const options = [
    { id: 1, name: 'value 1' },
    { id: 2, name: 'value 2' },
    { id: 3, name: 'value 3' },
  ];

  const component = mount(
    <Typeahead
      value="valu"
      showLoading
      displayKey={'name'}
      options={options}
      optionTemplate={SimpleOptionTemplate}
    />);

  const inputComponent = component.find('.rtex-input').at(0);
  inputComponent.simulate('focus');
  inputComponent.simulate('keyDown', { key: 'ArrowDown' });
  inputComponent.simulate('keyDown', { key: 'ArrowDown' });
  const hintComponent = component.find('.rtex-hint').at(0);
  expect(hintComponent.prop('value')).toEqual('value 2');
  inputComponent.simulate('keyDown', { key: 'Tab' });
  expect(inputComponent.prop('value')).toEqual('value 2');
});

test('Typeahead should autocomplete by press <End> by hint for value', () => {
  const options = [
    { id: 1, name: 'value 1' },
    { id: 2, name: 'value 2' },
    { id: 3, name: 'value 3' },
  ];

  const component = mount(
    <Typeahead
      value="valu"
      showLoading
      displayKey={'name'}
      options={options}
      optionTemplate={SimpleOptionTemplate}
    />);

  const inputComponent = component.find('.rtex-input').at(0);
  inputComponent.simulate('focus');
  inputComponent.simulate('keyDown', { key: 'ArrowDown' });
  inputComponent.simulate('keyDown', { key: 'ArrowDown' });
  const hintComponent = component.find('.rtex-hint').at(0);
  expect(hintComponent.prop('value')).toEqual('value 2');
  inputComponent.simulate('keyDown', { key: 'End' });
  expect(inputComponent.prop('value')).toEqual('value 2');
});

test('Typeahead should not autocomplete by press <Tab> if hint disabled', () => {
  const options = [
    { id: 1, name: 'value 1' },
    { id: 2, name: 'value 2' },
    { id: 3, name: 'value 3' },
  ];

  const component = mount(
    <Typeahead
      value="valu"
      showLoading
      hint={false}
      displayKey={'name'}
      options={options}
      optionTemplate={SimpleOptionTemplate}
    />);

  const inputComponent = component.find('.rtex-input').at(0);
  inputComponent.simulate('keyDown', { key: 'ArrowDown' });
  inputComponent.simulate('keyDown', { key: 'ArrowDown' });
  const hintComponent = component.find('.rtex-hint').at(0);
  expect(hintComponent.prop('value')).toEqual('');
  inputComponent.simulate('keyDown', { key: 'Tab' });
  expect(inputComponent.prop('value')).toEqual('valu');
});

test('Typeahead should not autocomplete by press <End> if hint disabled', () => {
  const options = [
    { id: 1, name: 'value 1' },
    { id: 2, name: 'value 2' },
    { id: 3, name: 'value 3' },
  ];

  const component = mount(
    <Typeahead
      value="valu"
      showLoading
      hint={false}
      displayKey={'name'}
      options={options}
      optionTemplate={SimpleOptionTemplate}
    />);

  const inputComponent = component.find('.rtex-input').at(0);
  inputComponent.simulate('keyDown', { key: 'ArrowDown' });
  inputComponent.simulate('keyDown', { key: 'ArrowDown' });
  const hintComponent = component.find('.rtex-hint').at(0);
  expect(hintComponent.prop('value')).toEqual('');
  inputComponent.simulate('keyDown', { key: 'End' });
  expect(inputComponent.prop('value')).toEqual('valu');
});

test('Typeahead should select option by click on it', () => {
  const options = [
    { id: 1, name: 'value 1' },
    { id: 2, name: 'value 2' },
    { id: 3, name: 'value 3' },
  ];

  const component = mount(
    <Typeahead
      value="valu"
      showLoading
      hint={false}
      displayKey={'name'}
      options={options}
      optionTemplate={SimpleOptionTemplate}
    />);

  const inputComponent = component.find('.rtex-input').at(0);
  inputComponent.simulate('focus');
  const container = component.find('.rtex-is-open');
  container.find('.rtex-option-item').at(1).simulate('click', {
    nativeEvent: { stopImmediatePropagation: () => {} },
  });
  expect(inputComponent.prop('value')).toEqual('value 2');
  const containerClosed = component.find('.rtex-is-open');
  expect(containerClosed.length).toEqual(0);
});

test('Typeahead should close option list if click on different div', () => {
  const options = [
    { id: 1, name: 'value 1' },
    { id: 2, name: 'value 2' },
    { id: 3, name: 'value 3' },
  ];

  const component = mount(
    <div>
      <Typeahead
        value="valu"
        showLoading
        hint={false}
        displayKey={'name'}
        options={options}
        optionTemplate={SimpleOptionTemplate}
      />
    </div>);

  const inputComponent = component.find('.rtex-input').at(0);
  inputComponent.simulate('keyDown', { key: 'ArrowDown' });
  expect(component.find('.rtex-is-open').length).toEqual(1);

  documentEventsMap.click();

  expect(component.find('.rtex-is-open').length).toEqual(0);
});

test('Typeahead should move spinner to left for RTL when chnage event raised', () => {
  const options = [
    { id: 1, name: 'value 1' },
    { id: 2, name: 'value 2' },
    { id: 3, name: 'value 3' },
  ];

  sinon.stub(window, 'getComputedStyle').callsFake(() => ({ direction: 'rtl' }));

  const component = mount(
    <div>
      <Typeahead
        value="valu"
        showLoading
        hint={false}
        displayKey={'name'}
        options={options}
        optionTemplate={SimpleOptionTemplate}
      />
    </div>);
  const event = { target: { value: 'value changed' } };
  component.find('.rtex-input').at(0).simulate('change', event);

  window.getComputedStyle.restore();

  expect(component.find('.rtex-spinner').prop('dir')).toEqual('rtl');
});


test('Typeahead should move spinner to left for RTL when new props sets', () => {
  const options = [
    { id: 1, name: 'value 1' },
    { id: 2, name: 'value 2' },
    { id: 3, name: 'value 3' },
  ];

  sinon.stub(window, 'getComputedStyle').callsFake(() => ({ direction: 'rtl' }));

  const component = mount(
    <Typeahead
      value="valu"
      showLoading
      hint={false}
      displayKey={'name'}
      options={options}
      optionTemplate={SimpleOptionTemplate}
    />);

  component.setProps({ value: 'value 1' });

  window.getComputedStyle.restore();

  expect(component.find('.rtex-spinner').prop('dir')).toEqual('rtl');
});

test('Typeahead should set default value for minLength', () => {
  const options = [
    { id: 1, name: 'value 1' },
    { id: 2, name: 'value 2' },
    { id: 3, name: 'value 3' },
  ];

  const component = mount(
    <Typeahead
      value=""
      showLoading
      hint={false}
      displayKey={'name'}
      options={options}
      optionTemplate={SimpleOptionTemplate}
    />);

  expect(component.prop('minLength')).toEqual(1);
});

test('Typeahead should raise Fetch event if value >= minLength', () => {
  const options = [
    { id: 1, name: 'value 1' },
    { id: 2, name: 'value 2' },
    { id: 3, name: 'value 3' },
  ];

  const onFetchData = sinon.spy();

  const component = mount(
    <Typeahead
      value=""
      showLoading
      hint={false}
      displayKey={'name'}
      minLength={4}
      options={options}
      optionTemplate={SimpleOptionTemplate}
      onFetchData={onFetchData}
    />);

  const event = { target: { value: 'v' } };
  component.find('.rtex-input').at(0).simulate('change', event);

  expect(onFetchData.callCount).toEqual(0);

  const event2 = { target: { value: 'val' } };
  component.find('.rtex-input').at(0).simulate('change', event2);

  expect(onFetchData.callCount).toEqual(0);

  const event3 = { target: { value: 'valu' } };
  component.find('.rtex-input').at(0).simulate('change', event3);

  expect(onFetchData.callCount).toEqual(1);

  const event4 = { target: { value: 'value' } };
  component.find('.rtex-input').at(0).simulate('change', event4);

  expect(onFetchData.callCount).toEqual(2);
});

test('Typeahead should receive rateLimitBy types ["none", "trottle", "debounce"]', () => {
  const options = [
    { id: 1, name: 'value 1' },
    { id: 2, name: 'value 2' },
    { id: 3, name: 'value 3' },
  ];

  const component = mount(
    <Typeahead
      value=""
      hint={false}
      displayKey={'name'}
      minLength={4}
      options={options}
      optionTemplate={SimpleOptionTemplate}
    />);

  expect(component.prop('rateLimitBy')).toEqual('none');

  expect(() => {
    component.setProps({ rateLimitBy: 'trottle' });
  }).not.toThrow();
  expect(component.prop('rateLimitBy')).toEqual('trottle');

  expect(() => {
    component.setProps({ rateLimitBy: 'debounce' });
  }).not.toThrow();
  expect(component.prop('rateLimitBy')).toEqual('debounce');

  expect(() => {
    component.setProps({ rateLimitBy: 'none' });
  }).not.toThrow();
  expect(component.prop('rateLimitBy')).toEqual('none');

  expect(() => {
    component.setProps({ rateLimitBy: 'unknown' });
  }).toThrowError(/Invalid prop `rateLimitBy` of value `unknown`/);
});

test('Typeahead should set rateLimitWait as number', () => {
  const options = [
    { id: 1, name: 'value 1' },
    { id: 2, name: 'value 2' },
    { id: 3, name: 'value 3' },
  ];

  const component = mount(
    <Typeahead
      value=""
      hint={false}
      displayKey={'name'}
      minLength={4}
      options={options}
      optionTemplate={SimpleOptionTemplate}
    />);

  // check default value
  expect(component.prop('rateLimitWait')).toEqual(100);

  expect(() => {
    component.setProps({ rateLimitWait: '100' });
  }).toThrowError(/Invalid prop `rateLimitWait` of type `string`/);
});

test('Typeahead check debounce rateLimitBy', (done) => {
  const options = [
    { id: 1, name: 'value 1' },
    { id: 2, name: 'value 2' },
    { id: 3, name: 'value 3' },
  ];

  const onFetchData = sinon.spy();

  const component = mount(
    <Typeahead
      value=""
      hint={false}
      displayKey={'name'}
      minLength={4}
      options={options}
      optionTemplate={SimpleOptionTemplate}
      rateLimitBy={'debounce'}
      onFetchData={onFetchData}
    />);

  const typeData = 'value 1 testing debounce';
  for (let i = 1; i < (typeData.length - 1); i += 1) {
    const event = { target: { value: typeData.substring(0, i) } };
    component.find('.rtex-input').at(0).simulate('change', event);
  }

  setTimeout(() => {
    try {
      expect(onFetchData.callCount).toBeLessThanOrEqual(1);
      done();
    } catch (e) {
      done.fail(e);
    }
  }, 201);
});


test('Typeahead check trottle rateLimitBy', (done) => {
  const options = [
    { id: 1, name: 'value 1' },
    { id: 2, name: 'value 2' },
    { id: 3, name: 'value 3' },
  ];

  const onFetchData = sinon.spy();

  const component = mount(
    <Typeahead
      value=""
      hint={false}
      displayKey={'name'}
      minLength={4}
      options={options}
      optionTemplate={SimpleOptionTemplate}
      rateLimitBy={'trottle'}
      onFetchData={onFetchData}
    />);

  const typeData = 'value 1 testing !';
  for (let i = 1; i < (typeData.length - 1); i += 1) {
    const event = { target: { value: typeData.substring(0, i) } };
    component.find('.rtex-input').at(0).simulate('change', event);
  }

  setTimeout(() => {
    try {
      expect(onFetchData.callCount).toBeLessThanOrEqual(3);
      done();
    } catch (e) {
      done.fail(e);
    }
  }, 201);
});


test('Typeahead check "none" rateLimitBy', () => {
  const options = [
    { id: 1, name: 'value 1' },
    { id: 2, name: 'value 2' },
    { id: 3, name: 'value 3' },
  ];

  const onFetchData = sinon.spy();

  const component = mount(
    <Typeahead
      value=""
      hint={false}
      displayKey={'name'}
      minLength={4}
      options={options}
      optionTemplate={SimpleOptionTemplate}
      rateLimitBy={'none'}
      onFetchData={onFetchData}
    />);

  const typeData = 'value 1 testing!';
  const input = component.find('.rtex-input').at(0);
  for (let i = 0, len = typeData.length; i < len; i += 1) {
    input.simulate('change', { target: { value: typeData.substring(0, i) } });
  }

  expect(onFetchData.callCount).toEqual(12);
});

test('Typeahead check showEmpty', () => {
  const options = [];

  const component = mount(
    <Typeahead
      value=""
      hint={false}
      displayKey={'name'}
      minLength={4}
      options={options}
      optionTemplate={SimpleOptionTemplate}
      rateLimitBy={'none'}
      showEmpty
    />);

  const inputComponent = component.find('.rtex-input').at(0);
  inputComponent.simulate('focus');

  const emptyContainer = component.find('.rtex-is-open .rtex-empty');
  expect(emptyContainer.length).toEqual(1);
  expect(emptyContainer.text()).toEqual('No items');

  component.setProps({ showEmpty: false });

  expect(component.find('.rtex-is-open .rtex-empty').length).toEqual(0);
});

test('Typeahead check showEmpty with custom template', () => {
  const options = [];

  const EmptyTemplate = () => (<div>Custom empty template</div>);

  const component = mount(
    <Typeahead
      value=""
      hint={false}
      displayKey={'name'}
      minLength={4}
      options={options}
      optionTemplate={SimpleOptionTemplate}
      rateLimitBy={'none'}
      emptyTemplate={EmptyTemplate}
      showEmpty
    />);

  const inputComponent = component.find('.rtex-input').at(0);
  inputComponent.simulate('focus');

  const emptyContainer = component.find('.rtex-is-open .rtex-empty');
  expect(emptyContainer.length).toEqual(1);
  expect(emptyContainer.text()).toEqual('Custom empty template');

  component.setProps({ showEmpty: false });

  expect(component.find('.rtex-is-open .rtex-empty').length).toEqual(0);
});

test('Typeahead check hide empty custom template with <Esc>', () => {
  const component = mount(
    <Typeahead
      value=""
      hint={false}
      displayKey={'name'}
      minLength={4}
      options={[]}
      optionTemplate={SimpleOptionTemplate}
      rateLimitBy={'none'}
      showEmpty
    />);

  let inputComponent = component.find('.rtex-input').at(0);
  inputComponent.simulate('focus');

  expect(component.find('.rtex-is-open .rtex-empty').length).toEqual(1);

  inputComponent = component.find('.rtex-input').at(0);
  inputComponent.simulate('keyDown', { key: 'Esc' });

  expect(component.find('.rtex-is-open .rtex-empty').length).toEqual(0);
});

test('Typeahead check not show empty template if items present', () => {
  const options = [
    { id: 1, name: 'value 1' },
    { id: 2, name: 'value 2' },
    { id: 3, name: 'value 3' },
  ];

  const component = mount(
    <Typeahead
      value=""
      hint={false}
      displayKey={'name'}
      minLength={4}
      options={options}
      optionTemplate={SimpleOptionTemplate}
      rateLimitBy={'none'}
      showEmpty
    />);

  const inputComponent = component.find('.rtex-input').at(0);

  inputComponent.simulate('keyDown', { key: 'ArrowDown' });

  expect(component.find('.rtex-is-open .rtex-empty').length).toEqual(0);
  expect(component.find('.rtex-is-open').length).toEqual(1);
});

test('Typeahead check show template with <DownArrow>', () => {
  const component = mount(
    <Typeahead
      value=""
      hint={false}
      displayKey={'name'}
      minLength={4}
      options={[]}
      optionTemplate={SimpleOptionTemplate}
      rateLimitBy={'none'}
      showEmpty
    />);

  const inputComponent = component.find('.rtex-input').at(0);
  inputComponent.simulate('keyDown', { key: 'ArrowDown' });
  expect(component.find('.rtex-is-open .rtex-empty').length).toEqual(1);

  inputComponent.simulate('keyDown', { key: 'Esc' });
  expect(component.find('.rtex-is-open .rtex-empty').length).toEqual(0);

  inputComponent.simulate('keyDown', { key: 'ArrowDown' });
  expect(component.find('.rtex-is-open .rtex-empty').length).toEqual(1);
});

test('Typeahead check show template on focused input', () => {
  const component = mount(
    <Typeahead
      value=""
      hint={false}
      displayKey={'name'}
      minLength={4}
      options={[]}
      optionTemplate={SimpleOptionTemplate}
      rateLimitBy={'none'}
      showEmpty
    />);

  const inputComponent = component.find('.rtex-input').at(0);

  inputComponent.simulate('focus');
  expect(component.find('.rtex-is-open .rtex-empty').length).toEqual(1);
});

test('Typeahead check close empty template by click outside of component', () => {
  const component = mount(
    <Typeahead
      value=""
      hint={false}
      displayKey={'name'}
      minLength={4}
      options={[]}
      optionTemplate={SimpleOptionTemplate}
      rateLimitBy={'none'}
      showEmpty
    />);

  const inputComponent = component.find('.rtex-input').at(0);

  inputComponent.simulate('focus');
  expect(component.find('.rtex-is-open .rtex-empty').length).toEqual(1);

  documentEventsMap.click();

  expect(component.find('.rtex-is-open .rtex-empty').length).toEqual(0);
});

test('Typeahead check showing placeholder', () => {
  const PlaceholderText = 'Placeholder for input';
  const component = mount(
    <Typeahead
      value=""
      hint={false}
      displayKey={'name'}
      minLength={4}
      options={[]}
      optionTemplate={SimpleOptionTemplate}
      rateLimitBy={'none'}
      showEmpty
      placeholder={PlaceholderText}
    />);

  const inputComponent = component.find('.rtex-input').at(0);
  expect(inputComponent.prop('placeholder')).toEqual(PlaceholderText);
});

test('Typeahead check not showing placeholder if hint value present', () => {
  const options = [
    { id: 1, name: 'value 1' },
    { id: 2, name: 'value 2' },
    { id: 3, name: 'value 3' },
  ];

  const PlaceholderText = 'Placeholder for input';
  const component = mount(
    <Typeahead
      value="valu"
      hint
      displayKey={'name'}
      minLength={4}
      options={options}
      optionTemplate={SimpleOptionTemplate}
      rateLimitBy={'none'}
      placeholder={PlaceholderText}
    />);

  const inputComponent = component.find('.rtex-input').at(0);
  inputComponent.simulate('focus');
  inputComponent.simulate('keyDown', { key: 'ArrowDown' });

  const hintComponent = component.find('.rtex-hint').at(0);
  expect(hintComponent.prop('value')).toEqual('value 1');

  expect(component.find('.rtex-input').at(0).prop('placeholder')).toEqual('');
});

test('Typeahead should work with Immutable Record', () => {
  const Item = Immutable.Record({ id: 0, name: '' });
  const options = Immutable.List([
    new Item({ id: 1, name: 'value 1' }),
    new Item({ id: 2, name: 'value 2' }),
    new Item({ id: 3, name: 'value 3' }),
  ]);

  const PlaceholderText = 'Placeholder for input';
  const component = mount(
    <Typeahead
      value=""
      hint
      displayKey={'name'}
      minLength={4}
      options={options}
      optionTemplate={SimpleOptionTemplate}
      rateLimitBy={'none'}
      placeholder={PlaceholderText}
    />);

  const inputComponent = component.find('.rtex-input').at(0);
  inputComponent.simulate('keyDown', { key: 'ArrowDown' });

  expect(component.find('.rtex-option-item').length).toEqual(3);
});

test('Typeahead should select item of Immutable Record', () => {
  const Item = Immutable.Record({ id: 0, name: '' });
  const options = Immutable.List([
    new Item({ id: 1, name: 'value 1' }),
    new Item({ id: 2, name: 'value 2' }),
    new Item({ id: 3, name: 'value 3' }),
  ]);

  const PlaceholderText = 'Placeholder for input';
  const component = mount(
    <Typeahead
      value=""
      hint
      displayKey={'name'}
      minLength={4}
      options={options}
      optionTemplate={SimpleOptionTemplate}
      rateLimitBy={'none'}
      placeholder={PlaceholderText}
    />);

  const inputComponent = component.find('.rtex-input').at(0);
  inputComponent.simulate('focus');

  inputComponent.simulate('keyDown', { key: 'ArrowDown' });
  const selectedItem = component.find('.rtex-option-item .rtex-option-selected');
  expect(selectedItem.text()).toEqual('value 1');

  inputComponent.simulate('keyDown', { key: 'ArrowDown' });
  const selectedItem2 = component.find('.rtex-option-item .rtex-option-selected');
  expect(selectedItem2.text()).toEqual('value 2');

  inputComponent.simulate('keyDown', { key: 'ArrowDown' });
  const selectedItem3 = component.find('.rtex-option-item .rtex-option-selected');
  expect(selectedItem3.text()).toEqual('value 3');
});

test('Typeahead should choose item of Immutable Record by press <Enter>', () => {
  const Item = Immutable.Record({ id: 0, name: '' });
  const options = Immutable.List([
    new Item({ id: 1, name: 'value 1' }),
    new Item({ id: 2, name: 'value 2' }),
    new Item({ id: 3, name: 'value 3' }),
  ]);

  const PlaceholderText = 'Placeholder for input';
  const component = mount(
    <Typeahead
      value=""
      hint
      displayKey={'name'}
      minLength={4}
      options={options}
      optionTemplate={SimpleOptionTemplate}
      rateLimitBy={'none'}
      placeholder={PlaceholderText}
    />);

  const inputComponent = component.find('.rtex-input').at(0);
  expect(inputComponent.prop('value')).toEqual('');
  inputComponent.simulate('focus');

  inputComponent.simulate('keyDown', { key: 'ArrowDown' });
  const selectedItem = component.find('.rtex-option-item .rtex-option-selected');
  expect(selectedItem.text()).toEqual('value 1');

  inputComponent.simulate('keyDown', { key: 'Enter' });
  expect(component.find('.rtex-input').at(0).prop('value')).toEqual('value 1');
});

test('Typeahead should receive any type in value', () => {
  const templateFn = () => null;
  expect(() => {
    mount(
      <Typeahead
        value={String(123)}
        displayKey={'name'}
        optionTemplate={templateFn}
      />);
  }).not.toThrow();
});

test('Typeahead should correctly show hint', () => {
  const component = mount(
    <Typeahead
      value={String(12)}
      hint
      options={[{ id: 123, name: 'aaaaaa' }]}
      displayKey={'id'}
      optionTemplate={SimpleOptionTemplate}
    />);

  component.find('.rtex-input').simulate('focus');

  expect(component.find('.rtex-is-open').length).toEqual(1);
  expect(component.find('.rtex-option-item').length).toEqual(1);

  const input = component.find('.rtex-input').at(0);
  input.simulate('keyDown', { key: 'ArrowDown' });
  const hintComponent = component.find('.rtex-hint').at(0);
  expect(hintComponent.prop('value')).toEqual('123');
});

test('Typeahead should correctly receive Object or array', () => {
  const component = mount(
    <Typeahead
      value={String({ id: 1, name: 'test' })}
      hint
      options={[]}
      displayKey={'id'}
      optionTemplate={SimpleOptionTemplate}
    />);

  expect(component.find('.rtex-input').props().value).toEqual('[object Object]');

  component.setProps({ value: String([1, 2, 3]) });

  expect(component.find('.rtex-input').props().value).toEqual('1,2,3');
});

test('Typeahead should correctly update values and trigger events for 2 elements', () => {
  /* eslint-disable no-undef */
  const fetchSecond = jest.fn();
  const fetchFirst = jest.fn();
  const changeSecond = jest.fn();
  const changeFirst = jest.fn();
  /* eslint-enable no-undef */

  const component = mount(
    <div>
      <Typeahead
        hint
        className="first"
        value=""
        options={[]}
        onFetchData={fetchFirst}
        onChange={changeFirst}
        displayKey={'id'}
        optionTemplate={SimpleOptionTemplate}
      />

      <Typeahead
        hint
        className="second"
        value=""
        options={[]}
        onFetchData={fetchSecond}
        onChange={changeSecond}
        displayKey={'name'}
        optionTemplate={SimpleOptionTemplate}
      />
    </div>);

  component.find('.first.rtex-input').simulate('change', { target: { value: 'info' } });
  expect(component.find('.first.rtex-input').props().value).toEqual('info');
  expect(fetchFirst).toHaveBeenCalledTimes(1);
  expect(fetchFirst).toBeCalledWith('info');
  expect(changeFirst).toHaveBeenCalledTimes(1);
  expect(changeFirst.mock.calls[0][0].target).toEqual({ value: 'info' });

  component.find('.second.rtex-input').simulate('change', { target: { value: 12 } });
  expect(component.find('.second.rtex-input').props().value).toEqual('12');
  expect(fetchSecond).toHaveBeenCalledTimes(1);
  expect(fetchSecond).toBeCalledWith('12');
  expect(changeSecond).toHaveBeenCalledTimes(1);
  expect(changeSecond.mock.calls[0][0].target).toEqual({ value: 12 });
});

test('Typeahead should correctly trigger onOptionClick value for 2 typeahead', () => {
  /* eslint-disable no-undef */
  const optionClickSecond = jest.fn();
  const optionClickFirst = jest.fn();
  /* eslint-enable no-undef */

  const component = mount(
    <div>
      <div className="first_block">
        <Typeahead
          hint
          className="first"
          value=""
          options={[{ id: 1, name: 'Item 1' }, { id: 1, name: 'Item 2' }]}
          displayKey={'id'}
          onOptionClick={optionClickFirst}
          optionTemplate={SimpleOptionTemplate}
        />
      </div>
      <div className="second_block">
        <Typeahead
          hint
          className="second"
          value=""
          options={[{ id: 10, name: 'Item 10' }, { id: 11, name: 'Item 11' }]}
          displayKey={'name'}
          onOptionClick={optionClickSecond}
          optionTemplate={SimpleOptionTemplate}
        />
      </div>
    </div>);

  const input = component.find('.first.rtex-input');
  input.simulate('focus');
  input.simulate('keyDown', { key: 'ArrowDown' });
  const container = component.find('.first_block .rtex-is-open');
  const items = container.find('.rtex-option-item');

  expect(items.length).toEqual(2);
  items.at(0).simulate('click', { nativeEvent: { stopImmediatePropagation: () => {} } });
  expect(optionClickFirst).toBeCalledWith({ id: 1, name: 'Item 1' }, 0);
  expect(optionClickFirst).toHaveBeenCalledTimes(1);
  expect(input.props().value).toEqual('1');

  const input2 = component.find('.second.rtex-input');
  input2.simulate('focus');
  input2.simulate('keyDown', { key: 'ArrowDown' });
  const container2 = component.find('.second_block .rtex-is-open');
  const items2 = container2.find('.rtex-option-item');

  expect(items2.length).toEqual(2);
  items2.at(0).simulate('click', { nativeEvent: { stopImmediatePropagation: () => {} } });
  expect(optionClickSecond).toBeCalledWith({ id: 10, name: 'Item 10' }, 0);
  expect(optionClickSecond).toHaveBeenCalledTimes(1);
  expect(input2.props().value).toEqual('Item 10');
});

test('Typeahead should correctly trigger onOptionChange value for 2 typeahead', () => {
  /* eslint-disable no-undef */
  const optionOptionChangeSecond = jest.fn();
  const optionOptionChangeFirst = jest.fn();
  /* eslint-enable no-undef */

  const component = mount(
    <div>
      <div className="first_block">
        <Typeahead
          hint
          className="first"
          value=""
          options={[{ id: 1, name: 'Item 1' }, { id: 1, name: 'Item 2' }]}
          displayKey={'id'}
          onOptionChange={optionOptionChangeFirst}
          optionTemplate={SimpleOptionTemplate}
        />
      </div>
      <div className="second_block">
        <Typeahead
          hint
          className="second"
          value=""
          options={[{ id: 10, name: 'Item 10' }, { id: 11, name: 'Item 11' }]}
          displayKey={'name'}
          onOptionChange={optionOptionChangeSecond}
          optionTemplate={SimpleOptionTemplate}
        />
      </div>
    </div>);

  const input = component.find('.first.rtex-input');
  input.simulate('focus');
  input.simulate('keyDown', { key: 'ArrowDown' });
  input.simulate('keyDown', { key: 'Enter' });

  expect(optionOptionChangeFirst).toBeCalledWith({ id: 1, name: 'Item 1' }, 0);
  expect(optionOptionChangeFirst).toHaveBeenCalledTimes(1);
  expect(input.props().value).toEqual('1');

  const input2 = component.find('.second.rtex-input');
  input2.simulate('focus');
  input2.simulate('keyDown', { key: 'ArrowDown' });
  input2.simulate('keyDown', { key: 'Enter' });

  expect(optionOptionChangeSecond).toBeCalledWith({ id: 10, name: 'Item 10' }, 0);
  expect(optionOptionChangeSecond).toHaveBeenCalledTimes(1);
  expect(input2.props().value).toEqual('Item 10');
});

test('Typeahead should trigger only onFetchData instead of onChange after minLength reached', () => {
  /* eslint-disable no-undef */
  const onChange = jest.fn();
  const onFetchData = jest.fn();
  /* eslint-enable no-undef */

  const component = mount(
    <Typeahead
      value=""
      hint
      options={[]}
      displayKey={'id'}
      minLength={4}
      optionTemplate={SimpleOptionTemplate}
      onFetchData={onFetchData}
      onChange={onChange}
    />);

  const event = { target: { value: 'value changed' } };
  component.find('.rtex-input').simulate('change', event);

  expect(onChange).not.toBeCalled();
  expect(onFetchData).toHaveBeenCalledTimes(1);
});
