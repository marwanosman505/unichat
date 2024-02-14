import React from 'react';
import moment from 'moment';
import '../Message/Message.css'; // Assuming existing CSS is suitable for this component as well
import './EventMessage.css'; 
import Tag from '../Tag/Tag';


export default function EventMessage(props) {
    const {
      event,
      isMine,
      startsSequence,
      endsSequence,
      showTimestamp
    } = props;

    const { title, time, tags, location, picture } = event;
    const friendlyTimestamp = moment(time).format('LLLL');

    const images = require.context('../../assets/events/128px', true);

    const imagePath = images(`./${picture}.jpg`);

    // alert(picture)

    return (
      <div className={[
        'message', 
        `${isMine ? 'mine' : ''}`, 
        `${startsSequence ? 'start' : ''}`, 
        `${endsSequence ? 'end' : ''}`
      ].join(' ')}>
        {showTimestamp && <div className="timestamp">{friendlyTimestamp}</div>}
        <div className="event-message">
          <div className="bubble-container">
            <div className="bubble" title={friendlyTimestamp}>
              <div className="event-details">
                <strong className="event-title">{title}</strong>
                <div className="event-time">{moment(time).format('dddd, MMMM Do YYYY, h:mm:ss a')}</div>
                <div className="event-tags">
                  {tags.map((tag, index) => <Tag key={index} text={tag} />)}
                </div>
                <div className="event-location"><em>Location:</em> {location}</div>
                {imagePath && <img src={imagePath} alt={title} className="event-image" />}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}
