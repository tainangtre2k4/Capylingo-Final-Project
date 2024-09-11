import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const Styles = StyleSheet.create({
    sentenceContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
      },
      selectedWordButton: {
        backgroundColor: 'transparent',
        borderBottomWidth: width * 0.00267,
        borderColor: '#898A8D',
        marginVertical: width * 0.0213,
        marginHorizontal: width * 0.04,
        minWidth: width * 0.1866,
        height: height * 0.04,
        alignItems: 'center',
        justifyContent: 'center',
      },
      selectedWordText: {
        fontSize: width * 0.053,
        color: '#0074CE',
        fontWeight: '500',
      },
});
