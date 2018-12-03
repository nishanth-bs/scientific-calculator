import { elements } from './base.js';


export const renderCalculation = (str)=>{
  elements.displayCalculation.innerHTML = str;
  //console.log(obj.entry);
}

export const renderAns = str=>{
  elements.displayResult.innerHTML = str;
}
