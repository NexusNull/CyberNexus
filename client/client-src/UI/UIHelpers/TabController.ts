interface Tab {
    nav: HTMLDivElement;
    content: HTMLDivElement;
}


class TabController {
    activeTab: Tab;

    constructor(structure: Array<Tab>) {
        for (let tab of structure) {
            let nav = tab.nav;
            nav.addEventListener("click", this.setActive.bind(this, tab));
        }
        this.activeTab = null;
        this.setActive(structure[0])
    }

    setActive(Tab) {
        if (this.activeTab) {
            this.activeTab.nav.classList.remove("active");
            this.activeTab.content.classList.add("hidden");
        }

        this.activeTab = Tab;
        this.activeTab.nav.classList.add("active");
        this.activeTab.content.classList.remove("hidden");

    }

}

export {TabController}