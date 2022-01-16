import React, { useRef, useState } from 'react';
import { generateUuid } from '../../../../utils';
import Button from '../../../Button';
import AppForm from './AppForm';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { SettingsSectionProps } from '../../../../pages/settings';

export default function AppSettings({ config, modifiedConfig, setModifiedConfig, saveNewConfig }: SettingsSectionProps) {
    const [editEnabledAppId, setEditEnabledAppId] = useState<string>()
    const endingElement = useRef<HTMLDivElement>(null);

    const createNewApp = () => {
        modifiedConfig.apps.push({ id: generateUuid(), name: "", url: "", icon: "" });
        setModifiedConfig({ ...modifiedConfig });
        setTimeout(scrollToBottom, 100);
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

    const scrollToBottom = () => {
        endingElement.current?.scrollIntoView({ behavior: "smooth" });
    }

    return (
        <div className="flex flex-col gap-4 relative">
            <div className="flex gap-4 bg-nord-1 p-4 w-full sticky top-0 z-50 border-t border-opacity-60 shadow-lg">
                <Button onClick={createNewApp} colour="green">New app</Button>
                <Button onClick={scrollToBottom}>Scroll to bottom</Button>
            </div>

            <div className="p-4 pt-1">
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
                                                            <AppForm app={app} editEnabled={editEnabledAppId === app.id} enableEditing={setEditEnabledAppId} modifiedConfig={modifiedConfig} setModifiedConfig={setModifiedConfig} />
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

                {/* Ending element to scroll to bottom */}
                <div ref={endingElement}></div>
            </div>
        </div >
    )
}
