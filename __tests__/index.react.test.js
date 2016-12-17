import React from 'react';
// import { expect } from 'chai';
import sinon from 'sinon';
import { shallow, mount } from 'enzyme';

import Button from '../src/index';
import Input from '../src/Input.jsx';

const { describe, it, expect } = global;

describe('Typeahead', () => {
  it('should handle the click event', () => {
    const clickMe = sinon.spy();
    // Here we do a JSDOM render. So, that's why we need to
    // wrap this with a div.
    const wrapper = mount(
      <div>
        <Button onClick={clickMe}>ClickMe</Button>
      </div>
    );

    wrapper.find('button').simulate('click');
    expect(clickMe.callCount).toEqual(1);
  });
});
