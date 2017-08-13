/**
 * Combine all reducers in this file and export the combined reducers.
 * If we were to do this in store.js, reducers wouldn't be hot reloadable.
 */

import { combineReducers } from 'redux';
import { SELECT_ROVER, INVALIDATE_ROVER, REQUEST_ROVERS_DATA, RECEIVE_ROVERS_DATA,
    RECEIVE_ROVER_IMAGES, REQUEST_ROVERS_IMAGES,
    SELECTED_CAMERA, UNSELECTED_CAMERA,
    ADD_EMPTY_SOL, ADD_MEANINGFUL_SOL,
    DISPLAY_NOT_FOUND } from './actions';


function addSolImageData(state, action) {
    switch (action.type) {
        case ADD_MEANINGFUL_SOL:
            if (!state.meaningfulSols.includes(action.sol)) {
                return Object.assign({}, state, {
                    latestMeaningfulSol: action.sol,
                    meaningfulSols: state.meaningfulSols.concat(action.sol),
                });
            } else {
                return state;
            }
        case ADD_EMPTY_SOL:
            if (!state.emptySols.includes(action.sol)) {
                return Object.assign({}, state, {
                    emptySols: state.emptySols.concat(action.sol),
                    [action.sol]: {
                        isFetching: false,
                    }
                });
            } else {
                return state;
            }
        default:
            return state;
    }
}

function receiveRoversImages(state = {
    didInvalidate: false,
    isFetching: false,
    hasFetchedImages: false,
    sol: '',
    earthDate: '',
    camera: '',
    cameraFullName: '',
    photoData: [],
}, action) {
    switch (action.type) {
        case REQUEST_ROVERS_IMAGES:
            return Object.assign({}, state, {
                isFetching: true,
                didInvalidate: false,
                sol: action.sol,
            });
        case RECEIVE_ROVER_IMAGES:
            return Object.assign({}, state, {
                hasFetchedImages: true,
                isFetching: false,
                didInvalidate: false,
                sol: action.sol,
                earthDate: action.earthDate,
                camera: action.camera,
                cameraFullName: action.cameraFullName,
                photoData: action.photos,
            });
        default:
            return state;
    }
}

function putRoverImageDataIntoSolObjects(state = {
    latestMeaningfulSol: '',
    meaningfulSols: [],
    emptySols: [],
    isFetching: false,
    hasFetchedImages: false,
}, action) {
    switch (action.type) {
        case REQUEST_ROVERS_IMAGES:
            return Object.assign({}, state, {
                isFetching: true,
                [action.sol]: receiveRoversImages(state[action.sol], action),
            });
        case RECEIVE_ROVER_IMAGES:
            return Object.assign({}, state, {
                isFetching: false,
                hasFetchedImages: true,
                [action.sol]: receiveRoversImages(state[action.sol], action),
            });
        default:
            return state;
    }
}

function roversImages(state = {
    displayNotFound: false,
}, action) {
    switch (action.type) {
        case REQUEST_ROVERS_IMAGES:
            return Object.assign({}, state, {
                displayNotFound: false,
                [action.camera]: putRoverImageDataIntoSolObjects(state[action.camera], action),
            });
        case DISPLAY_NOT_FOUND:
            return Object.assign({}, state, {
                displayNotFound: true,
            });
        case ADD_EMPTY_SOL:
            return Object.assign({}, state, {
                [action.camera]: addSolImageData(state[action.camera], action),
            });
        case ADD_MEANINGFUL_SOL:
            return Object.assign({}, state, {
                [action.camera]: addSolImageData(state[action.camera], action),
            });
        case RECEIVE_ROVER_IMAGES:
            return Object.assign({}, state, {
                [action.camera]: putRoverImageDataIntoSolObjects(state[action.camera], action),
            });
        default:
            return state;
    }
}

function roversData(state = {
    isFetching: false,
    didInvalidate: false,
    name: '',
    data: {},
    status: '',
}, action) {
    switch (action.type) {
        case INVALIDATE_ROVER:
            return Object.assign({}, state, {
                didInvalidate: true,
            });
        case REQUEST_ROVERS_DATA:
            return Object.assign({}, state, {
                isFetching: true,
                didInvalidate: false,
            });
        case RECEIVE_ROVERS_DATA:
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: false,
                name: action.name,
                data: action.data,
                lastUpdated: action.receivedAt,
            });
        default:
            return state;
    }
}

export function selectedRover(state = '', action) {
    switch (action.type) {
        case SELECT_ROVER:
            return action.rover;
        default:
            return state;
    }
}

export function getDataByRover(state = {}, action) {
    switch (action.type) {
        case RECEIVE_ROVERS_DATA:
        case REQUEST_ROVERS_DATA:
            return Object.assign({}, state, {
                [action.rover]: roversData(state[action.rover], action),
            });
        case DISPLAY_NOT_FOUND:
            return Object.assign({}, state, {
                [action.rover]: roversImages(state[action.rover], action),
            });
        case ADD_EMPTY_SOL:
            return Object.assign({}, state, {
                [action.rover]: roversImages(state[action.rover], action),
            });
        case ADD_MEANINGFUL_SOL:
            return Object.assign({}, state, {
                [action.rover]: roversImages(state[action.rover], action),
            });
        case RECEIVE_ROVER_IMAGES:
        case REQUEST_ROVERS_IMAGES:
            return Object.assign({}, state, {
                [action.rover]: roversImages(state[action.rover], action),
            });
        default:
            return state;
    }
}

export function selectedCamera(state = {
    selected: false,
    rover: undefined,
    cameraIndex: undefined,
    camera: undefined,
    cameraFullName: undefined,
    sol: undefined,
    earthDate: undefined
}, action) {
    switch (action.type) {
        case SELECTED_CAMERA:
            return Object.assign({}, state, {
                selected: true,
                rover: action.rover,
                cameraIndex: action.cameraIndex,
                camera: action.camera,
                cameraFullName: action.cameraFullName,
                sol: action.sol,
                earthDate: action.earthDate,
            });
        case UNSELECTED_CAMERA:
            return Object.assign({}, state, {
                selected: false,
                rover: undefined,
                cameraIndex: undefined,
                camera: undefined,
                cameraFullName: undefined,
                sol: undefined,
            });
        default:
            return state;
    }
}