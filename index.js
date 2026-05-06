// https://mongotest2026.vercel.app/api/foods
// https://mongotest2026.vercel.app/api/foods/SOME_ID
const categoryDish = "https://mongotest2026.vercel.app/api/foods/category/"
const regionDish = "https://mongotest2026.vercel.app/api/foods/region/"
const vegetarianDish = "https://mongotest2026.vercel.app/api/foods/filter/vegetarian"
const spicyDish = "https://mongotest2026.vercel.app/api/foods/filter/spicy"
let allFoods = [];
let filtered = [];
// let favorites = JSON.parse(localStorage.getItem('naija_favs') || '[]');
let activeModal = null;
let searchTerm = '';
let searchTimer = null;
// Do not query DOM nodes until DOM is ready — queries below use getElementById when needed
let faveFood = localStorage.getItem('faveFood') ? JSON.parse(localStorage.getItem('faveFood')) : [];
const updateFavCount = () => {
    const favCount = document.getElementById('favCount')
    if (favCount) {
        const stored = localStorage.getItem('faveFood')
        const favorites = stored ? JSON.parse(stored) : faveFood
        favCount.textContent = `${favorites.length}`
    }
}
const favBtn = () => {
    document.getElementById('removeFav').style.display = 'block'
    const searchInput = document.getElementById("searchInput")
    searchInput.style.display = 'none'
    try {
        const stored = localStorage.getItem('faveFood')
        const favorites = stored ? JSON.parse(stored) : []

        if (favorites.length === 0) {
            hideSpinner()
            const container = document.getElementById('allDishes')
            if (container) {
                container.innerHTML = '<p class="text-center text-gray-600 py-8">No favorites yet! Add some by clicking the heart icon.</p>'
            }
            return
        }

        // Fetch all foods and filter to only favorites
        fetch("https://mongotest2026.vercel.app/api/foods")
            .then(r => r.json())
            .then(d => {
                const allFoods = d.data
                const favoriteFoods = allFoods.filter(food => {
                    const foodId = food.id || food._id
                    return favorites.some(fav => fav.id === foodId)
                })
                document.getElementById("headerSec").textContent = ` Favorites meal`
                allDishes(favoriteFoods, true)
            })
            .catch(err => {
                console.error('Error fetching favorites:', err)
                hideSpinner()
            })
    } catch (error) {
        console.error('favBtn error:', error)
        hideSpinner()
    }
}
const removeFavBtn = () => {
    // Clear all favorites from localStorage
    faveFood = []
    localStorage.removeItem('faveFood')
    localStorage.setItem('faveFood', JSON.stringify([]))

    // Update the favorite count badge
    updateFavCount()

    // Show all foods again and hide the remove button
    showSpinner()
    nigerFood()

    // Hide search input and show it again
    const searchInput = document.getElementById("searchInput")
    searchInput.style.display = 'block'
    document.getElementById('removeFav').style.display = 'none'
}
const showSpinner = () => {
    document.getElementById('spinner').style.display = 'block'
}
const showModalSpinner = () => {
    const modalSpinner = document.getElementById('modalSpinner')
    if (modalSpinner) {
        modalSpinner.style.display = 'block'
    }
}

const hideSpinner = () => {
    document.getElementById('spinner').style.display = 'none'
}
const hideModalSpinner = () => {
    document.getElementById('modalSpinner').style.display = 'none'
}

const syncCardHeartState = (itemId, isFav) => {
    const card = document.querySelector(`[data-food-id="${CSS.escape(String(itemId))}"]`)
    if (!card) return

    const heartDivs = card.querySelectorAll('div[onclick*="addHeart"]')
    heartDivs.forEach(div => {
        div.style.display = isFav
            ? (div.innerHTML.includes('#f8312f') ? 'block' : 'none')
            : (div.innerHTML.includes('#f8312f') ? 'none' : 'block')
    })
}

const searchTrack = () => {
    showSpinner()
    clearTimeout(searchTimer)
    searchTimer = setTimeout(() => {
        const searchInput = document.getElementById('search')
        const container = document.getElementById('allDishes')
        if (!searchInput || !container) return

        searchTerm = searchInput.value.trim().toLowerCase()

        const cards = container.children
        let visibleCount = 0

        for (let i = 0; i < cards.length; i++) {
            const card = cards[i]
            const matches = !searchTerm || card.textContent.toLowerCase().includes(searchTerm)
            card.style.display = matches ? '' : 'none'
            if (matches) visibleCount++
        }

        const existingEmptyState = container.querySelector('.search-empty-state')
        if (existingEmptyState) {
            existingEmptyState.remove()
        }

        if (searchTerm && visibleCount === 0) {
            const emptyState = document.createElement('p')
            emptyState.className = 'search-empty-state text-center text-gray-600 py-8 w-full'
            emptyState.textContent = `No food matched "${searchInput.value.trim()}".`
            container.appendChild(emptyState)
        }
        hideSpinner()
    }, 1000)
}

const addHeartEl = document.getElementById('addHeart')
if (addHeartEl) {
    addHeartEl.style.display = 'none';
}



const foodImages = {
    "Jollof Rice": "https://res.cloudinary.com/dup6notir/image/upload/jollof-rice_qpgiyz.jpg",
    "Egusi Soup": "https://res.cloudinary.com/dup6notir/image/upload/v1777721044/Egusi-Soup_iajmc1.jpg",
    "Pounded Yam": "https://res.cloudinary.com/dup6notir/image/upload/v1777721192/DSC0194-pounded-yam_h9ft6i.jpg",
    "Suya": "https://res.cloudinary.com/dup6notir/image/upload/v1777721361/Suya-1024x1024.jpg_suijjq.webp",
    "Akara": "https://res.cloudinary.com/dup6notir/image/upload/v1777721437/Akara-1024x649_bmzwzq.jpg",
    "Moi Moi": "https://res.cloudinary.com/dup6notir/image/upload/v1777721461/IMG_4798-scaled_dnsbmf.jpg",
    "Efo Riro": "https://res.cloudinary.com/dup6notir/image/upload/v1777721495/20190728_121338_lcwyjg.jpg",
    "Fried Rice": "https://res.cloudinary.com/dup6notir/image/upload/v1777721533/20220904015448-veg-20fried-20rice_u10sqf.png",
    "Pepper Soup": "https://res.cloudinary.com/dup6notir/image/upload/v1777721573/Goat-Meat-Pepper-Soup-1_ivjo11.jpg",
    "Amala": "https://res.cloudinary.com/dup6notir/image/upload/v1777721611/0_LyDfZ6kSmoCgaovK_zekp03.jpg",
    "Boli (Roasted Plantain)": "https://res.cloudinary.com/dup6notir/image/upload/v1777721653/Roasted-baked-plantain-Recipe-w-avocado-7_fgbvlh.jpg",
    "Ofada Rice": "https://res.cloudinary.com/dup6notir/image/upload/v1777721689/Ofada-Rice_iswg00.jpg",
    "Edikang Ikong": "https://res.cloudinary.com/dup6notir/image/upload/v1777721733/Efo-Riro-Nigerian-Spinach-Stew-homepage-1_770x500_jzttpx.jpg",
    "Tuwo Shinkafa": "https://res.cloudinary.com/dup6notir/image/upload/v1777721803/tuwo-rice2-1024x681_yp6byr.jpg",
    "Puff Puff": "https://res.cloudinary.com/dup6notir/image/upload/v1777721830/puffpuff-nigerian_hll6db.jpg",
    "Oha Soup": "https://res.cloudinary.com/dup6notir/image/upload/v1777721861/hq720_ilue6z.jpg",
    "Chin Chin": "https://res.cloudinary.com/dup6notir/image/upload/v1777721897/Chin_Chin_2100x_sv2sl7.jpg",
    "Afang Soup": "https://res.cloudinary.com/dup6notir/image/upload/v1777721933/img_0794_hpop1y.jpg",
    "Nkwobi": "https://res.cloudinary.com/dup6notir/image/upload/v1777724136/hqdefault_x33zzb.jpg",
    "Ewa Agoyin": "https://res.cloudinary.com/dup6notir/image/upload/v1777721398/Nigerian-ewaagoyin-in-a-white-bowl_xiaro6.jpg",
    "Gizdodo": "https://res.cloudinary.com/dup6notir/image/upload/v1777722004/Gizdodo-5.jpg_nqybf2.webp",
    "Okro Soup": "https://res.cloudinary.com/dup6notir/image/upload/v1777724314/Add-a-heading-2022-02-24T123011.298-min_xao7tw.png",
    "Banga Soup": "https://res.cloudinary.com/dup6notir/image/upload/v1777722089/Banga-Soup_gg0tvw.jpg",
    "Masa": "https://res.cloudinary.com/dup6notir/image/upload/v1777722122/20221108-NigerianMasaMaureen-Celestine-2700-d06fd5ea0a9f4486af4bd555e5810aec_t2eyjf.jpg",
    "Abacha (African Salad)": "https://res.cloudinary.com/dup6notir/image/upload/v1777722159/hq720_y46izi.jpg",
    "Ofensala (White Soup)": "https://res.cloudinary.com/dup6notir/image/upload/v1777722176/PHOTO-2025-01-10-18-28-57-2-e1739135083724_w6bax9.jpg",
    "Dodo (Fried Plantain)": "https://res.cloudinary.com/dup6notir/image/upload/v1777722260/image_asfdqc.jpg",
    "Miyan Kuka": "https://res.cloudinary.com/dup6notir/image/upload/v1777722286/miyan-kuka-500x500_csj8a9.jpg",
    "Asaro (Yam Porridge)": "https://res.cloudinary.com/dup6notir/image/upload/v1777722303/Asaro-mashed-yam-porridge-1-5_o0wtdn.jpg",
    "Yamarita (Egg-coated Yam)": "https://res.cloudinary.com/dup6notir/image/upload/v1777722338/Yamarita-1-1_zhpze5.jpg",
    // ... one line per dish
}
const allDishes = (foodArray, showRemoveFav = false) => {
    hideSpinner()
    const container = document.getElementById('allDishes')
    const removeFav = document.getElementById('removeFav')
    removeFav.style.display = showRemoveFav ? 'block' : 'none'
    container.style.display = 'flex'
    let html = ''
    for (let i = 0; i < foodArray.length; i++) {
        const element = foodArray[i]
        // ensure we have the latest favorites from localStorage so UI restores after reload
        const stored = localStorage.getItem('faveFood')
        faveFood = stored ? JSON.parse(stored) : faveFood
        const itemId = element.id || element._id || element.name
        const isFav = faveFood.find(f => f.id === itemId)
        const outlineDisplay = isFav ? 'none' : 'block'
        const filledDisplay = isFav ? 'block' : 'none'
        let imgPath = foodImages[element.name] || `https://placehold.co/350x200/e8a020/white?text=${encodeURIComponent(element.name)}`        // Fallback to placeholder image if local image doesn't exist
        // let fallbackImage = `${element.id}`;

        let ingredients = "";
        for (let j = 0; j < element.ingredients.length; j++) {
            ingredients += `<li>${element.ingredients[j]}</li>`;
        }
        const spicy = element.isSpicy === true ? '<span class="text-white sm:flex font-bold bg-[#dc3545] px-4 py-2 rounded-full">🌶️ Spicy</span>' : ''
        const vegetarian = element.isVegetarian === true ? '<span class="text-white sm:flex font-bold bg-[#198754] px-4 py-2 rounded-full">🥦 Vegetarian</span>' : ''

        html += `
        <div class="food-card-item my-2 flex h-full self-stretch items-stretch justify-center" data-food-id="${itemId}">
            <div class="food-card flex w-full max-w-[360px] flex-col bg-[#fbf3f2] my-2 border border-none rounded-md shadow-xl overflow-hidden transition delay-150 duration-300 ease-in-out hover:-translate-x-1 hover:scale-105">
                    <img src="${imgPath}" alt="${element.name}" class="food-card__image w-full object-cover rounded-t-md transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110">
                <div class="food-card__body flex flex-1 flex-col bg-[#fbf3f2] p-3 md:p-5">
                        <div class="flex items-start justify-between gap-3">
                            <h1 class="text-lg md:text-xl font-extrabold leading-tight">${element.name}</h1>
                            <div onclick="addHeart(${i}, this)" style="display:${outlineDisplay}"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 56 56"><path fill="currentColor" d="M4.727 20.64c0 9.985 8.367 19.805 21.562 28.243c.516.304 1.219.633 1.711.633s1.195-.328 1.688-.633c13.218-8.438 21.586-18.258 21.586-28.242c0-8.297-5.696-14.157-13.29-14.157c-4.359 0-7.875 2.063-9.984 5.227c-2.11-3.14-5.648-5.227-9.984-5.227c-7.594 0-13.29 5.86-13.29 14.157m3.773 0c0-6.234 4.031-10.382 9.469-10.382c4.406 0 6.914 2.742 8.437 5.086c.633.937 1.032 1.195 1.594 1.195s.914-.281 1.594-1.195c1.593-2.297 4.054-5.086 8.437-5.086c5.438 0 9.469 4.148 9.469 10.383c0 8.718-9.211 18.117-19.031 24.632c-.235.164-.375.282-.469.282s-.258-.117-.492-.282C17.71 38.758 8.5 29.36 8.5 20.641"/></svg></div>
                            <div onclick="addHeart(${i}, this)" style="display:${filledDisplay}"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 32 32"><g fill="none"><path fill="#f8312f" d="M6 6c4.665-2.332 8.5.5 10 2.5c1.5-2 5.335-4.832 10-2.5c6 3 4.5 10.5 0 15c-2.196 2.196-6.063 6.063-8.891 8.214a1.764 1.764 0 0 1-2.186-.041C12.33 27.08 8.165 23.165 6 21C1.5 16.5 0 9 6 6"/><path fill="#ca0b4a" d="M16 8.5v3.05c1.27-2.685 4.425-6.27 9.658-5.713c-4.51-2.03-8.195.712-9.658 2.663m-4.054-2.963C10.26 4.95 8.225 4.887 6 6C0 9 1.5 16.5 6 21c2.165 2.165 6.33 6.08 8.923 8.173a1.764 1.764 0 0 0 2.186.04q.381-.29.785-.618c-2.854-2.143-6.86-5.519-9.035-7.462c-4.957-4.431-6.61-11.815 0-14.769a9.7 9.7 0 0 1 3.087-.827"/><ellipse cx="23.477" cy="12.594" fill="#f37366" rx="2.836" ry="4.781" transform="rotate(30 23.477 12.594)"/></g></svg></div>
                        </div>

                        <div class="text-sm sm:text-base font-semibold">
                            <div class="flex flex-wrap gap-2"><h3>${element.category}</h3> <span aria-hidden="true">.</span> <span>${element.region}</span></div>
                        </div>
                        <hr class="text-[#888888] border-1 rounded-sm my-2">
                        <div class="flex flex-wrap gap-1 items-center my-1">
                            <p class="floating-one">${spicy}</p>
                            <p class="floating-one">${vegetarian}</p>
                        </div>
                        <div class="flex flex-wrap gap-2 items-center my-1">
                            <p class="floating-one flex bg-[#fadcd0] px-2 rounded-xl items-center font-semibold"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#000" fill-rule="evenodd" d="m12.6 11.503l3.891 3.891l-.848.849L11.4 12V6h1.2zM12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10s-4.477 10-10 10m0-1.2a8.8 8.8 0 1 0 0-17.6a8.8 8.8 0 0 0 0 17.6"/></svg>${element.preparationTime}</p>
                            <p class="floating-one bg-[#fadcd0] px-2 rounded-xl font-semibold">${element.calories} KCAL</p>
                        </div>
                        <hr class="text-[#888888] border-1 rounded-sm my-2">
                        <div class="food-card__description flex-1 overflow-y-auto px-1 py-2 my-2">
                            <p class="text-xs sm:text-sm leading-relaxed">${element.description}</p>
                        </div>

                        <button href="#" class="read-more-btn floating-btn2 mt-auto inline-flex items-center text-body hover:bg-neutral-tertiary-medium hover:text-heading font-medium leading-5 text-xs sm:text-sm px-4 py-2.5 focus:outline-none" data-index="${i}">
                            view details
                            <svg class="w-4 h-4 ms-1.5 rtl:rotate-180 -me-0.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 12H5m14 0-4 4m4-4-4-4"/></svg>
                        </button>
                    </div>
                </div>
        </div>
        `
    }
    if (!container) return
    container.innerHTML = html
    if (searchTerm) {
        searchTrack()
    }

    // expose a global helper so inline onclick handlers can add favorites
    window.addHeart = (idx, elem) => {
        try {
            const item = foodArray[idx]
            console.log('addHeart', item)

            // Get the parent container that holds both heart icons
            const parentDiv = elem.parentElement

            // Find both heart icon divs (siblings)
            const heartDivs = parentDiv.querySelectorAll('div[onclick*="addHeart"]')
            const favCount = document.getElementById("favCount")

            // Hide the clicked icon and show the other one
            heartDivs.forEach(div => {
                div.style.display = (div === elem) ? 'none' : 'block'
            })
            // Determine which icon is visible now
            const visible = Array.from(heartDivs).find(d => d.style.display !== 'none')
            const id = item.id || item._id || item.name

            // If the visible icon is the filled red heart, add to favorites; otherwise remove
            if (visible && visible.innerHTML.includes('#f8312f')) {
                if (!faveFood.find(f => f.id === id)) {
                    faveFood.push({ id, name: item.name })
                    localStorage.setItem('faveFood', JSON.stringify(faveFood))
                }
            } else {
                faveFood = faveFood.filter(f => f.id !== id)
                localStorage.setItem('faveFood', JSON.stringify(faveFood))
            }
            updateFavCount()
        } catch (err) {
            console.error('addHeart error', err)
        }
    }

    // Attach handlers to newly-created buttons so we can populate the modal from JS
    const readBtns = container.querySelectorAll('.read-more-btn')
    readBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (btn.dataset.loading === 'true') return

            btn.dataset.loading = 'true'
            btn.disabled = true
            const originalBtnHtml = btn.innerHTML
            btn.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#e8a020" d="M12 2A10 10 0 1 0 22 12A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8A8 8 0 0 1 12 20Z" opacity="0.5"/><path fill="#e8a020" d="M20 12h2A10 10 0 0 0 12 2V4A8 8 0 0 1 20 12Z"><animateTransform attributeName="transform" dur="1s" from="0 12 12" repeatCount="indefinite" to="360 12 12" type="rotate"/></path></svg>
                    Loading...
                `
            // const spicy = item.isSpicy === true ? '<span class="text-white font-bold bg-[#dc3545] px-4 py-2 rounded-full">🌶️ Spicy</span>' : ''
            // const vegetarian = item.isVegetarian === true ? '<span class="text-white font-bold bg-[#198754] px-4 py-2 rounded-full">🥦 Vegetarian</span>' : ''

            const idx = e.currentTarget.dataset.index
            setTimeout(() => {
                try {
                    const item = foodArray[idx]
                    activeModal = item
                    let imgModal = foodImages[item.name] || `https://placehold.co/350x200/e8a020/white?text=${encodeURIComponent(item.name)}`
                    const titleEl = document.getElementById('modalTitle')
                    const catReg = document.getElementById('catReg')
                    const bodyEl = document.getElementById('modalBody')
                    const spicy = item.isSpicy === true ? '<span class="text-white font-bold bg-[#dc3545] px-4 py-2 rounded-full">🌶️ Spicy</span>' : ''
                    const vegetarian = item.isVegetarian === true ? '<span class="text-white font-bold bg-[#198754] px-4 py-2 rounded-full">🥦 Vegetarian</span>' : ''
                    if (titleEl) titleEl.textContent = item.name
                    if (titleEl) {
                        titleEl.innerHTML = `
                        <h3 class="text-base sm:text-lg font-semibold text-heading" >
                        ${item.name}
                        </h3>
                        `
                    }
                    if (bodyEl) {
                        bodyEl.innerHTML = `
                                    <div class="flex flex-col gap-4 md:flex-row">
                                    <img src="${imgModal}" alt="${item.name}"  class="floating-btn2 w-full md:w-[300px] h-[220px] md:h-[350px] object-cover rounded-md md:rounded-t-md">
                                    <div class="flex flex-col flex-1 min-w-0">
                                        <h3 class="text-base sm:text-lg font-semibold text-heading">${item.category} . ${item.region}</h3>
                                        <div>
                                            <hr class="text-[#888888] border-1 rounded-sm my-2">
                                            <div class="flex gap-3 items-center my-4">
                                                <p>${spicy}</p>
                                                <p>${vegetarian}</p>
                                            </div>
                                            <div class="flex gap-3 items-center my-3">
                                                <p class="flex bg-[#fadcd0] px-2 rounded-xl items-center font-semibold"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#000" fill-rule="evenodd" d="m12.6 11.503l3.891 3.891l-.848.849L11.4 12V6h1.2zM12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10s-4.477 10-10 10m0-1.2a8.8 8.8 0 1 0 0-17.6a8.8 8.8 0 0 0 0 17.6"/></svg>${item.preparationTime}</p>
                                                <p class="bg-[#fadcd0] px-2 rounded-xl font-semibold">${item.calories} KCAL</p>
                                            </div>
                                            <hr class="text-[#888888] border-1 rounded-sm my-2">
                                        </div>
                                        <div
                                            <p class="leading-relaxed text-body text-sm sm:text-base"><strong>Description:</strong></p>
                                            <p class="leading-relaxed text-body text-sm sm:text-base">${item.description}</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="flex flexrow sm:flex sm:flex-wrap gap-2">
                                    <div class="">
                                        <p class="leading-relaxed text-body bg-[#bababa] px-3 py-1.5 rounded-t-xl text-xs sm:text-sm"><strong>Difficulty:</strong></p>
                                        <p class="bg-[#1a1208] text-[#e8a020] px-3 py-1.5 font-semibold rounded-b-xl text-xs sm:text-sm">${item.difficulty}</p>
                                    </div>
                                    <div class="">
                                        <p class="leading-relaxed text-body bg-[#bababa] px-3 py-1.5 rounded-t-xl text-xs sm:text-sm"><strong>Serving Size:</strong></p>
                                        <p class="bg-[#1a1208] text-[#e8a020] px-3 py-1.5 font-semibold rounded-b-xl text-xs sm:text-sm">${item.servingSize}</p>
                                    </div>
                                    <div class="">
                                        <p class="leading-relaxed text-body bg-[#bababa] px-3 py-1.5 rounded-t-xl text-xs sm:text-sm"><strong>price:</strong></p>
                                        <p class="bg-[#1a1208] text-[#e8a020] px-3 py-1.5 font-semibold rounded-b-xl text-xs sm:text-sm">${item.price}</p>
                                    </div>
                                    <div class="">
                                        <p class="leading-relaxed text-body bg-[#bababa] px-3 py-1.5 rounded-t-xl text-xs sm:text-sm"><strong>category:</strong></p>
                                        <p class="bg-[#1a1208] text-[#e8a020] px-3 py-1.5 font-semibold rounded-b-xl text-xs sm:text-sm">${item.category}</p>
                                    </div>
                                </div>
                                <div>
                                    <p class="leading-relaxed text-body text-sm sm:text-base"><strong>Ingredients:</strong></p>
                                    <ul class="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm sm:text-base">${item.ingredients.map(i => `<li>${i}</li>`).join('')}</ul>
                                </div>
                                `
                    }
                    const toggle = document.querySelector('[data-modal-toggle="default-modal"]')
                    if (toggle) toggle.click()
                } finally {
                    btn.innerHTML = originalBtnHtml
                    btn.disabled = false
                    btn.dataset.loading = 'false'
                }
            }, 3000);

            // Trigger the modal via an existing toggle button (first matching toggle)
        })
    })

    // Optional: attach the same behavior to view-details-btn
    const viewBtns = container.querySelectorAll('.view-details-btn')
    viewBtns.forEach(btn => btn.addEventListener('click', (e) => btn.click()))
}

// console.log(foodArray);
// console.log(imgPath);


const nigerFood = async () => {
    showSpinner()
    try {
        const api_Base = "https://mongotest2026.vercel.app/api/foods"
        const fetchData = await fetch(api_Base)
        const respond = await fetchData.json()
        const respondData = await respond.data
        console.log(respond);
        console.log(respondData);
        allDishes(respondData)
    } catch (error) {
        console.log(error);
    } finally {
        const container = document.getElementById('allDishes')
        if (container) container.style.display = 'flex'
    }

}

const dishCategory = document.getElementById("dishCategory")
const trackCategory = async () => {
    showSpinner()
    if (!dishCategory || dishCategory.value === '0') {
        nigerFood()
    } else {
        try {
            document.getElementById("headerSec").textContent = ` ${dishCategory.value}`
            let selectedCategory = dishCategory.value.toLowerCase();
            let meal = `${categoryDish}${encodeURIComponent(selectedCategory)}`
            const result = await fetch(meal)
            const food = await result.json()
            allDishes(food.data)
        } catch (error) {
            console.error(error);
        } finally {
            const container = document.getElementById('allDishes')
            if (container) container.style.display = 'flex'
        }
    }

}
const dishRegion = document.getElementById("dishRegion")
const trackRegion = async () => {
    showSpinner()
    if (!dishRegion || dishRegion.value === '0') {
        nigerFood()
    } else {
        try {
            document.getElementById("headerSec").textContent = ` ${dishRegion.value}`
            let selectedRegion = dishRegion.value.toLowerCase();
            let regionMeal = `${regionDish}${encodeURIComponent(selectedRegion)}`
            const regionResult = await fetch(regionMeal)
            const regionFood = await regionResult.json()
            allDishes(regionFood.data)
        } catch (error) {
            console.error(error);
        } finally {
            const container = document.getElementById('allDishes')
            if (container) container.style.display = 'flex'
        }
    }

}
// Run after DOM is ready so `#allDishes` and `#spinner` exist in the document
window.addEventListener('DOMContentLoaded', () => {
    updateFavCount()
    nigerFood()
    const home = document.getElementById('home')
    home.addEventListener('click', () => {
        setTimeout(() => {
            showSpinner()
            nigerFood()
            headerSec.textContent = `All Dishes`
        }, 2000);
        hideSpinner()
    })

    const searchInput = document.getElementById('search')
    if (searchInput) {
        searchInput.addEventListener('input', searchTrack)
        searchInput.addEventListener('keypress', searchTrack)
    }

    const spicyCheck = document.getElementById('spicyCheck')
    if (spicyCheck) {
        spicyCheck.addEventListener('change', async () => {
            showSpinner()
            try {
                if (spicyCheck.checked) {
                    document.getElementById('headerSec').textContent = ' Spicy meal'
                    const response = await fetch(spicyDish)
                    const data = await response.json()
                    allDishes(data.data)
                } else {
                    document.getElementById('headerSec').textContent = ' All meals'
                    nigerFood()
                }
            } catch (error) {
                console.error('spicyCheck error:', error)
                hideSpinner()
            }
        })
    }
    const vegCheck = document.getElementById('vegCheck')
    if (vegCheck) {
        vegCheck.addEventListener('change', async () => {
            showSpinner()
            try {
                if (vegCheck.checked) {
                    document.getElementById('headerSec').textContent = ' Spicy meal'
                    const response = await fetch(vegetarianDish)
                    const data = await response.json()
                    allDishes(data.data)
                } else {
                    document.getElementById('headerSec').textContent = ' All meals'
                    nigerFood()
                }
            } catch (error) {
                console.error('spicyCheck error:', error)
                hideSpinner()
            }
        })
    }
})

const addFavBtn = () => {
    if (!activeModal) return

    const id = activeModal.id || activeModal._id || activeModal.name
    const alreadyFav = faveFood.some(fav => fav.id === id)

    if (!alreadyFav) {
        faveFood.push({ id, name: activeModal.name })
        localStorage.setItem('faveFood', JSON.stringify(faveFood))
    }

    syncCardHeartState(id, true)
    updateFavCount()

    const modalToggle = document.querySelector('[data-modal-hide="default-modal"]')
    if (modalToggle) {
        modalToggle.click()
    }
}

const clearFilter = () => {
    const spicyCheck = document.getElementById('spicyCheck')
    const vegCheck = document.getElementById('vegCheck')
    const searchInput = document.getElementById('search')
    const searchForm = document.getElementById('searchInput')
    const removeFavBtnEl = document.getElementById('removeFav')
    const headerSec = document.getElementById('headerSec')

    if (dishCategory) dishCategory.value = 'All Categories'
    if (dishRegion) dishRegion.value = ''
    if (spicyCheck) spicyCheck.checked = false
    if (vegCheck) vegCheck.checked = false
    if (searchInput) searchInput.value = ''
    if (searchForm) searchForm.style.display = 'block'
    if (removeFavBtnEl) removeFavBtnEl.style.display = 'none'
    if (headerSec) headerSec.textContent = 'All Dishes'

    searchTerm = ''
    nigerFood()
}


fetch("https://mongotest2026.vercel.app/api/foods")
    .then(r => r.json())
    .then(d => console.log(d.data[0]))
