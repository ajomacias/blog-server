type postSaveDTO = {
    id? : number
    name : string
    description : string
    user : number

}

function verifyProps(userSave : postSaveDTO){

    if(!userSave.description || !userSave.name || !userSave.user) return false;

    return (
        userSave.name.length > 6 && userSave.description.length >20
        &&userSave.name.length < 61 
        );

}

export{ postSaveDTO, verifyProps }