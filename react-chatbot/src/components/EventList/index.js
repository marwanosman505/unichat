  import React, {useState, useEffect} from 'react';
  import EventListItem from '../EventListItem';
  import Toolbar from '../Toolbar';
  import ToolbarButton from '../ToolbarButton';
  import axios from 'axios';

  import './EventList.css';

  export default function EventList(props) {
    const [Events, setEvents] = useState([]);
    useEffect(() => {
      getEvents()
    },[])


  const getEvents = () => {
      axios.get('http://127.0.0.1:5000/getEvents').then(response => {
          console.log(response.data.response.results)
          let newEvents = response.data.response.results.map(result => {
            return result;
          });
          setEvents([...Events, ...newEvents])
      });
    }

      return (
        <div className="event-list">
          {/* <Toolbar
            title="Messenger"
            leftItems={[
              <ToolbarButton key="cog" icon="ion-ios-cog" />
            ]}
            rightItems={[
              <ToolbarButton key="add" icon="ion-ios-add-circle-outline" />
            ]}
          /> */}
          {
            Events.map(Event =>
              <EventListItem
                key={Event.id}
                data={Event}
              />
            )
          }
        </div>
      );
  }