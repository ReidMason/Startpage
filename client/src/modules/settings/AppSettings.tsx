import React, { useContext } from 'react';
import { SettingsContext } from '../../modules/settings/settingsContext';
import { generateUuid } from '../../utils';
import Button from '../../components/Button';
import AppForm from '../../components/AppForm';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

export default function AppSettings() {
    const { modifiedConfig, setModifiedConfig } = useContext(SettingsContext)!;

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
        <div className="flex flex-col gap-4 w-6/12">
            <h2 className="text-xl text-nord-4 semibold">Apps settings</h2>

            <div className="w-24">
                <Button onClick={createNewApp} colour="green">New app</Button>
            </div>

            {
                modifiedConfig!.apps.length === 0 ?
                    <p>No apps found. Create one to get started</p>
                    :
                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="droppable">
                            {
                                (provided) => (
                                    <div
                                        className="flex flex-col"
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                    >
                                        {modifiedConfig!.apps.map((app, index) => (
                                            <Draggable draggableId={app.id} index={index} key={app.id}>
                                                {(provided) => (
                                                    <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef} className="mb-4">
                                                        <AppForm app={app} />
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
            }
        </div >
    )
}
