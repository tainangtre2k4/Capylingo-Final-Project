import { StyleSheet, Text, TextInput, View } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { colors } from 'react-native-elements';

type Props = {
  withHorizonalPadding: boolean;
  setSearchQuery: Function
};

const SearchBar = ({withHorizonalPadding, setSearchQuery}: Props) => {
  return (
    <View style={[styles.container, withHorizonalPadding && {paddingHorizontal: 20}]}>
      <View style={styles.searchBar}>
        <Ionicons name='search-outline' size={20} color={colors.grey0} />
        <TextInput 
        placeholder='Search' 
        placeholderTextColor={colors.grey0} 
        style = {styles.searchTxt} 
        autoCapitalize='none'
        onChangeText={query => setSearchQuery(query)}
        />
      </View>
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  container: {
    //marginHorizontal: 20,
    marginBottom: 20
  },
  searchBar: {
    backgroundColor: '#E4E4E4',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    flexDirection: 'row'
  },
  searchTxt: {
    fontSize: 14,
    flex: 1,
    color: colors.grey2
  }
});