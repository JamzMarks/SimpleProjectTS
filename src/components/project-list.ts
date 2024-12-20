import { Component } from "./base-component";
import { ProjectItem } from "./project-item";
import { projectState } from "../state/project-state";
import { Project, ProjectStatus } from "../models/project";
import { DragTarget } from "../models/drag-drop";
import { autoBind } from "../decorators/autobind";

export class ProjectList extends Component<HTMLDivElement, HTMLElement>
    implements DragTarget{
    assignedProjects: Project[];

    constructor(private type: ProjectStatus){
        
        super('project-list', 'app', false, `${type}-projects` );
        this.assignedProjects = [];

        this.configure();
        this.renderContent();
    }

    @autoBind
    dragOverHandler(event: DragEvent): void {
        if(event.dataTransfer && event.dataTransfer.types[0] === 'text/plain'){
            event.preventDefault();
            const listEl = this.element.querySelector('ul')!;
            listEl.classList.add('droppable');
        }  
    }
    @autoBind
    dragLeaveHandler(_: DragEvent): void {
        const listEl = this.element.querySelector('ul')!;
        listEl.classList.remove('droppable');
    }

    @autoBind
    dropHandler(event: DragEvent) {
        const prjId = event.dataTransfer!.getData('text/plain');
        projectState.moveProject(
        prjId,
        this.type === ProjectStatus.ACTIVE ? ProjectStatus.ACTIVE : ProjectStatus.FINISHED
        );
    }
    

    configure(){
        this.element.addEventListener('dragover', this.dragOverHandler)
        this.element.addEventListener('dragleave', this.dragLeaveHandler)
        this.element.addEventListener('drop', this.dropHandler)
        
        projectState.addListener((projects: Project[]) => {
            const relevantProjects = projects.filter(prj => {
                if(this.type === ProjectStatus.ACTIVE){
                    return prj.status === ProjectStatus.ACTIVE;
                }else{
                    return prj.status === ProjectStatus.FINISHED;
                }
            });
            this.assignedProjects = relevantProjects;
            this.renderProjects();
        });
    }
    renderContent(){
        const listId = `${this.type}-projects-list`;
        this.element.querySelector('ul')!.id = listId;
        this.element.querySelector('h2')!.textContent = 
            this.type.toUpperCase() + ' PROJECTS';

    }

    private renderProjects() {
        const listEl = document.getElementById(
          `${this.type}-projects-list`
        )! as HTMLUListElement;
        listEl.innerHTML = '';
        for (const prjItem of this.assignedProjects) {
          new ProjectItem(this.element.querySelector('ul')!.id, prjItem);
        }
    }
}