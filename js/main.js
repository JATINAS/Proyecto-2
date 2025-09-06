let animeCounter = 0;
const animesLimit = 5;
const animesTagsLimit = 20;
let page = 1;
const size = 20;

//------------CARD TEMPLATE
const createAnimecard = (anime) => {
    //NUMBER OF ANIMES IN CAROUSEL
    const animesNum = document.querySelector(".totalIndicators");

    const indicatorBtn = document.createElement("button");
    indicatorBtn.setAttribute("type", "button");
    indicatorBtn.setAttribute("data-bs-target", "#carouselExampleCaptions");
    indicatorBtn.setAttribute("data-bs-slide-to", `${animeCounter}`);
    indicatorBtn.setAttribute("aria-label", `Slide ${animeCounter + 1}`);

    if (animeCounter === 0) {
        indicatorBtn.classList.add("active");
        indicatorBtn.setAttribute("aria-current", "true");
    }

    animesNum.appendChild(indicatorBtn);


    //LAYOUT OF ANIME CARDS
    const carouselMain = document.querySelector(".carousel-main");

    const card = document.createElement("div");
    card.classList.add("carousel-item","text-center", "carousel");
    if (animeCounter === 0) {
        card.classList.add("active");
    }

    const cardRow = document.createElement("div");
    cardRow.classList.add("row","justify-content-center");

    const cardColImg = document.createElement("div");
    cardColImg.classList.add("col-4");

    const img = document.createElement("img");
    img.classList.add("d-block", "car-img");
    img.src = anime.images.webp.image_url;
    //console.log(img.src);
    img.alt = anime.title;
    //console.log(anime.alt);

    const cardColText = document.createElement("div");
    cardColText.classList.add("col-4", "carousel-text");
    const text = document.createElement("a");
    text.classList.add("synopsis");
    text.textContent = anime.synopsis;


    //ADD THE TITLE
    const cardTitle = document.createElement("div");
    cardTitle.classList.add("carousel-caption", "d-none", "d-md-block", "title");
    const animeTitle = document.createElement("h5");
    animeTitle.textContent = anime.title.toUpperCase();
    cardTitle.appendChild(animeTitle);

    //TOGGLE SHOW SYNOPSIS
    text.addEventListener("click", () => {
        text.classList.toggle("showMore");
        cardTitle.classList.toggle("show");
    });



    //ADD THE DIVS TO MAIN
    cardColImg.appendChild(img);
    cardColText.appendChild(text);
    

    card.appendChild(cardRow);
    cardRow.appendChild(cardColImg);
    cardRow.appendChild(cardColText);
    card.appendChild(cardTitle);

    animeCounter++;
    return card;
}



//------------TAGS TEMPLATE
const createAnimeTag = (anime) => {
    const animeSection = document.createElement("section");
    animeSection.classList.add("anime-tag");

    const tagDiv = document.createElement("div");
    tagDiv.classList.add("description-tag");

    const tagImg = document.createElement("img");
    tagImg.classList.add("anime-cover");
    tagImg.src = anime.images.webp.image_url;
    tagImg.alt = anime.title;

    const animeTitle = document.createElement("h3");
    animeTitle.textContent = anime.title.toUpperCase();

    const animeGenres = document.createElement("p");
    //animeGenres.textContent = anime.genres;

    for(const genre of anime.genres) {
        animeGenres.textContent += genre.name + " ";
        //console.log(animeGenres);
    }




    //SCALE ANIME TAGS
    animeSection.addEventListener("mouseenter", () => {
        animeSection.classList.toggle("scaleSection");
        tagDiv.classList.toggle("showBackground");
        animeGenres.classList.toggle("showBackground");
    });

    animeSection.addEventListener("mouseleave", () => {
        animeSection.classList.toggle("scaleSection");
        tagDiv.classList.toggle("showBackground");
        animeGenres.classList.toggle("showBackground");
    });


    tagDiv.appendChild(animeTitle);
    tagDiv.appendChild(animeGenres);

    animeSection.appendChild(tagImg);
    animeSection.appendChild(tagDiv);    

    return animeSection;
}


//----------EXTRACT INFO WITH AXIOS

// INFO TO CAROUSEL
const loadAnimes = async () => {
    const animeGrid = document.getElementById("anime-grid");
    const carouselDiv = document.querySelector(".carousel-main");
    
    try {
        const response = await axios.get("https://api.jikan.moe/v4/anime", {params: {limit: animesLimit}});
        const animes = response.data.data;
        animeGrid.innerHTML = "";
        
        for(const anime of animes) {
            //const urlResponse = anime.url;
            //const imgResponse = anime.images.jpg.image_url;

            const animeCard = createAnimecard(anime);
            carouselDiv.appendChild(animeCard);
        }

    }
    catch (error) {
        console.log("Error de fetch: ", error);
    }
}


//INFO TO TAGS
const loadAnimesTags = async () => {
    const animeTags = document.querySelector(".anime-tags");

    try {
        const response = await axios.get("https://api.jikan.moe/v4/anime", {params: {limit: 20}});
        const animes = response.data.data;
        //console.log(animes);

        animeTags.innerHTML = "";

        for(const anime of animes) {
            
            //console.log(anime.genres.name);
            const animeTag = createAnimeTag(anime);
            animeTags.appendChild(animeTag);

        }
        
    }
    catch (error) {
        console.log("Error de fetch en anime tags: ", error);
    }
}

//SEARCH AN ANIME
const searchAnime = async () => {
    const animeName = document.getElementById("search").value.toLowerCase();
    //console.log(animeName);
    if (animeName) {
        try {
            const response = await axios.get(`https://api.jikan.moe/v4/anime/${animeName}`);
            const animeTags = document.getElementById("anime-tags");
            animeTags.innerHTML = "";
            const animeTag = createAnimeTag(response.data.data);
            //console.log(animeTag);
            animeTags.appendChild(animeTag);
        }
        catch (error) {
            console.log("Error de fetch en anime search: ", error);
        }
    }
};





//------------CALL ASYNC FUNCTIONS
document.addEventListener("DOMContentLoaded", loadAnimes);
document.addEventListener("DOMContentLoaded", loadAnimesTags);

console.log(document.getElementById("search-button"));

//document.getElementById("search-button").addEventListener("click",searchAnime);
/*document.getElementById("search").addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        console.log("search");
        searchAnime();
    }
});*/
//document.addEventListener("DOMContentLoaded", api);







//------------------------------------------------------------------------------JS IN LIBRARY PAGE

const loadAnimesTagsLibrary = () => {
    const animeTags = document.getElementById("anime-tags-library");
    const page1 = document.getElementById("page-1");
    const page2 = document.getElementById("page-2");
    const page3 = document.getElementById("page-3");
    const page4 = document.getElementById("page-4");
    const page5 = document.getElementById("page-5");
    

    try {
        
        const chargeAnimes = async () => {
            const response = await axios.get(`https://api.jikan.moe/v4/anime?page=${page}&limit=${size}`);
            const animes = response.data.data;
            //console.log(animes);
        
            animeTags.innerHTML = "";

            for(const anime of animes) {
                
                //console.log(anime);
                const animeTag = createAnimeTag(anime);
                animeTags.appendChild(animeTag)

            }
        }

        chargeAnimes();


        page1.addEventListener("click", () => {
            page = 1;

            chargeAnimes();
        });

        page2.addEventListener("click", () => {
            page = 2;

            chargeAnimes();
        });

        page3.addEventListener("click", () => {
            page = 3;

            chargeAnimes();
        });

        page4.addEventListener("click", () => {
            page = 4;

            chargeAnimes();
        });

        page5.addEventListener("click", () => {
            page = 5;

            chargeAnimes();
        });

        


    }
    catch (error) {
        console.log("Error de fetch en anime tags: ", error);
    }
}


document.addEventListener("DOMContentLoaded", loadAnimesTagsLibrary);