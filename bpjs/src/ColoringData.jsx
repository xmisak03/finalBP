export var coloring = [];
var i;

// added elements to the list from which are selected metadata for coloring
export const handleColoring = (checked, element, pro) => {
    if (checked) {
        coloring = coloring.concat(element);      
    } 
    else if(element === ""){
        coloring = [];
    }
    else{
        if ((i = coloring.indexOf(element)) > -1){
            coloring.splice(i,1);
        }
        if ((i = pro.coloring.indexOf(element)) > -1){
            pro.coloring.splice(i,1);
        }
    }

}

