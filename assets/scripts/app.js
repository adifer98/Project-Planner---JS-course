class ToolTip {}

class DOMHelper {
    static addElement(elementId, destinationSelector) {
        const element = document.getElementById(elementId);
        const destinationElement = document.querySelector(destinationSelector);
        destinationElement.append(element);
    }

    static removeElement(elementId, destinationSelector) {
        const element = document.getElementById(elementId);
        const destinationElement = document.querySelector(destinationSelector);
        destinationElement;
    }
}

class ProjectItem {
    constructor(elementId, switchListFunction) {
        this.id = elementId;
        this.switchListHandler = switchListFunction;
        this.connectSwitchBtn();
        this.connectMoreInfoBtn();
    }

    connectSwitchBtn() {
        const switchBtnEl = document.querySelector(`#${this.id} button:last-of-type`);
        switchBtnEl.addEventListener('click', this.switchListHandler);
    }
    
    connectMoreInfoBtn() {}
}

class ProjectList {

    projects = [];
    constructor(type) {
        this.type = type;
        const projList = document.querySelectorAll(`#${type}-projects li`);
        for (const projItemEl of projList) {
            this.projects.push(new ProjectItem(projItemEl.id, this.switchProject.bind(this)));
        }
    }

    set switchHandler(switchHandlerFunction) {
        this.switchHandler = switchHandlerFunction;
    }

    addProject(proj) {
        this.projects.push(proj);
        DOMHelper.addElement(proj.id, `#${this.type}-projects ul`);

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
        activeProjectsList.switchHandler = finishedProjectsList.addProject.bind(finishedProjectsList);
        finishedProjectsList.switchHandler = activeProjectsList.addProject.bind(activeProjectsList);
    }
}

App.init();