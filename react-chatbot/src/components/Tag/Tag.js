import React from 'react';
import './Tag.css'; // Make sure to create a corresponding CSS file for styling

const Tag = ({ text }) => {
    return <div className="tag">{text}</div>;
};

export default Tag;
