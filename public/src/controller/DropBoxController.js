class DropBoxController {

    constructor(){
        this.buttonSendFile = document.querySelector('#btn-send-file');
        this.inputSendFile = document.querySelector('#files');
        this.snackModal = document.querySelector('#react-snackbar-root')
        this.progressBar = this.snackModal.querySelector('.mc-progress-bar-fg');
        this.nameFile = this.snackModal.querySelector('.filename');
        this.timeLeftUpload = this.snackModal.querySelector('.timeleft');

        this.initEvents();
    }

    //método inicial do evendo do button enviar arquivos
    initEvents(){
        this.buttonSendFile.addEventListener('click', event => {
            this.inputSendFile.click();
        });

        this.inputSendFile.addEventListener('change', event =>{
            this.uploadFiles(event.target.files);
            this.progressModalShow();
            this.inputSendFile.value = '';
        });
    }

    progressModalShow(show = true){
        this.snackModal.style.display = (show) ? 'block' : 'none';
    }

    //método que faz de fato o upload usando promise.all()
    uploadFiles(files){
        
        let promises = [];
        
        [...files].forEach(file => {
            promises.push(new Promise((resolve, reject) => {
                let ajax = new XMLHttpRequest();
                
                ajax.open('POST', '/upload');

                ajax.onload = event => {
                    this.progressModalShow(false)
                    try{
                        resolve(JSON.parse(ajax.responseText));
                    }catch(e){
                        reject(e);
                    }
                };
                ajax.onerror = event =>{
                    this.progressModalShow(false)
                    reject(event);
                };
                
                ajax.upload.onprogress = event =>{
                    this.uploadProgress(event, file);
                }

                let formData = new FormData();

                formData.append('input-file', file);

                this.uploadTime = Date.now();

                ajax.send(formData);

            }));
        });

        return Promise.all(promises);
    }

    //função responsável por mostrar o nível de progresso na barra
    uploadProgress(event, file){

        let time = Date.now() - this.uploadTime;
        let loaded = event.loaded;
        let total = event.total;
        let porcent = parseInt((loaded/total)*100);
        let timeLeft = ((100-porcent) * time) / porcent;

        this.progressBar.style.width = `${porcent}%`;

        this.nameFile.innerHTML = file.name;
        this.timeLeftUpload.innerHTML = this.formatTime(timeLeft)
        
        console.log(time, timeLeft, porcent);
    }

    //formatação da data
    formatTime(duration){
        let seconds = parseInt((duration / 1000) % 60);
        let minutes = parseInt((duration / (1000 * 60)) % 60);
        let hours = parseInt((duration / (1000 * 60 * 60)) % 24);

        if(hours > 0){
            return `${hours} horas, ${minutes} minutos e ${seconds} segundos`;
        }

        if(minutes > 0){
            return `${minutes} minutos e ${seconds} segundos`;
        }

        if(seconds > 0){
            return `${seconds} segundos`;
        }

        return ''
    }

} 