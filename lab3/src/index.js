function getRandomInt(maxWords) {
    return Math.floor(Math.random()*(maxWords));
}

function isWordValid(word) {
    if(/^[а-яё]+$/i.test(word) === true || word === "chill"){
        return true;
    }
    // return [...word].every(letter => alphabet_ru.includes(letter));
}

function updateUsedLetters(word) {
    let wordAndRightLetter = "";

    for (let i = 0; i < word.length; i++) {
        if (!userUsedLetter.includes(word[i])) {
            userUsedLetter += word[i];
        }
        
        if(word[i] === randomWord[i]){
            wordAndRightLetter += `✅`;
            // wordAndRightLetter += `Буква ${word[i].toUpperCase()} угадана. Она на ${i+1} месте.\n`;
        }
        else if(randomWord.includes(word[i])){
            wordAndRightLetter += `🟨`;
            // wordAndRightLetter = `Буква ${word[i].toUpperCase()} есть, но не туточки. Пробуй еще.\n`;
        }
        else{
            wordAndRightLetter += `🟥`;
        }
    }
    word = word.charAt(0).toUpperCase() + word.slice(1);
    wordAndRightLetter = `${word}.${wordAndRightLetter}`;
    return wordAndRightLetter;
}


const wordGuess = ["смола", "капот", "стена", "ласка", "порка", "курок", "chill", "шляпа", "дверь", "дрель", "брань", "кража", "сталь", "цинга", "сачок", "удача", ];

// let alphabet_ru = "абвгдеёжзийклмнопрстуфхцчшщъыьэюя";
let userUsedLetter = "";
var randomWord = wordGuess[getRandomInt(wordGuess.length)];

let wordsAndRightLetter = [];
console.log("Загаданное слово: " + randomWord);
console.log("Приветики");


var maxAttemptToGuess = 7;
var countAttempts = 0;

let word;

async function checkWord() {
    strReload = "Игра завершена! Хотите начать новую игру? Нажмите ОК для перезагрузки, или Отмена, чтобы остаться.";
    while (countAttempts < maxAttemptToGuess) {
        word = prompt("Угадайте слово из 5 букв:")?.trim().toLowerCase();

        if (!word) {
            alert("Вы не ввели слово!");
            continue;
        }
        
        if(word.length !== 5 || !isWordValid(word)){
            alert("Введите слово из 5 букв. Ну, и только буковки русского алфавита");
            continue;
        }        

        const checkWordExist = await checkWordAPI(word);
        console.log("Check Word Exist:", checkWordExist);

        if(!checkWordExist){
            alert("//Норм слово напишите//");
            continue;
        }

        alert("Фух, хотя бы слово норм написали. Давайте посмотрим, угадали ли Вы...");
        countAttempts++;
        
        if (word === randomWord) {
            attemptStr = countAttempts === 1 ? "попытку" : (countAttempts > 1 && countAttempts <= 4) ? "попытки" : "попыток";
            
            if(word === "chill"){   //лучший способ, чтобы потыкаться до нажатия кнопки в логах console
                playChillGuy("Вот это фича! Можете почиллить. 💥💣🚀", true);
                return;
            }
            else{
                alert(`🎉 Поздравляем! Вы угадали слово "${word}" за ${countAttempts} ${attemptStr}!`);
                const reloadGame = confirm(strReload);
                if (reloadGame) {
                    location.reload(); // Перезагружает страницу
                }
                return;
            }
            
        } else{
            wordsAndRightLetter.push(updateUsedLetters(word));
            let sortedUserUsedLetter = [...userUsedLetter].sort();
            alert(`❌ Неверно! Осталось попыток: ${maxAttemptToGuess - countAttempts}\nВаши предыдущие слова:\n${wordsAndRightLetter.join("\n")}` +
                `\nИспользованные буквы: ${sortedUserUsedLetter.join(' ')}`);
        }

    }
    if(randomWord !== "chill"){
        alert(`Вы проигралиㅜㅜㅜ Загаданное слово было: "${randomWord}"`);
        const reloadGame = confirm(strReload);
        if (reloadGame) {
            location.reload(); // Перезагружает страницу
        }
    }
}

// не стоит открывать в сети muctr и тд без vpn, если хотите проверочку на слово

async function checkWordAPI(word) {
    const apiKey = "LYKdPvanryooYqgB";
    const url = `https://api.textgears.com/spelling?text=${encodeURIComponent(word)}&language=ru-RU&whitelist=chill&key=${apiKey}`;  

    try {
        const response = await fetchWithTimeout(url, {}, 1000);     // свой тайм-аут, если апишка не воркает
        if (!response.ok) {
            console.error("Ошибка сети или сервера:", response.statusText);
            return true;
        }

        const data = await response.json();

        console.log("API Response:", data);

        if (data.status && data.response) {
            const hasSpellingError = data.response.errors.some(error => 
                error.description?.en === "Возможно найдена орфографическая ошибка."
            );
            console.log("Has Spelling Error:", hasSpellingError);
            return !hasSpellingError;
        } 
        else {
            console.error("Ошибка API:", data.description);
            return true;
        }
        //     if (hasSpellingError) {
        //         alert("Напишите норм слово..");
        //     } else {
        //         alert("Есть такое.");
        //     }
        // } else {
        //     alert("Ошибка проверки.");
        // }
    } catch (error) {
        console.error("Ошибка при запросе к API:", error);
        return true;
    }
}    

// Функция для выполнения fetch с таймаутом
async function fetchWithTimeout(url, options = {}, timeout = 5000) {
    // Создаем промис, который завершится с ошибкой после таймаута
    const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
            reject(new Error("Request timed out"));
        }, timeout);
    });

    // Выполняем fetch и соревнуемся с таймаутом
    return Promise.race([fetch(url, options), timeoutPromise]);
}

function playChillGuy(message, playSound = false) {
    if (playSound) {
        let audio = document.getElementById("chillAlert");
        audio.currentTime = 0; // Сброс перед воспроизведением
        audio.play().catch(error => console.log("Ошибка воспроизведения:", error));
    }

    let modal = document.getElementById("modal");
    let modalMessage = document.getElementById("modalMessage");

    modalMessage.innerText = message;  // Устанавливаем сообщение
    modal.style.display = "block"; 
    setVolume();
    document.getElementById("volumeSlider").addEventListener("input", setVolume);
}

function closeModal() {
    let modal = document.getElementById("modal");
    modal.style.display = "none";  // Скрываем модальное окно
}

// Запуск при нажатии на кнопку
document.getElementById('checkButton').addEventListener('click', checkWord);


function setVolume() {
    let volumeSlider = document.getElementById("volumeSlider");
    let volumeValue = document.getElementById("volumeValue");
    let audio = document.getElementById("chillAlert");

    // Устанавливаем громкость
    audio.volume = volumeSlider.value;
    
    // Обновляем отображение текущей громкости
    volumeValue.innerText = `Громкость: ${Math.round(volumeSlider.value * 100)}%`;
}