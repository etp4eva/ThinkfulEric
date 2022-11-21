import { Text, Button, FlatList, ListRenderItem, View } from "react-native"

type Params = {
    data: any[];
    removeFn: (idx: number) => void;
    minItems?: number;
}

export interface RemovableListItemInterface {
    labels: String[];
}

export const RemoveableItemList = (params: Params) => {
    const isRemoveRendered = (!params.minItems) || params.minItems < params.data.length;
    
    const renderItem = ({item, index}: {item: RemovableListItemInterface, index: number}) => {
        const hasSubLabel = item.labels.length > 1;        
        let removeButton;
        let subLabel;

        if (isRemoveRendered)
        {
            removeButton = (
                <Button
                    title="X"
                    onPress={() => params.removeFn(index)}
                />
            )
        }

        if (hasSubLabel)
        {
            subLabel = (
                <Text>{item.labels[1]}</Text>
            )
        }

        return (
            <View>
                <Text>{item.labels[0]}</Text>
                {subLabel}
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