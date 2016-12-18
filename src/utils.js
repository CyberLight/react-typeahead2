import ReactDOM from 'react-dom';

function getDirection(element){
    var result = null;
    if (element){
        if (window.getComputedStyle){
            var elem = ReactDOM.findDOMNode(element);
            result = window.getComputedStyle(elem,null).direction;
        } else if (element.currentStyle){
            result = element.currentStyle.direction;
        }
    }

    return result;
}

export {getDirection}
