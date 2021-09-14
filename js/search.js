let id = 1;
let offset = 0;
let nb = 0; // compte le nb de résultat par fetch
let totalSearch = 0; // compte le nb total de résultat
let finish = false;

window.onscroll = function() {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        if (!finish) moreSearch();
    }
};

function search(){

    addSpinner();

    let search;
    let artist, album, fullAlbum, title, mbid, genre, length, rating, recordId;
    if (offset==0) removeInfo();

    const select = document.querySelector("#search-select").value;
    let input = document.querySelector("#search-input").value;

    if (select == 'title') search = encodeURI('recording:"'+input+'"');
    else if (select == 'artist') search = encodeURI('artist:"'+input+'"');
    else if (select == 'album') search = encodeURI('release:"'+input+'"');
    else if (select == 'everything') search = encodeURI('recording:"'+input+'" OR artist:"'+input+'" OR release:"'+input+'"');

    fetch("http://musicbrainz.org/ws/2/recording/?query="+search+"&limit=100&fmt=json&offset="+offset).then(function(response){
        if (response.status == 200) removeSpinner();
        response.json().then(function(value){
            nb = 0;
            addTotal(value.count);
            if (value.count == 0) noResult();
            if (totalSearch == value.count) finish = true;
            else{
                value.recordings.map(function(record){
                    title = record.title;
                    // On check les artist featuring another artist
                    artist = "";
                    listArtist = record['artist-credit'];
                    for (let i=0; i<=listArtist.length-1; i++){
                        if (i==listArtist.length-1) artist = listArtist[i].name + artist;
                        else artist += " feat. " + listArtist[i].name;
                    }
                    // On check les albums associés au recording
                    album = "";
                    if (select == "album"){
                            for (let i=0; i<record.releases.length; i++){
                                if (record.releases[i]['release-group'].title.toLowerCase().includes(input.toLowerCase())){
                                    album = record.releases[i]['release-group'].title;
                                }
                            }
                    }
                    else if (record.releases) album = record.releases[0]['release-group'].title;
                    else {
                        album = record.title;
                    }
                    if (record.releases && record.releases.length > 1) album += " / ...";
                    fullAlbum = "";
                    if (record.releases != null){
                        if (record.releases.length == 1){
                            fullAlbum = record.releases[0]["release-group"].title;
                        }
                        else{
                            for (let i=0; i<=record.releases.length; i++){
                                if (record.releases[i] != undefined){
                                    if (i == 0) fullAlbum = record.releases[i]["release-group"].title;
                                    else fullAlbum += " / " + record.releases[i]["release-group"].title;
                                }
                                
                            }
                        }
                        // On check les ids des albums poour les covers arts
                        mbid = [];
                        for (let i=0; i<record.releases.length; i++){
                            mbid.push(record.releases[i].id);
                        }
                    }
                    // On check les différents genres musicaux
                    if (record.tags){
                        genre = "";
                        for (let i=0; i<record.tags.length; i++){
                            if (i==record.tags.length-1) genre += record.tags[i].name;
                            else genre += record.tags[i].name + ", ";
                        }
                    }
                    // On check la durée de la track en milliseconde => minutes
                    if (record.length){
                        length = (record.length/60000).toFixed(2);
                        if (length<10) length = "0"+length;
                    }
                    recordId = record.id;
                    newImport(artist, album, fullAlbum, title, id++, mbid, genre, length, recordId);
                    totalSearch++;
                    nb++;                     
                    
                });
                removeSpinner();
                if (nb == 0 && !finish) moreSearch();
            }
        });
    });

}    

function resetSearch(){
    let table = document.querySelector("#res-table");
    let tbody = document.querySelector("#res-body");
    tbody.remove();
    tbody = document.createElement("tbody");
    tbody.id = "res-body";
    table.append(tbody);
}

function moreSearch(){
    removeMore();
    offset+=100;
    search();
}

function newSearch(){
    id = 1;
    offset = 0;
    totalSearch = 0;
    finish = false;
    let more = document.querySelector("#res-foot");
    if (more) more.remove();
    resetSearch();
    search();
}


const btn = document.querySelector("#search-button");
btn.addEventListener('click', newSearch);

const input = document.querySelector("#search-input");
input.addEventListener('keypress', function(e){
    var key = e.which || e.keyCode;
    if (key === 13) {
        newSearch();
    }
});

document.addEventListener('keydown', function(event){
	if(event.key === "Escape"){
		hideModal();
	}
});