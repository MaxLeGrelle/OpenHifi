"use strict"
const fs = require("fs");
const FILE_PATH = __dirname + "/data/albums.json";
const FILE_PATH_IMAGE64 = __dirname + "/data/images";

class Album {
    constructor(name, listIdMusics, idCreator, pathImage64, nbrLikes = 0, id = Album.incId()) {
        this.name = name;
        this.listIdMusics = listIdMusics;
        this.idCreator = idCreator;
        this.pathImage64 = pathImage64;
        this.nbrLikes = nbrLikes;
        this.id = id;
    }

    async save() {
        try{
            const albumsList = getAlbumsFromFile(FILE_PATH)
            albumsList.push(this);
            saveAlbumListToFile(FILE_PATH, albumsList);
            return true;
        }catch(err) {return err}
    }

    static async getAlbumFromId(albumId) {
        const albumsList = Album.getList()
        const album = albumsList.find(album => album.id == albumId);
        return album;
    }

    static async saveImage64(image64, nameImage64) {
        try{
            const timestamp = Date.now();
            const path = FILE_PATH_IMAGE64+"/"+timestamp+"-"+nameImage64+".txt";
            fs.writeFileSync(path, image64);
            return path;
        }catch(err) {return err}
    }

    static incId() {
        const albumsList = Album.getList();
        if (!albumsList || albumsList.length === 0) return 0;
        return albumsList[albumsList.length-1].id + 1;
    }

    static getList() {
        return getAlbumsFromFile(FILE_PATH);
    }

    static getImage64(pathImage64) {
        if (!fs.existsSync(pathImage64)) return null;
        const image64 = fs.readFileSync(pathImage64);
        if (!image64) return null;
        return image64.toString();
    }
    
}



/**
 * Write in the file path to save the list albumList
 * @param {*} path the path to the file
 * @param {*} albumList the list of albums
 */
function saveAlbumListToFile(path, albumList){
    const albumListToJson = JSON.stringify(albumList);
    fs.writeFileSync(path, albumListToJson);
}

/**
 * Return the list of albums in path 
 * return an empty list if path does not exist
 * @param {*} path the path of the file
 */
function getAlbumsFromFile(path){
    if (!fs.existsSync(path)) return [];
    const rawData = fs.readFileSync(path);
    if (!rawData) return [];
    return JSON.parse(rawData);
}

module.exports = Album;