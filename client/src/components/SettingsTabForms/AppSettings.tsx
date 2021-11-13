import React, { useContext } from 'react';
import { SettingsContext } from '../../modules/settings section/settingsContext';
import { generateUuid } from '../../utils';
import App from '../App';
import Button from '../Button';
import AppForm from './AppForm';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

export default function AppSettings() {
    const { modifiedConfig, setModifiedConfig } = useContext(SettingsContext)!;

    const removeApp = (appId: string) => {
        modifiedConfig!.apps = modifiedConfig!.apps.filter((app) => (app.id !== appId))
        setModifiedConfig({ ...modifiedConfig! });
    }

    const createNewApp = () => {
        modifiedConfig!.apps.push({ id: generateUuid(), name: "", url: "", icon: "" });
        setModifiedConfig({ ...modifiedConfig! });
    }

    const onDragEnd = (result: DropResult) => {
        const { destination, source, draggableId } = result;
        // Item was dropped outside of droppable area
        if (!destination)
            return;

        // Item was dropped back in the same position
        if (destination.droppableId === source.droppableId &&
            destination.index === source.index)
            return;

        const appsArray = modifiedConfig!.apps;
        const target = appsArray.find(x => x.id === draggableId);
        // Couldn't find moved item
        if (!target)
            return;

        // Move the item to its new position
        appsArray.splice(source.index, 1);
        appsArray.splice(destination.index, 0, target)
        modifiedConfig!.apps = appsArray;
        setModifiedConfig({ ...modifiedConfig! })
    }

    return (
        <div className="grid grid-cols-1 gap-4">
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="droppable">
                    {
                        (provided, snapshot) => (
                            <div
                                className="flex flex-col"
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                            >
                                {modifiedConfig!.apps.map((app, index) => (
                                    <Draggable draggableId={app.id} index={index} key={app.id}>
                                        {(provided) => (
                                            <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef} className="flex border border-nord-4 bg-nord-1 border-opacity-40 rounded p-2 gap-8 mt-4">
                                                <div className="lg:grid lg:grid-cols-3 lg:gap-8 w-full">
                                                    <div className="col-span-2">
                                                        <AppForm app={app} />
                                                    </div>
                                                    <div className="grid grid-cols-1">
                                                        <div className="my-auto">
                                                            <App app={app} preview />
                                                        </div>
                                                        <div className="flex justify-end">
                                                            <div className="mt-auto w-24">
                                                                <Button onClick={() => (removeApp(app.id))} colour="red">Delete</Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </Draggable>
                                ))
                                }
                                {provided.placeholder}
                            </div>
                        )
                    }
                </Droppable>
            </DragDropContext>
            <div className="w-24">
                <Button onClick={createNewApp} colour="green">New app</Button>
            </div>
        </div >
    )
}
