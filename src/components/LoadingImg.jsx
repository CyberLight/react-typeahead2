import styled from 'styled-components';

const LoadingImg = styled.img`
  position: absolute;
  top: 1px;
  ${props => (props.dir === 'rtl' ? 'left: 0' : 'right: 0')};
  width: ${props => props.height}px;
  height: ${props => props.height}px;
  display: block;
`;

export default LoadingImg;
