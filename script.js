const BASE_URL = 'https://strapi.kitek-pg.ru'
const API_URL = `${BASE_URL}/api/homyaks?populate=*`
const API_TOKEN = '11dd93b9a30d2029ed45380c06333a57d46089e36ea9e94da82e294eff8402fc281b97e9e6845fd6f5762b5299cb49e266a474fda956efd7ef80f9677d37586828cb478720173d6b0f51d499e298786bc931a6f4daa983773eddac1cbb1ada64a176964b56032327e2b3dec5433030e3239e06d059cffdda50337f66af2e9cab'

const cardsEl = document.querySelector('#cards')
const statusEl = document.querySelector('#status')

function createCard(item) {
    const { name, breed, color, weight_g, gender, birthday, photo } = item

    const formattedDate = birthday
        ? new Date(birthday).toLocaleDateString('ru-RU')
        : 'Дата не указана'

    return `
    <article class="card">
                    <img
                        class="card__image"
                        src="${BASE_URL}${photo.url}"
                        alt="${name}" />
                    <div class="card__body">
                        <h2 class="card__title">${name}</h2>
                        <p class="card__text">${color}</p>
                        <p class="card__text">${formattedDate}</p>
                        <p class="card__text">${weight_g} г.</p>
                        <div class="card__footer">
                            <span class="card__price">${breed}</span>
                            <span class="badge badge--no">${gender}</span>
                        </div>
                    </div>
                </article>
    `
}

async function loadCards() {
    try {
        statusEl.textContent = 'Загрузка...'

        // 1. Делаем запрос
        const response = await fetch(API_URL, {
            headers: {
                Authorization: `Bearer ${API_TOKEN}`,
            },
        })

        // 2. Проверяем статус вручную (fetch сам не бросает ошибку на 403/404/500)
        if (!response.ok) {
            throw new Error(`Ошибка запроса: ${response.status}`)
        }

        // 3. Читаем JSON
        const result = await response.json()

        // 4. Достаём массив записей
        const items = result.data

        if (items.length === 0) {
            statusEl.textContent = 'Записей пока нет'
            cardsEl.innerHTML = ''
            return
        }

        // 5. map: каждая запись -> строка HTML. join(''): склеиваем в одну строку
        cardsEl.innerHTML = items.map(createCard).join('')
        statusEl.textContent = ''
    } catch (error) {
        console.error(error)
        cardsEl.innerHTML = ''
        statusEl.textContent = `Не удалось загрузить данные: ${error.message}`
        statusEl.classList.add('status--error')
    }
}

loadCards()