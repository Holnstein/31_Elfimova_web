import { useState } from 'react';
import './CatsApi.css';

const Cats = () => {
    const [statusCode, setStatusCode] = useState('');
    const [catImage, setCatImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const checkImageExists = async (url) => {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = url;
            setTimeout(() => resolve(false), 3000);
        });
    };

    const handleGetCat = async () => {
        if (!statusCode) {
            alert('Введи статусик, чтобы Паша Дуров был счастлив');
            return;
        }

        if (!/^\d+$/.test(statusCode) || statusCode < 100 || statusCode > 599) {
            alert('Код статуса должен быть трёхзначным числом от 100 до 599');
            return;
        }

        const imgUrl = `https://http.cat/${statusCode}.jpg`;
        setLoading(true);
        setError(null);

        try {
            const exists = await checkImageExists(imgUrl);
            if (!exists) {
                setError(`Котик для статуса ${statusCode} не найден 😿 (Ошибка 404)`);
                return;
            }
            setCatImage(imgUrl);
        } catch {
            setError('Ошибка загрузки изображения');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="api-container bg-green-300">
            <h1 className="text-4xl font-bold text text-blue-800">Китики</h1>

            <div className="input-status-code">
                <input
                    type="text"
                    value={statusCode}
                    id="kittie"
                    onChange={(e) => setStatusCode(e.target.value)}
                    placeholder="Введи код статуса"
                    onKeyPress={(e) => e.key === 'Enter' && handleGetCat()}
                />
                <button onClick={handleGetCat}>Get kittie</button>
            </div>

            <div id="catsResult">
                {loading && <div className="loading">Ищем котика...</div>}
                {error && <div className="error">{error}</div>}
                {catImage && !loading && (
                    <img
                        src={catImage}
                        alt={`HTTP Cat ${statusCode}`}
                        onError={() => setError('Ошибка загрузки изображения')}
                    />
                )}
            </div>
        </div>
    );
};

export default Cats;