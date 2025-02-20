import {folder} from './folder'

export interface note{
    id : string, 
    folderId : string, 
    title : string, 
    content : string, 
    isFavorite : boolean, 
    isArchived : boolean, 
    createdAt : string, 
    updatedAt : string, 
    deletedAt : string, 
    folder : folder
    preview? : string
}