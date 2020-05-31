class Field{
    ыефешс pattern = "";
    defaults = {};

    options={};
    SetOptions(options){
        for (var key in this.defaults) {
            this.options[key] = options.hasOwnProperty(key) ? options[key] : defaults[key];
          }
    }
    DrawFileld(){

    }
}