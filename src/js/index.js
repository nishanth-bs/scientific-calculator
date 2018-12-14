import { elements } from './views/base';
import * as disp from './views/displayResult';
import * as calc from './model/calculation';

const state = {};

const init = ()=>{
  state.entry = "";
  state.dot = false;
  state.anyNumber = false;
  state.consecutiveSigns = false;
  state.actionBegin = false;
  disp.renderAns("");
  disp.renderCalculation("0");
}

//a function which sanitizes the
//the entered key
let sane = e =>{
  //check if the user clicked the equals sign
  //and check if it is valid (to scale the answer)
  if( e === 'eq' && state.actionBegin){
    state.actionBegin = false;
    return "equalsPressed";
  }

  //when the input is a decimal point
  //check if the decimal point is being typed twice using state
  else if(e === 'dot'){
    state.actionBegin = true;
    if(!state.dot){
      state.dot = true;
      return '.';
    }
    return "";
  }

  //when the input is clear
  //clear the state object
  else if(e === "clr"){
    state.actionBegin = false;
    init();
    return "";
  }

  //when the input is a number
  else if(!isNaN(parseFloat(e)) && isFinite(e)){
    state.actionBegin = true;
    state.anyNumber = true;
    state.consecutiveSigns = false;
    return e;
  }

  else if(state.anyNumber && !state.consecutiveSigns){
    state.actionBegin = true;
    state.consecutiveSigns = true;
    if(e === 'add') return '+';
    if(e === 'sub') return '-';
    if(e === 'mul') return '*';
    if(e === 'div') return '/';
  }
  else{
    return "";
  }
}
  //identify a button when clicked, call the callback function
  elements.buttonsParent.addEventListener('click', (e) =>{
    let entry,answer;
    if(e.target.matches('[class *= "btn--"]')){
      entry = e.target.getAttribute('class').split('--')[1];
      entry = sane(entry);
      console.log(entry);
      if(entry === 'equalsPressed'){
        //todo display the final answer by scaling
        //the rendered answer

        //1. clear the calculation part
        disp.renderCalculation("");

        //2.Scale the answer
        elements.displayResult.classList.add('scaleAnswer');
      }else{
        elements.displayResult.classList.remove('scaleAnswer');
        if(entry !== ""){
          if(!state.entry && entry !== ""){
            state.entry = entry;
          }else{
            state.entry = `${state.entry}${entry}`;
          }
          //display it in the calculation field
          disp.renderCalculation(state.entry);
          //pass the entered number to the model
          answer = calc.res(state.entry);
          //display the result
          disp.renderAns(answer);
        }
      }
    }

  });
  elements.scientificDrawer.addEventListener('click',e=>{
    elements.drawer.classList.toggle('open-drawer');

    //2.dim the background

    //3.inverse the caret
  });

init();


  //display the result in the display
