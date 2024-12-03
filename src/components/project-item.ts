import { Component } from "./base-component";
import { Project } from "../models/project";
import { Draggable } from "../models/drag-drop";
import { autoBind } from "../decorators/autobind";

export class ProjectItem extends Component<HTMLUListElement, HTMLLIElement>
    implements Draggable{
    private project: Project;

    get persons(){
        if(this.project.people === 1){
            return '1 person'
        }else{
            return  `${this.project.people} persons`
        } 
    }

    constructor(hostId: string, project: Project){
        super('simple-project', hostId, false, project.id);
        this.project = project;

        this.configure();
        this.renderContent();
    }

    @autoBind
    dragStartHandler(event: DragEvent): void {
        event.dataTransfer!.setData('text/plain', this.project.id );
        event.dataTransfer!.effectAllowed = 'move';
    }

    @autoBind
    dragEndHandler(event: DragEvent): void {
        console.log('Dragend')
    }

    configure(): void { 
        this.element.addEventListener('dragstart', this.dragStartHandler);
    }
    renderContent(): void {
       this.element.querySelector('h2')!.textContent = this.project.title;
       this.element.querySelector('h3')!.textContent = this.persons + ' assigned.';
       this.element.querySelector('p')!.textContent = this.project.description;
    }
}