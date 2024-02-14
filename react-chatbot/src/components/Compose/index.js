import {React, useState} from 'react';
import './Compose.css';

export default function Compose({ rightItems, onSubmit }) {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e) => {
      setInputValue(e.target.value);
  };

  // const handleKeyPress = (e) => {
  //     if (e.key === 'Enter' && inputValue.trim()) {
  //         onSubmit(inputValue);
  //         setInputValue(''); // Clear the input after sending
  //         e.preventDefault(); // Prevent the default form submission behavior
  //     }
  // };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      onSubmit({type: "message", id:"user", text: inputValue})
      // Prepare the data to send
      const dataToSend = { query: inputValue };
      fetch('http://127.0.0.1:5000/invoke', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
        if (data.response === "found") {
          onSubmit({type: "event", event: data.event}); // Use a type field to distinguish messages and events
        } else {
          onSubmit({type: "message", id: "ai", text: data.response});
        }
        setInputValue(''); // Clear the input after sending
      })
      .catch((error) => {
        console.error('Error:', error);
        setInputValue(''); // Optionally clear input on error too
      });
  
      e.preventDefault(); // Prevent the default form submission behavior
    }
  };



// const handleKeyPress = (e) => {
//   if (e.key === 'Enter' && inputValue.trim()) {
//     onSubmit({id: "user",text: inputValue}); 
   
//     const dataToSend = { query: inputValue };
//     fetch('http://127.0.0.1:5000/invoke', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(dataToSend),
//     })
//     .then(response => response.json())
//     .then(data => {
//       console.log('Success:', data);
//       if (data.response == "found") {
//         onSubmit({id:"event", event:data.event})
//       } else {
//         onSubmit({id: "ai",text: data.response}); 

//       }

//     })
//     .catch((error) => {
//       console.error('Error:', error);
//     });

//     setInputValue('');
//     e.preventDefault();
//   }
// };

    return (
      <div className="compose">
        <input
          type="text"
          className="compose-input"
          placeholder="Type a message, @name"
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
        />

        {
          rightItems
        }
      </div>
    );
}