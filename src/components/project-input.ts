import { Component } from "./base-component";
import { autoBind } from "../decorators/autobind";
import { validation, Validatable } from "../util/validation";
import { projectState } from "../state/project-state";

export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement>{
    titleInputElement: HTMLInputElement; 
    descriptionInputElement: HTMLInputElement;
    peopleInputElement: HTMLInputElement;

    constructor(){
        super('project-input', 'app', true, 'user-input');

        this.titleInputElement = this.element.querySelector("#title") as HTMLInputElement;
        this.descriptionInputElement = this.element.querySelector("#description") as HTMLInputElement;
        this.peopleInputElement = this.element.querySelector("#people") as HTMLInputElement;

        this.configure();

    }
    configure(){
        this.element.addEventListener("submit", this.submitHandler);
    }
    renderContent(){

    }
    private gatherUserInput(): [string, string, number] | void{
        const enteredTitle = this.titleInputElement.value;
        const enteredDescriptor = this.descriptionInputElement.value;
        const enteredPeople = this.peopleInputElement.value;

        const titleValidatable: Validatable = {
            value: enteredTitle,
            required: true,
            minLenght: 5,
            maxLenght: 50
        }
        const descriptorValidatable: Validatable = {
            value: enteredDescriptor,
            required: true,
            minLenght: 1,
            maxLenght: 500
        }
        const peopleValidatable: Validatable = {
            value: enteredPeople,
            required: true,
            min: 1,
            max: 30
        }
        if(
            !validation(titleValidatable) || 
            !validation(descriptorValidatable) || 
            !validation(peopleValidatable) 
        ){
            alert("Invalid Input, try again");
            return;
        }else{
            return [enteredTitle, enteredDescriptor, parseFloat(enteredPeople)]
        }    
    }
    
    private clearInputs(){
        this.titleInputElement.value = "";
        this.descriptionInputElement.value = "";
        this.peopleInputElement.value = '';
    }

    @autoBind
    private submitHandler(event: Event){
        event.preventDefault();
        const enteredUserInputs = this.gatherUserInput();
        if(Array.isArray(enteredUserInputs)){
            const [title, description, people] = enteredUserInputs;
            //O erro ocorre aqui
            projectState.addProject(title, description, people);
            this.clearInputs();
            
        }
    }
}