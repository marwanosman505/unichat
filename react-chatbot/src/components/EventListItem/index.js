import React, {useEffect} from 'react';
import shave from 'shave';
import moment from 'moment';

import './EventListItem.css';
import Tag from '../Tag/Tag';

export default function EventListItem(props) {
  useEffect(() => {
    shave('.event-snippet', 20);
  })
  console.log("-------------------------------------------------")
  console.log(props)

    const {
        event,
        isMine,
        startsSequence,
        endsSequence,
        showTimestamp
    } = props.data;

    const { title, time, tags, location, picture } = props.data;
    const friendlyTimestamp = moment(time).format('LLLL');

    const images = require.context('../../assets/events/128px', true);

    const imagePath = images(`./${picture}.jpg`);
    return (
      <div className="event-list-item">
        <img className="event-photo" src={imagePath} alt="Event" />
        <div className="event-info">
          <h1 className="event-title">{ title }</h1>
          <div className="event-tags">
                    {tags.map((tag, index) => (
                        <Tag key={index} text={tag} />
                    ))}
                </div>
        </div>
      </div>
    );
}