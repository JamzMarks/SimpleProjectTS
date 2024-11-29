"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
function checkInputValue(validatableInput) {
    let isValid = true;
    if (validatableInput.required) {
        isValid = isValid && validatableInput.value.toString().trim().length !== 0;
    }
    if (validatableInput.minLenght != null &&
        typeof validatableInput.value === 'string') {
        isValid = isValid && validatableInput.value.length > validatableInput.minLenght;
    }
    if (validatableInput.maxLenght != null &&
        typeof validatableInput.value === 'string') {
        isValid = isValid && validatableInput.value.length < validatableInput.maxLenght;
    }
    if (validatableInput.min != null &&
        typeof validatableInput.value === 'number') {
        isValid = isValid && validatableInput.value >= validatableInput.min;
    }
    if (validatableInput.max != null &&
        typeof validatableInput.value === 'number') {
        isValid = isValid && validatableInput.value <= validatableInput.max;
    }
    return isValid;
}
//Decorator Autobind
function autoBind(target, methodName, descriptor) {
    const originalMethod = descriptor.value;
    const adjDescriptor = {
        configurable: true,
        get() {
            const boundFn = originalMethod.bind(this);
            return boundFn;
        }
    };
    return adjDescriptor;
}
class ProjectList {
    constructor(type) {
        this.type = type;
        this.templateElement = document.querySelector("#project-list");
        this.rootElement = document.getElementById("app");
        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild;
        this.element.id = `${type}-projects`;
        this.attach();
        this.renderContent();
    }
    renderContent() {
        const listId = `${this.type}-projects-list`;
        this.element.querySelector('ul').id = listId;
        this.element.querySelector('h2').textContent = this.type.toUpperCase() + ' Projects';
    }
    attach() {
        this.rootElement.insertAdjacentElement('beforeend', this.element);
    }
}
class ProjectInput {
    constructor() {
        this.templateElement = document.getElementById("project-input");
        this.rootElement = document.getElementById("app");
        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild;
        this.element.id = 'user-input';
        this.titleInputElement = this.element.querySelector("#title");
        this.descriptionInputElement = this.element.querySelector("#description");
        this.peopleInputElement = this.element.querySelector("#people");
        this.configure();
        this.attach();
    }
    gatherUserInput() {
        const enteredTitle = this.titleInputElement.value;
        const enteredDescriptor = this.descriptionInputElement.value;
        const enteredPeople = this.peopleInputElement.value;
        const titleValidatable = {
            value: enteredTitle,
            required: true,
            minLenght: 5,
            maxLenght: 50
        };
        const descriptorValidatable = {
            value: enteredDescriptor,
            required: true,
            minLenght: 20,
            maxLenght: 500
        };
        const peopleValidatable = {
            value: enteredPeople,
            required: true,
            min: 1,
            max: 30
        };
        const checked = checkInputValue(titleValidatable);
        const checked2 = checkInputValue(descriptorValidatable);
        const checked3 = checkInputValue(peopleValidatable);
        console.log(checked, checked2, checked3);
        if (!checkInputValue(titleValidatable) ||
            !checkInputValue(descriptorValidatable) ||
            !checkInputValue(peopleValidatable)) {
            alert("Invalid Input, try again");
            return;
        }
        else {
            return [enteredTitle, enteredDescriptor, parseFloat(enteredPeople)];
        }
    }
    clearInputs() {
        this.titleInputElement.value = "";
        this.descriptionInputElement.value = "";
        this.peopleInputElement.value = '';
    }
    submitHandler(event) {
        event.preventDefault();
        const enteredUserInputs = this.gatherUserInput();
        if (Array.isArray(enteredUserInputs)) {
            const [title, description, people] = enteredUserInputs;
            console.log(title, description, people);
            this.clearInputs();
        }
    }
    configure() {
        this.element.addEventListener("submit", this.submitHandler.bind(this));
    }
    attach() {
        this.rootElement.insertAdjacentElement('afterbegin', this.element);
    }
}
__decorate([
    autoBind
], ProjectInput.prototype, "submitHandler", null);
const project = new ProjectInput();
const activeList = new ProjectList('active');
const finishedList = new ProjectList('finished');
