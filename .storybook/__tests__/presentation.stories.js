import React, {PureComponent} from 'react';
import { storiesOf, action } from '@kadira/storybook';
import styled from 'styled-components';

import Typeahead from '../../src/index';
import {TestWrapper} from './ui.wrappers';
import SpinnerGif from '../../src/static/spinner.gif';

const DivItem = styled.div`
  width: 100%;
  position: relative;
  padding: 8px;
  cursor: pointer;
  border-top: 1px solid #ccd6dd;
  ${props => (props.selected ? "background: #2091e6; color: #fff;" : "")}
  &:hover {
    color: #fff;
    background: ${props => (props.selected ? "#2091e6" : "#55acee")};
    .rtex-stats-label, .rtex-screen-name {
      color: #fff;
    }
  }
  content: " ";
  display: table;
  clear: both;
`;
const Avatar = styled.img`
  position: absolute;
  top: 8px;
  left: 8px;
  width: 52px;
  height: 52px;
  border: 2px solid #ccd6dd;
  border-radius: 5px;
`;
const Details = styled.div`
  min-height: 60px;
  padding-left: 60px;
`;
const RealName = styled.div`
  font-weight: 700;
  display: inline-block;
`;
const ScreenName = styled.div`
  color: #8899a6;
  display: inline-block;
  ${props => (props.selected ? "color: #fff;" : "")}
`;
const Description = styled.div`
  margin-top: 5px;
  font-size: 14px;
  line-height: 18px;
`;
const Stats = styled.div`
  float: right;
  text-align: right;
`;
const Stat = styled.div`
  display: inline-block;
  font-size: 12px;
  line-height: 16px;
  text-transform: uppercase;
`;
const StatLabel = styled.span`
  color: #8899a6;
  font-weight: 500;
  ${props => (props.selected ? "color: #fff;" : "")}
`;

const Spinner = styled.img`
  position: absolute;
  top: 7px;
  ${props => (props.dir == "rtl" ? 'left: 7px' : 'right: 7px')};
  width: 27px;
  height: 27px;
  display: ${props => (props.visible ? 'block' : 'none')};
`

var SpinnerTemplate = (props) =>
  (<Spinner src={SpinnerGif} height={props.height} dir={props.dir} visible={props.visible}/>);

const allTweets = require('../static/twitter_micro.json');

const allOptions = [
  {id:1, name:'al'},
  {id:3, name:'ali-ba'},
  {id:3, name:'ali-baba'},
  {id:4, name:'box'},
  {id:5, name:'fox in box'},
  {id:6, name:'earth'}
];

let simpleOptionTemplate = (props) => {
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
};

let TwitterTemplate = (props) => {
  var data = props.data;
  return (
    <DivItem selected={props.selected} className="rtex-option-item">
      <Avatar src={data.profile_image_url_https}/>
      <Details>
          <RealName>{data.name}&nbsp;</RealName>
          <ScreenName selected={props.selected}
                      className="rtex-screen-name">{"@"+data.screen_name}</ScreenName>
          <Description>{data.description}</Description>
      </Details>
      <Stats>
        <Stat>
          <StatLabel selected={props.selected}
                     className="rtex-stats-label">Tweets:&nbsp;</StatLabel>
          {data.statuses_count}&nbsp;
        </Stat>
        <Stat>
          <StatLabel selected={props.selected}
                     className="rtex-stats-label">Following:&nbsp;</StatLabel>
          {data.friends_count}&nbsp;
        </Stat>
        <Stat>
          <StatLabel selected={props.selected}
                     className="rtex-stats-label">Followers:&nbsp;</StatLabel>
          {data.followers_count}
        </Stat>
      </Stats>
    </DivItem>
  )
};

storiesOf('Presentation UI', module)
  .add('default view', () => (
      <Typeahead
        displayKey="name"
        options={[]}
        allData={allOptions}
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
        showLoading={false}
        allData={allOptions}
        optionTemplate={simpleOptionTemplate}
        options={[
          {id:1, name:'View #1'},
          {id:2, name:'View #2'},
          {id:3, name:'Super long View #3'}
        ]}/>
      )
    })
    .add('with options and loading view', () => {
        return (
          <TestWrapper
            options={[]}
            value={"ali-baba"}
            allData={allOptions}
            enableShowLoading={true}
            debounceRate={300}
            optionTemplate={simpleOptionTemplate}/>
        );
    })
    .add('rtl view', () => {
        return (
          <div dir="rtl">
          <TestWrapper
            options={[]}
            value={"ali-baba"}
            allData={allOptions}
            enableShowLoading={true}
            debounceRate={300}
            optionTemplate={simpleOptionTemplate}/>
          </div>
        );
    }).add('styled like twitter typeahead view', () => {
        var styles = require('./../static/tw_typeahead.css');

        return (
          <div className="TwitterStylePage">
          <TestWrapper
            options={[]}
            allData={allTweets}
            value={"micro"}
            enableShowLoading={true}
            debounceRate={300}
            optionTemplate={TwitterTemplate}
            loadingTemplate={SpinnerTemplate}/>
          </div>
        );
    });
