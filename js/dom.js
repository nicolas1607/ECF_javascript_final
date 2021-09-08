let i = 0; // nb de lignes du tableau

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

function newImport(artist, album, fullAlbum, title, i, mbid, genre, length, recordId){

    const table = document.querySelector("#res-body");

    const tr = document.createElement("tr");
    const tdRes = document.createElement("td");
    tdRes.className = "id-res";
    tdRes.textContent = i;
    const tdArtist = document.createElement("td");
    tdArtist.id = "artist-res";
    tdArtist.textContent = artist;
    const tdTitle = document.createElement("td");
    tdTitle.id = "title-res";
    tdTitle.textContent = title;
    const tdAlbum = document.createElement("td");
    tdAlbum.id = "album-res";
    tdAlbum.textContent = album;
    const tdAction = document.createElement("td");
    tdAction.id = "action-res"+mbid;
    const a = document.createElement("a");
    a.className = "action-button";

    a.addEventListener('click', function(){
        
        showModal();

        const modal = document.querySelector("#modal")

        const modalName = document.createElement("div");
        modalName.id = "modalName";
        const modalNameh2 = document.createElement("h1");
        modalNameh2.textContent = artist + " - " + title;
        modalName.appendChild(modalNameh2);
        const modalButton = document.createElement("button");
        modalButton.id = "modalButton";
        modalButton.textContent = "X";
        modalButton.addEventListener('click', hideModal);
        modalName.appendChild(modalButton);

        const modalContent = document.createElement("div");
        modalContent.id = "modalContent";
        const modalContenth2 = document.createElement("h2");
        modalContenth2.textContent = "Informations";
        const modalInfo = document.createElement("div");
        modalInfo.id = "modalInfo";
        modalContent.appendChild(modalContenth2);
        modalContent.appendChild(modalInfo);

        const modalCoverArt = document.createElement("div");
        modalCoverArt.id = "modalCoverArt";
        const modalCoverArth2 = document.createElement("h2");
        modalCoverArth2.textContent = "Cover Arts";
        const modalCover = document.createElement("div");
        modalCover.id = "modalCover";
        modalCoverArt.appendChild(modalCoverArth2);
        modalCoverArt.appendChild(modalCover);

        const modalhr = document.createElement("hr");
        modalhr.id = "modalhr";
        const modalTitle = document.createElement("p");
        modalTitle.textContent = "Title : " + title;
        const modalArtist = document.createElement("p");
        modalArtist.textContent = "Artist : " + artist;
        const modalAlbum = document.createElement("p");
        modalAlbum.textContent = "Album : " + fullAlbum;
        const modalGenre = document.createElement("p");
        modalGenre.textContent = "Genre : " + genre;
        const modalLength = document.createElement("p");
        modalLength.textContent = "Length : " + length;
        const modalRating = document.createElement("p");
        modalRating.textContent = "Note : ";
        modalInfo.appendChild(modalTitle);
        modalInfo.appendChild(modalArtist);
        modalInfo.appendChild(modalAlbum);
        modalInfo.appendChild(modalGenre);
        modalInfo.appendChild(modalLength);
        modalInfo.appendChild(modalRating);
        
        modal.appendChild(modalName);
        modal.appendChild(modalContent);
        modal.appendChild(modalhr);
        modal.appendChild(modalCoverArt);

        // On check les covers arts
        let count = 0;
        const countCover = document.querySelector("#modalCoverArt h2");
        if (mbid){
            mbid.forEach(function(id){
                id = id.replace('action-res','');
                fetch("http://coverartarchive.org/release/"+id).then(function(response){
                    if (response.status == 404){
                        countCover.textContent = "Cover Arts : 0";
                    }
                    else{
                        response.json().then(function(value){
                            count += value.images.length;
                            countCover.textContent = "Cover Arts : " + count;
                            value.images.forEach(image => {
                                const img = document.createElement("img");
                                img.className = "imgContent";
                                img.setAttribute("src", image.image);
                                modalCover.appendChild(img);
                            });
                        })
                    }
                    
                });
            });
        }

        // On check la note attribué /5
        let rating;
        if (recordId){
            fetch("http://musicbrainz.org/ws/2/recording/"+recordId+"?inc=ratings&fmt=json").then(function(response){ 
                    response.json().then(function(value){ 
                        rating = value.rating.value; 
                        if (rating != null) modalRating.textContent += rating + "/5";
                        else modalRating.textContent += "undefined";
                    });
            });
        }

    });

    const img = document.createElement("img");
    img.src = "img/noun_more_4052946.svg";

    a.append(img);
    tdAction.append(a);
    tr.append(tdRes);
    tr.append(tdArtist);
    tr.append(tdTitle);
    tr.append(tdAlbum);
    tr.append(tdAction);
    table.append(tr);

}

function addTotal(totalSearch){
    const total = document.querySelector("#total");
    (totalSearch<=1) ? total.textContent = totalSearch + " résultat" : total.textContent = totalSearch + " résultats";
}

function noResult(){
    const table = document.querySelector("#res-table");

    const tfoot = document.createElement("tfoot");
    tfoot.id = "res-foot";
    const tr = document.createElement("tr");
    const th = document.createElement("th");
    th.textContent = "Aucun résultat ne correspond à votre recherche ... Try again !";

    tr.appendChild(th);
    tfoot.appendChild(tr);
    table.appendChild(tfoot);
}

function addInfo(){
    const tbody = document.querySelector("#res-body");
    const info = document.createElement("tr");
    info.id = "res-info";
    const th = document.createElement("th");
    th.textContent = "Veuillez saisir une nouvelle recherche... Please !";
    info.appendChild(th);
    tbody.appendChild(info);
}

function removeInfo(){
    const info = document.querySelector("#res-info");
    if (info) info.remove();
}

function removeMore(){
    let more = document.querySelector("#res-foot");
    if (more) more.remove();
}


    // MODAL //

function showModal() {
    document.querySelector(".overlap").hidden = false;
}

function hideModal() {
    document.querySelector(".overlap").hidden = true;
    document.querySelector("#modalName").remove();
    document.querySelector("#modalContent").remove();
    document.querySelector("#modalhr").remove();
    document.querySelector("#modalCoverArt").remove();
}


    // SPINNER //

function addSpinner(){
    const spinner = document.querySelector(".spinner");
    spinner.setAttribute("style", "visibility:visible");
}

function removeSpinner(){
    const spinner = document.querySelector(".spinner");
    spinner.setAttribute("style", "visibility:hidden");
}