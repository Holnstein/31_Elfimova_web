document.addEventListener('DOMContentLoaded', () =>{
    const apiContainer = document.getElementById('api-ageByName');
    if (!apiContainer) return;
    
    apiContainer.innerHTML = `
        <h1>Напиши имя и посмотри, насколько ты можешь быть старым! (Он инглиш, плиз)</h1>
        <div class="input-cont">
            <input type="text" id="NameInput" placeholder="Name">
            <button id="getInfo">Get age</button>
        </div>
        <div id="result"></div>
    `;

    const nameInput = document.getElementById('NameInput');
    const getInfoBtn = document.getElementById('getInfo');
    const resultDiv = document.getElementById('result');
    const ALLOWED_CHARS = /[^A-Za-z\s]$/;

    nameInput.addEventListener('input', (e) => {
        // 
        const value = e.target.value;

        if(ALLOWED_CHARS.test(value)){
            e.preventDefault();
            alert('Вводите на языке иностранном (латинице великорусской).');
            e.target.value = '';
            // return;
        }
    });

    async function getAge(name){
        const URL_API = `https://api.agify.io?name=${encodeURIComponent(name)}`;

        try{
            resultDiv.innerHTML = '<div class="loading">Your age is...</div>';
            const response = await fetch(URL_API);

            if(!response.ok){
                throw new Error(`Ошибочка: ${response.status}`)
            }

            return await response.json();
        }
        catch (error)
        {
            resultDiv.innerHTML = `<div class ="error">Ошибка: ${error.message}</div>`;
            return null;
        }
    }

    getInfoBtn.addEventListener('click', async () => {
        const name = nameInput.value.trim();

        if(!name){
            resultDiv.innerHTML = `<div class="error">Enter your name</div>`;
            return null;
        }

        const ageData = await getAge(name);

        if(ageData) {
            resultDiv.innerHTML = `
                <p>Name: ${ageData.name}</p>
                <p>Age: ${ageData.age ?? 'unknown'}</p>
                <p>Count: ${ageData.count}</p>
            `;
        }
    });

    nameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') getInfoBtn.click();
    });
});