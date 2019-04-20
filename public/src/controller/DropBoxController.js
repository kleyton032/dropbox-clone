class DropBoxController {

    constructor(){
        this.buttonSendFile = document.querySelector('#btn-send-file');
        this.inputSendFile = document.querySelector('#files');
        this.snackModal = document.querySelector('#react-snackbar-root')
        this.initEvents();
    }


    initEvents(){
        this.buttonSendFile.addEventListener('click', event => {
            this.inputSendFile.click();
        });

        this.inputSendFile.addEventListener('change', event =>{
            console.log(event.target.files)
            this.snackModal.style.display = 'block'
        });
    }

} 