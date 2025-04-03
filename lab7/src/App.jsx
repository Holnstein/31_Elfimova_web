import { useState } from 'react';
import ApiNav from './components/ApiNav/ApiNav';
import AgeByName from './components/AgeByNameApi/AgeByNameApi';
import JsonPlaceholder from './components/JsonPlaceholderApi/JsonPlaceholderApi';
import Cats from './components/CatsApi/CatsApi';
// import './styles/reset.css';
// import './styles/global.css';
// import './styles/api.css';

function App() {
    const [activeApi, setActiveApi] = useState('ageByName');

    return (
        <div className="app">
            <ApiNav activeApi={activeApi} setActiveApi={setActiveApi} />

            {activeApi === 'ageByName' && <AgeByName />}
            {activeApi === 'JSONPlaceholder' && <JsonPlaceholder />}
            {activeApi === 'cats' && <Cats />}
        </div>
    );
}

export default App