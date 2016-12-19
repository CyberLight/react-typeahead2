import styled from 'styled-components';

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

export default UlContainer;
