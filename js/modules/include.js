class IncludeHTML{
    constructor(){

        this.elements = [];

        this.z = document.getElementsByTagName("*");
        for (let i = 0; i < this.z.length; i++) {
            const e = this.z[i];

            const file = e.getAttribute("include-html");
    
            if (file) {

                this.elements.push({
                    "file": file,
                    "dom": e,
                    "data": undefined
                })

            }
        }
    
        for (let e of this.elements){
            fetch(e["file"])
            .then((res) => {
                return res.text();
            }).then((res) => {
                e["data"] = res;
                e["dom"].removeAttribute('include-html');
            })
        }

        this.load();
    }

    getStatus(){
        for( let e of this.elements){
            if (e.data == undefined){
                return false;
            }
            return true;
        }
    }

    load(){
        if (this.getStatus()){
            this.loadAfter();
        }else{
            setTimeout(() => {
                this.load();
            }, 500)
        }
    }

    loadAfter(){
        for (let e of this.elements){
            e['dom'].innerHTML = e['data'];
        }
    }
}

export { IncludeHTML }