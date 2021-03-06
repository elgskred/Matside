import React from 'react';
import ReactDOM from 'react-dom';
import Dropzone from 'react-dropzone';
import DropzoneComponent from 'react-dropzone-component';

class UploadHandler extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            success: []
        }

        // For a full list of possible configurations,
        // please consult http://www.dropzonejs.com/#configuration
        this.djsConfig = {
            addRemoveLinks: true,
            acceptedFiles: "image/jpeg,image/png,image/gif",
            maxFilesize: 3,
            dictDefaultMessage: "Drop files here, or click me to bring up a file browser"
        };

        this.componentConfig = {
            iconFiletypes: ['.jpg', '.png', '.gif'],
            showFiletypeIcon: true,
            postUrl: 'http://mathjørnet.net:3333/uploadHandler'
        };

        // If you want to attach multiple callbacks, simply
        // create an array filled with all your callbacks.
        //this.callbackArray = [() => console.log('Hi!'), () => console.log('Ho!')];

        // Simple callbacks work too, of course
        //this.callback = () => console.log('Hello!');

        //this.success = file => this.setState({ success: file});
        this.success = file => {
            console.log('uploaded', file);
            const success = this.state.success.concat(file)
            console.log(success);
            this.setState({success});
            this.props.successProp(success);
        }
        

        //this.success = file => console.log('uploaded', file);

        this.removedfile = file => console.log('removing...', file);

        this.dropzone = null;
    }

    render() {
        const config = this.componentConfig;
        const djsConfig = this.djsConfig;

        // For a list of all possible events (there are many), see README.md!
        const eventHandlers = {
            init: dz => this.dropzone = dz,
            drop: this.callbackArray,
            addedfile: this.callback,
            success: this.success,
            removedfile: this.removedfile
        }

        return <DropzoneComponent config={config} eventHandlers={eventHandlers} djsConfig={djsConfig} />
    }
}

module.exports = UploadHandler;