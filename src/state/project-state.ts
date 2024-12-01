import { ProjectStatus, Project } from "../models/project";

type Listeners<T> = (items: T[]) => void;

class State<T>{
    protected listeners: Listeners<T>[] = [];

    addListener(listenerFn: Listeners<T>){
        this.listeners.push(listenerFn)
    }
}

export class ProjectState extends State<Project>{
    
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

export const projectState = ProjectState.getInstance();

