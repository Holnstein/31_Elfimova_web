import { useState } from 'react';
import './JsonPlaceholderApi.css';

const JsonPlaceholder = () => {
    const BASE_URL = 'https://jsonplaceholder.typicode.com/posts';
    const [posts, setPosts] = useState([]);
    const [currentPost, setCurrentPost] = useState({
        id: '',
        title: '',
        body: '',
        userId: '1'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [action, setAction] = useState('');

    const fetchPosts = async () => {
        setAction('GET All');
        setLoading(true);
        try {
            const response = await fetch(BASE_URL);
            if (!response.ok) setError(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            setPosts(data);
        } catch {
            setAction("Ошибка выполнения запроса");
        } finally {
            setLoading(false);
        }
    };

    // Получение конкретного поста
    const fetchPost = async (id) => {
        if (!id) return alert('Введите ID поста');
        setAction(`GET #${id}`);
        setLoading(true);
        try {
            if (!await checkPostExists(id)) return;
            const response = await fetch(`${BASE_URL}/${id}`);
            // if (!response.ok) setError(`Пост #${id} не найден`);
            const data = await response.json();
            setPosts([data]);
            setCurrentPost({
                id: data.id.toString(),
                title: data.title,
                body: data.body,
                userId: data.userId.toString()
            });
        } catch {
            // setError(`Пост #${id} не найден`);
            setPosts([]);
        } finally {
            setLoading(false);
        }
    };

    // Создание поста
    const createPost = async () => {
        if (!currentPost.title || !currentPost.body) {
            return alert('Заполните title и body');
        }

        setAction('POST');
        setLoading(true);
        try {
            const response = await fetch(BASE_URL, {
                method: 'POST',
                body: JSON.stringify({
                    title: currentPost.title,
                    body: currentPost.body,
                    userId: currentPost.userId
                }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
            });
            const data = await response.json();
            setPosts([data]);
            setCurrentPost({
                id: data.id.toString(),
                title: data.title,
                body: data.body,
                userId: data.userId.toString()
            });
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Полное обновление поста (PUT)
    const updatePost = async () => {
        if (!currentPost.id) return alert('Введите ID поста');
        setAction(`PUT #${currentPost.id}`);
        setLoading(true);
        try {
            if (!await checkPostExists(currentPost.id)) return;
            const response = await fetch(`${BASE_URL}/${currentPost.id}`, {
                method: 'PUT',
                body: JSON.stringify({
                    id: currentPost.id,
                    title: currentPost.title,
                    body: currentPost.body,
                    userId: currentPost.userId
                }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
            });
            const data = await response.json();
            setPosts([data]);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Частичное обновление (PATCH)
    const patchPost = async () => {
        if (!currentPost.id) return alert('Введите ID поста');
        setAction(`PATCH #${currentPost.id}`);
        setLoading(true);

        const patchData = {};
        if (currentPost.title) patchData.title = currentPost.title;
        if (currentPost.body) patchData.body = currentPost.body;
        if (currentPost.userId) patchData.userId = currentPost.userId;

        try {
            if (!await checkPostExists(currentPost.id)) return;
            const response = await fetch(`${BASE_URL}/${currentPost.id}`, {
                method: 'PATCH',
                body: JSON.stringify(patchData),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
            });
            // if (!response.ok) setError(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            setPosts([data]);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Удаление поста
    const deletePost = async () => {
        if (!currentPost.id) return alert('Введите ID поста');
        if (!window.confirm(`Удалить пост #${currentPost.id}?`)) return;

        setAction(`DELETE #${currentPost.id}`);
        setLoading(true);
        try {
            if (!await checkPostExists(currentPost.id)) return;
            await fetch(`${BASE_URL}/${currentPost.id}`, {
                method: 'DELETE',
            });
            setPosts([{
                id: currentPost.id,
                status: 'Deleted',
                title: '[Удален]',
                body: 'Этот пост был удален',
                userId: currentPost.userId
            }]);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const checkPostExists = async (postId) => {
        try {
            const response = await fetch(`${BASE_URL}/${postId}`);
            if (!response.ok) {
                setError(`Пост #${postId} не найден`);
                setPosts([]);
                return false;
            }
            setError(null);
            return true;
        } catch{
            setError('Сервер недоступен');
            return false;
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentPost(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="api-container bg-purple-400 p-5 rounded-lg shadow">
            <h1 className="text-4xl font-bold text-amber-200">JSONPlaceholder API (фейк)</h1>

            <div className="api-controls">
                <button className="hover:bg-blue-500" onClick={fetchPosts}>Get All Posts</button>
                <input
                    type="number"
                    name="PostID"
                    placeholder="Post ID"
                    value={currentPost.id}
                    onChange={(e) => setCurrentPost(prev => ({
                        ...prev,
                        id: e.target.value
                    }))}
                />
                <button className="hover:bg-blue-500" onClick={() => fetchPost(currentPost.id)}>Get Post</button>
            </div>

            <div className="post-form bg-amber-100 p-8 rounded-2xl">
                <h3 className="text-2xl">Создай или измени постик</h3>

                <div className="form-group">
                    <input
                        type="number"
                        name="id"
                        value={currentPost.id}
                        onChange={handleInputChange}
                        placeholder="ID поста"
                    />
                </div>

                <div className="form-group">
                    <input
                        type="text"
                        name="title"
                        value={currentPost.title}
                        onChange={handleInputChange}
                        placeholder="Титле"
                        required
                    />
                </div>

                <div className="form-group">
                    <textarea
                        name="body"
                        value={currentPost.body}
                        onChange={handleInputChange}
                        placeholder="Боди"
                        required
                    />
                </div>

                <div className="form-group">
                    <input
                        type="number"
                        name="userId"
                        value={currentPost.userId}
                        onChange={handleInputChange}
                        placeholder="User ID"
                        min="1"
                    />
                </div>

                <div className="form-actions">
                    <button className="bg-[#27ae60] hover:bg-[#219653]" onClick={createPost}>Create (POST)</button>
                    <button className="bg-[#f39c12] hover:bg-[#e67e22]" onClick={updatePost}>Update (PUT)</button>
                    <button className="bg-[#9b59b6] hover:bg-[#8e44ad]" onClick={patchPost}>Patch (PATCH)</button>
                    <button className="bg-[#e74c3c] hover:bg-[#c0392b]" onClick={deletePost}>Delete</button>
                </div>
            </div>

            <div className="status-info">
                {loading && <div className="loading">Loading... ({action})</div>}
                {error && <div className="error">Error: {error}</div>}
            </div>

            <div className="result-container">
                <h3 className="text-2xl">Результаты ({posts.length})</h3>
                <table>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>User ID</th>
                        <th>Title</th>
                        <th>Body</th>
                    </tr>
                    </thead>
                    <tbody>
                    {posts.map(post => (
                        <tr key={post.id}>
                            <td>{post.id}</td>
                            <td>{post.userId}</td>
                            <td>{post.title}</td>
                            <td>{post.body}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default JsonPlaceholder;