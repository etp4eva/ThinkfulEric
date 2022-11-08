import { useState } from "react"
import { Text, Button, FlatList, ListRenderItem, View } from "react-native"

type Params = {
    removeFn: (index: number) => void;
    data: RemovableListItemInterface[];
}

export interface RemovableListItemInterface {
    label: String;
    removeFn: () => void;
}

export const RemovableListItem = (params: RemovableListItemInterface) => {
    return (
        <View>
            <Text>{params.label}</Text>
            <Button
                title="X"
                onPress={params.removeFn}
            />
        </View>
    )
}

export const RemoveableItemList = (params: Params) => {
    const renderItem = ({item, index}: {item: RemovableListItemInterface, index: number}) => {
        return (
            <RemovableListItem 
                label={item.label} 
                removeFn={() => params.removeFn(index)}
            />
        )
    }

    return (
        <FlatList 
            data={params.data}
            renderItem={renderItem}
        />
    )
}