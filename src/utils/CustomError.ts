
class CustomError extends Error{
     
    status : number;

    constructor(_status : number, message : string){
        super(message);
        this.status =this.status 
    }  

}

export { CustomError }