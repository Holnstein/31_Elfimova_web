import { useState } from 'react';
import './AgeByNameApi.css';

const AgeByNameApi = () => {
    const [name, setName] = useState('');
    const [ageData, setAgeData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleNameChange = (e) => {
        const value = e.target.value;
        if (/[^A-Za-z\s]/.test(value)) {
            alert('Вводите на языке иностранном (латинице великорусской).');
            return;
        }
        setName(value);
    };

    const getAge = async () => {
        if (!name.trim()) {
            setError('Enter your name');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`https://api.agify.io?name=${encodeURIComponent(name)}`);
            if (!response.ok) throw new Error(`Ошибочка: ${response.status}`);
            const data = await response.json();
            setAgeData(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="api-container">
            <h1 className="text-4xl font-bold text-amber-200">Напиши имя и посмотри, насколько ты можешь быть старым! (Он инглиш, плиз)</h1>

            <div className="input-cont">
                <input
                    id="ageInput"
                    type="text"
                    value={name}
                    onChange={handleNameChange}
                    placeholder="Name"
                    onKeyPress={(e) => e.key === 'Enter' && getAge()}
                />
                <button onClick={getAge}>Get age</button>
            </div>

            <div id="result">
                {loading && <div className="loading">Your age is...</div>}
                {error && <div className="error">{error}</div>}
                {ageData && !loading && (
                    <div className="bg-white rounded-2xl p-3">
                        <p className="text-amber-500">Name: {ageData.name}</p>
                        <p className="text-blue-800">Age: {ageData.age ?? 'unknown'}</p>
                        <p className="text-rose-600">Count: {ageData.count}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AgeByNameApi;