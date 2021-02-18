import {DirectoryUI} from '../UIElements/DirectoryUI';
import {FileUI} from '../UIElements/FileUI';
import {Modal} from '../UIHelpers/Modal';

export default function append(array, element: DirectoryUI | FileUI) {
    array.push(
        {
            type: 'selection',
            text: 'Rename',
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
                                <input class="buttonSubmit" style="float:right;" type="submit" value="Rename">
                            </form>
                        `;

                const form = domElement.getElementsByTagName('form')[0];
                const buttonCancel = <HTMLInputElement>domElement.getElementsByClassName('buttonCancel')[0];

                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    modal.destroy();
                    const nameElement = <HTMLInputElement>form.getElementsByClassName('inputNewName')[0];
                    element.rename(nameElement.value);
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
            text: 'Delete',
            fn: () => {
                const modal = new Modal();
                const domElement = document.createElement('div');

                domElement.style.background = '#ababab';
                domElement.style.padding = '5px';

                domElement.innerHTML = `
                            <p>Are you sure you want to delete the '${element.name}' directory?<br>
                                All files inside will be irrecoverable. 
                            </p>
                            <button class="buttonCancel">Cancel</button>
                            <button class="buttonOK">OK</button>
                        `;

                const buttonCancel = domElement.getElementsByClassName('buttonCancel')[0];
                const buttonOK = domElement.getElementsByClassName('buttonOK')[0];

                buttonCancel.addEventListener('click', () => {
                    modal.destroy();
                });

                buttonOK.addEventListener('click', () => {
                    element.parent.removeChild(element.name);
                    modal.destroy();
                });

                modal.setContent(domElement);
                modal.display();
            },
        },
    );
}
