import { Text, Button, FlatList, ListRenderItem, View } from "react-native"

type Params = {
    data: any[];
    removeFn: (idx: number) => void;
    minItems?: number;
}

export interface RemovableListItemInterface {
    label: String;
}

export const RemoveableItemList = (params: Params) => {
    const isRemoveRendered = (!params.minItems) || params.minItems < params.data.length;
    
    const renderItem = ({item, index}: {item: RemovableListItemInterface, index: number}) => {
        let removeButton;

        if (isRemoveRendered)
        {
            removeButton = (
                <Button
                    title="X"
                    onPress={() => params.removeFn(index)}
                />
            )
        }

        return (
            <View>
                <Text>{item.label}</Text>
                {removeButton}
            </View>
        )
    }

    return (
        <FlatList 
            data={params.data}
            renderItem={renderItem}
        />
    )
}