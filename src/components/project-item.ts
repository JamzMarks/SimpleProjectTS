import { Component } from "./base-component.js";
import { Project } from "../models/project.js";

export class ProjectItem extends Component<HTMLUListElement, HTMLLIElement>{
    private project: Project;

    constructor(hostId: string, project: Project){
        super('simple-project', hostId, false, project.id);
        this.project = project;

        this.configure();
        this.renderContent();
    }

    configure(): void { }
    renderContent(): void {
       this.element.querySelector('h2')!.textContent = this.project.title;
       this.element.querySelector('h3')!.textContent = this.project.people.toString();
       this.element.querySelector('p')!.textContent = this.project.description;
    }
}