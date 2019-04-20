class DropBoxController {

    constructor(){
        this.buttonSendFile = document.querySelector('#btn-send-file');
        this.inputSendFile = document.querySelector('#files');
        this.snackModal = document.querySelector('#react-snackbar-root')
        this.initEvents();
    }

    //método inicial do evendo do button enviar arquivos
    initEvents(){
        this.buttonSendFile.addEventListener('click', event => {
            this.inputSendFile.click();
        });

        this.inputSendFile.addEventListener('change', event =>{
            this.uploadFiles(event.target.files);
            this.snackModal.style.display = 'block'
        });
    }

    uploadFiles(files){
        
        let promises = [];
        
        [...files].forEach(file => {
            promises.push(new Promise((resolve, reject) => {
                let ajax = new XMLHttpRequest();
                
                ajax.open('POST', '/upload');

                ajax.onload = event => {
                    try{
                        resolve(JSON.parse(ajax.responseText));
                    }catch(e){
                        reject(e);
                    }
                };
                ajax.onerror = event =>{
                    reject(event);
                };

                let formData = new FormData();

                formData.append('input-file', file);

                ajax.send(formData);

            }));
        });

        return Promise.all(promises);
    }

} 