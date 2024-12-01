import { Component } from "./base-component";
import { ProjectItem } from "./project-item";
import { projectState } from "../state/project-state";
import { Project, ProjectStatus } from "../models/project";

export class ProjectList extends Component<HTMLDivElement, HTMLElement>{
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
    renderContent(){
        const listId = `${this.type}-projects-list`;
        this.element.querySelector('ul')!.id = listId;
        this.element.querySelector('h2')!.textContent = this.type.toUpperCase() + ' Projects';

    }

    private renderProjects(){
        const listEl = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement
        listEl.innerHTML = '';
        for(const prjItem of this.assignedProjects){
            new ProjectItem(this.element.querySelector('ul')!.id, prjItem)
        }
    }
}