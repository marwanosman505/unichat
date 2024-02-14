import React, {useEffect, useState, useRef} from 'react';
import Compose from '../Compose';
import Toolbar from '../Toolbar';
import ToolbarButton from '../ToolbarButton';
import Message from '../Message';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';


import './MessageList.css';
import EventMessage from '../EventMessage';

const MY_USER_ID = 'user';

export default function MessageList(props) {
  const [messages, setMessages] = useState([])
  const messagesEndRef = useRef(null);
  var tempMessages;


  useEffect(() => {
    getMessages();
  },[])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  


  const handleNewMessage = (msg) => {
    setMessages((currentMessages) => [
      ...currentMessages,
      msg.type === "message" ? {
        id: uuidv4(),
        author: msg.id,
        message: msg.text,
        timestamp: new Date().getTime(),
      } : {
        // For event messages, store the entire event object
        id: uuidv4(),
        type: "event",
        event: msg.event,
        timestamp: new Date().getTime(),
      }
    ]);
  };
  
  

  const getMessages = () => {
     var tempMessages = [
        {
          id: 1,
          author: 'ai',
          message: 'ask me anything',
          timestamp: new Date().getTime()
        }
      ]
      setMessages([...messages, ...tempMessages])
  }
  
  const renderMessages = () => {
    let i = 0;
    let tempMessages = [];
  
    while (i < messages.length) {
      let previous = messages[i - 1];
      let current = messages[i];
      let next = messages[i + 1];
      let isMine = current.author === MY_USER_ID;
      let currentMoment = moment(current.timestamp);
      let prevBySameAuthor = false;
      let nextBySameAuthor = false;
      let startsSequence = true;
      let endsSequence = true;
      let showTimestamp = true;
  
      if (previous) {
        let previousMoment = moment(previous.timestamp);
        let previousDuration = moment.duration(currentMoment.diff(previousMoment));
        prevBySameAuthor = previous.author === current.author;
        
        if (prevBySameAuthor && previousDuration.as('hours') < 1) {
          startsSequence = false;
        }
  
        if (previousDuration.as('hours') < 1) {
          showTimestamp = false;
        }
      }
  
      if (next) {
        let nextMoment = moment(next.timestamp);
        let nextDuration = moment.duration(nextMoment.diff(currentMoment));
        nextBySameAuthor = next.author === current.author;
  
        if (nextBySameAuthor && nextDuration.as('hours') < 1) {
          endsSequence = false;
        }
      }
  
      if (current.type === "event") {
        // Render EventMessage for event type messages
        tempMessages.push(
          <EventMessage
            key={i}
            event={current.event}
            isMine={isMine} // Adjust based on your needs
            startsSequence={startsSequence}
            endsSequence={endsSequence}
            showTimestamp={showTimestamp}
          />
        );
      } else {
        // Render regular Message component for non-event messages
        tempMessages.push(
          <Message
            key={i}
            isMine={isMine}
            startsSequence={startsSequence}
            endsSequence={endsSequence}
            showTimestamp={showTimestamp}
            data={current}
          />
        );
      }
  
      // Proceed to the next message.
      i += 1;
    }
  
    return tempMessages;
  }
  
  

  const dummyEventData = {
    event: {
      title: "Community Tech Talk",
      time: "2024-10-05T14:00:00Z",
      tags: ["technology", "community", "talk"],
      location: "37.7749,-122.4194",
      picture: '1' // Ensure this image exists in your `./pictures/` directory
    },
    isMine: false,
    startsSequence: true,
    endsSequence: true,
    showTimestamp: true
  };
  
  const renderEventMessage = () => {
    return (
      <EventMessage
        event={dummyEventData.event}
        isMine={dummyEventData.isMine}
        startsSequence={dummyEventData.startsSequence}
        endsSequence={dummyEventData.endsSequence}
        showTimestamp={dummyEventData.showTimestamp}
      />
    );
  };

    return(
      <div className="message-list">
        <Toolbar
          title="UNICHAT"
          image="../../assets/UNICHAT_TRANSPARENT.png"
          rightItems={[
            <ToolbarButton key="info" icon="ion-ios-information-circle-outline" />,
            <ToolbarButton key="video" icon="ion-ios-videocam" />,
            <ToolbarButton key="phone" icon="ion-ios-call" />
          ]}
        />

        <div className="message-list-container">
          {renderMessages()}
          {/* Empty div for scrolling to the bottom */}
          <div ref={messagesEndRef} />
        </div>

        <Compose rightItems={[
          <ToolbarButton key="photo" icon="ion-ios-camera" />,
          <ToolbarButton key="image" icon="ion-ios-image" />,
          <ToolbarButton key="audio" icon="ion-ios-mic" />,
          <ToolbarButton key="money" icon="ion-ios-card" />,
          <ToolbarButton key="games" icon="ion-logo-game-controller-b" />,
          <ToolbarButton key="emoji" icon="ion-ios-happy" />
        ]} onSubmit={handleNewMessage}/>
      </div>
    );
}