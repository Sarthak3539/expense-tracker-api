import bcrypt  from 'bcrypt';
const saltRounds = 10;



async function hash(password){

    const hased=await bcrypt.hash(password, saltRounds);
    return hased;
}

export {hash}
 

