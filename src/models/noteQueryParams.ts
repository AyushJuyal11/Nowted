export interface NoteQueryParams{
    folderId : string, 
    page : number, 
    limit : number, 
    search : string, 
    favorite : boolean
    deleted : boolean
    archived : boolean
}