document.addEventListener('DOMContentLoaded', () => {
    const apiContainer = document.getElementById('api-JSONPlaceholder');
    if (!apiContainer) return;
    const BASE_URL = 'https://jsonplaceholder.typicode.com/posts';
    
    apiContainer.innerHTML = `
        <h1>JSONPlaceholder API (фейк)</h1>
        
        <div class="api-controls">
            <button id="getPosts">Get All Posts</button>
            <input type="number" id="postId" placeholder="Post ID">
            <button id="getPost">Get Post</button>
        </div>
        
        <div class="post-form">
            <h3>Создай или измени постик</h3> 

            <div class="form-group">
                <input type="number" id="formId" placeholder="ID">
            </div>

            <div class="form-group">
                <input type="text" id="formTitle" placeholder="Title">
            </div>

            <div class="form-group">
                <textarea id="formBody" placeholder="Body"></textarea>
            </div>

            <div class="form-group">
                <input type="number" id="formUserId" placeholder="User ID" value="1">
            </div>
            
            <div class="form-actions">
                <button id="createPost">Create (POST)</button>
                <button id="updatePost">Update (PUT)</button>
                <button id="patchPost">Patch (PATCH)</button>
                <button id="deletePost">Delete</button>
            </div>
        </div>
        
        <div class="result-container">
            <h3 id="resultsHeader">Результаты</h3>
            <div id="apiTableContainer">
                <table id="apiTable">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>User ID</th>
                            <th>Title</th>
                            <th>Body</th>
                        </tr>
                    </thead>
                    <tbody id="apiTableBody"></tbody>
                </table>
            </div>
        </div>
    `;

    const tableBody = document.getElementById('apiTableBody');
    const getPostsBtn = document.getElementById('getPosts');
    const getPostBtn = document.getElementById('getPost');
    const createPostBtn = document.getElementById('createPost');
    const updatePostBtn = document.getElementById('updatePost');
    const patchPostBtn = document.getElementById('patchPost');
    const deletePostBtn = document.getElementById('deletePost');

    const resultsHeader = document.getElementById('resultsHeader');
    
    getPostsBtn.addEventListener('click', () => {
        // resultsHeader.textContent = 'Results';
        fetchData(BASE_URL);
    });

    getPostBtn.addEventListener('click', async() => {
        const id = document.getElementById('postId').value;
        if(id <= 0 || !Number.isInteger(Number(id))){
            alert('ID должен быть положительным целым числом');
            throw new Error('Invalid ID');
        }
        if (!await checkPostExists(id)) return;
        if (!id) return alert('Please enter Post ID');
        fetchData(`${BASE_URL}/${id}`);
    });

    createPostBtn.addEventListener('click', () => {
        const post = getFormData();
        if (!post.title || !post.body) return alert('Необходимы Title и Body.');
        resultsHeader.textContent = 'Новый пост создан';
        fetchData(BASE_URL, {
            method: 'POST',
            body: JSON.stringify(post),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        });
    });

    updatePostBtn.addEventListener('click', async () => {
        const post = getFormData();
        if (!post.id) return alert('Необходим ID');

        if (!await checkPostExists(post.id)) return;
        
        resultsHeader.textContent = `Обновляем пост #${post.id}...`;
        fetchData(`${BASE_URL}/${post.id}`, {
            method: 'PUT',
            body: JSON.stringify(post),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        });
    });

    patchPostBtn.addEventListener('click', async () => {
        const post = getFormData();
        if (!post.id) return alert('ID is required for update');

        if (!await checkPostExists(post.id)) return;
        resultsHeader.textContent = `Частично обновляем пост #${post.id}...`;
        Object.keys(post).forEach(key => {
            if (post[key] === '' || post[key] === null) delete post[key];
        });
        
        fetchData(`${BASE_URL}/${post.id}`, {
            method: 'PATCH',
            body: JSON.stringify(post),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        });
    });

    deletePostBtn.addEventListener('click', async () => {
        const id = document.getElementById('formId').value;
        if (!id) return alert('Please enter ID to delete');
        
        if (!await checkPostExists(id)) return;

        if (confirm('Ты не уверен в себе? На тебя написали донос?')) {
            resultsHeader.textContent = `Пост #${id} удален`;
            resultsHeader.textContent = 'Вы удалили данный пост';
            fetchData(`${BASE_URL}/${id}`, {
                method: 'DELETE',
            });
        }
    });

    async function checkPostExists(postId) {
        try {
            const response = await fetch(`${BASE_URL}/${postId}`);
            if (!response.ok) {
                resultsHeader.textContent = `Пост #${postId} не найден`;
                tableBody.innerHTML = '';
                return false;
            }
            return true;
        } catch (error) {
            resultsHeader.textContent = 'Ошибка проверки поста';
            return false;
        }
    }

    function getFormData() {
        const id = document.getElementById('formId').value;
        const userId = document.getElementById('formUserId').value;

        if (id && parseInt(id) <= 0 || !Number.isInteger(Number(id))) {
            alert('ID должен быть положительным целым числом');
            throw new Error('Invalid ID');
        }
        
        // Валидация User ID
        if (parseInt(userId) <= 0 || !Number.isInteger(Number(userId))) {
            alert('User ID должен быть положительным целым числом');
            throw new Error('Invalid User ID');
        }

        return {
            id: id || null,
            title: document.getElementById('formTitle').value,
            body: document.getElementById('formBody').value,
            userId: userId || 1
        };
    }

    async function fetchData(url, options) {
        try {
            tableBody.textContent = '///Loading///';
            const response = await fetch(url, options);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            // Для вывода удаленного id после DELETE
            const data = options?.method === 'DELETE' 
                ? { status: 'Deleted', id: url.split('/').pop() }
                : await response.json();
            

            renderTable(data);
            
            // Если это GET запрос, заполняем форму данными
            if (!options && data.id) {
                document.getElementById('formId').value = data.id;
                document.getElementById('formTitle').value = data.title;
                document.getElementById('formBody').value = data.body;
                document.getElementById('formUserId').value = data.userId;
            }
        } catch (error) {
            tableBody.innerHTML = `<tr><td colspan="4">Error: ${error.message}</td></tr>`;
            resultsHeader.textContent = 'Ошибка выполнения запроса';
        }
    }

    function renderTable(data) {
        tableBody.innerHTML = '';
        
        // Если данные - массив
        if (Array.isArray(data)) {
            data.forEach(post => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${post.id}</td>
                    <td>${post.userId}</td>
                    <td>${post.title}</td>
                    <td>${post.body}</td>
                `;
                tableBody.appendChild(row);
            });
        } 
        // Если данные - одиночный объект
        else if (typeof data === 'object' && data !== null) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${data.id || '-'}</td>
                <td>${data.userId || '-'}</td>
                <td>${data.title || '-'}</td>
                <td>${data.body || data.status || '-'}</td>
            `;
            tableBody.appendChild(row);
        }
    }
});