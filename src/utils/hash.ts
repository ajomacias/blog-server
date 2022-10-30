import * as bcrypt from 'bcryptjs';
const salt = bcrypt.genSaltSync(10);

function hashText(text : string){
 return bcrypt.hashSync(text, salt);
}

function isEquals(noHash : string,hash : string ){
    return bcrypt.compare(noHash, hash);

}

export { hashText, isEquals };