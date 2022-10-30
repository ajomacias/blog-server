
export function isEmpty(opt : validateOpt){
    if(!opt.word) return true;
    if(opt.word.length < opt.min ) return true;
    return false;

}

type validateOpt = {
    min : number,
    word : string
}