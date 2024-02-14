import logo from './logo.svg';
import './App.css';
import Message from './components/Message'
import MessageList from './components/MessageList';
import ConversationList from './components/ConversationList';
import Messenger from './components/Messenger';

function App() {
  return (
    <div className="App">
      <Messenger/>
    </div>
    
  );
}

export default App;
