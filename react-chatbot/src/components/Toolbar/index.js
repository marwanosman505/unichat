import React from 'react';
import './Toolbar.css';
import unichatLogo from '../../assets/UNICHAT/UNICHAT_TRANSPARENT.png';


export default function Toolbar(props) {
    const { title, leftItems, rightItems, image } = props;
    return (
      <div className="toolbar">
        <div className="left-items">{ leftItems }</div>
        <div className='toolbar-profile'>
          <img className='toolbar-logo' src={unichatLogo}/>
          <h1 className="toolbar-title">{ title }</h1>
          
        </div>
        <div className="right-items">{ rightItems }</div>
      </div>
    );
}