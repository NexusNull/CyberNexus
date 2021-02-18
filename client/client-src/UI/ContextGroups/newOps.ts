import {DirectoryUI} from '../UIElements/DirectoryUI';
import {FileUI} from '../UIElements/FileUI';
import {Modal} from '../UIHelpers/Modal';

export default function append(array, element: DirectoryUI) {
    array.push(
        {
            type: 'subSelection',
            text: 'New:',
            structure: [
                {
                    type: 'selection',
                    text: 'Directory',
                    fn: () => {
                        const modal = new Modal();
                        const domElement = document.createElement('div');

                        domElement.style.background = '#ababab';
                        domElement.style.padding = '5px';
                        domElement.innerHTML = `
                                    <form>
                                        <p style="margin: 5px 0">
                                            <input class="inputNewName" name="name" type="text" value="${element.name}" >
                                        </p>
                                        <input class="buttonCancel" type="button" value="Cancel">
                                        <input class="buttonSubmit" style="float:right;" type="submit" value="Create Directory">
                                    </form>
                                `;

                        const form = domElement.getElementsByTagName('form')[0];
                        const buttonCancel = <HTMLInputElement>domElement.getElementsByClassName('buttonCancel')[0];

                        form.addEventListener('submit', async (e) => {
                            e.preventDefault();
                            modal.destroy();

                            const nameElement = <HTMLInputElement>form.getElementsByClassName('inputNewName')[0];
                            try {
                                await element.fileSystemUI.uiController.viewStates.codeEditor.createDirectory(element.getPath().slice(1) + '/' + nameElement.value + '/');
                            } catch (e) {
                                console.error(e);
                                return;
                            }
                            element.addChild(new DirectoryUI(element.fileSystemUI, element, nameElement.value));
                        });

                        buttonCancel.addEventListener('click', () => {
                            modal.destroy();
                        });

                        modal.setContent(domElement);
                        modal.display();

                        modal.element.getElementsByTagName('input')[0].focus();
                    },
                },
                {
                    type: 'selection',
                    text: 'File',
                    fn: () => {
                        const modal = new Modal();
                        const domElement = document.createElement('div');

                        domElement.style.background = '#ababab';
                        domElement.style.padding = '5px';
                        domElement.innerHTML = `
                                    <form>
                                        <p style="margin: 5px 0">
                                            <input class="inputNewName" name="name" type="text" value="${element.name}" >
                                        </p>
                                        <input class="buttonCancel" type="button" value="Cancel">
                                        <input class="buttonSubmit" style="float:right;" type="submit" value="Create File">
                                    </form>
                                `;

                        const form = domElement.getElementsByTagName('form')[0];
                        const buttonCancel = <HTMLInputElement>domElement.getElementsByClassName('buttonCancel')[0];

                        form.addEventListener('submit', async (e) => {
                            e.preventDefault();
                            modal.destroy();

                            const nameElement = <HTMLInputElement>form.getElementsByClassName('inputNewName')[0];
                            try {
                                await element.fileSystemUI.uiController.viewStates.codeEditor.createFile(element.getPath().slice(1) + '/' + nameElement.value);
                            } catch (e) {
                                console.error(e);
                                return;
                            }
                            element.addChild(new FileUI(element.fileSystemUI, element, nameElement.value));
                        });

                        buttonCancel.addEventListener('click', () => {
                            modal.destroy();
                        });

                        modal.setContent(domElement);
                        modal.display();
                        modal.element.getElementsByTagName('input')[0].focus();
                    },
                },
            ],
        },
    );
}

