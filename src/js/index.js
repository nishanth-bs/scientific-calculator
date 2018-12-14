import { elements } from './views/base';
import * as disp from './views/displayResult';
import * as calc from './model/calculation';

const state = {};
const initState = ()=>{
  //contains keys just how the user clicks
  state.entry = [];
  //contains keys changed into js math fn
  state.bgentry = [];
  //doesn't contain '.'
  state.dot = false;
  //checks if any number has been entered
  state.anyNumber = false;
  //no consecutive signs are allowed
  state.consecutiveSigns = false;
  state.actionBegin = false;
  state.degrad = 'RAD';
}
const toDegrees = angle => angle * (180 / Math.PI );
const initTemplate = ()=>{
  disp.renderAns("");
  disp.renderCalculation("0");
  elements.displayResult.classList.remove('scaleAnswer');
}

let handlekeyboardEvents = e =>{
  elements.displayResult.classList.remove('scaleAnswer');
  if(!isNaN(parseFloat(e.key)) && isFinite(e.key)){
    sane(e.key);
    display(e.key);
  }
  else if(e.keyCode === 107){
    sane('add');
    display('add');
  }
  else if(e.keyCode === 109){
    sane('sub');
    display('sub');
  }
  else if(e.keyCode === 106){
    sane('mul');
    display('mul');
  }
  else if(e.keyCode === 111){
    sane('div');
    display('div');
  }else if(e.keyCode ===13 || e.keyCode === 187){
      equalIsPressed();
  }
}
const equalIsPressed = ()=>{
  //todo display the final answer by scaling
  //the rendered answer
  state.enter = true;
  //1. clear the calculation part
  disp.renderCalculation("");
  let answer = calc.res(Array.prototype.join.call(state.bgentry,''),true);
  //2.Scale the answer
  elements.displayResult.classList.add('scaleAnswer');
  //display the result
  disp.renderAns(answer);
  if(answer === "Bad Expression"){
    initState();
  }else{
    state.entry = [answer];
    state.bgentry = [answer];
  }

}

window.addEventListener("keydown", function (event) {
  handlekeyboardEvents(event);
  console.log(event);
});


//identify a button when clicked, call the callback function
elements.buttonsParent.addEventListener('click', (e) =>{
  let entry;
  if(e.target.matches('[class *= "btn--"]')){
    entry = e.target.getAttribute('class').split('--')[1];
    sane(entry);
    if(state.bgentry[state.bgentry.length - 1] === 'equalsPressed'){
      state.bgentry.pop()
      equalIsPressed();
    }else if(entry === 'clr'){
      initState();
      initTemplate();
    }else{
      elements.displayResult.classList.remove('scaleAnswer');
      if(entry !== ""){
        //pushOp(entry);
        display();
      }
    }
  }
});

elements.scientificDrawer.addEventListener('click',()=>{
  elements.drawer.classList.toggle('open-drawer');
  //2.dim the background
  elements.scientificDrawer.classList.toggle('larr');
  elements.scientificDrawer.classList.toggle('rarr');
  //3.inverse the caret
});

elements.drawer.addEventListener('click',e=>{
  let entry;
  if(e.target.matches('[class *= "btn--"]')){
    entry = e.target.getAttribute('class').split('--')[1];
    saneScientific(entry);
    display();
  }
});

initState();
initTemplate();
//function to push the entered value into
//states object
const pushOp = entry =>{
  if(!state.entry && entry !== ""){
    state.entry = entry;
  }else{
    state.entry = `${state.entry}${entry}`;
  }
}
const pushSaneOp = entry =>{
  if(!state.bgentry && entry !== ""){
    state.bgentry = entry;
  }else{
    state.bgentry = `${state.bgentry}${entry}`;
  }
}

//function to show live results
const display = ()=>{
  //display it in the calculation field
  disp.renderCalculation(Array.prototype.join.call(state.entry,''));
  //pass the entered number to the model
  let last = state.bgentry[state.bgentry.length -1] ==="equalsPressed";
  console.log(last);
  let answer = calc.res(Array.prototype.join.call(state.bgentry,''));
  //display the result
  disp.renderAns(answer);
}

//a function which sanitizes the
//the entered key
let sane = e =>{
  //check if the user clicked the equals sign
  //and check if it is valid (to scale the answer)
  if( e === 'eq' && state.actionBegin){
    state.actionBegin = false;
    pushValueIntoStateObj('','equalsPressed');
  }
  //when the input is a decimal point
  //check if the decimal point is being typed twice using state
  else if(e === 'dot'){
    state.actionBegin = true;
    if(!state.dot){
      state.dot = true;
      pushValueIntoStateObj('.','.');
    }
  }
  //when the input is clear
  //clear the state object
  else if(e === "clr"){
    state.actionBegin = false;
    initState();
    initTemplate();
  }
  //when the input is a number
  else if(!isNaN(parseFloat(e)) && isFinite(e)){
    state.actionBegin = true;
    state.anyNumber = true;
    state.consecutiveSigns = false;
    pushValueIntoStateObj(e,e);
  }
  else if(state.anyNumber && !state.consecutiveSigns){
    state.actionBegin = true;
    state.consecutiveSigns = true;
    if(e === 'add') pushValueIntoStateObj('+','+');
    if(e === 'sub') pushValueIntoStateObj('-','-');
    if(e === 'mul') pushValueIntoStateObj('*','*');
    if(e === 'div') pushValueIntoStateObj('/','/');
  }
  else{
    //return "";
  }
}

const mathFunction = e =>{
  //if previously entered key is a number by default prepend
  //asterisk
  let lastVal = state.entry[state.entry.length -1];
  if(lastVal && ['+','-','/','*','^'].indexOf(lastVal) === -1){
    return `*Math.${e}(`;
  }else{
    return `Math.${e}(`;
    }
}

const mathValue = e =>{
  //if previously entered key is a number by default prepend
  //asterisk
  let lastVal = state.entry[state.entry.length -1];
  if(lastVal && ['+','-','/','*','^'].indexOf(lastVal) === -1){
    return `*Math.${e}`;
  }else{
    return `Math.${e}`;
    }
}

const pushValueIntoStateObj = (visible,bg)=>{
  state.entry = state.entry.concat(visible);
  state.bgentry = state.bgentry.concat(bg);

  console.log(state.entry+state.bgentry);
}

const saneScientific = e=>{
  if( e === 'tan' || e=== 'sin' || e === 'cos'){

      pushValueIntoStateObj(`${e}(`,mathFunction(e));

  }else if(e === 'pi'){
    pushValueIntoStateObj('pi',mathValue('PI'));
  }else if(e === 'log'){
    pushValueIntoStateObj('log(',mathFunction('log10'));
  }else if(e === 'ln'){
    pushValueIntoStateObj('ln(',mathFunction('log2'));
  }else if(e === 'root'){
    pushValueIntoStateObj('root(',mathFunction('sqrt'));
  }else if(e === 'e'){
    pushValueIntoStateObj('e(',mathFunction('exp'));
  }else if(e === 'power'){
    pushValueIntoStateObj('^',mathFunction('pow'))
  }else if(e === 'open'){
    //let lastEntry = this.state.entry.charAt(this.state.entry.length -1);
    let lastVal = state.entry[state.entry.length - 1];
    if(lastVal && ['+','-','/','*','^'].indexOf(lastVal) === -1){
      //(!isNaN(parseFloat(lastVal)) && isFinite(lastVal))|| lastVal ===')'){//['+','-','/','*'].indexOf(lastEntry) !== -1){
      pushValueIntoStateObj('(','*(');
    }else{
      pushValueIntoStateObj('(','(');
    }
  }else if(e === 'close'){
    pushValueIntoStateObj(')',')');
  }
  else{
  }
}
