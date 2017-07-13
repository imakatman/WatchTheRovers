/**
 *
 * PicsNavigation
 *
 */

import React from 'react';
import styled from 'styled-components';
import { Flex, Box } from 'grid-styled';

const pathToCuriosityCameraImages = require.context('assets/cameras/Curiosity');
const curiosityCameras = ['FHAZ.jpg', 'NAVCAM.jpg', 'MAST.jpg'];

const Wrapper = styled.div`
    position: absolute;
    bottom: 0;
    background-color: rgba(0,0,0,0.5);
`;

const H4 = styled.h4`

`;

const Ul = styled.ul`
  padding: 0;
`;

const Li = styled.li`
  list-style:none;
`;

class PicsNavigation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            noOfCameras: "",
            latestEarthDate: "",
            curiosityCameras: ['FHAZ.jpg', 'NAVCAM.jpg', 'MAST.jpg'],
            cameraImages: [],
        }

        this.dynamicImport = this.dynamicImport.bind(this);
        this.selectAppropriateImages = this.selectAppropriateImages.bind(this);
    }

    componentDidMount(){
        console.log(this.props);
        this.setState({
            rover: this.props.selectedRover,
            noOfCameras: this.props.cameras.length,
            latestEarthDate: this.props.latestEarthDate,
        });

        this.selectAppropriateImages(this.state.rover);
    }

    dynamicImport(path){
        return import(`assets/cameras/Curiosity/${path}`);
    }

    selectAppropriateImages(rover){
        const imageFiles = [];

        this.state.curiosityCameras.map(imgPath=> this.dynamicImport(imgPath).then(path=>imageFiles.push(path)));

        // const imageFiles = imageFiles.slice

        this.setState({
            cameraImages: imageFiles
        })

        console.log(this.state.cameraImages);


        // switch(rover){
        //     case "Curiosity":
        //         curiosityCameras.map(imgFile=>
        //             this.setState(prevState=>{
        //                 cameraImages: prevState.push(pathToCuriosityCameraImages(imgFile, true))
        //             })
        //         )
        //         break;
        //     default:
        //         return;
        // }
    }

    render() {
        const widthOfWrapper =  {width: 25 * this.state.noOfCameras + "%"};

        // console.log(this.state);
        // style={{backgroundImage: "url(" + this.state.cameraImages[i] + ")"}}

        return (
            <Wrapper style={widthOfWrapper}>
                <H4>{this.state.latestEarthDate}</H4>
                <Flex>
                    {this.props.cameras.map((camera, i) =>
                        <Box
                            style={{backgroundImage:"url(" + this.state.cameraImages[i] + ")"}}
                            data-camera={camera.name}
                            key={i}
                            onClick={() => this.props.fetchPictures(i)}>
                            {camera.full_name}
                        </Box>
                    )}
                </Flex>
            </Wrapper>
        );
    }
}

PicsNavigation.propTypes = {};

export default PicsNavigation;
