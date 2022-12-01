import Image1 from '../../docker/config/webpack/1.png';
import Image2 from '../../docker/config/webpack/2.png';
import Image3 from '../../docker/config/webpack/3.png';
import Image4 from '../../docker/config/webpack/4.png';
import Image5 from '../../docker/config/webpack/5.png';

export const imagePicker = (id: string) => {
    if(id === "1"){
        return Image1;
    }
    if(id === "2"){
        return Image2;
    }
    if(id === "3"){
        return Image3;
    }
    if(id === "4"){
        return Image4;
    }
    return Image5;
}