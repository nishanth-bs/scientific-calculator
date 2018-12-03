import { elements } from './../views/base';

export const res = str =>{
  try{
    return eval(str);
  }
  catch(e){
    return e;
  }


}
