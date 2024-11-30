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