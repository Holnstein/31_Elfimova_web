document.addEventListener('DOMContentLoaded', () => {
    const apiContainer = document.getElementById('api-cats');

    apiContainer.innerHTML = `
        <h1>Китики</h1>
        <div class="input-status-code">
            <input type="text" id="statusCodeInput" placeholder="Введи код статуса">
            <button id="getCatBtn">Get kittie</button>
        </div>
        <div id="catsResult"></div>
    `;

    const statusCodeInput = document.getElementById('statusCodeInput');
    const getCatBtn = document.getElementById('getCatBtn');
    const resultDiv = document.getElementById('catsResult');

    async function checkImageExists(url) {
        try {
            const response = await fetch(url, { 
                method: 'HEAD',
                mode: 'no-cors'
            });
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = () => resolve(true);
                img.onerror = () => resolve(false);
                img.src = url;

                setTimeout(() => resolve(false), 3000);
            });
        } catch {
            return false;
        }
    }

    getCatBtn.addEventListener('click', async () => {
        const statusCode = statusCodeInput.value.trim();

        if(!statusCode){
            alert('Введи статусик, чтобы Паша Дуров был счастлив');
            return;
        }

        if (!/^\d+$/.test(statusCode) || (statusCode < 100 || statusCode > 599)) {
            alert('Код статуса должен быть трёхзначным числом от 100 до 599');
            return;
        }

        const imgUrl = `https://http.cat/${statusCode}.jpg`;

        resultDiv.innerHTML = '<div class="loading">Ищем котика...</div>';

        const exists = await checkImageExists(imgUrl);
        if (!exists) {
            alert(`Котик для статуса ${statusCode} не найден 😿 (Ошибка 404)`);
            return;
        }

        resultDiv.innerHTML = `
            <img src="${imgUrl}" 
                 alt="HTTP Cat ${statusCode}" 
                //  style="max-width: 100%; border-radius: 8px;"
                 onerror="this.onerror=null;this.parentElement.innerHTML='<p>Ошибка загрузки изображения</p>'">
        `;
    });

    // function displayImage(url, statusCode) {
    //     resultDiv.innerHTML = `
    //         <img src="${url}" 
    //             alt="HTTP Котик ${statusCode}" 
    //             onerror="this.parentElement.innerHTML = '<p style=color:red>Ошибка загрузки изображения</p>'">
    //         <p>Статус: ${statusCode}</p>
    //     `;
    // }

    statusCodeInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            getCatBtn.click();
        }
    });
});