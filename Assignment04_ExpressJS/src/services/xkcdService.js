const axios=require("axios");
class ValidationError extends Error{constructor(message){super(message);this.name="ValidationError";this.isOperational=true;this.statusCode=400;}}

class XKCDService{
 constructor(){
    this.baseUrl="https://xkcd.com";
    this.cache=new Map();this.cacheTimeout=Number(process.env.CACHE_TIMEOUT)||300000;
 }
 _getCached(key){
    const e=this.cache.get(key);
    if(!e)return null;
    if(Date.now()-e.timestamp>=this.cacheTimeout){
        this.cache.delete(key);
        return null;
    }
    return e.data;
 }
 _setCached(key,data){
    this.cache.set(key,{data,timestamp:Date.now()});
 }
 _processComic(d){
    return{id:d.num,title:d.title,image:d.img,alt:d.alt,transcript:d.transcript||"",date:`${d.year}-${d.month}-${d.day}`,link:`https://xkcd.com/${d.num}/`};
 }
 async getLatest(){
    const c=this._getCached("comic-latest");
    if(c)return c;
    const r=await axios.get(`${this.baseUrl}/info.0.json`);
    const comic=this._processComic(r.data);
    this._setCached("comic-latest",comic);
    return comic;
 }
 async getById(id){
    /* TODO */
    // Validate that the comic ID is a positive integer.
   if(!Number.isInteger(Number(id)) || Number(id)<=0){
    throw new ValidationError("Invalid comic ID");
   }

   id=Number(id);

   // Return the cached comic if a valid, unexpired copy is available.
   const cached=this._getCached(`comic-${id}`);
   if(cached){
    return cached;
   }

   try{
    // Fetch the comic data from the XKCD API.
    const response=await axios.get(`${this.baseUrl}/${id}/info.0.json`);

    // Convert the XKCD response into the format used by this API.
    const comic=this._processComic(response.data);

    // Cache the successful response to avoid unnecessary API requests.
    this._setCached(`comic-${id}`,comic);

    return comic;
   }
   
   catch(error){
    // A 404 means that the requested comic does not exist.
    if(error.response && error.response.status===404){
        throw new Error("Comic not found");
    }

    // Other HTTP errors are treated as operational errors from the external API.
    if(error.response){
        const operationalError = new Error("Failed to fetch comic");
        operationalError.isOperational = true;
        operationalError.statusCode = 502;
        throw operationalError;
    }

    // Handle network or connection failures when no HTTP response was received.
    const operationalError = new Error("Network error");
    operationalError.isOperational = true;
    operationalError.statusCode = 503;
    throw operationalError;
   }  
 }

 async getRandom(){
    /* TODO */
    // Get the latest comic to determine the range of valid comic IDs.
    try{
         const latestComic=await this.getLatest();

         // Generate a random comic ID between 1 and the latest comic ID.
         const randomId=Math.floor(Math.random() * latestComic.id) + 1;

         // Use getById() to retrieve and process the randomly selected comic.
         return await this.getById(randomId);
      }
   catch(error){
      // Pass any errors from getLatest() or getById() to the outer error handler.
      throw error;
   }
 }

 async search(query,page=1,limit=10){
    /* TODO */
    // Validate that the search query is a string between 1 and 100 characters.
    if(typeof query!=="string" || query.length<1 || query.length>100){
      throw new ValidationError("Invalid search query");
   }

   // Calculate the starting position for the requested page.
   const offset=(page-1)*limit;

   try{
      // Get the latest comic to determine the range of recent comics to search.
      const latestComic=await this.getLatest();
      const startId=Math.max(1,latestComic.id-99);

      const comics=[];

   // Search through the 100 most recent comics.
   for(let id=startId;id<=latestComic.id;id++){
      try{
         const comic=await this.getById(id);

         // Convert the text to lowercase so searches are case-insensitive.
         const title=comic.title.toLowerCase();
         const transcript=comic.transcript.toLowerCase();
         const searchTerm=query.toLowerCase();

         // Add the comic when the search term appears in its title or transcript.
         if(title.includes(searchTerm) || transcript.includes(searchTerm)){
            comics.push(comic);
        }
      }

      catch(error){
         //Skip missing comic IDs and continue searching the remaining comics.
         if(error.message==="Comic not found"){
            continue;
         }
      // Pass other errors to the outer error handler.
      throw error;
      }
   }

      const total=comics.length;
      const results=comics.slice(offset,offset+limit);
      const totalPages=Math.ceil(total/limit);
      
      return{
         query,
         results,
         total,
         pagination:{
            page,
            limit,
            totalPages,
            hasNext:page<totalPages,
            hasPrevious:page>1
         }
      };
   }

   catch(error){
      throw new Error("Failed to search comics");
   }
}
}
module.exports=new XKCDService();module.exports.XKCDService=XKCDService;module.exports.ValidationError=ValidationError;
