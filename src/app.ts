interface ProjectInterface{
    id: string,
    title: string,
    description: string,
    peopleOf: number
} 

class ProjectState{
    private listeners: any[] = [];
    private projects: ProjectInterface[] = [];
    private static instance: ProjectState;

    private constructor(){

    }
    static getInstance(){
        if(this.instance){
            return this.instance;
        }else{
            this.instance = new ProjectState;
            return this.instance
        }
    }
    addListener(listenerFn: Function){
        this.listeners.push(listenerFn)
    }

    addProject(title: string, description: string, numOfPeople: number){
        const newProject = {
            id: Math.random().toString(),
            title: title,
            description: description,
            peopleOf: numOfPeople
        }
        this.projects.push(newProject);
        for(const listenerFn of this.listeners){
            listenerFn(this.projects.slice())
        }
    }
} 

const projectState = ProjectState.getInstance();


interface Validatable{
    value: string | number,
    required?: boolean,
    minLenght?: number,
    maxLenght?: number,
    min?: number,
    max?: number
}

function checkInputValue(validatableInput: Validatable){
    let isValid =  true;
    if(validatableInput.required){
        isValid = isValid && validatableInput.value.toString().trim().length !== 0;
    }
    if(
        validatableInput.minLenght != null && 
        typeof validatableInput.value === 'string'
    ){
        isValid = isValid && validatableInput.value.length > validatableInput.minLenght
    }
    if(
        validatableInput.maxLenght != null && 
        typeof validatableInput.value === 'string'
    ){
        isValid = isValid && validatableInput.value.length < validatableInput.maxLenght
    }
    if(
        validatableInput.min != null && 
        typeof validatableInput.value === 'number'
    ){
        isValid = isValid && validatableInput.value >= validatableInput.min
    }
    if(
        validatableInput.max != null && 
        typeof validatableInput.value === 'number'
    ){
        isValid = isValid && validatableInput.value <= validatableInput.max
    }
    
    return isValid
}

//Decorator Autobind
function autoBind(
    target: any, 
    methodName: string, 
    descriptor: PropertyDescriptor
){
    const originalMethod = descriptor.value;
    const adjDescriptor: PropertyDescriptor = {
        configurable: true,
        get(){
            const boundFn = originalMethod.bind(this);
            return boundFn;
        }
    }
    return adjDescriptor;
}
class ProjectList{
    templateElement: HTMLTemplateElement;
    rootElement: HTMLDivElement;
    element: HTMLElement;
    assignedProjects: any[];

    constructor(private type: 'active' | 'finished'){
        this.templateElement = document.querySelector("#project-list")! as HTMLTemplateElement;
        this.rootElement = document.getElementById("app")! as HTMLDivElement;
        this.assignedProjects = [];

        const importedNode = document.importNode(
            this.templateElement.content,
            true
        );
        this.element = importedNode.firstElementChild as HTMLElement;
        this.element.id = `${type}-projects`;

        projectState.addListener((projects: any) => {
            this.assignedProjects = projects;
            this.renderProjects();
        });
        
        this.attach();
        this.renderContent();
    }

    private renderProjects(){
        console.log(this)
        const listEl = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement
        for(const prjItem of this.assignedProjects){
            const listItem = document.createElement('li');
            listItem.textContent = prjItem.title;
            listEl.appendChild(listItem)
        }
    }
    private renderContent(){
        const listId = `${this.type}-projects-list`;
        this.element.querySelector('ul')!.id = listId;
        this.element.querySelector('h2')!.textContent = this.type.toUpperCase() + ' Projects';

    }
    private attach(){
        this.rootElement.insertAdjacentElement('beforeend', this.element);
    }

}
class ProjectInput{
    templateElement: HTMLTemplateElement;
    rootElement: HTMLDivElement;
    element: HTMLFormElement;

    titleInputElement: HTMLInputElement; 
    descriptionInputElement: HTMLInputElement;
    peopleInputElement: HTMLInputElement;

    constructor(){
        this.templateElement = document.getElementById("project-input")! as HTMLTemplateElement;
        this.rootElement = document.getElementById("app")! as HTMLDivElement;

        const importedNode = document.importNode(
            this.templateElement.content,
            true
        );
        this.element = importedNode.firstElementChild as HTMLFormElement;
        this.element.id = 'user-input';

        this.titleInputElement = this.element.querySelector("#title") as HTMLInputElement;
        this.descriptionInputElement = this.element.querySelector("#description") as HTMLInputElement;
        this.peopleInputElement = this.element.querySelector("#people") as HTMLInputElement;

        this.configure();
        this.attach();

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
            minLenght: 20,
            maxLenght: 500
        }
        const peopleValidatable: Validatable = {
            value: enteredPeople,
            required: true,
            min: 1,
            max: 30
        }
        if(
            !checkInputValue(titleValidatable) || 
            !checkInputValue(descriptorValidatable) || 
            !checkInputValue(peopleValidatable) 
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
            projectState.addProject(title, description, people);
            this.clearInputs();
        }
    }

    private configure(){
        this.element.addEventListener("submit", this.submitHandler.bind(this));
    }

    private attach(){
        this.rootElement.insertAdjacentElement('afterbegin', this.element);
    }
}

const project = new ProjectInput();
const activeList = new ProjectList('active');
const finishedList = new ProjectList('finished');