import { imagePicker } from "./utils";


const ImagePreviewer = (props: {id: string}) => {

    return (
        <div>
            <img src={imagePicker(props.id)} width="500px" height="250px" alt="preview" />
        </div>
    )

}

export default ImagePreviewer;