import { elements } from './../views/base';

export const res = (str,bool=false) =>{
  let ans;
  try{
    let openingBrace, closingBrace;
    openingBrace = str.match(/\(/g);
    if(openingBrace){
      openingBrace = openingBrace.length
      try{
        closingBrace = str.match(/\)/g).length;
      }catch(e){
        closingBrace = 0;
      }
      str = str + ')'.repeat(openingBrace - closingBrace);
      console.log(str);
    }
    ans = eval(str);
    console.log(ans);
    if((!Number.isFinite(ans) || Number.isNaN(ans)) && !bool)
      return "";
    else if((!Number.isFinite(ans) || Number.isNaN(ans)) && bool)
      return "Bad Expression";
    return ans;
  }
  catch(e){
      if((!Number.isFinite(ans) || Number.isNaN(ans)) && bool)
      return "Bad Expression"
    return "";
  }


}
