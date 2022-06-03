
const API_URL_RANDOM = "https://api.thecatapi.com/v1/images/search?limit=3";

const API_URL_FAVORITES = "https://api.thecatapi.com/v1/favourites";

const API_URL_DELETE_FAVORITES = (id) =>  `https://api.thecatapi.com/v1/favourites/${id
}`;

const API_URL_UPLOAD = "https://api.thecatapi.com/v1/images/upload ";

const spanError = document.getElementById("msn_error");

// creamos una condicion de que al dar click en el buton nos recarge la pagina 

async function loadRandomMichis() {
// especificamos que sea asincrona
    const res = await fetch(API_URL_RANDOM) 
    const data = await res.json();
    console.log("random");
    console.log(data);

    if (res.status !== 200) {
        spanError.innerHTML = "Hubo un error: " + res.status;

    } else {
        // indicamos en que parte debe aparecer
        const img1 = document.getElementById("img1"); 
        const img2 = document.getElementById("img2");
        const img3 = document.getElementById("img3"); 
        const btn1 = document.getElementById("btn1"); 
        const btn2 = document.getElementById("btn2");
        const btn3 = document.getElementById("btn3"); 
        
         // ubicamos la primera posicion y la dirrecion web
        img1.src = data[0].url;
        img2.src = data[1].url;
        img3.src = data[2].url;  

        // al hacer click en el boton btn1 se llama a la funcion
        btn1.onclick = () => saveFavouriteMichi(data[0].id);
        btn2.onclick = () =>  saveFavouriteMichi(data[1].id);
        btn3.onclick = () =>  saveFavouriteMichi(data[2].id);
    }
}


async function loadFavouriteMichis() {
    // especificamos que sea asincrona
        const res = await fetch(API_URL_FAVORITES, {
            method: "GET",
            headers: {
                "X-API-KEY": "6543beab-9d3b-4221-8a60-fd5ab3c3b427",
            },
        });
        const data = await res.json();
    
        console.log("favorites");
        console.log(data);

        if (res.status !== 200) {
            spanError.innerHTML = "Hubo un error: " + res.status + data.message;
        }else {
            const section = document.getElementById("favoriteMichis");           

            section.innerHTML = ""; // borramos el contenido
            const h2 = document.createElement("h2"); //insertamos un elemento html

            const h2Text =document.createTextNode("Michis en favoritos"); // insertamos un texto 

            h2.appendChild(h2Text);
            section.appendChild(h2);


            data.forEach(michi => {
                
                const article = document.createElement("article");
                const img = document.createElement("img");
                const btn = document.createElement("button");
                const btnText = document.createTextNode("Sacar al michi de favorito");

                img.src = michi.image.url;
                btn.appendChild(btnText);
                btn.onclick = () => deleteFavouriteMichi(michi.id);
                article.appendChild(img);
                article.appendChild(btn);
                section.appendChild(article);

            })
        }
}

async function saveFavouriteMichi(id) {
    const res = await fetch(API_URL_FAVORITES, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
          // probaremos otra headers content type
         //   "Content-Type": "text/plain",
            "X-API-KEY": "6543beab-9d3b-4221-8a60-fd5ab3c3b427"
        },
        body: JSON.stringify({
            image_id: id
        }),
    });
    const data = await res.json();

    console.log("save")
    console.log(res)

    if (res.status !== 200) {
        spanError.innerHTML = "Hubo un error: " + res.status + data.message;
    } else {
        console.log("MICHI GUARDADO EN FAVORITO");
        loadFavouriteMichis();
    }

}
// hacemos una funcion para eliminar de favoritos

async function deleteFavouriteMichi(id) {
    const res = await fetch(API_URL_DELETE_FAVORITES(id), {
        method: "DELETE",
        headers: {
            "X-API-KEY": "6543beab-9d3b-4221-8a60-fd5ab3c3b427",
        }
    });
    const data = await res.json();

    if (res.status !== 200) {
        spanError.innerHTML = "Hubo un error: " + res.status + data.message;
    }else {
        console.log("MIICHI ELIMINADO DE FAVORITO");
        loadFavouriteMichis();
    }
}

async function uploadMichiPhoto() {
    const form = document.getElementById("uploadingForm");
    const formData = new FormData(form);

    console.log(formData.get("file"));

    const res = await fetch(API_URL_UPLOAD, {
        method: "POST",
        headers: {
          //  "Content-type": "multipart/form-data",
            "X-API-KEY": "6543beab-9d3b-4221-8a60-fd5ab3c3b427",
        },
        body: formData,
    })
    const data = await res.json();

    if (res.status !== 201) {
        spanError.innerHTML = "Hubo un error: " + res.status + data.message;
        console.log(data);
    }else {
        console.log("Foto de michi subida:) ");
        console.log(data);
        console.log(data.url);
    }
    saveFavouriteMichi(data.id);


}


// para que no aparesca vacio el dom llamamos a la funcion
loadRandomMichis();
loadFavouriteMichis();

