class Project{
    constructor(
        public id: string, 
        public title: string, 
        public description: string, 
        public people: number,
        public status: ProjectStatus
    ){}
}

type Listeners<T> = (items: T[]) => void;
class State<T>{
    protected listeners: Listeners<T>[] = [];

    addListener(listenerFn: Listeners<T>){
        this.listeners.push(listenerFn)
    }
}

class ProjectState extends State<Project>{
    
    private projects: Project[] = [];
    private static instance: ProjectState;

    private constructor(){
        super();
    }
    static getInstance(){
        if(this.instance){
            return this.instance;
        }else{
            this.instance = new ProjectState;
            return this.instance
        }
    }
    
    addProject(title: string, description: string, numOfPeople: number){
        const newProject = new Project(
            Math.random().toString(),
            title,
            description,
            numOfPeople,
            ProjectStatus.ACTIVE
        )
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

abstract class Component<T extends HTMLElement, U extends HTMLElement>{
    templateElement: HTMLTemplateElement;
    rootElement: T;
    element: U;
    constructor(
        templateId: string, 
        hostElementId: string, 
        insertAtStart: boolean,
        newElementId?: string)
        {
            this.templateElement = document.getElementById(templateId
            )! as HTMLTemplateElement;
            
            this.rootElement = document.getElementById(hostElementId
            )! as T;
            const importedNode = document.importNode(
                this.templateElement.content,
                true
            );
            this.element = importedNode.firstElementChild as U;
            if(newElementId){
                this.element.id = newElementId;
            }
            this.attach(insertAtStart)
    } 
    private attach(insertAtStart: boolean){
        if(insertAtStart){
            this.rootElement.insertAdjacentElement(
                insertAtStart ? 'afterbegin' : 'beforeend', this.element);
        }    
    }
    abstract configure(): void;
    abstract renderContent(): void;
}

class ProjectList extends Component<HTMLDivElement, HTMLElement>{

    assignedProjects: Project[];

    constructor(private type: ProjectStatus){
        super('project-list', 'app', false,`${type}-projects` );
        this.assignedProjects = [];

        this.configure();
        this.renderContent();
    }

    configure(){
        projectState.addListener((projects: Project[]) => {
            const relevantProjects = projects.filter(prj => {
                if(this.type === ProjectStatus.ACTIVE){
                    return prj.status === ProjectStatus.ACTIVE
                }else{
                    return prj.status === ProjectStatus.FINISHED
                }
            });
            this.assignedProjects = relevantProjects;
            this.renderProjects();
        });
    }

    private renderProjects(){
        console.log(this)
        const listEl = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement
        listEl.innerHTML = '';
        for(const prjItem of this.assignedProjects){
            const listItem = document.createElement('li');
            listItem.textContent = prjItem.title;
            listEl.appendChild(listItem)
        }
    }
    renderContent(){
        const listId = `${this.type}-projects-list`;
        this.element.querySelector('ul')!.id = listId;
        this.element.querySelector('h2')!.textContent = this.type.toUpperCase() + ' Projects';

    }

}
class ProjectInput extends Component<HTMLDivElement, HTMLFormElement>{
    titleInputElement: HTMLInputElement; 
    descriptionInputElement: HTMLInputElement;
    peopleInputElement: HTMLInputElement;

    constructor(){
        super('project-input', 'app', true, 'user-input');

        this.titleInputElement = this.element.querySelector("#title") as HTMLInputElement;
        this.descriptionInputElement = this.element.querySelector("#description") as HTMLInputElement;
        this.peopleInputElement = this.element.querySelector("#people") as HTMLInputElement;

        this.configure();
        this.renderContent();


    }
    configure(){
        this.element.addEventListener("submit", this.submitHandler.bind(this));
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

    private clearInputs(){
        this.titleInputElement.value = "";
        this.descriptionInputElement.value = "";
        this.peopleInputElement.value = '';
    }
}

const project = new ProjectInput();
const activeList = new ProjectList(ProjectStatus.ACTIVE);
const finishedList = new ProjectList(ProjectStatus.FINISHED);