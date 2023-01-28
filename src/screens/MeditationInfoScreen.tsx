import { StackScreenProps } from '@react-navigation/stack';
import { MeditationInfoMode, RootStackParamList } from './ScreenParams';
import { Button, Text, View, StyleSheet, TextInput, ImageBackground } from 'react-native'
import { useContext, useState } from 'react';
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
    setEditing: (edit: boolean) => void
) => {
    const minSec = calculateMinSec(meditation.timeElapsed);

    let log;
    let location;
    let stressBefore;
    let stressAfter;
    let depthCom;
    let feelingsCombo;
    let interrupted;

    if (meditation.location) {
        location = (
            <View>
                <Text style={ styles.sectionHeader }>Location</Text>
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
                <Text style={ styles.sectionHeader }>Log</Text>
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
                <Text style={ styles.centeredHeader }>Stress Before</Text>
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
                <Text style={ styles.centeredHeader }>Stress After</Text>
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
                <Text style={ styles.centeredHeader }>Depth</Text>
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
                <Text style={ styles.centeredHeader }>Interrupted</Text>
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
            <Text style={ styles.centeredHeader }>Time Elapsed</Text>
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

    return (
        <View style={ Theme.styles.container }>
            <ImageBackground style={ Theme.styles.bg } source={ Theme.images.background }>
                <View>
                    <Text style={styles.title}>
                        { generateMeditationTitle(meditation).dateTime }
                    </Text>
                </View>

                { location }
                { log }
                { feelingsCombo }
                { interruptTimeCombo }
                
                <View>
                    <Text style={ styles.sectionHeader }>Chimes</Text>
                    <View style={ Theme.styles.card }>
                        <FlatList
                            data={meditation.chimes}
                            renderItem={({item}) => {
                                return (
                                    <View style={{ 
                                        flexDirection: 'row', 
                                        justifyContent: 'space-between',
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
                        />
                    </View>
                </View>
    
                <ImageButton
                    imageStyle={{ width: 100, height: undefined, aspectRatio: 1.8 }}
                    textStyle={{ fontSize: 18 }}
                    label='Edit log'
                    image={Theme.images.lotusButton}
                    onPress={() => { setEditing(true); }}
                />
            </ImageBackground>
        </View>
    )
}

type CustomSliderProps = {
    defaultValue: number;
    title: string;
    labels: string[];
    numLevels: number;
    onUpdate: (value: number) => void;
}

const CustomSlider = (props: CustomSliderProps) => {
    const [curLabel, setCurLabel] = useState(props.labels[props.defaultValue]);

    return (
        <View>
            <Text>{props.title}</Text>
            <Text>{curLabel}</Text>
            <Slider 
                value={props.defaultValue}
                minimumValue={0}
                maximumValue={props.numLevels}
                step={1}
                onValueChange={(value) => {
                    props.onUpdate(value);
                    setCurLabel(props.labels[value]);
                }}
            />
        </View>
    )
}

const EditMode = (
    meditation: Meditation,
    mode: MeditationInfoMode,
    setEditing: (edit: boolean) => void,
    dispatch: React.Dispatch<any>,
    {route, navigation}: StackScreenProps<RootStackParamList, 'MeditationInfo'>
) => {
    let newMeditation: Meditation = JSON.parse(JSON.stringify(meditation))

    let log = (
        <View>
            <Text>Log:</Text>
            <TextInput
                    multiline
                    numberOfLines={10}
                    onChangeText={(text) => {newMeditation.log = text}}
                >
                    {meditation.log}
            </TextInput>
        </View>
    );

    let location = (
        <View>
            <Text>Location:</Text>
            <TextInput
                onChangeText={(text) => {newMeditation.location = text}}
            >
                {meditation.location}
            </TextInput>
        </View>
    );

    let stressBefore = (
        <CustomSlider 
            defaultValue={meditation.stressBefore ? meditation.stressBefore : 0} 
            title={'Stress Before:'} 
            labels={stressLevels} 
            numLevels={5}
            onUpdate={(value: number) => {
                newMeditation.stressBefore = value === 0 ? undefined : value;
            }}
        />
    );

    let stressAfter = (
        <CustomSlider 
            defaultValue={meditation.stressAfter ? meditation.stressAfter : 0} 
            title={'Stress After:'} 
            labels={stressLevels}
            numLevels={5}
            onUpdate={(value: number) => {
                newMeditation.stressAfter = value === 0 ? undefined : value;
            }}
        />
    );

    let depth = (
        <CustomSlider 
            defaultValue={meditation.depth ? meditation.depth : 0} 
            title={'Depth:'} 
            labels={depthLevels}
            numLevels={4}
            onUpdate={(value: number) => {
                newMeditation.depth = value === 0 ? undefined : value;
            }}
        />
    );

    let interrupted = (
        <CustomSlider 
            defaultValue={meditation.interrupted ? meditation.interrupted : 0} 
            title={'Interrupted:'} 
            labels={interruptionLevels}
            numLevels={3}
            onUpdate={(value: number) => {
                newMeditation.interrupted = value === 0 ? undefined : value;
            }}
        />
    )

    let startMeditationButton = (
        <Button
            title='Start Meditation'
            onPress={() => {
                dispatch(actionCreators.updateMeditation(newMeditation));
                navigation.replace('Meditate', {meditation: newMeditation});
            }}
        />
    )

    let cancelMeditationButton = (
        <Button
            title='Cancel Meditation'
            onPress={() =>{
                navigation.popToTop();
            }}            
        />
    )

    let saveChangesButton = (
        <Button
            title='Save changes'
            onPress={() => { 
                dispatch(actionCreators.updateMeditation(newMeditation))
                setEditing(false); 
                if (mode === MeditationInfoMode.POST_MED)
                {
                    navigation.popToTop();
                }
            }}
        />
    )

    let discardChangesButton = (
        <Button
            title='Discard changes'
            onPress={() => { setEditing(false); }}
        />
    )

    let deleteMeditationButton = (
        <Button
            title='Delete meditation'
            onPress={() => { 
                dispatch(actionCreators.deleteMeditation(meditation));
                navigation.pop();
            }}
        />
    )

    return (
        <View>
            <View>
                <Text>{meditation.key}</Text>
            </View>
            {location}
            {log}      
            { (mode === MeditationInfoMode.PRE_MED  || MeditationInfoMode.LOG) ? stressBefore : null }
            { (mode === MeditationInfoMode.POST_MED || MeditationInfoMode.LOG) ? stressAfter : null }
            { (mode === MeditationInfoMode.POST_MED || MeditationInfoMode.LOG) ? depth : null }
            { (mode === MeditationInfoMode.POST_MED || MeditationInfoMode.LOG) ? interrupted : null }
            <View style={styles.sideBySide}>
                { (mode === MeditationInfoMode.POST_MED || MeditationInfoMode.LOG) ? saveChangesButton : null }
                {  mode === MeditationInfoMode.LOG ? discardChangesButton : null }
                {  mode === MeditationInfoMode.PRE_MED ? startMeditationButton : null }
                {  mode === MeditationInfoMode.PRE_MED ? cancelMeditationButton : null }                
                { (mode === MeditationInfoMode.POST_MED || MeditationInfoMode.LOG) ? deleteMeditationButton : null }
            </View>
        </View>
    )
}

// TODO: Edit and save changes to meditation log also more fields
// eg. Stress level, location
export const MediationInfoScreen = ({ route, navigation }: StackScreenProps<RootStackParamList, 'MeditationInfo'> ) => {
    const {state, dispatch} = useContext(DispatchContext);

    const [isEditing, setEditing] = useState(route.params.mode !== MeditationInfoMode.LOG);
    
    if (isEditing) {
        return EditMode(route.params.meditation, route.params.mode, setEditing, dispatch, {route, navigation});
    } else {
        return ReadMode(route.params.meditation, setEditing);
    }
};

const styles = StyleSheet.create({
    sideBySide: {
        display: 'flex',
        flexDirection: 'row',
    },

    title: {
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingTop: 10,
    },

    sectionHeader: {
        fontWeight: 'bold',
        fontSize: 16,
        paddingLeft: 10,
        marginBottom: -10,
    },

    centeredHeader: {
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center',
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
    }
});