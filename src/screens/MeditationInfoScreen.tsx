import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import { MeditationInfoMode, RootStackParamList } from './ScreenParams';
import { Button, Text, View, StyleSheet, TextInput, ImageBackground, ScrollView, TouchableOpacity, TouchableHighlight } from 'react-native'
import React, { useContext, useState } from 'react';
import { DispatchContext } from '../contexts/Context';
import { Meditation } from './LogScreen';
import { actionCreators } from '../reducers/MeditationReducer';
import { FlatList } from 'react-native-gesture-handler';
import Slider from '@react-native-community/slider';
import { generateMeditationTitle } from '../types/types';
import { Theme } from './Themes';
import { ImageButton } from '../components/ImageButton';

const stress = [
    ['N/A', '✖️'], 
    ['Serene', '🧘'], 
    ['Relaxed', '😌'],
    ['Normal',  '😑'],
    ['Uneasy',  '😣'],
    ['Stressed', '😫'],
]

const stressLevels = stress.map((val) => {return val[0]});

const depth = [
    ['N/A', '✖️'],
    ['Many Thoughts', '📢'], 
    ['Some Thoughts', '🔊'], 
    ['Few thoughts', '🔉'], 
    ['No Thoughts', '🔈']
];

const depthLevels = depth.map((val) => {return val[0]});

const interruptionLevels = [
    'N/A', 'Once', 'Twice', 'Frequently'
]

const calculateMinSec = (milliseconds: number) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds - (minutes * 60000)) / 1000);

    return {minutes: minutes, seconds: seconds};
}

const ReadMode = (
    meditation: Meditation,
    navigation: StackNavigationProp<RootStackParamList, "MeditationInfo", undefined>,
) => {
    const minSec = calculateMinSec(meditation.timeElapsed);

    let log: JSX.Element;
    let location: JSX.Element;
    let stressBefore;
    let stressAfter;
    let depthCom;
    let feelingsCombo: JSX.Element;
    let interrupted;

    if (meditation.location) {
        location = (
            <View>
                <Text style={ Theme.styles.sectionHeader }>Location</Text>
                <View style={ Theme.styles.card }>
                    <Text style={{fontSize: 15}}>
                        {meditation.location}
                    </Text>
                </View>
            </View>
        )
    }

    if (meditation.log) {
        log = (
            <View>
                <Text style={ Theme.styles.sectionHeader }>Log</Text>
                <View style={ Theme.styles.card }>
                    <Text style={{fontSize: 15}}>
                        { meditation.log }
                    </Text>
                </View>
            </View>
        )
    }

    if (meditation.stressBefore) {
        stressBefore = (
            <View style={ styles.rowItems }>
                <Text style={ Theme.styles.centeredHeader }>Stress Before</Text>
                <View style={ styles.rowCard }>
                    <Text style={ styles.emojiScale }>
                        { stress[meditation.stressBefore][1] }
                    </Text>
                    <Text style={ styles.dataItemText }>
                        { stress[meditation.stressBefore][0] }
                    </Text>                    
                </View>
            </View>
        )
    }

    if (meditation.stressAfter) {
        stressAfter = (
            <View style={ styles.rowItems }>
                <Text style={ Theme.styles.centeredHeader }>Stress After</Text>
                <View style={ styles.rowCard }>
                    <Text style={ styles.emojiScale }>
                        { stress[meditation.stressAfter][1] }
                    </Text>
                    <Text style={ styles.dataItemText }>
                        { stress[meditation.stressAfter][0] }
                    </Text>                    
                </View>
            </View>
        )
    }    

    if (meditation.depth) {
        depthCom = (
            <View style={ styles.rowItems }>
                <Text style={ Theme.styles.centeredHeader }>Depth</Text>
                <View style={ styles.rowCard }>                    
                    <Text style={ styles.emojiScale }>
                        { depth[meditation.depth][1] }
                    </Text>
                    <Text style={ styles.dataItemText }>
                        { depth[meditation.depth][0] }                        
                    </Text>                    
                </View>
            </View>
        )
    }        

    if (meditation.interrupted) {
        interrupted = (
            <View style={ styles.rowItems }>
                <Text style={ Theme.styles.centeredHeader }>Interrupted</Text>
                <View style={ styles.rowCard }>
                    <Text style={ styles.dataItemText }>
                        {interruptionLevels[meditation.interrupted]}
                    </Text>
                </View>
            </View>
        )
    }

    const timeElapsed = (
        <View style={ styles.rowItems }>            
            <Text style={ Theme.styles.centeredHeader }>Time Elapsed</Text>
            <View style={ styles.rowCard }>
                <Text style={ styles.dataItemText }>
                    {minSec.minutes}m {minSec.seconds.toString().padStart(2,'0')}s
                </Text>
            </View>
        </View>
    );

    if ( stressBefore || stressAfter || depthCom )
    {
        feelingsCombo = (
            <View style={ styles.rowContainer }>
                { stressBefore }
                { stressAfter }
                { depthCom }
            </View>
        )
    }

    const interruptTimeCombo = (
        <View style={ styles.rowContainer }>
            { interrupted }
            { timeElapsed }
        </View>
    );

    const listHeader = () => {
        return (
            <View>
                <View>
                    <Text style={styles.title}>
                        { generateMeditationTitle(meditation).dateTime }
                    </Text>
                </View>

                { location }
                { log }
                { feelingsCombo }
                { interruptTimeCombo }

                <Text style={ Theme.styles.sectionHeader }>Chimes</Text>
            </View>            
        )
    }

    const listFooter = () => {
        return (
            <ImageButton
                imageStyle={ styles.imageButtonImageStyle }
                textStyle={ styles.imageButtonTextStyle }
                label='Edit log'
                image={Theme.images.lotusButton}
                onPress={() => { navigation.push('MeditationInfo', { meditation: meditation, mode: MeditationInfoMode.EDIT }) }}
            />
        )
    }

    return (
        <ImageBackground style={ Theme.styles.bg } source={ Theme.images.background }>              
            <FlatList
                data={meditation.chimes}
                renderItem={({item}) => {
                    return (
                        <View style={{ 
                            flexDirection: 'row', 
                            justifyContent: 'space-between',
                            backgroundColor: Theme.colors.card,
                            marginHorizontal: 10,
                            paddingHorizontal: 5,
                        }}>
                            <Text style={ styles.dataItemText }>
                                {item.labels[1]}
                            </Text>
                            <Text style={ styles.dataItemText }>
                                {item.labels[0]}
                            </Text>
                        </View>
                    )
                }}
                
                ListHeaderComponent={listHeader}
                ListHeaderComponentStyle={{paddingBottom: 10}}
                ListFooterComponent={listFooter}
                ListFooterComponentStyle={{paddingTop: 10}}
            />
        </ImageBackground>        
    )
}

type CustomSliderProps = {
    defaultValue: number;
    title: string;
    labels: string[];
    icons?: string[][];
    numLevels: number;
    onUpdate: (value: number) => void;
}

const CustomSlider = (props: CustomSliderProps) => {
    const [curLabelIndex, setCurLabelIndex] = useState(props.defaultValue);

    const curLabel = props.labels[curLabelIndex];
    const curIcon = (props.icons) ? props.icons[curLabelIndex][1] : undefined;
    const label = (curIcon) ? `${curLabel} ${curIcon}` : `${curLabel}`;

    return (
        <View>
            <Text style={ Theme.styles.sectionHeader }>{props.title}</Text> 
            <View style={ Theme.styles.card }>
            <Slider 
                value={props.defaultValue}
                minimumValue={0}
                maximumValue={props.numLevels}
                step={1}
                onValueChange={(value) => {
                    props.onUpdate(value);
                    setCurLabelIndex(value);
                }}
                minimumTrackTintColor={Theme.colors.dot}
                maximumTrackTintColor={Theme.colors.dot}                
                thumbTintColor={Theme.colors.text}
            />
            <Text style={{ textAlign:'center', fontSize: 15, }}>{ label }</Text>
            </View>
        </View>
    )
}

type CustomTextInputProps = {
    startHeight: number;
    maxHeight?: number;
    text: string;
    onChangeText: (text: string) => void
}

const CustomTextInput = (props: CustomTextInputProps) => {
    const [height, setHeight] = useState(props.startHeight);
    const [showPencil, setShowPencil] = useState(true);

    const refInput = React.useRef<TextInput>(null);

    const pencil = (
        <TouchableHighlight 
            style={{marginTop: -15, position: 'absolute', right: 0, top: 10}}
            onPress={() => {
                if(refInput.current) refInput.current.focus();
            }}
        >
            <Text>
                ✏️
            </Text>
        </TouchableHighlight>
    )

    return (
    <View>
        <TextInput
            multiline
            ref={refInput}
            onFocus={() => {
                setShowPencil(false);
            }}
            onBlur={() => {
                setShowPencil(true);
            }}
            onChangeText={(text) => {
                props.onChangeText(text);
            }}
            onContentSizeChange={(e) => {
                const newHeight = e.nativeEvent.contentSize.height;            
                if (props.maxHeight) {
                    setHeight((newHeight > props.maxHeight) ? props.maxHeight : newHeight);
                } else {
                    setHeight(newHeight);
                }
            }}
            style={{height: height}}
            textAlignVertical='top'
        >
            { props.text }
        </TextInput>
        { (showPencil) ? pencil : undefined }
    </View>)
}

const EditMode = (
    meditation: Meditation,
    mode: MeditationInfoMode,
    setEditing: (edit: boolean) => void,
    dispatch: React.Dispatch<any>,
    {route, navigation}: StackScreenProps<RootStackParamList, 'MeditationInfo'>
) => {
    let location = (
        <View>
            <Text style={ Theme.styles.sectionHeader }>Location</Text>
            <View style={ Theme.styles.card }>
                <CustomTextInput
                    startHeight={14}
                    onChangeText={(text) => {meditation.location = text}}
                    text={(meditation.location) ? meditation.location : ''}
                />
            </View>
        </View>
    );

    let log = (
        <View>
            <Text style={ Theme.styles.sectionHeader }>Log</Text>
            <View style={ Theme.styles.card }>
                <CustomTextInput
                    startHeight={14}
                    onChangeText={(text) => {meditation.log = text}}
                    text={(meditation.log) ? meditation.log : ''}
                />
            </View>
        </View>
    );

    let stressBefore = (
        <CustomSlider 
            defaultValue={meditation.stressBefore ? meditation.stressBefore : 0} 
            title={'Stress Before'} 
            labels={stressLevels} 
            icons={stress}
            numLevels={5}
            onUpdate={(value: number) => {
                meditation.stressBefore = value === 0 ? undefined : value;
            }}
        />
    );

    let stressAfter = (
        <CustomSlider 
            defaultValue={meditation.stressAfter ? meditation.stressAfter : 0} 
            title={'Stress After'} 
            labels={stressLevels}
            icons={stress}
            numLevels={5}
            onUpdate={(value: number) => {
                meditation.stressAfter = value === 0 ? undefined : value;
            }}
        />
    );

    let depthSlider = (
        <CustomSlider 
            defaultValue={meditation.depth ? meditation.depth : 0} 
            title={'Depth'} 
            labels={depthLevels}
            icons={depth}
            numLevels={4}
            onUpdate={(value: number) => {
                meditation.depth = value === 0 ? undefined : value;
            }}
        />
    );

    let interrupted = (
        <CustomSlider 
            defaultValue={meditation.interrupted ? meditation.interrupted : 0} 
            title={'Interrupted'} 
            labels={interruptionLevels}
            numLevels={3}
            onUpdate={(value: number) => {
                meditation.interrupted = value === 0 ? undefined : value;
            }}
        />
    )

    let startMeditationButton = (
        <ImageButton
            imageStyle={ styles.imageButtonImageStyle }
            textStyle={ styles.imageButtonTextStyle }
            label='Start Meditation'
            image={Theme.images.lotusButton}
            onPress={() => {
                dispatch(actionCreators.updateMeditation(meditation));
                navigation.replace('Meditate', {meditation: meditation});
            }}
        />
    )

    let saveChangesButton = (
        <ImageButton
            imageStyle={ styles.imageButtonImageStyle }
            textStyle={ styles.imageButtonTextStyle }
            label='Save Changes'
            image={Theme.images.lotusButton}
            onPress={() => { 
                dispatch(actionCreators.updateMeditation(meditation))

                if (mode === MeditationInfoMode.POST_MED)
                {
                    navigation.popToTop();
                } if (mode === MeditationInfoMode.EDIT) {
                    navigation.pop();
                }
            }}
        />
    )

    let discardChangesButton = (
        <ImageButton
            imageStyle={ styles.imageButtonImageStyle }
            textStyle={ styles.imageButtonTextStyle }
            label='Discard Changes'
            image={Theme.images.lotusButton}
            onPress={() => { navigation.pop(); }}
        />
    )

    let deleteMeditationButton = (
        <ImageButton
            imageStyle={ styles.imageButtonImageStyle }
            textStyle={ styles.imageButtonTextStyle }
            label='Delete Meditation'
            image={Theme.images.lotusButton}
            onPress={() => { 
                dispatch(actionCreators.deleteMeditation(meditation));
                if (mode === MeditationInfoMode.POST_MED)
                {
                    navigation.popToTop();
                } if (mode === MeditationInfoMode.EDIT) {
                    navigation.navigate('Log');
                }
            }}
        />
    )

    return (
        <ImageBackground style={ Theme.styles.bg } source={ Theme.images.background }>
            <ScrollView contentContainerStyle={{flexGrow: 1}} >            
                <View>
                    <Text style={styles.title}>
                        { generateMeditationTitle(meditation).dateTime }
                    </Text>
                </View>
                
                {location}
                {log}      
                { (mode === MeditationInfoMode.PRE_MED  || mode === MeditationInfoMode.EDIT) ? stressBefore : null }
                { (mode === MeditationInfoMode.POST_MED || mode === MeditationInfoMode.EDIT) ? stressAfter : null }
                { (mode === MeditationInfoMode.POST_MED || mode === MeditationInfoMode.EDIT) ? depthSlider : null }
                { (mode === MeditationInfoMode.POST_MED || mode === MeditationInfoMode.EDIT) ? interrupted : null }
                {/* TODO: https://stackoverflow.com/a/50714355 */}
                <View style={styles.sideBySide}>
                    { (mode === MeditationInfoMode.POST_MED || mode === MeditationInfoMode.EDIT) ? saveChangesButton : null }
                    {  mode === MeditationInfoMode.EDIT ? discardChangesButton : null }
                    {  mode === MeditationInfoMode.PRE_MED ? startMeditationButton : null }             
                    { (mode === MeditationInfoMode.POST_MED || mode === MeditationInfoMode.EDIT) ? deleteMeditationButton : null }
                </View>            
            </ScrollView>
        </ImageBackground>
    )
}

export const MediationInfoScreen = ({ route, navigation }: StackScreenProps<RootStackParamList, 'MeditationInfo'> ) => {
    const {state, dispatch} = useContext(DispatchContext);

    const [isEditing, setEditing] = useState(route.params.mode !== MeditationInfoMode.LOG);

    let newMeditation: Meditation = route.params.meditation;

    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            if (newMeditation.key in state.meditations) {
                newMeditation = JSON.parse(JSON.stringify(state.meditations[newMeditation.key]));
            } else {
                newMeditation = JSON.parse(JSON.stringify(route.params.meditation));
            }
        });
    
        return unsubscribe;
    }, [navigation]);
    
    if (isEditing) {
        return EditMode(newMeditation, route.params.mode, setEditing, dispatch, {route, navigation});
    } else {
        return ReadMode(newMeditation, navigation);
    }
};

const styles = StyleSheet.create({
    sideBySide: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly',
    },

    title: {
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingTop: 10,
    },

    rowContainer: {
        flexDirection: 'row',
        alignItems: 'stretch',
        alignContent: 'stretch',
        paddingBottom: 5, 
    },

    rowItems: {
        paddingHorizontal: 10,
        flexGrow: 1,
    },

    rowCard: {
        padding: 5,
        backgroundColor: Theme.colors.card,
        alignItems: 'center',
    },

    emojiScale: {
        fontSize: 30,
    },

    dataItemText: {
        fontSize: 20,
    },

    imageButtonImageStyle: {
        width: 80, 
        height: undefined, 
        aspectRatio: 1.8 
    },

    imageButtonTextStyle: {
        fontSize: 16,
        textShadowColor: Theme.colors.primary,
        //textShadowOffset: {width: -1, height: 1},
        textShadowRadius: 10,
    }
});