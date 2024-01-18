class ToolTip {

    constructor(operatingFunction) {
        this.operate = operatingFunction;
    }

    deleteElement = () => {
        this.operate();
        this.detach();
    }
    detach(){
        this.element.remove();
    }
    attach() {
        const element = document.createElement('div');
        element.className = 'card';
        element.textContent = 'WHAT SAY!'
        element.addEventListener('click', this.deleteElement);
        document.body.append(element);
        this.element = element;
    }


}

class DOMHelper {
    static moveElement(elementId, destinationSelector) {
        const element = document.getElementById(elementId);
        const destinationElement = document.querySelector(destinationSelector);
        destinationElement.append(element);
    }

    static clearEventListeners(element) {
        let clonedElement = element.cloneNode(true);
        element.replaceWith(clonedElement);
        return clonedElement;
    }
}

class ProjectItem {

    moreInfoIsShowed = false;
    constructor(elementId, switchListFunction, type) {
        this.id = elementId;
        this.switchListHandler = switchListFunction;
        this.connectSwitchBtn(type);
        this.connectMoreInfoBtn();
    }

    connectSwitchBtn(type) {
        let switchBtnEl = document.querySelector(`#${this.id} button:last-of-type`);
        switchBtnEl = DOMHelper.clearEventListeners(switchBtnEl);
        switchBtnEl.textContent = type === 'active' ? 'Finish' : 'Activate';
        switchBtnEl.addEventListener('click', this.switchListHandler);
    }


    moreInfoHandler() {
        if(this.moreInfoIsShowed) {
            return;
        }
        const toolTip = new ToolTip(() => this.moreInfoIsShowed = false);
        toolTip.attach();
        this.moreInfoIsShowed = true;
    }

    connectMoreInfoBtn() {
        let moreInfoBtnEl = document.querySelector(`#${this.id} button:first-of-type`);
        moreInfoBtnEl.addEventListener('click', this.moreInfoHandler)
    }

    update(newSwitchListFunc, type) {
        this.switchListHandler = newSwitchListFunc;
        this.connectSwitchBtn(type);
    }
}

class ProjectList {

    projects = [];
    constructor(type) {
        this.type = type;
        const projList = document.querySelectorAll(`#${type}-projects li`);
        for (const projItemEl of projList) {
            this.projects.push(new ProjectItem(projItemEl.id, this.switchProject.bind(this, projItemEl.id), type));
        }
    }

    setSwitchHandler(switchHandlerFunction) {
        this.switchHandler = switchHandlerFunction;
    }

    addProject(project) {
        this.projects.push(project);
        DOMHelper.moveElement(project.id, `#${this.type}-projects ul`);
        project.update(this.switchProject.bind(this, project.id), this.type)
    }

    switchProject(projectId) {
        this.switchHandler(this.projects.find(p => p.id === projectId));
        this.projects = this.projects.filter(p => p.id !== projectId);
    }


}

class App {
    static init() {
        const activeProjectsList = new ProjectList('active');
        const finishedProjectsList = new ProjectList('finished');
        activeProjectsList.setSwitchHandler(finishedProjectsList.addProject.bind(finishedProjectsList));
        finishedProjectsList.setSwitchHandler(activeProjectsList.addProject.bind(activeProjectsList));
    }
}

App.init();