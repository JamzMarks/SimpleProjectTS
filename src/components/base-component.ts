export abstract class Component<T extends HTMLElement, U extends HTMLElement>{
    templateElement: HTMLTemplateElement;
    rootElement: T;
    element: U;
    constructor(
        templateId: string, 
        hostElementId: string, 
        insertAtStart: boolean,
        newElementId?: string)
        {
            const template = document.getElementById(templateId);
            if (!template) {
                throw new Error(`Template with ID "${templateId}" not found`);
            }
            this.templateElement = template as HTMLTemplateElement;
            
            const root = document.getElementById(hostElementId);
            if (!root) {
                throw new Error(`Host element with ID "${hostElementId}" not found`);
            }
            this.rootElement = root as T;

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
    private attach(insertAtBeginning: boolean){
            this.rootElement.insertAdjacentElement(
                insertAtBeginning ? 'afterbegin' : 'beforeend', 
                this.element
            );   
    }
    abstract configure(): void;
    abstract renderContent(): void;
}