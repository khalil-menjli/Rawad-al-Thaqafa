import React, {useState} from 'react';
import {View, TextInput, FlatList} from 'react-native';
import {Stack} from 'expo-router';
import {Search} from 'lucide-react-native';
import {icons} from '@/constants';
import { SafeAreaView } from "react-native-safe-area-context";

const SearchScreen = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        // Implement search logic here
    };

    return (
        <SafeAreaView className="flex-1 bg-white">

            <View className="px-4 py-2">
                <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-2">
                    <Search size={20} color="#666"/>
                    <TextInput
                        className="flex-1 ml-2 text-base"
                        placeholder="Search..."
                        value={searchQuery}
                        onChangeText={handleSearch}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
};

export default SearchScreen;