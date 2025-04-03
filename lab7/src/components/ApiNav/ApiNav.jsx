import './ApiNav.css';

const ApiNav = ({ activeApi, setActiveApi }) => {
    return (
        <nav className="api-nav">
            <button
                className={`api-nav-button ${activeApi === 'ageByName' ? 'active' : ''}`}
                onClick={() => setActiveApi('ageByName')}
            >
                ageByName
            </button>
            <button
                className={`api-nav-button ${activeApi === 'JSONPlaceholder' ? 'active' : ''}`}
                onClick={() => setActiveApi('JSONPlaceholder')}
            >
                JSONPlaceholder
            </button>
            <button
                className={`api-nav-button ${activeApi === 'cats' ? 'active' : ''}`}
                onClick={() => setActiveApi('cats')}
            >
                cats
            </button>
        </nav>
    );
};

export default ApiNav;